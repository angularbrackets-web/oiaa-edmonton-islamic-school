/**
 * Run Migration 024: Add column_index to content_blocks
 *
 * This migration adds a column_index field to the content_blocks table
 * to allow blocks inside a columns container to be assigned to specific columns.
 *
 * Usage: npx tsx scripts/run-migration-024.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL')
  console.error('- SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function runMigration() {
  console.log('Running Migration 024: Add column_index to content_blocks...\n')

  try {
    // Check if column already exists by querying the table structure
    console.log('Checking if column_index column exists...')

    const { data: testData, error: testError } = await supabase
      .from('content_blocks')
      .select('id, column_index')
      .limit(1)

    if (!testError) {
      console.log('column_index column already exists. Migration may have been applied.')
      console.log('Checking current state...')

      // Count blocks with column_index set
      const { count } = await supabase
        .from('content_blocks')
        .select('*', { count: 'exact', head: true })
        .not('column_index', 'is', null)

      console.log(`Blocks with column_index set: ${count || 0}`)
      console.log('\nMigration 024 already applied!')
      return
    }

    // Column doesn't exist - need to run migration via SQL
    console.log('Column does not exist. Running migration...')
    console.log('\nIMPORTANT: Run the following SQL in Supabase Dashboard > SQL Editor:\n')
    console.log('------------------------------------------------------------')
    console.log(`
-- Migration 024: Add column_index to content_blocks
ALTER TABLE content_blocks
ADD COLUMN IF NOT EXISTS column_index INTEGER DEFAULT NULL;

COMMENT ON COLUMN content_blocks.column_index IS
  'Zero-based column index for blocks inside a columns container. NULL means auto-distribute.';

CREATE INDEX IF NOT EXISTS idx_content_blocks_parent_column
ON content_blocks(parent_block_id, column_index)
WHERE parent_block_id IS NOT NULL;
`)
    console.log('------------------------------------------------------------')
    console.log('\nAfter running the SQL, re-run this script to verify.')

  } catch (error) {
    console.error('Migration check failed:', error)
    process.exit(1)
  }
}

runMigration()
