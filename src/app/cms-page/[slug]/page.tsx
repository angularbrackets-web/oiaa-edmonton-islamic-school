/**
 * Dynamic CMS Page Renderer
 *
 * Renders pages managed through the CMS
 * Access via: /cms-page/your-page-slug
 */

import { notFound } from 'next/navigation'
import { pagesService } from '@/lib/supabase/pages'
import BlockRenderer from '@/components/blocks/BlockRenderer'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params

  try {
    const page = await pagesService.getBySlug(slug, true)

    if (!page) {
      return {
        title: 'Page Not Found'
      }
    }

    return {
      title: page.title,
      description: page.meta_description || undefined,
      openGraph: page.og_image ? {
        images: [page.og_image]
      } : undefined,
      keywords: page.keywords || undefined
    }
  } catch (error) {
    return {
      title: 'Page Not Found'
    }
  }
}

export default async function CMSPage({ params }: PageProps) {
  const { slug } = await params

  // Fetch page data
  const page = await pagesService.getBySlug(slug, true)

  // Show 404 if page doesn't exist or isn't published
  if (!page || !page.is_published) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-warm-white">
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
