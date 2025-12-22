import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '..', '.env.local') })

async function testArticleCreation() {
  console.log('🧪 Testing article creation API...\n')

  const testArticle = {
    title: 'Test Article ' + Date.now(),
    arabic_title: 'مقال تجريبي',
    slug: 'test-article-' + Date.now(),
    excerpt: 'This is a test excerpt',
    content: 'This is the test content for the article.',
    featured_image: 'https://example.com/image.jpg',
    category: 'general',
    tags: ['test', 'demo'],
    author: 'Test Author',
    featured: false,
    published: true,
    publish_date: new Date().toISOString()
  }

  console.log('📤 Sending request to API...')
  console.log('Data:', JSON.stringify(testArticle, null, 2))

  try {
    const response = await fetch('http://localhost:3000/api/news', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testArticle),
    })

    console.log('\n📥 Response status:', response.status)

    const data = await response.json()
    console.log('📥 Response data:', JSON.stringify(data, null, 2))

    if (response.ok) {
      console.log('\n✅ Article created successfully!')
    } else {
      console.log('\n❌ Failed to create article')
      console.log('Error:', data.error)
      if (data.details) {
        console.log('Details:', data.details)
      }
    }
  } catch (error: any) {
    console.error('\n❌ Request failed:', error.message)
  }
}

testArticleCreation()
