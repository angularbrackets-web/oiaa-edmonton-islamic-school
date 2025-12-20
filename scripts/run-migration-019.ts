import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
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

async function runMigration(migrationFile: string) {
  console.log(`\n🚀 Running migration: ${migrationFile}...\n`)

  try {
    const migrationPath = path.join(__dirname, '../migrations', migrationFile)
    const sql = fs.readFileSync(migrationPath, 'utf-8')

    console.log('📋 Please run this migration manually in Supabase SQL Editor:')
    console.log('='.repeat(60))
    console.log(`Migration file: migrations/${migrationFile}`)
    console.log('='.repeat(60))
    console.log(sql)
    console.log('='.repeat(60))
    console.log('\n📖 Instructions:')
    console.log('1. Go to https://supabase.com/dashboard/project/eqifzqosnyhgglrkzkur/sql/new')
    console.log('2. Copy the SQL above')
    console.log('3. Paste into SQL Editor')
    console.log('4. Click "Run"\n')

    return { sql, needsManualRun: true }

  } catch (error) {
    console.error(`❌ Migration ${migrationFile} failed:`, error)
    return { sql: null, needsManualRun: true }
  }
}

async function verifyBlockTypes() {
  console.log('\n📊 After running the migration, verify with these tests:\n')

  const testPageId = 'test-page-id' // Replace with actual page ID

  console.log('Test 1: Create a Map block')
  console.log(`
  const { data, error } = await supabase
    .from('content_blocks')
    .insert({
      page_id: '${testPageId}',
      block_type: 'map',
      content: { address: '123 Test St' },
      display_order: 0
    })
  `)

  console.log('\nTest 2: Create a Documents block')
  console.log(`
  const { data, error } = await supabase
    .from('content_blocks')
    .insert({
      page_id: '${testPageId}',
      block_type: 'documents',
      content: { documents: [] },
      display_order: 0
    })
  `)

  console.log('\nTest 3: Create a Form block')
  console.log(`
  const { data, error } = await supabase
    .from('content_blocks')
    .insert({
      page_id: '${testPageId}',
      block_type: 'form',
      content: { form_name: 'test', fields: [] },
      display_order: 0
    })
  `)
}

async function main() {
  console.log('═'.repeat(60))
  console.log('  Migration 019: Add Map & Documents Block Types')
  console.log('  (Fix CHECK constraint)')
  console.log('═'.repeat(60))

  // Show migration SQL
  const { sql, needsManualRun } = await runMigration('019_add_map_documents_block_types.sql')

  // Show verification steps
  await verifyBlockTypes()

  console.log('\n═'.repeat(60))
  console.log('⚠️  Migration needs to be run manually in Supabase SQL Editor')
  console.log('   Follow the instructions above to complete the migration')
  console.log('═'.repeat(60))
}

main()
