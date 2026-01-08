'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CalendarIcon, TagIcon } from '@heroicons/react/24/outline'

interface NewsArticle {
  id: string
  title: string
  arabic_title?: string
  slug: string
  excerpt?: string
  content: string
  featured_image?: string
  category: string
  tags?: string[]
  author?: string
  featured: boolean
  published: boolean
  publish_date: string
  created_at: string
  updated_at: string
}

const categoryColors: Record<string, string> = {
  announcements: 'bg-blue-100 text-blue-800',
  events: 'bg-purple-100 text-purple-800',
  achievements: 'bg-green-100 text-green-800',
  'islamic-calendar': 'bg-teal-100 text-teal-800',
  general: 'bg-gray-100 text-gray-800'
}

const CATEGORIES = [
  { value: 'all', label: 'All News' },
  { value: 'announcements', label: 'Announcements' },
  { value: 'events', label: 'Events' },
  { value: 'achievements', label: 'Achievements' },
  { value: 'islamic-calendar', label: 'Islamic Calendar' },
  { value: 'general', label: 'General' }
]

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    loadArticles()
  }, [selectedCategory])

  const loadArticles = async () => {
    setLoading(true)
    try {
      const url = selectedCategory === 'all'
        ? '/api/news'
        : `/api/news?category=${selectedCategory}`

      const response = await fetch(url)
      const data = await response.json()

      if (data.success) {
        setArticles(data.data || [])
      }
    } catch (error) {
      console.error('Error loading articles:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-warm-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-terracotta-red to-terracotta-red-dark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">News & Updates</h1>
          <p className="text-xl md:text-2xl opacity-90">
            Stay informed about school announcements, events, and achievements
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-soft-beige/30 py-6 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-2 flex-wrap justify-center">
            {CATEGORIES.map(cat => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  selectedCategory === cat.value
                    ? 'bg-terracotta-red text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-t-lg"></div>
                <div className="bg-white p-6 rounded-b-lg space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600">
              No articles found in this category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map(article => (
              <Link
                key={article.id}
                href={`/news/${article.slug}`}
                className="group bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Featured Image */}
                {article.featured_image && (
                  <div className="relative h-48 overflow-hidden bg-gray-200">
                    <Image
                      src={article.featured_image}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  {/* Category Badge */}
                  <div className="mb-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      categoryColors[article.category] || categoryColors.general
                    }`}>
                      {article.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-bold text-deep-teal mb-2 group-hover:text-terracotta-red transition-colors line-clamp-2">
                    {article.title}
                  </h2>

                  {/* Arabic Title */}
                  {article.arabic_title && (
                    <p className="text-md text-sage-green mb-3 arabic-text text-right line-clamp-1">
                      {article.arabic_title}
                    </p>
                  )}

                  {/* Excerpt */}
                  {article.excerpt && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                  )}

                  {/* Metadata */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="w-4 h-4" />
                      <span>{formatDate(article.publish_date || article.created_at)}</span>
                    </div>
                    {article.author && (
                      <span>By {article.author}</span>
                    )}
                  </div>

                  {/* Tags */}
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex items-center gap-2 mb-4">
                      <TagIcon className="w-4 h-4 text-gray-400" />
                      <div className="flex flex-wrap gap-1">
                        {article.tags.slice(0, 2).map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-soft-beige text-gray-600 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                        {article.tags.length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{article.tags.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Read More */}
                  <div className="text-terracotta-red font-semibold text-sm group-hover:underline">
                    Read More →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Load More Button (future enhancement) */}
        {!loading && articles.length > 0 && articles.length % 12 === 0 && (
          <div className="text-center mt-12">
            <button
              onClick={loadArticles}
              className="bg-terracotta-red text-white px-8 py-3 rounded-lg font-semibold hover:bg-terracotta-red-dark transition-colors"
            >
              Load More Articles
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
