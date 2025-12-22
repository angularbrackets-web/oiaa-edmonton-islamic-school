import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function addMissingColumns() {
  console.log('🔧 Checking and adding missing columns to news table...\n')

  // Get existing articles to understand current schema
  const { data: articles, error: fetchError } = await supabase
    .from('news')
    .select('*')
    .limit(1)

  if (fetchError) {
    console.error('❌ Error:', fetchError)
    return
  }

  const currentColumns = articles && articles.length > 0 ? Object.keys(articles[0]) : []
  console.log('Current columns:', currentColumns.join(', '))

  const requiredColumns = ['slug', 'arabic_title', 'featured_image', 'tags', 'publish_date']
  const missing = requiredColumns.filter(col => !currentColumns.includes(col))

  if (missing.length > 0) {
    console.log('\n⚠️  Missing columns:', missing.join(', '))
    console.log('\n📝 You need to run this SQL in your Supabase SQL Editor:')
    console.log('\n' + '='.repeat(70))
    console.log(`
-- Add missing columns to news table
ALTER TABLE news ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE news ADD COLUMN IF NOT EXISTS arabic_title TEXT;
ALTER TABLE news ADD COLUMN IF NOT EXISTS featured_image TEXT;
ALTER TABLE news ADD COLUMN IF NOT EXISTS tags TEXT[];
ALTER TABLE news ADD COLUMN IF NOT EXISTS publish_date TIMESTAMP WITH TIME ZONE;
`)
    console.log('='.repeat(70) + '\n')

    console.log('Steps:')
    console.log('1. Go to https://supabase.com/dashboard/project/eqifzqosnyhgglrkzkur/sql/new')
    console.log('2. Copy the SQL above')
    console.log('3. Paste and click "Run"')
    console.log('4. Then run this script again to migrate the data\n')
    return
  }

  console.log('✅ All required columns exist!\n')

  // Now migrate data
  console.log('📦 Migrating existing data...\n')

  const { data: allArticles } = await supabase
    .from('news')
    .select('*')

  if (!allArticles || allArticles.length === 0) {
    console.log('No articles to migrate.')
    return
  }

  console.log(`Found ${allArticles.length} articles to migrate`)

  for (const article of allArticles) {
    const updates: any = {}

    // Generate slug if missing
    if (!article.slug) {
      const baseSlug = article.title
        ? article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        : `article-${article.id}`

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
    if (!article.publish_date && (article.date || article.created_at)) {
      updates.publish_date = article.date || article.created_at
    }

    // Initialize tags if missing
    if (!article.tags) {
      updates.tags = []
    }

    // Apply updates
    if (Object.keys(updates).length > 0) {
      const { error } = await supabase
        .from('news')
        .update(updates)
        .eq('id', article.id)

      if (error) {
        console.error(`❌ Error updating ${article.title}:`, error.message)
      } else {
        console.log(`✅ ${article.title} ${updates.slug ? `→ ${updates.slug}` : ''}`)
      }
    }
  }

  console.log('\n✨ Data migration complete!')
}

addMissingColumns().catch(console.error)
