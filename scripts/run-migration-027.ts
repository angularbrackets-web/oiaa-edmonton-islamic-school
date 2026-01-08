import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing Supabase credentials')
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function runMigration() {
  try {
    console.log('🚀 Running migration 027: Create Footer Links Table...')

    // Read the migration file
    const migrationPath = path.join(process.cwd(), 'migrations', '027_create_footer_links.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8')

    console.log('📄 Migration file loaded successfully')

    // Execute the migration
    const { data, error } = await supabase.rpc('exec_sql', { sql: migrationSQL })

    if (error) {
      console.error('❌ Migration failed:', error)
      process.exit(1)
    }

    console.log('✅ Migration 027 completed successfully!')

    // Verify the table was created
    const { data: footerLinks, error: verifyError } = await supabase
      .from('footer_links')
      .select('*')
      .limit(5)

    if (verifyError) {
      console.error('⚠️  Warning: Could not verify table creation:', verifyError)
    } else {
      console.log(`✅ Verified: footer_links table exists with ${footerLinks?.length || 0} rows`)

      if (footerLinks && footerLinks.length > 0) {
        console.log('\n📋 Sample footer links:')
        footerLinks.forEach((link: any) => {
          console.log(`  - ${link.label} (${link.category}): ${link.href}`)
        })
      }
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error)
    process.exit(1)
  }
}

// Run the migration
runMigration()
  .then(() => {
    console.log('\n🎉 Migration process completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Migration process failed:', error)
    process.exit(1)
  })
