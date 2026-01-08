#!/usr/bin/env tsx

/**
 * Migration 029: Add component_id to content_blocks
 *
 * This migration unifies the block system by allowing blocks to belong to
 * either a page OR a component, enabling full feature parity.
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
  console.error('❌ Missing required environment variables')
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function runMigration() {
  console.log('🚀 Starting Migration 029: Add component_id to content_blocks\n')

  try {
    // Read the migration file
    const migrationPath = path.join(process.cwd(), 'migrations', '029_add_component_id_to_blocks.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8')

    // Split into individual statements (basic split on semicolons, excluding comments)
    const statements = migrationSQL
      .split('\n')
      .filter(line => !line.trim().startsWith('--') && line.trim() !== '')
      .join('\n')
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0)

    console.log(`📝 Found ${statements.length} SQL statements to execute\n`)

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      if (statement.includes('COMMENT ON') || statement.includes('SELECT') || statement.includes('FROM information_schema')) {
        // Skip comments and verification queries
        continue
      }

      console.log(`▶️  Executing statement ${i + 1}/${statements.length}...`)
      console.log(`   ${statement.substring(0, 80)}${statement.length > 80 ? '...' : ''}`)

      const { data, error } = await supabase.rpc('exec_sql', {
        sql_query: statement + ';'
      })

      if (error) {
        // Check if it's a benign error (e.g., "column already exists")
        if (
          error.message.includes('already exists') ||
          error.message.includes('does not exist') ||
          error.message.includes('IF NOT EXISTS') ||
          error.message.includes('IF EXISTS')
        ) {
          console.log(`   ⚠️  ${error.message} (continuing...)`)
        } else {
          console.error(`   ❌ Error: ${error.message}`)
          throw error
        }
      } else {
        console.log(`   ✅ Success`)
      }
    }

    console.log('\n🎉 Migration 029 completed successfully!')
    console.log('\n📊 Verification:')
    console.log('   Run these queries in Supabase SQL Editor to verify:\n')
    console.log('   -- Check page_id is nullable:')
    console.log("   SELECT column_name, is_nullable FROM information_schema.columns")
    console.log("   WHERE table_name = 'content_blocks' AND column_name = 'page_id';")
    console.log('\n   -- Check component_id exists:')
    console.log("   SELECT column_name, is_nullable FROM information_schema.columns")
    console.log("   WHERE table_name = 'content_blocks' AND column_name = 'component_id';")
    console.log('\n   -- Check constraint exists:')
    console.log("   SELECT constraint_name FROM information_schema.table_constraints")
    console.log("   WHERE table_name = 'content_blocks' AND constraint_name = 'block_parent_exclusive';")

  } catch (error) {
    console.error('\n❌ Migration failed:', error)
    process.exit(1)
  }
}

// Run the migration
runMigration()
