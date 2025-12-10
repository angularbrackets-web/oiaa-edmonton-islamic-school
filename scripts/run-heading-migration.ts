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

async function runMigrationDirect() {
  console.log('🚀 Running heading block migration...\n')

  try {
    const migrationPath = path.join(__dirname, '../migrations/015_add_heading_block_type.sql')
    const sql = fs.readFileSync(migrationPath, 'utf-8')

    console.log('📝 Migration SQL to execute:\n')
    console.log('=' .repeat(60))
    console.log(sql)
    console.log('=' .repeat(60))
    console.log('\n⚠️  Running migration in Supabase...\n')

    // Split into statements and execute
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('/**'))

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]

      if (!statement || statement.length === 0) continue

      console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`)

      try {
        // For Supabase, we need to use the REST API to execute DDL
        const { error } = await supabase.rpc('exec_sql', {
          sql_query: statement + ';'
        }).single()

        if (error) {
          // If RPC doesn't exist, just log for manual execution
          console.log(`⚠️  Auto-execution not available. Please run manually in Supabase Dashboard.`)
          break
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`)
        }
      } catch (err) {
        console.log(`⚠️  Auto-execution not available. Please run manually in Supabase Dashboard.`)
        break
      }
    }

    console.log('\n📋 Instructions for manual execution:')
    console.log('1. Go to: https://eqifzqosnyhgglrkzkur.supabase.co/project/_/sql')
    console.log('2. Copy the SQL above and paste it into the SQL Editor')
    console.log('3. Click "Run" to execute the migration')
    console.log('\n✅ Migration file created: migrations/015_add_heading_block_type.sql')

  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

runMigrationDirect()
