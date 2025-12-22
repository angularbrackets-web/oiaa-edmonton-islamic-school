import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { readFileSync } from 'fs'
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
  console.log('\nYou need the service role key to run migrations.')
  console.log('Add it to your .env.local file as SUPABASE_SERVICE_ROLE_KEY=your_key')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function runMigration() {
  console.log('🚀 Running migration 025: Update news table schema\n')

  try {
    // Read the SQL file
    const sqlPath = join(__dirname, '..', 'migrations', '025_update_news_table_schema.sql')
    const sql = readFileSync(sqlPath, 'utf-8')

    // Split into individual statements (basic split on semicolon)
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('COMMENT'))

    console.log(`Found ${statements.length} SQL statements to execute\n`)

    // Execute each statement using direct SQL query
    // Note: This requires using the SQL editor or direct database access
    console.log('⚠️  This migration needs to be run directly on your Supabase database.')
    console.log('\nOptions:')
    console.log('1. Go to your Supabase dashboard → SQL Editor')
    console.log('2. Copy the contents of migrations/025_update_news_table_schema.sql')
    console.log('3. Paste and run it in the SQL Editor\n')

    console.log('Alternatively, run this command if you have psql installed:')
    console.log(`psql "$DATABASE_URL" -f migrations/025_update_news_table_schema.sql\n`)

    // Try a simple approach for adding columns
    console.log('Attempting to add columns using Supabase client...\n')

    // Add slug column and migrate data
    const { data: articles } = await supabase
      .from('news')
      .select('id, title, slug, image_url, date, featured_image, publish_date')

    if (articles) {
      console.log(`Found ${articles.length} articles`)

      for (const article of articles) {
        const updates: any = {}

        // Generate slug if missing
        if (!article.slug && article.title) {
          const baseSlug = article.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')

          let slug = baseSlug
          let counter = 2

          // Check for duplicates
          while (true) {
            const { data: existing } = await supabase
              .from('news')
              .select('id')
              .eq('slug', slug)
              .neq('id', article.id)
              .limit(1)

            if (!existing || existing.length === 0) break
            slug = `${baseSlug}-${counter}`
            counter++
          }

          updates.slug = slug
        }

        // Migrate image_url to featured_image
        if (!article.featured_image && article.image_url) {
          updates.featured_image = article.image_url
        }

        // Migrate date to publish_date
        if (!article.publish_date && article.date) {
          updates.publish_date = article.date
        }

        // Only update if there are changes
        if (Object.keys(updates).length > 0) {
          const { error } = await supabase
            .from('news')
            .update(updates)
            .eq('id', article.id)

          if (error) {
            console.error(`❌ Error updating article ${article.id}:`, error.message)
          } else {
            console.log(`✅ Updated: ${article.title} ${updates.slug ? `-> ${updates.slug}` : ''}`)
          }
        }
      }

      console.log('\n✅ Data migration completed!')
      console.log('\n⚠️  Note: Column constraints (NOT NULL, UNIQUE) need to be added via SQL Editor')
    }

  } catch (error: any) {
    console.error('❌ Migration error:', error.message)
    process.exit(1)
  }
}

runMigration()
