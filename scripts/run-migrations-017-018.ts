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

    console.log('📝 Executing migration SQL via Supabase REST API...\n')

    // Use Supabase's REST API to execute raw SQL
    // Note: This requires the sql extension to be enabled in Supabase
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`
      },
      body: JSON.stringify({ sql })
    })

    if (!response.ok) {
      console.log('⚠️  Direct SQL execution not available via REST API')
      console.log('📋 Please run this migration manually in Supabase SQL Editor:')
      console.log('=' .repeat(60))
      console.log(`Migration file: migrations/${migrationFile}`)
      console.log('=' .repeat(60))
      console.log(sql)
      console.log('=' .repeat(60))
      console.log('\n📖 Instructions:')
      console.log('1. Go to https://supabase.com/dashboard/project/eqifzqosnyhgglrkzkur/sql/new')
      console.log('2. Copy the SQL above')
      console.log('3. Paste into SQL Editor')
      console.log('4. Click "Run"\n')
      return false
    }

    console.log(`✅ Migration ${migrationFile} completed successfully!`)
    return true

  } catch (error) {
    console.error(`❌ Migration ${migrationFile} failed:`, error)
    console.log('\n📋 You can run this migration manually in Supabase SQL Editor')
    return false
  }
}

async function verifyTables() {
  console.log('\n📊 Verifying tables...\n')

  try {
    // Check form_submissions table
    const { data: formData, error: formError } = await supabase
      .from('form_submissions')
      .select('count')
      .limit(1)

    if (!formError) {
      console.log('✅ form_submissions table verified and accessible!')
    } else {
      console.log('⚠️  form_submissions table not accessible (may need RLS policy or table doesn\'t exist)')
    }

    // Check home_sections table
    const { data: homeData, error: homeError } = await supabase
      .from('home_sections')
      .select('*')
      .limit(5)

    if (!homeError) {
      console.log('✅ home_sections table verified and accessible!')
      if (homeData && homeData.length > 0) {
        console.log(`   Found ${homeData.length} default sections:`)
        homeData.forEach((section: any) => {
          console.log(`   - ${section.section_name} (order: ${section.display_order}, visible: ${section.is_visible})`)
        })
      }
    } else {
      console.log('⚠️  home_sections table not accessible (may need RLS policy or table doesn\'t exist)')
    }

  } catch (error) {
    console.log('⚠️  Table verification encountered issues')
  }
}

async function main() {
  console.log('═'.repeat(60))
  console.log('  Phase 3 & 4 Database Migrations')
  console.log('═'.repeat(60))

  // Run migration 017
  const migration017Success = await runMigration('017_create_form_submissions.sql')

  // Run migration 018
  const migration018Success = await runMigration('018_create_home_sections.sql')

  // Verify tables
  await verifyTables()

  console.log('\n═'.repeat(60))
  if (migration017Success && migration018Success) {
    console.log('✅ All migrations completed successfully!')
  } else {
    console.log('⚠️  Some migrations may need to be run manually')
    console.log('   Please check the output above for instructions')
  }
  console.log('═'.repeat(60))
}

main()
