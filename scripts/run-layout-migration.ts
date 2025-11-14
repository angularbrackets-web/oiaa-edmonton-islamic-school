/**
 * Run Block Layout Fields Migration
 *
 * Adds container_width, margin_top, and margin_bottom fields to content_blocks table
 */

import { supabaseAdmin } from '../src/lib/supabase'
import * as fs from 'fs'
import * as path from 'path'

async function runMigration() {
  console.log('🚀 Running Block Layout Fields Migration...\n')

  try {
    // Read the migration SQL file
    const migrationPath = path.join(__dirname, '../migrations/005_add_block_layout_fields.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8')

    // Extract the ALTER TABLE and CREATE INDEX statements
    // (Skip COMMENT statements as they might not work via JS)
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s =>
        s.startsWith('ALTER TABLE') ||
        s.startsWith('CREATE INDEX')
      )

    console.log(`📝 Found ${statements.length} SQL statements to execute\n`)

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      console.log(`Executing statement ${i + 1}/${statements.length}...`)

      const { error } = await supabaseAdmin.rpc('exec_sql', {
        sql: statement
      })

      if (error) {
        // If RPC doesn't work, try direct SQL execution (Postgres-specific)
        console.log('RPC method failed, trying direct execution...')
        const { error: directError } = await supabaseAdmin.from('_temp_migration').select('*').limit(0)

        // Since Supabase JS doesn't support raw SQL directly, we'll log instructions
        console.error('⚠️  Cannot execute via Supabase JS client.')
        console.log('\n📋 Please run this migration manually via Supabase Dashboard:')
        console.log('\n1. Go to: https://app.supabase.com')
        console.log('2. Select your project')
        console.log('3. Go to SQL Editor')
        console.log('4. Run the following SQL:\n')
        console.log('```sql')
        console.log(fs.readFileSync(migrationPath, 'utf-8'))
        console.log('```\n')
        process.exit(1)
      }

      console.log(`✅ Statement ${i + 1} executed successfully`)
    }

    // Verify the migration
    console.log('\n🔍 Verifying migration...')
    const { data: columns, error: verifyError } = await supabaseAdmin
      .from('content_blocks')
      .select('*')
      .limit(1)

    if (verifyError) {
      console.error('❌ Verification failed:', verifyError)
      throw verifyError
    }

    console.log('\n✅ Migration completed successfully!')
    console.log('\nNew fields added:')
    console.log('  - container_width (narrow | contained | wide | full)')
    console.log('  - margin_top (none | xs | sm | md | lg | xl | 2xl)')
    console.log('  - margin_bottom (none | xs | sm | md | lg | xl | 2xl)')

  } catch (error) {
    console.error('\n❌ Migration failed:', error)
    console.log('\n📋 Manual migration instructions:')
    console.log('\n1. Go to Supabase Dashboard → SQL Editor')
    console.log('2. Copy and paste the migration from:')
    console.log('   migrations/005_add_block_layout_fields.sql')
    console.log('3. Click "Run"\n')
    process.exit(1)
  }
}

// Run the migration
runMigration()
