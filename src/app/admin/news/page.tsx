'use client'

import { useState, useEffect } from 'react'
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

interface NewsData {
  news: NewsArticle[]
}

const categories = [
  'all',
  'announcements',
  'events', 
  'achievements',
  'islamic-calendar',
  'general'
]

export default function NewsAdminPage() {
  const [newsData, setNewsData] = useState<NewsData | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  useEffect(() => {
    loadNews()
  }, [selectedCategory])

  const loadNews = () => {
    setLoading(true)
    const categoryParam = selectedCategory === 'all' ? '' : `&category=${selectedCategory}`
    fetch(`/api/news?admin=true${categoryParam}`)
      .then(res => res.json())
      .then(data => {
        setNewsData(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error loading news data:', err)
        setLoading(false)
      })
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return
    }

    setIsDeleting(id)
    try {
      const response = await fetch(`/api/news?id=${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        loadNews() // Refresh the list
      } else {
        alert('Failed to delete article')
      }
    } catch (error) {
      console.error('Error deleting article:', error)
      alert('Error deleting article')
    } finally {
      setIsDeleting(null)
    }
  }

  const togglePublished = async (article: NewsArticle) => {
    try {
      const response = await fetch('/api/news', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: article.id,
          published: !article.published
        }),
      })

      if (response.ok) {
        loadNews() // Refresh the list
      } else {
        alert('Failed to update article')
      }
    } catch (error) {
      console.error('Error updating article:', error)
      alert('Error updating article')
    }
  }

  const toggleFeatured = async (article: NewsArticle) => {
    try {
      const response = await fetch('/api/news', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: article.id,
          featured: !article.featured
        }),
      })

      if (response.ok) {
        loadNews() // Refresh the list
      } else {
        alert('Failed to update article')
      }
    } catch (error) {
      console.error('Error updating article:', error)
      alert('Error updating article')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-warm-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-terracotta-red mb-2">
              News & Articles Management
            </h1>
            <p className="text-deep-teal">
              Manage school news, announcements, and blog posts
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mt-4 sm:mt-0">
            <Link
              href="/admin"
              className="bg-soft-beige hover:bg-soft-beige-lightest text-deep-teal px-4 py-2 rounded-lg font-semibold transition-colors duration-200"
            >
              ← Back to Admin
            </Link>
            <Link
              href="/admin/news/new"
              className="bg-terracotta-red hover:bg-terracotta-red-dark text-warm-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
            >
              + New Article
            </Link>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-terracotta-red text-warm-white'
                    : 'bg-soft-beige-lightest text-deep-teal hover:bg-soft-beige'
                }`}
              >
                {category === 'all' ? 'All Articles' : category.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-soft-beige-lightest rounded-lg p-6 border border-soft-beige">
            <div className="text-2xl text-terracotta-red font-bold mb-2">
              {newsData?.news?.length || 0}
            </div>
            <p className="text-deep-teal font-medium">
              {selectedCategory === 'all' ? 'Total Articles' : `${selectedCategory} Articles`}
            </p>
          </div>
          <div className="bg-soft-beige-lightest rounded-lg p-6 border border-soft-beige">
            <div className="text-2xl text-sage-green font-bold mb-2">
              {newsData?.news?.filter(article => article.published).length || 0}
            </div>
            <p className="text-deep-teal font-medium">Published</p>
          </div>
          <div className="bg-soft-beige-lightest rounded-lg p-6 border border-soft-beige">
            <div className="text-2xl text-wood font-bold mb-2">
              {newsData?.news?.filter(article => !article.published).length || 0}
            </div>
            <p className="text-deep-teal font-medium">Drafts</p>
          </div>
          <div className="bg-soft-beige-lightest rounded-lg p-6 border border-soft-beige">
            <div className="text-2xl text-deep-teal font-bold mb-2">
              {newsData?.news?.filter(article => article.featured).length || 0}
            </div>
            <p className="text-deep-teal font-medium">Featured</p>
          </div>
        </div>

        {/* Articles Table */}
        <div className="bg-soft-beige-lightest rounded-lg shadow-lg border border-soft-beige overflow-hidden">
          {loading ? (
            <div className="p-8">
              <div className="animate-pulse space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="h-16 bg-soft-beige rounded"></div>
                ))}
              </div>
            </div>
          ) : newsData?.news && newsData.news.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-soft-beige border-b border-soft-beige">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-deep-teal uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-deep-teal uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-deep-teal uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-deep-teal uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-deep-teal uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-warm-white divide-y divide-soft-beige">
                  {newsData.news.map((article) => (
                    <tr key={article.id} className="hover:bg-soft-beige-lightest/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-start">
                          <div className="flex-1">
                            <div className="text-sm font-medium text-terracotta-red">
                              {article.title}
                            </div>
                            {article.arabic_title && (
                              <div className="text-sm text-sage-green arabic-text">
                                {article.arabic_title}
                              </div>
                            )}
                            <div className="text-sm text-deep-teal mt-1">
                              {article.excerpt || article.content.substring(0, 100) + '...'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sage-green/20 text-sage-green">
{(article.category || 'general').replace('-', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-deep-teal">
                        {formatDate(article.publish_date)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            article.published 
                              ? 'bg-sage-green/20 text-sage-green' 
                              : 'bg-wood/20 text-wood'
                          }`}>
                            {article.published ? 'Published' : 'Draft'}
                          </span>
                          {article.featured && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-terracotta-red/20 text-terracotta-red">
                              Featured
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-2">
                          <div className="flex gap-2">
                            <Link
                              href={`/admin/news/edit/${article.id}`}
                              className="text-terracotta-red hover:text-terracotta-red-dark text-sm font-medium transition-colors"
                            >
                              Edit
                            </Link>
                            <Link
                              href={`/news/${article.slug}`}
                              target="_blank"
                              className="text-sage-green hover:text-sage-green-dark text-sm font-medium transition-colors"
                            >
                              View
                            </Link>
                            <button
                              onClick={() => handleDelete(article.id, article.title)}
                              disabled={isDeleting === article.id}
                              className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors disabled:opacity-50"
                            >
                              {isDeleting === article.id ? 'Deleting...' : 'Delete'}
                            </button>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => togglePublished(article)}
                              className="text-deep-teal hover:text-terracotta-red text-xs font-medium transition-colors"
                            >
                              {article.published ? 'Unpublish' : 'Publish'}
                            </button>
                            <button
                              onClick={() => toggleFeatured(article)}
                              className="text-deep-teal hover:text-terracotta-red text-xs font-medium transition-colors"
                            >
                              {article.featured ? 'Unfeature' : 'Feature'}
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">📰</div>
              <h3 className="text-xl font-bold text-terracotta-red mb-2">
                No articles found
              </h3>
              <p className="text-deep-teal mb-6">
                {selectedCategory === 'all' 
                  ? 'No news articles have been created yet.' 
                  : `No articles found in the "${selectedCategory.replace('-', ' ')}" category.`}
              </p>
              <Link
                href="/admin/news/new"
                className="bg-terracotta-red hover:bg-terracotta-red-dark text-warm-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Create First Article
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}