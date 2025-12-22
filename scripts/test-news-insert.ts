import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables from .env.local
dotenv.config({ path: join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('Environment check:')
console.log('SUPABASE_URL:', supabaseUrl ? '✓ Set' : '✗ Missing')
console.log('SUPABASE_KEY:', supabaseKey ? '✓ Set' : '✗ Missing')

if (!supabaseUrl || !supabaseKey) {
  console.error('\n❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testNewsInsert() {
  console.log('\n🔍 Testing database connection...')

  // Test 1: Check if we can query the news table
  console.log('\n1️⃣ Testing SELECT query...')
  const { data: existingNews, error: selectError } = await supabase
    .from('news')
    .select('id, title, slug')
    .limit(5)

  if (selectError) {
    console.error('❌ SELECT failed:', selectError)
    return
  }
  console.log('✅ SELECT successful! Found', existingNews?.length || 0, 'articles')
  console.log('Existing articles:', existingNews?.map(n => ({ id: n.id, slug: n.slug })))

  // Test 2: Try to insert a test article
  console.log('\n2️⃣ Testing INSERT operation...')

  const testArticle = {
    title: 'Test Article ' + Date.now(),
    slug: 'test-article-' + Date.now(),
    content: 'This is a test article created by the test script.',
    category: 'general',
    published: false,
    featured: false
  }

  console.log('Inserting:', testArticle)

  const { data: insertedData, error: insertError } = await supabase
    .from('news')
    .insert(testArticle)
    .select()

  if (insertError) {
    console.error('❌ INSERT failed:', insertError)
    console.error('Error details:', JSON.stringify(insertError, null, 2))
    return
  }

  console.log('✅ INSERT successful!')
  console.log('Created article:', insertedData)

  // Test 3: Delete the test article
  if (insertedData && insertedData.length > 0) {
    console.log('\n3️⃣ Cleaning up test article...')
    const { error: deleteError } = await supabase
      .from('news')
      .delete()
      .eq('id', insertedData[0].id)

    if (deleteError) {
      console.error('❌ DELETE failed:', deleteError)
    } else {
      console.log('✅ Test article deleted successfully')
    }
  }

  console.log('\n✨ All tests completed!')
}

testNewsInsert().catch(console.error)
