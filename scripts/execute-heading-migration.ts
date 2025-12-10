import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function executeMigration() {
  console.log('🚀 Executing heading block migration directly...\n')

  try {
    // First, drop the old constraint
    console.log('⏳ Step 1: Dropping old constraint...')
    const { error: dropError } = await supabase.rpc('exec_sql', {
      sql_query: 'ALTER TABLE content_blocks DROP CONSTRAINT IF EXISTS valid_block_type;'
    })

    if (dropError) {
      console.log('⚠️  Using alternative method (constraint might not exist or already dropped)')
    } else {
      console.log('✅ Old constraint dropped')
    }

    // Add the new constraint
    console.log('⏳ Step 2: Adding new constraint with heading block type...')
    const newConstraint = `
      ALTER TABLE content_blocks
      ADD CONSTRAINT valid_block_type CHECK (block_type IN (
        'text',
        'heading',
        'image',
        'image_gallery',
        'video',
        'cards',
        'cta',
        'page_embed',
        'component',
        'section',
        'columns',
        'hero',
        'stats_grid',
        'accordion',
        'table',
        'staff_grid',
        'news_feed'
      ));
    `

    const { error: addError } = await supabase.rpc('exec_sql', {
      sql_query: newConstraint
    })

    if (addError) {
      console.log('⚠️  RPC method not available. Trying alternative approach...')

      // Alternative: Use Supabase's PostgreSQL REST API
      // This might not work for DDL, but let's try
      console.log('\n📋 Please execute the following SQL manually in Supabase Dashboard:')
      console.log('=' .repeat(60))
      console.log(newConstraint)
      console.log('=' .repeat(60))
      console.log('\nGo to: https://eqifzqosnyhgglrkzkur.supabase.co/project/_/sql')
    } else {
      console.log('✅ New constraint added successfully!')
      console.log('\n✅ Migration completed! Heading block type is now available.')
    }

  } catch (error: any) {
    console.error('❌ Error:', error.message || error)
    console.log('\n📋 Please run the migration manually in Supabase SQL Editor:')
    console.log('Go to: https://eqifzqosnyhgglrkzkur.supabase.co/project/_/sql')
    console.log('And paste the SQL from: migrations/015_add_heading_block_type.sql')
  }
}

executeMigration()
