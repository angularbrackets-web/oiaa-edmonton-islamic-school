'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import PrayerTimes from '@/components/PrayerTimes'

interface NewsItem {
  id: string
  title: string
  excerpt: string
  content: string
  date: string
  author: string
  published: boolean
  featured: boolean
  category?: string
  image?: string
}

interface NewsData {
  news: NewsItem[]
}

export default function NewsPage() {
  const [newsData, setNewsData] = useState<NewsData | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/news')
      .then(res => res.json())
      .then(data => {
        setNewsData(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error loading news:', err)
        setLoading(false)
      })
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const filteredNews = newsData?.news.filter(article => {
    if (selectedCategory === 'all') return article.published
    return article.published && article.category === selectedCategory
  }) || []

  const categories = Array.from(new Set(newsData?.news.filter(n => n.category).map(n => n.category))).filter(Boolean)

  if (loading) {
    return (
      <div className="min-h-screen bg-soft-beige-lightest">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="animate-pulse space-y-8">
            <div className="h-16 bg-soft-beige rounded max-w-2xl mx-auto"></div>
            <div className="grid md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map(i => (
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
    )
  }

  return (
    <div className="min-h-screen bg-soft-beige-lightest">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-terracotta-red to-wood text-warm-white py-20">
        <div className="absolute inset-0 islamic-pattern opacity-10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            News & Updates
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
            Stay informed with the latest news, announcements, and developments from OIA Academy Edmonton
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  selectedCategory === 'all'
                    ? 'bg-terracotta-red text-warm-white'
                    : 'bg-warm-white text-deep-teal hover:bg-soft-beige border border-soft-beige'
                }`}
              >
                All News
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category || '')}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 capitalize ${
                    selectedCategory === category
                      ? 'bg-terracotta-red text-warm-white'
                      : 'bg-warm-white text-deep-teal hover:bg-soft-beige border border-soft-beige'
                  }`}
                >
                  {category?.replace('-', ' ')}
                </button>
              ))}
            </div>

            {/* News Articles */}
            <div className="space-y-8">
              {filteredNews.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">📰</div>
                  <h3 className="text-2xl font-bold text-terracotta-red mb-2">
                    No articles found
                  </h3>
                  <p className="text-deep-teal">
                    Check back soon for more updates!
                  </p>
                </div>
              ) : (
                filteredNews.map((article) => (
                  <article key={article.id} className="bg-warm-white rounded-lg overflow-hidden shadow-lg border border-soft-beige hover:shadow-xl transition-shadow duration-300">
                    <div className="md:flex">
                      {article.image && (
                        <div className="md:w-1/3 relative h-64 md:h-auto">
                          <Image
                            src={article.image}
                            alt={article.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className={`${article.image ? 'md:w-2/3' : 'w-full'} p-8`}>
                        <div className="flex items-center mb-4">
                          {article.featured && (
                            <span className="bg-terracotta-red text-warm-white px-3 py-1 rounded-full text-sm font-semibold mr-3">
                              Featured
                            </span>
                          )}
                          {article.category && (
                            <span className="bg-sage-green/20 text-sage-green px-3 py-1 rounded-full text-sm capitalize">
                              {article.category.replace('-', ' ')}
                            </span>
                          )}
                        </div>
                        
                        <h2 className="text-2xl md:text-3xl font-bold text-terracotta-red mb-4">
                          {article.title}
                        </h2>
                        
                        <p className="text-deep-teal mb-4 leading-relaxed">
                          {article.excerpt}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="text-sm text-sage-green">
                            <p className="font-medium">{article.author}</p>
                            <p>{formatDate(article.date)}</p>
                          </div>
                          <button
                            onClick={() => setSelectedArticle(article)}
                            className="bg-terracotta-red hover:bg-terracotta-red-dark text-warm-white px-6 py-2 rounded-lg font-semibold transition-colors duration-300"
                          >
                            Read More
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Prayer Times Widget */}
            <PrayerTimes />

            {/* Newsletter Signup */}
            <div className="bg-warm-white rounded-lg p-6 shadow-lg border border-soft-beige">
              <h3 className="text-xl font-bold text-terracotta-red mb-4">
                Stay Updated
              </h3>
              <p className="text-deep-teal mb-4 text-sm">
                Subscribe to our newsletter for the latest news and updates.
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-4 py-3 border border-soft-beige rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
                />
                <button className="w-full bg-terracotta-red hover:bg-terracotta-red-dark text-warm-white py-3 rounded-lg font-semibold transition-colors duration-300">
                  Subscribe
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-warm-white rounded-lg p-6 shadow-lg border border-soft-beige">
              <h3 className="text-xl font-bold text-terracotta-red mb-4">
                Quick Links
              </h3>
              <div className="space-y-3">
                <a
                  href="/events"
                  className="block text-deep-teal hover:text-terracotta-red transition-colors duration-200"
                >
                  → Upcoming Events
                </a>
                <a
                  href="/new-centre"
                  className="block text-deep-teal hover:text-terracotta-red transition-colors duration-200"
                >
                  → New Centre Project
                </a>
                <a
                  href="/gallery"
                  className="block text-deep-teal hover:text-terracotta-red transition-colors duration-200"
                >
                  → Photo Gallery
                </a>
                <a
                  href="/donate"
                  className="block text-deep-teal hover:text-terracotta-red transition-colors duration-200"
                >
                  → Support Our Mission
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-warm-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-3xl font-bold text-terracotta-red mb-4">
                    {selectedArticle.title}
                  </h3>
                  <div className="text-sage-green">
                    <p className="font-medium">{selectedArticle.author}</p>
                    <p className="text-sm">{formatDate(selectedArticle.date)}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="text-deep-teal hover:text-terracotta-red text-2xl font-bold"
                >
                  ×
                </button>
              </div>
              
              {selectedArticle.image && (
                <div className="relative h-64 mb-6 rounded-lg overflow-hidden">
                  <Image
                    src={selectedArticle.image}
                    alt={selectedArticle.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="prose max-w-none">
                <p className="text-deep-teal leading-relaxed text-lg">
                  {selectedArticle.content}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}