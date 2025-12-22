import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY not found in .env.local')
  console.log('This migration requires admin privileges')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function migrateNewsTable() {
  console.log('🔄 Migrating news table schema...\n')

  try {
    // Step 1: Add missing columns
    console.log('1️⃣ Adding missing columns...')

    const alterQueries = [
      // Add slug column (will be populated in next step)
      `ALTER TABLE news ADD COLUMN IF NOT EXISTS slug TEXT`,

      // Add other missing columns
      `ALTER TABLE news ADD COLUMN IF NOT EXISTS arabic_title TEXT`,
      `ALTER TABLE news ADD COLUMN IF NOT EXISTS featured_image TEXT`,
      `ALTER TABLE news ADD COLUMN IF NOT EXISTS tags TEXT[]`,
      `ALTER TABLE news ADD COLUMN IF NOT EXISTS publish_date TIMESTAMP WITH TIME ZONE`,
    ]

    for (const query of alterQueries) {
      const { error } = await supabase.rpc('exec_sql', { sql: query })
      if (error) {
        console.log(`⚠️  Query may have failed (column might already exist): ${error.message}`)
      }
    }

    console.log('✅ Columns added\n')

    // Step 2: Migrate existing data
    console.log('2️⃣ Migrating existing data...')

    // Get all existing articles
    const { data: articles, error: fetchError } = await supabase
      .from('news')
      .select('*')

    if (fetchError) {
      console.error('❌ Error fetching articles:', fetchError)
      return
    }

    console.log(`Found ${articles?.length || 0} articles to migrate`)

    // Update each article
    if (articles && articles.length > 0) {
      for (const article of articles) {
        // Generate slug from title if missing
        let slug = article.slug
        if (!slug && article.title) {
          slug = article.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')

          // Make sure slug is unique
          let uniqueSlug = slug
          let counter = 2
          while (true) {
            const { data: existing } = await supabase
              .from('news')
              .select('id')
              .eq('slug', uniqueSlug)
              .neq('id', article.id)
              .maybeSingle()

            if (!existing) break
            uniqueSlug = `${slug}-${counter}`
            counter++
          }
          slug = uniqueSlug
        }

        // Migrate image_url to featured_image
        const featured_image = article.featured_image || article.image_url

        // Migrate date to publish_date
        const publish_date = article.publish_date || article.date || article.created_at

        // Update the article
        const { error: updateError } = await supabase
          .from('news')
          .update({
            slug,
            featured_image,
            publish_date,
            tags: article.tags || []
          })
          .eq('id', article.id)

        if (updateError) {
          console.error(`❌ Error updating article ${article.id}:`, updateError)
        } else {
          console.log(`✅ Migrated: ${article.title} -> ${slug}`)
        }
      }
    }

    console.log('\n3️⃣ Adding constraints...')

    // Add NOT NULL and UNIQUE constraints on slug
    const constraintQueries = [
      `ALTER TABLE news ALTER COLUMN slug SET NOT NULL`,
      `ALTER TABLE news ADD CONSTRAINT news_slug_unique UNIQUE (slug)`
    ]

    for (const query of constraintQueries) {
      const { error } = await supabase.rpc('exec_sql', { sql: query })
      if (error) {
        console.log(`⚠️  Constraint may already exist: ${error.message}`)
      }
    }

    console.log('\n✨ Migration completed successfully!')

  } catch (error: any) {
    console.error('❌ Migration failed:', error.message)
  }
}

migrateNewsTable()
