/**
 * Universal Dynamic Page Renderer
 *
 * Handles ALL routes through CMS
 * Examples: /about/mission, /admissions/apply, /contact
 */

import { notFound } from 'next/navigation'
import { pagesService } from '@/lib/supabase/pages'
import BlockRenderer from '@/components/blocks/BlockRenderer'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{
    slug: string[]
  }>
  searchParams: Promise<{
    preview?: string
  }>
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const fullSlug = slug.join('/')

  // Skip metadata generation for dedicated routes
  const firstSegment = slug[0]
  if (firstSegment === 'news-events' || firstSegment === 'admin' || firstSegment === 'api') {
    return { title: 'Page Not Found' }
  }

  try {
    const page = await pagesService.getBySlug(fullSlug, true)

    if (!page) {
      return { title: 'Page Not Found' }
    }

    return {
      title: page.title,
      description: page.meta_description || undefined,
      openGraph: page.og_image ? { images: [page.og_image] } : undefined,
      keywords: page.keywords || undefined
    }
  } catch (error) {
    return { title: 'Page Not Found' }
  }
}

export default async function UniversalPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const { preview } = await searchParams
  const fullSlug = slug.join('/')

  // Skip this catch-all for routes that have dedicated handlers
  // This prevents conflicts with specific routes like /news-events/[slug]
  const firstSegment = slug[0]
  if (firstSegment === 'news-events' || firstSegment === 'admin' || firstSegment === 'api') {
    notFound()
  }

  // Check if we're in preview mode
  const isDraftPreview = preview === 'draft'

  // Fetch page from CMS (allow unpublished if in preview mode)
  const page = await pagesService.getBySlug(fullSlug, !isDraftPreview)

  // 404 if not found
  if (!page) {
    notFound()
  }

  // 404 if not published AND not in preview mode
  if (!page.is_published && !isDraftPreview) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-warm-white">
      {/* Preview Mode Banner */}
      {isDraftPreview && (
        <div className="bg-yellow-500 text-yellow-900 py-3 px-4 text-center font-medium">
          <span className="inline-flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Preview Mode - This is a draft page
          </span>
        </div>
      )}

      {/* Page Header */}
      <div className="bg-gradient-to-br from-deep-teal via-deep-teal to-terracotta-red text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{page.title}</h1>
          {page.meta_description && (
            <p className="text-xl opacity-90">{page.meta_description}</p>
          )}
        </div>
      </div>

      {/* Content Blocks */}
      <div className="py-12 space-y-8">
        {page.blocks && page.blocks.length > 0 ? (
          page.blocks.map(block => (
            <BlockRenderer key={block.id} block={block} />
          ))
        ) : (
          <div className="max-w-4xl mx-auto px-4 text-center text-gray-600">
            <p>This page has no content yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
