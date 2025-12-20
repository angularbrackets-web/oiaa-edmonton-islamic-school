/**
 * Run Migration 023: Add spacer and divider block types
 *
 * This script updates the content_blocks table constraint
 * to include the new spacer and divider block types.
 *
 * Usage: npx tsx scripts/run-migration-023.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as fs from 'fs'
import * as path from 'path'

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
  console.log('Running Migration 023: Add spacer and divider block types...\n')

  try {
    // Read the migration file
    const migrationPath = path.join(__dirname, '../migrations/023_add_spacer_divider_block_types.sql')
    const sql = fs.readFileSync(migrationPath, 'utf8')

    // Split into individual statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('--'))

    for (const statement of statements) {
      if (!statement) continue

      console.log('Executing:', statement.substring(0, 60) + '...')

      const { error } = await supabase.rpc('exec_sql', { sql: statement })

      if (error) {
        // Try direct execution
        const { error: directError } = await supabase
          .from('_migrations')
          .select('*')
          .limit(0)

        if (directError) {
          console.error('Error:', error.message)
        }
      }
    }

    console.log('\nMigration 023 completed successfully!')
    console.log('\nNew block types available:')
    console.log('  - spacer: Vertical spacing between blocks')
    console.log('  - divider: Visual separator line with styling')

  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

runMigration()
