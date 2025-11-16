'use client'

import { useEffect, useState } from 'react'
import { PageEmbedBlockContent, PageWithBlocks, ContentBlock } from '@/types/cms'
import BlockRenderer from './BlockRenderer'

interface PageEmbedBlockProps {
  content: PageEmbedBlockContent
}

export default function PageEmbedBlock({ content }: PageEmbedBlockProps) {
  const [page, setPage] = useState<PageWithBlocks | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadPage()
  }, [content.page_id])

  const loadPage = async () => {
    if (!content.page_id) {
      setError('No page selected')
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/pages/${content.page_id}?include_blocks=true`)
      const data = await response.json()

      if (data.success && data.data) {
        setPage(data.data)
      } else {
        setError('Page not found')
      }
    } catch (err) {
      console.error('Error loading embedded page:', err)
      setError('Failed to load page content')
    } finally {
      setLoading(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="bg-gray-50 rounded-lg p-12">
        <div className="flex flex-col items-center justify-center">
          <div className="w-8 h-8 border-4 border-terracotta-red border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading embedded content...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !page) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-8">
        <div className="text-center">
          <p className="text-red-800 font-medium">Unable to load embedded content</p>
          <p className="text-sm text-red-600 mt-2">{error || 'Page not found'}</p>
        </div>
      </div>
    )
  }

  // Get blocks to display
  const blocksToDisplay: ContentBlock[] = content.blocks_to_show === 'all'
    ? page.blocks
    : page.blocks.filter(block => (content.blocks_to_show as string[]).includes(block.id))

  // Filter only visible blocks
  const visibleBlocks = blocksToDisplay.filter(block => block.is_visible)

  return (
    <div className="embedded-page-content">
      {/* Optional Page Title */}
      {content.show_title && (
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-deep-teal mb-2">
            {page.title}
          </h2>
          {page.meta_description && (
            <p className="text-lg text-gray-600">
              {page.meta_description}
            </p>
          )}
        </div>
      )}

      {/* Render Embedded Blocks */}
      {visibleBlocks.length > 0 ? (
        <div className="space-y-0">
          {visibleBlocks.map(block => (
            <BlockRenderer key={block.id} block={block} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600">No content available</p>
        </div>
      )}
    </div>
  )
}
