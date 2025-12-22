import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { readFileSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

async function runSQL(query: string) {
  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseServiceKey,
      'Authorization': `Bearer ${supabaseServiceKey}`
    },
    body: JSON.stringify({ query })
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`SQL execution failed: ${error}`)
  }

  return response.json()
}

async function applyMigration() {
  console.log('🚀 Applying news table migration...\n')

  const queries = [
    'ALTER TABLE news ADD COLUMN IF NOT EXISTS slug TEXT',
    'ALTER TABLE news ADD COLUMN IF NOT EXISTS arabic_title TEXT',
    'ALTER TABLE news ADD COLUMN IF NOT EXISTS featured_image TEXT',
    'ALTER TABLE news ADD COLUMN IF NOT EXISTS tags TEXT[]',
    'ALTER TABLE news ADD COLUMN IF NOT EXISTS publish_date TIMESTAMP WITH TIME ZONE',
  ]

  for (const query of queries) {
    try {
      console.log(`Executing: ${query.substring(0, 60)}...`)
      await runSQL(query)
      console.log('✅ Success')
    } catch (error: any) {
      console.log(`⚠️  ${error.message}`)
    }
  }

  console.log('\n✨ Migration completed!')
  console.log('\nNow run: npx tsx scripts/run-migration-025.ts')
  console.log('to migrate existing data.')
}

applyMigration().catch(console.error)
