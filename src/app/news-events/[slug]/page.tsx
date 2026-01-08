import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { CalendarIcon, UserIcon, TagIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import ShareButtons from '@/components/ShareButtons'

interface NewsArticle {
  id: string
  title: string
  arabic_title?: string
  slug: string
  content: string
  excerpt?: string
  featured_image?: string
  category: string
  tags?: string[]
  author?: string
  publish_date: string
  created_at: string
  updated_at: string
}

async function getArticle(slug: string): Promise<NewsArticle | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/news/${slug}`, {
      cache: 'no-store'
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.success ? data.data : null
  } catch (error) {
    console.error('Error fetching article:', error)
    return null
  }
}

async function getRelatedArticles(category: string, currentSlug: string): Promise<NewsArticle[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/news?category=${category}&limit=3`, {
      cache: 'no-store'
    })

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    const articles = data.success ? data.data : []

    // Filter out current article and limit to 3
    return articles.filter((article: NewsArticle) => article.slug !== currentSlug).slice(0, 3)
  } catch (error) {
    console.error('Error fetching related articles:', error)
    return []
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article) {
    return {
      title: 'Article Not Found'
    }
  }

  return {
    title: `${article.title} | OIA Academy News`,
    description: article.excerpt || article.content.substring(0, 160),
    openGraph: {
      title: article.title,
      description: article.excerpt || article.content.substring(0, 160),
      images: article.featured_image ? [article.featured_image] : [],
      type: 'article',
      publishedTime: article.publish_date || article.created_at,
      authors: article.author ? [article.author] : undefined,
      tags: article.tags
    }
  }
}

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article) {
    notFound()
  }

  const relatedArticles = await getRelatedArticles(article.category, article.slug)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const categoryColors: Record<string, string> = {
    announcements: 'bg-blue-100 text-blue-800',
    events: 'bg-purple-100 text-purple-800',
    achievements: 'bg-green-100 text-green-800',
    'islamic-calendar': 'bg-teal-100 text-teal-800',
    general: 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen bg-warm-white">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-4 pt-24 pb-4">
        <Link
          href="/news-events"
          className="inline-flex items-center gap-2 text-deep-teal hover:text-terracotta-red transition-colors duration-300"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>Back to News</span>
        </Link>
      </div>

      {/* Article Header */}
      <article className="max-w-4xl mx-auto px-4 pb-16">
        {/* Category Badge */}
        <div className="mb-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            categoryColors[article.category] || categoryColors.general
          }`}>
            {article.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-deep-teal mb-4">
          {article.title}
        </h1>

        {/* Arabic Title */}
        {article.arabic_title && (
          <h2 className="text-2xl md:text-3xl font-bold text-sage-green mb-6 arabic-text text-right">
            {article.arabic_title}
          </h2>
        )}

        {/* Metadata */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-8 pb-8 border-b border-soft-beige">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            <span>{formatDate(article.publish_date || article.created_at)}</span>
          </div>

          {article.author && (
            <div className="flex items-center gap-2">
              <UserIcon className="w-5 h-5" />
              <span>{article.author}</span>
            </div>
          )}

          {article.tags && article.tags.length > 0 && (
            <div className="flex items-center gap-2">
              <TagIcon className="w-5 h-5" />
              <div className="flex flex-wrap gap-2">
                {article.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-soft-beige rounded text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Featured Image */}
        {article.featured_image && (
          <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
            <Image
              src={article.featured_image}
              alt={article.title}
              width={1200}
              height={600}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        )}

        {/* Excerpt */}
        {article.excerpt && (
          <div className="text-xl text-gray-700 mb-8 p-6 bg-soft-beige/30 rounded-lg border-l-4 border-terracotta-red">
            {article.excerpt}
          </div>
        )}

        {/* Content */}
        <div
          className="prose prose-lg max-w-none
            prose-headings:text-deep-teal
            prose-h2:text-3xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4
            prose-h3:text-2xl prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-3
            prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
            prose-a:text-terracotta-red prose-a:no-underline hover:prose-a:underline
            prose-strong:text-deep-teal prose-strong:font-semibold
            prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6
            prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6
            prose-li:text-gray-700 prose-li:mb-2
            prose-blockquote:border-l-4 prose-blockquote:border-terracotta-red
            prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600
            prose-img:rounded-lg prose-img:shadow-lg"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Share Section */}
        <ShareButtons title={article.title} excerpt={article.excerpt} />
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <div className="bg-soft-beige/30 py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-deep-teal mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedArticles.map(relatedArticle => (
                <Link
                  key={relatedArticle.id}
                  href={`/news-events/${relatedArticle.slug}`}
                  className="group bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  {relatedArticle.featured_image && (
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={relatedArticle.featured_image}
                        alt={relatedArticle.title}
                        width={400}
                        height={300}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mb-3 ${
                      categoryColors[relatedArticle.category] || categoryColors.general
                    }`}>
                      {relatedArticle.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                    <h3 className="text-xl font-semibold text-deep-teal mb-2 group-hover:text-terracotta-red transition-colors">
                      {relatedArticle.title}
                    </h3>
                    {relatedArticle.excerpt && (
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {relatedArticle.excerpt}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 mt-3">
                      {formatDate(relatedArticle.publish_date || relatedArticle.created_at)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
