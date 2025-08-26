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

export default function News() {
  const [newsData, setNewsData] = useState<NewsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/news?limit=4')
      .then(res => res.json())
      .then(data => {
        setNewsData(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error loading news data:', err)
        setLoading(false)
      })
  }, [])

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
      <section className="py-20 bg-soft-beige-lightest">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-soft-beige rounded max-w-md mx-auto"></div>
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
      </section>
    )
  }

  if (!newsData?.news || newsData.news.length === 0) {
    return (
      <section className="py-20 bg-soft-beige-lightest">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-terracotta-red mb-4">
            Latest News & Updates
          </h2>
          <p className="text-deep-teal">No news articles available at this time.</p>
        </div>
      </section>
    )
  }

  const featuredArticle = newsData.news.find(article => article.featured) || newsData.news[0]
  const recentArticles = newsData.news.filter(article => article.id !== featuredArticle.id).slice(0, 3)

  return (
    <section className="py-20 bg-soft-beige-lightest">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-terracotta-red mb-6">
            Latest News & Updates
          </h2>
          <div className="w-24 h-1 bg-wood mx-auto mb-8"></div>
          <p className="text-xl text-deep-teal max-w-3xl mx-auto">
            Stay informed about school announcements, events, achievements, and community highlights.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Featured Article */}
          <div className="lg:col-span-1">
            <div className="bg-warm-white rounded-lg overflow-hidden shadow-lg border border-soft-beige hover:shadow-xl transition-shadow duration-300">
{featuredArticle.featured_image && (
                <div className="relative h-64 bg-soft-beige">
                  <Image
                    src={featuredArticle.featured_image}
                    alt={featuredArticle.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      categoryColors[featuredArticle.category as keyof typeof categoryColors] || categoryColors.general
                    }`}>
                      <span className="mr-1">
                        {categoryIcons[featuredArticle.category as keyof typeof categoryIcons] || categoryIcons.general}
                      </span>
{(featuredArticle.category || 'general').replace('-', ' ')}
                    </span>
                  </div>
                </div>
              )}
              <div className="p-8">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-sage-green text-sm font-medium">
                    {formatDate(featuredArticle.publish_date)}
                  </span>
{featuredArticle.author && (
                    <span className="text-deep-teal text-sm">
                      By {featuredArticle.author}
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-bold text-terracotta-red mb-4 leading-tight">
                  {featuredArticle.title}
                </h3>
                {featuredArticle.arabic_title && (
                  <p className="arabic-text text-sage-green mb-4 text-lg">
                    {featuredArticle.arabic_title}
                  </p>
                )}
                <p className="text-deep-teal mb-6 leading-relaxed">
                  {featuredArticle.excerpt || featuredArticle.content.substring(0, 200) + '...'}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {featuredArticle.tags?.slice(0, 3).map(tag => (
                      <span key={tag} className="bg-sage-green/20 text-sage-green px-2 py-1 rounded text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/news/${featuredArticle.slug || featuredArticle.id}`}
                    className="inline-flex items-center text-terracotta-red hover:text-terracotta-red-dark font-semibold transition-colors duration-200"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Articles */}
          <div className="lg:col-span-1 space-y-6">
            {recentArticles.map((article) => (
              <div key={article.id} className="bg-warm-white rounded-lg overflow-hidden shadow-lg border border-soft-beige hover:shadow-xl transition-shadow duration-300">
                <div className="flex">
{article.featured_image && (
                    <div className="relative w-1/3 h-32 bg-soft-beige flex-shrink-0">
                      <Image
                        src={article.featured_image}
                        alt={article.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )}
                  <div className="flex-1 p-6">
                    <div className="flex items-center gap-4 mb-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        categoryColors[article.category as keyof typeof categoryColors] || categoryColors.general
                      }`}>
                        <span className="mr-1">
                          {categoryIcons[article.category as keyof typeof categoryIcons] || categoryIcons.general}
                        </span>
{(article.category || 'general').replace('-', ' ')}
                      </span>
                      <span className="text-sage-green text-xs font-medium">
                        {formatDate(article.publish_date)}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-terracotta-red mb-2 leading-tight">
                      {article.title}
                    </h4>
                    <p className="text-deep-teal text-sm mb-3 leading-relaxed">
                      {article.excerpt || article.content.substring(0, 120) + '...'}
                    </p>
                    <Link
                      href={`/news/${article.slug || article.id}`}
                      className="text-terracotta-red hover:text-terracotta-red-dark font-semibold text-sm transition-colors duration-200"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* View All News Button */}
        <div className="text-center">
          <Link
            href="/news"
            className="inline-flex items-center bg-terracotta-red hover:bg-terracotta-red-dark text-warm-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            <span className="mr-2">📰</span>
            View All News & Updates
          </Link>
        </div>
      </div>
    </section>
  )
}