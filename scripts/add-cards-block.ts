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
  },
  db: {
    schema: 'public'
  }
})

async function addCardsBlockType() {
  console.log('🚀 Adding "cards" block type to content_blocks table...\n')

  try {
    // Read the migration SQL file
    const migrationPath = path.join(__dirname, '../migrations/003_add_cards_block_type.sql')
    const sql = fs.readFileSync(migrationPath, 'utf-8')

    console.log('📝 Executing migration SQL...\n')

    // Execute the SQL via REST API
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`
      },
      body: JSON.stringify({ query: sql })
    })

    if (!response.ok) {
      // If exec_sql RPC doesn't exist, show manual instructions
      console.log('⚠️  Automated migration not available. Please run manually.\n')
      console.log('=' .repeat(70))
      console.log('Copy the SQL below and run it in Supabase SQL Editor:')
      console.log('(Dashboard > SQL Editor > New Query > Paste & Run)')
      console.log('=' .repeat(70))
      console.log(sql)
      console.log('=' .repeat(70))
      console.log('\n💡 After running the SQL in Supabase Dashboard,')
      console.log('   refresh your app and the Cards block will be available!')
      return
    }

    console.log('✅ Migration completed successfully!')
    console.log('\n🎉 The "cards" block type has been added!')
    console.log('   You can now use Cards blocks in the CMS page editor.')

  } catch (error) {
    console.error('❌ Migration failed:', error)
    console.log('\n💡 Please run the SQL manually in Supabase SQL Editor:')

    const migrationPath = path.join(__dirname, '../migrations/003_add_cards_block_type.sql')
    const sql = fs.readFileSync(migrationPath, 'utf-8')

    console.log('=' .repeat(70))
    console.log(sql)
    console.log('=' .repeat(70))
  }
}

addCardsBlockType()
