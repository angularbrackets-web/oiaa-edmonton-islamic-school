'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
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
  { id: 'all', name: 'All News', icon: '📰' },
  { id: 'announcements', name: 'Announcements', icon: '📢' },
  { id: 'events', name: 'Events', icon: '📅' },
  { id: 'achievements', name: 'Achievements', icon: '🏆' },
  { id: 'islamic-calendar', name: 'Islamic Calendar', icon: '🌙' },
  { id: 'general', name: 'General', icon: '📝' }
]

const categoryColors = {
  announcements: 'bg-terracotta-red/10 text-terracotta-red',
  events: 'bg-sage-green/10 text-sage-green',
  achievements: 'bg-wood/10 text-wood',
  general: 'bg-deep-teal/10 text-deep-teal',
  'islamic-calendar': 'bg-purple-500/10 text-purple-500'
}

const categoryIcons = {
  announcements: '📢',
  events: '📅', 
  achievements: '🏆',
  general: '📰',
  'islamic-calendar': '🌙'
}

export default function NewsPage() {
  const [newsData, setNewsData] = useState<NewsData | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const categoryParam = selectedCategory === 'all' ? '' : `&category=${selectedCategory}`
    fetch(`/api/news?${categoryParam}`)
      .then(res => res.json())
      .then(data => {
        setNewsData(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error loading news data:', err)
        setLoading(false)
      })
  }, [selectedCategory])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-warm-white">
        <div className="pt-24 pb-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="animate-pulse space-y-8">
              <div className="h-12 bg-soft-beige rounded max-w-md mx-auto"></div>
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="h-10 w-24 bg-soft-beige rounded-full"></div>
                ))}
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="space-y-4">
                    <div className="h-48 bg-soft-beige rounded"></div>
                    <div className="h-6 bg-soft-beige rounded"></div>
                    <div className="h-4 bg-soft-beige rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-warm-white">
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-terracotta-red mb-6">
              News & Updates
            </h1>
            <div className="w-24 h-1 bg-wood mx-auto mb-8"></div>
            <p className="text-xl text-deep-teal max-w-3xl mx-auto">
              Stay connected with the latest happenings at OIA Academy Edmonton. From school announcements 
              to community achievements, find all our updates here.
            </p>
          </div>

          {/* Category Filter */}
          <div className="mb-12">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`inline-flex items-center px-6 py-3 rounded-full font-semibold transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-terracotta-red text-warm-white shadow-lg'
                      : 'bg-soft-beige-lightest text-deep-teal hover:bg-soft-beige border border-soft-beige'
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* News Grid */}
          {newsData?.news && newsData.news.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {newsData.news.map((article) => (
                <article key={article.id} className="bg-soft-beige-lightest rounded-lg overflow-hidden shadow-lg border border-soft-beige hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  {article.featured_image && (
                    <div className="relative h-48 bg-soft-beige">
                      <Image
                        src={article.featured_image}
                        alt={article.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <div className="absolute top-4 left-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          categoryColors[article.category as keyof typeof categoryColors] || categoryColors.general
                        }`}>
                          <span className="mr-1">
                            {categoryIcons[article.category as keyof typeof categoryIcons] || categoryIcons.general}
                          </span>
{(article.category || 'general').replace('-', ' ')}
                        </span>
                      </div>
                      {article.featured && (
                        <div className="absolute top-4 right-4">
                          <span className="bg-terracotta-red text-warm-white px-2 py-1 rounded-full text-xs font-semibold">
                            Featured
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-sage-green text-sm font-medium">
                        {formatDate(article.publish_date)}
                      </span>
{article.author && (
                        <span className="text-deep-teal text-sm">
                          By {article.author}
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl font-bold text-terracotta-red mb-3 leading-tight">
                      {article.title}
                    </h2>
                    {article.arabic_title && (
                      <p className="arabic-text text-sage-green mb-3">
                        {article.arabic_title}
                      </p>
                    )}
                    <p className="text-deep-teal text-sm mb-4 leading-relaxed">
                      {article.excerpt || article.content.substring(0, 150) + '...'}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {article.tags?.slice(0, 2).map(tag => (
                          <span key={tag} className="bg-sage-green/20 text-sage-green px-2 py-1 rounded text-xs">
                            #{tag}
                          </span>
                        ))}
                        {(article.tags?.length || 0) > 2 && (
                          <span className="text-sage-green text-xs px-2 py-1">
                            +{(article.tags?.length || 0) - 2} more
                          </span>
                        )}
                      </div>
                      <Link
                        href={`/news/${article.slug || article.id}`}
                        className="text-terracotta-red hover:text-terracotta-red-dark font-semibold text-sm transition-colors duration-200"
                      >
                        Read More →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📰</div>
              <h3 className="text-2xl font-bold text-terracotta-red mb-4">
                No articles found
              </h3>
              <p className="text-deep-teal mb-8">
                {selectedCategory === 'all' 
                  ? 'No news articles are available at this time.' 
                  : `No articles found in the "${categories.find(c => c.id === selectedCategory)?.name}" category.`}
              </p>
              {selectedCategory !== 'all' && (
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="bg-terracotta-red hover:bg-terracotta-red-dark text-warm-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
                >
                  View All Articles
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}