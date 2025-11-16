/**
 * Section Block - Container Component
 *
 * Renders a section container with nested blocks
 * Used for grouping blocks with shared background/spacing
 */
'use client'

import { ContentBlock, SectionBlockContent } from '@/types/cms'
import BlockRenderer from './BlockRenderer'

interface SectionBlockProps {
  block: ContentBlock  // The section block itself
}

export default function SectionBlock({ block }: SectionBlockProps) {
  // Section blocks contain nested blocks via the blocks array
  const nestedBlocks = block.blocks || []

  // Filter only visible blocks
  const visibleBlocks = nestedBlocks.filter(b => b.is_visible)

  if (visibleBlocks.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        <p>This section is empty. Add blocks to it in the admin panel.</p>
      </div>
    )
  }

  return (
    <div className="section-container">
      {visibleBlocks.map((nestedBlock) => (
        <BlockRenderer key={nestedBlock.id} block={nestedBlock} />
      ))}
    </div>
  )
}
