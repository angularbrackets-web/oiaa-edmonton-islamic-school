'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

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

export default function News() {
  const [newsData, setNewsData] = useState<NewsData | null>(null)
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

  const featuredNews = newsData?.news.filter(item => item.featured && item.published) || []
  const recentNews = newsData?.news.filter(item => item.published).slice(0, 6) || []

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <section className="py-20 bg-warm-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-12 bg-soft-beige rounded mb-8 max-w-md mx-auto"></div>
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="space-y-4">
                  <div className="h-48 bg-soft-beige rounded"></div>
                  <div className="h-6 bg-soft-beige rounded"></div>
                  <div className="h-4 bg-soft-beige rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-warm-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-terracotta-red mb-6">
            Latest News & Updates
          </h2>
          <div className="w-24 h-1 bg-wood mx-auto mb-8"></div>
          <p className="text-xl text-deep-teal max-w-3xl mx-auto">
            Stay updated with the latest developments, events, and achievements from our community.
          </p>
        </div>

        {/* Featured News */}
        {featuredNews.length > 0 && (
          <div className="mb-16">
            <div className="bg-soft-beige-lightest rounded-lg overflow-hidden shadow-lg border border-soft-beige">
              <div className="md:flex">
                {featuredNews[0].image && (
                  <div className="md:w-1/2 relative h-64 md:h-auto">
                    <Image
                      src={featuredNews[0].image}
                      alt={featuredNews[0].title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className={`${featuredNews[0].image ? 'md:w-1/2' : 'w-full'} p-8`}>
                  <div className="flex items-center mb-4">
                    <span className="bg-terracotta-red text-warm-white px-3 py-1 rounded-full text-sm font-semibold mr-3">
                      Featured
                    </span>
                    {featuredNews[0].category && (
                      <span className="text-wood text-sm capitalize">
                        {featuredNews[0].category}
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-terracotta-red mb-4">
                    {featuredNews[0].title}
                  </h3>
                  <p className="text-deep-teal mb-4 leading-relaxed">
                    {featuredNews[0].excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-sage-green">
                      <p className="font-medium">{featuredNews[0].author}</p>
                      <p>{formatDate(featuredNews[0].date)}</p>
                    </div>
                    <button className="bg-terracotta-red hover:bg-terracotta-red-dark text-warm-white px-6 py-2 rounded-lg font-semibold transition-colors duration-300">
                      Read More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent News Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {recentNews.slice(featuredNews.length > 0 ? 1 : 0).map((item) => (
            <article key={item.id} className="bg-soft-beige-lightest rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border border-soft-beige">
              {item.image && (
                <div className="relative h-48">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <span className="text-wood text-sm">
                    {formatDate(item.date)}
                  </span>
                  {item.category && (
                    <>
                      <span className="mx-2 text-soft-beige">•</span>
                      <span className="text-sage-green text-sm capitalize">
                        {item.category}
                      </span>
                    </>
                  )}
                </div>
                <h3 className="text-xl font-bold text-terracotta-red mb-3 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-deep-teal mb-4 line-clamp-3">
                  {item.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-sage-green font-medium">
                    {item.author}
                  </span>
                  <button className="text-terracotta-red hover:text-terracotta-red-dark font-semibold transition-colors duration-200">
                    Read More →
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="bg-wood hover:bg-wood-dark text-warm-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300 shadow-md">
            View All News
          </button>
        </div>
      </div>
    </section>
  )
}