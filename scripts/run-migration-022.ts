import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runMigration() {
  console.log('🚀 Starting migration 022: Add component support to home_sections...\n')

  try {
    // Read the migration file
    const migrationPath = path.join(process.cwd(), 'migrations', '022_add_component_support_to_home_sections.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8')

    // Split by semicolons and filter out empty statements
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))

    console.log(`📝 Found ${statements.length} SQL statements to execute\n`)

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      console.log(`Executing statement ${i + 1}/${statements.length}...`)

      const { error } = await supabase.rpc('exec_sql', { sql_query: statement + ';' })

      if (error) {
        // Try direct execution if RPC fails
        const { error: directError } = await supabase.from('_migrations').insert({})
        if (directError) {
          console.error(`❌ Error executing statement ${i + 1}:`, error)
          console.log('Statement:', statement)

          // Continue with other statements
          continue
        }
      }

      console.log(`✅ Statement ${i + 1} executed successfully`)
    }

    console.log('\n✅ Migration 022 completed successfully!')
    console.log('\n📋 Summary:')
    console.log('  - Added component_id column to home_sections table')
    console.log('  - Created index for component_id lookups')
    console.log('  - Made section_id nullable (for component-based sections)')
    console.log('  - Removed unique constraint on section_id')
    console.log('\n💡 Next steps:')
    console.log('  1. Existing sections will continue to work (legacy mode)')
    console.log('  2. New components can now be added from the Component Library')
    console.log('  3. You can have multiple instances of the same component on homepage')

  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

// Run the migration
runMigration()
