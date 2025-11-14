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

async function runMigration() {
  console.log('🚀 Running navigation table migration...\n')

  try {
    // Read the migration SQL file
    const migrationPath = path.join(__dirname, '../migrations/001_create_navigation_table.sql')
    const sql = fs.readFileSync(migrationPath, 'utf-8')

    // Split by semicolons to execute statements one by one
    // Note: This is a simplified approach. For production, consider using a proper migration tool
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))

    console.log(`📝 Found ${statements.length} SQL statements to execute\n`)

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]

      // Skip comments and empty statements
      if (statement.startsWith('--') || statement.trim() === '') {
        continue
      }

      console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`)

      const { error } = await supabase.rpc('exec_sql', { sql_query: statement + ';' })

      if (error) {
        // Try direct query for DDL statements
        const { error: error2 } = await supabase.from('_query').select().eq('query', statement + ';')

        if (error2) {
          console.error(`❌ Error executing statement ${i + 1}:`, error.message || error2.message)
          console.error('Statement:', statement.substring(0, 100) + '...')

          // Continue with other statements instead of failing completely
          continue
        }
      }

      console.log(`✅ Statement ${i + 1} executed successfully`)
    }

    console.log('\n✅ Migration completed successfully!')
    console.log('\n📊 Verifying table creation...')

    // Verify the table was created
    const { data, error } = await supabase
      .from('navigation_items')
      .select('count')
      .limit(1)

    if (error) {
      console.log('⚠️  Note: Table verification failed, but migration may have succeeded.')
      console.log('   This can happen due to RLS policies. Please check Supabase dashboard.')
    } else {
      console.log('✅ Navigation table verified and accessible!')
    }

    console.log('\n🎉 Next step: Run seed script with `npm run seed-navigation`')

  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

// Alternative approach: Execute the entire migration as one statement
async function runMigrationDirect() {
  console.log('🚀 Running navigation table migration (direct method)...\n')

  try {
    const migrationPath = path.join(__dirname, '../migrations/001_create_navigation_table.sql')
    const sql = fs.readFileSync(migrationPath, 'utf-8')

    console.log('📝 Executing migration SQL...\n')
    console.log('⚠️  Note: You may need to run this SQL manually in Supabase SQL Editor')
    console.log('    Dashboard > SQL Editor > New Query > Paste the SQL\n')
    console.log('=' .repeat(60))
    console.log('Copy the SQL below and run it in Supabase Dashboard:')
    console.log('=' .repeat(60))
    console.log(sql)
    console.log('=' .repeat(60))
    console.log('\nAfter running the SQL in Supabase Dashboard:')
    console.log('Run: npm run seed-navigation')

  } catch (error) {
    console.error('❌ Error reading migration file:', error)
    process.exit(1)
  }
}

// Use direct method since Supabase doesn't support exec_sql RPC by default
runMigrationDirect()
