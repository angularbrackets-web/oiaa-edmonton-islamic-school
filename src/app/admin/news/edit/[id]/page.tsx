'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface NewsArticle {
  id: string
  title: string
  arabic_title?: string
  slug: string
  excerpt?: string
  content: string
  featured_image?: string
  category: string
  tags: string[]
  author: string
  featured: boolean
  published: boolean
  publish_date: string
  created_at: string
  updated_at: string
}

const categories = [
  { id: 'announcements', name: 'Announcements' },
  { id: 'events', name: 'Events' },
  { id: 'achievements', name: 'Achievements' },
  { id: 'islamic-calendar', name: 'Islamic Calendar' },
  { id: 'general', name: 'General' }
]

export default function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [article, setArticle] = useState<NewsArticle | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    arabic_title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    category: 'general',
    tags: '',
    author: '',
    featured: false,
    published: true
  })

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const resolvedParams = await params
        const response = await fetch('/api/news?admin=true')
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch news')
        }

        const foundArticle = data.news?.find((article: NewsArticle) => article.id === resolvedParams.id)
        
        if (!foundArticle) {
          setError('Article not found')
          return
        }

        setArticle(foundArticle)
        setFormData({
          title: foundArticle.title || '',
          arabic_title: foundArticle.arabic_title || '',
          slug: foundArticle.slug || '',
          excerpt: foundArticle.excerpt || '',
          content: foundArticle.content || '',
          featured_image: foundArticle.featured_image || '',
          category: foundArticle.category || 'general',
          tags: foundArticle.tags ? foundArticle.tags.join(', ') : '',
          author: foundArticle.author || '',
          featured: foundArticle.featured || false,
          published: foundArticle.published !== false
        })
      } catch (err) {
        console.error('Error fetching article:', err)
        setError('Failed to load article')
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
  }, [params])

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    try {
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      const slug = formData.slug || generateSlug(formData.title)

      const response = await fetch('/api/news', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: (await params).id,
          title: formData.title,
          arabic_title: formData.arabic_title || null,
          slug: slug,
          excerpt: formData.excerpt || null,
          content: formData.content,
          featured_image: formData.featured_image || null,
          category: formData.category,
          tags: tagsArray,
          author: formData.author,
          featured: formData.featured,
          published: formData.published
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update article')
      }

      router.push('/admin/news')
    } catch (err: any) {
      console.error('Error updating article:', err)
      setError(err.message || 'Failed to update article')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-soft-beige-lightest">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-soft-beige rounded max-w-md"></div>
            <div className="space-y-4">
              <div className="h-12 bg-soft-beige rounded"></div>
              <div className="h-32 bg-soft-beige rounded"></div>
              <div className="h-64 bg-soft-beige rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error && !article) {
    return (
      <div className="min-h-screen bg-soft-beige-lightest flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-terracotta-red mb-4">Error</h1>
          <p className="text-deep-teal mb-4">{error}</p>
          <Link
            href="/admin/news"
            className="bg-terracotta-red hover:bg-terracotta-red-dark text-warm-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
          >
            Back to News
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-soft-beige-lightest">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            href="/admin/news"
            className="text-sage-green hover:text-sage-green-dark mb-4 inline-block"
          >
            ← Back to News
          </Link>
          <h1 className="text-3xl font-bold text-terracotta-red">Edit News Article</h1>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-warm-white rounded-lg p-8 shadow-lg space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-deep-teal mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-soft-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green"
              />
            </div>

            <div>
              <label htmlFor="arabic_title" className="block text-sm font-medium text-deep-teal mb-2">
                Arabic Title
              </label>
              <input
                type="text"
                id="arabic_title"
                name="arabic_title"
                value={formData.arabic_title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-soft-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-deep-teal mb-2">
                Slug
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                placeholder="Auto-generated from title"
                className="w-full px-3 py-2 border border-soft-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-deep-teal mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-soft-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-deep-teal mb-2">
              Excerpt
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={formData.excerpt}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-soft-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green"
              placeholder="Brief summary of the article..."
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-deep-teal mb-2">
              Content *
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              required
              rows={12}
              className="w-full px-3 py-2 border border-soft-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green"
              placeholder="Article content..."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="featured_image" className="block text-sm font-medium text-deep-teal mb-2">
                Featured Image URL
              </label>
              <input
                type="url"
                id="featured_image"
                name="featured_image"
                value={formData.featured_image}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-soft-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <label htmlFor="author" className="block text-sm font-medium text-deep-teal mb-2">
                Author (Optional)
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-soft-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green"
              />
            </div>
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-deep-teal mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-soft-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-green"
              placeholder="tag1, tag2, tag3"
            />
          </div>

          <div className="flex gap-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
                className="w-4 h-4 text-sage-green border-soft-beige rounded focus:ring-sage-green"
              />
              <label htmlFor="featured" className="ml-2 text-sm text-deep-teal">
                Featured Article
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="published"
                name="published"
                checked={formData.published}
                onChange={handleInputChange}
                className="w-4 h-4 text-sage-green border-soft-beige rounded focus:ring-sage-green"
              />
              <label htmlFor="published" className="ml-2 text-sm text-deep-teal">
                Published
              </label>
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={saving}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-300 ${
                saving
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-terracotta-red hover:bg-terracotta-red-dark text-warm-white'
              }`}
            >
              {saving ? 'Updating...' : 'Update Article'}
            </button>

            <Link
              href="/admin/news"
              className="px-6 py-3 bg-soft-beige hover:bg-soft-beige-dark text-deep-teal rounded-lg font-semibold transition-colors duration-300"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}