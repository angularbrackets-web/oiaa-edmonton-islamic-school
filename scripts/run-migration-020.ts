/**
 * Migration Script: Create hero_slides table
 * Run with: npx tsx scripts/run-migration-020.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:')
  if (!supabaseUrl) console.error('- NEXT_PUBLIC_SUPABASE_URL')
  if (!supabaseServiceKey) console.error('- SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function runMigration() {
  console.log('Starting migration 020: Create hero_slides table...\n')

  try {
    // Read migration file
    const migrationPath = path.join(__dirname, '../migrations/020_create_hero_slides.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8')

    // Split by statement (rough split, works for this migration)
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))

    console.log(`Found ${statements.length} statements to execute\n`)

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      const preview = statement.substring(0, 60).replace(/\n/g, ' ')
      console.log(`[${i + 1}/${statements.length}] ${preview}...`)

      const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' })

      if (error) {
        // Try direct query for simple statements
        const { error: directError } = await supabase.from('hero_slides').select('count').limit(0)

        if (directError && !directError.message.includes('already exists')) {
          console.error(`  Error: ${error.message}`)
          // Continue anyway for CREATE IF NOT EXISTS statements
        }
      }

      console.log('  Done')
    }

    console.log('\nMigration 020 completed successfully!')
    console.log('\nTo verify, run: SELECT * FROM hero_slides;')

  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

// Alternative: Run raw SQL directly
async function runRawMigration() {
  console.log('Running migration 020 using raw SQL...\n')

  const queries = [
    // Create table
    `CREATE TABLE IF NOT EXISTS hero_slides (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title VARCHAR(200),
      subtitle VARCHAR(500),
      description TEXT,
      slide_type VARCHAR(20) NOT NULL DEFAULT 'image_text',
      background_image VARCHAR(500),
      background_color VARCHAR(50) DEFAULT '#145B55',
      background_overlay BOOLEAN DEFAULT TRUE,
      overlay_opacity DECIMAL(3,2) DEFAULT 0.50,
      text_color VARCHAR(20) DEFAULT 'white',
      text_alignment VARCHAR(20) DEFAULT 'center',
      cta_text VARCHAR(100),
      cta_link VARCHAR(500),
      cta_style VARCHAR(20) DEFAULT 'primary',
      cta2_text VARCHAR(100),
      cta2_link VARCHAR(500),
      cta2_style VARCHAR(20) DEFAULT 'secondary',
      display_order INTEGER NOT NULL DEFAULT 0,
      duration INTEGER DEFAULT 5000,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )`,

    // Check if table exists and insert sample data
    `INSERT INTO hero_slides (title, subtitle, description, slide_type, background_image, cta_text, cta_link, cta2_text, cta2_link, display_order, is_active)
     SELECT 'Welcome to Our Islamic Academy', 'Nurturing Faith, Knowledge, and Character', 'Providing excellence in Islamic and academic education for over 20 years', 'image_text', 'https://images.unsplash.com/photo-1585036156171-384164a8c675?w=1920&q=80', 'Learn More', '/about', 'Apply Now', '/admissions', 0, TRUE
     WHERE NOT EXISTS (SELECT 1 FROM hero_slides LIMIT 1)`,

    `INSERT INTO hero_slides (title, subtitle, description, slide_type, background_image, cta_text, cta_link, cta2_text, cta2_link, display_order, is_active)
     SELECT 'Excellence in Education', 'Alberta Curriculum with Islamic Values', 'Our students consistently achieve above provincial averages while developing strong moral foundations', 'image_text', 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1920&q=80', 'Our Programs', '/programs', 'Schedule a Tour', '/contact', 1, TRUE
     WHERE (SELECT COUNT(*) FROM hero_slides) < 2`,

    `INSERT INTO hero_slides (title, subtitle, description, slide_type, background_image, cta_text, cta_link, cta2_text, cta2_link, display_order, is_active)
     SELECT 'Join Our Community', 'Enroll for the 2025-2026 School Year', 'Limited spaces available. Give your child the gift of a comprehensive Islamic education.', 'image_text', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1920&q=80', 'Apply Now', '/admissions', 'Contact Us', '/contact', 2, TRUE
     WHERE (SELECT COUNT(*) FROM hero_slides) < 3`
  ]

  for (let i = 0; i < queries.length; i++) {
    console.log(`Executing query ${i + 1}/${queries.length}...`)

    const { data, error } = await supabase.rpc('exec_sql', { sql: queries[i] })

    if (error) {
      console.log(`  Note: ${error.message}`)
    } else {
      console.log('  Success')
    }
  }

  // Verify
  const { data: slides, error: verifyError } = await supabase
    .from('hero_slides')
    .select('id, title, is_active')
    .order('display_order')

  if (verifyError) {
    console.log('\nTable may not exist yet. Please run the SQL manually in Supabase SQL Editor.')
    console.log('\nCopy the contents of migrations/020_create_hero_slides.sql')
  } else {
    console.log(`\nVerification: Found ${slides?.length || 0} slides`)
    slides?.forEach(s => console.log(`  - ${s.title} (${s.is_active ? 'active' : 'inactive'})`))
  }
}

// Run
runRawMigration().catch(console.error)
