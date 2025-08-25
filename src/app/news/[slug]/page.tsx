'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
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

export default function NewsArticlePage() {
  const params = useParams()
  const router = useRouter()
  const [article, setArticle] = useState<NewsArticle | null>(null)
  const [relatedArticles, setRelatedArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!params.slug) return

    // Fetch all articles to find the one with matching slug and related articles
    fetch('/api/news')
      .then(res => res.json())
      .then(data => {
        const currentArticle = data.news.find((a: NewsArticle) => a.slug === params.slug)
        
        if (!currentArticle) {
          setNotFound(true)
          setLoading(false)
          return
        }

        setArticle(currentArticle)
        
        // Get related articles (same category, excluding current article, limit to 3)
        const related = data.news
          .filter((a: NewsArticle) => 
            a.id !== currentArticle.id && 
            a.category === currentArticle.category
          )
          .slice(0, 3)
        
        setRelatedArticles(related)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error loading article:', err)
        setNotFound(true)
        setLoading(false)
      })
  }, [params.slug])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatContent = (content: string) => {
    // Simple content formatting - split by double newlines to create paragraphs
    return content.split('\n\n').map((paragraph, index) => (
      <p key={index} className="mb-6 leading-relaxed">
        {paragraph}
      </p>
    ))
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-warm-white">
        <div className="pt-24 pb-20">
          <div className="max-w-4xl mx-auto px-4">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-soft-beige rounded w-1/4"></div>
              <div className="h-12 bg-soft-beige rounded"></div>
              <div className="h-64 bg-soft-beige rounded"></div>
              <div className="space-y-4">
                <div className="h-4 bg-soft-beige rounded"></div>
                <div className="h-4 bg-soft-beige rounded w-5/6"></div>
                <div className="h-4 bg-soft-beige rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (notFound || !article) {
    return (
      <main className="min-h-screen bg-warm-white">
        <div className="pt-24 pb-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="text-6xl mb-8">📰</div>
            <h1 className="text-3xl font-bold text-terracotta-red mb-4">
              Article Not Found
            </h1>
            <p className="text-deep-teal mb-8">
              The news article you're looking for doesn't exist or has been removed.
            </p>
            <Link
              href="/news"
              className="inline-flex items-center bg-terracotta-red hover:bg-terracotta-red-dark text-warm-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
            >
              ← Back to News
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-warm-white">
      <div className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <div className="flex items-center space-x-2 text-sm">
              <Link href="/" className="text-sage-green hover:text-sage-green-dark">
                Home
              </Link>
              <span className="text-deep-teal">›</span>
              <Link href="/news" className="text-sage-green hover:text-sage-green-dark">
                News
              </Link>
              <span className="text-deep-teal">›</span>
              <span className="text-deep-teal">{article.title}</span>
            </div>
          </nav>

          {/* Article Header */}
          <article className="mb-16">
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  categoryColors[article.category as keyof typeof categoryColors] || categoryColors.general
                }`}>
                  <span className="mr-1">
                    {categoryIcons[article.category as keyof typeof categoryIcons] || categoryIcons.general}
                  </span>
                  {article.category.replace('-', ' ')}
                </span>
                {article.featured && (
                  <span className="bg-terracotta-red text-warm-white px-3 py-1 rounded-full text-sm font-semibold">
                    Featured Article
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-terracotta-red mb-4 leading-tight">
                {article.title}
              </h1>

              {article.arabic_title && (
                <p className="arabic-text text-sage-green text-2xl mb-6">
                  {article.arabic_title}
                </p>
              )}

              <div className="flex items-center gap-6 text-deep-teal mb-8">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">📅</span>
                  <span>{formatDate(article.publish_date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">👤</span>
                  <span>By {article.author}</span>
                </div>
              </div>

              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {article.tags.map(tag => (
                    <span key={tag} className="bg-sage-green/20 text-sage-green px-3 py-1 rounded-full text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Featured Image */}
            {article.featured_image && (
              <div className="relative h-64 md:h-80 mb-8 rounded-lg overflow-hidden">
                <Image
                  src={article.featured_image}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              <div className="text-deep-teal text-lg leading-relaxed">
                {formatContent(article.content)}
              </div>
            </div>
          </article>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <section className="border-t border-soft-beige pt-16">
              <h2 className="text-2xl font-bold text-terracotta-red mb-8">
                Related Articles
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedArticles.map((relatedArticle) => (
                  <Link
                    key={relatedArticle.id}
                    href={`/news/${relatedArticle.slug}`}
                    className="group"
                  >
                    <div className="bg-soft-beige-lightest rounded-lg overflow-hidden shadow-lg border border-soft-beige hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      {relatedArticle.featured_image && (
                        <div className="relative h-32 bg-soft-beige">
                          <Image
                            src={relatedArticle.featured_image}
                            alt={relatedArticle.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <span className="text-sage-green text-xs font-medium mb-2 block">
                          {formatDate(relatedArticle.publish_date)}
                        </span>
                        <h3 className="text-lg font-bold text-terracotta-red mb-2 leading-tight group-hover:text-terracotta-red-dark transition-colors">
                          {relatedArticle.title}
                        </h3>
                        <p className="text-deep-teal text-sm">
                          {relatedArticle.excerpt || relatedArticle.content.substring(0, 100) + '...'}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Back to News */}
          <div className="mt-16 text-center">
            <Link
              href="/news"
              className="inline-flex items-center bg-terracotta-red hover:bg-terracotta-red-dark text-warm-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
            >
              ← Back to All News
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}