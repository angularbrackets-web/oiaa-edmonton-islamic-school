/**
 * Columns Block - Multi-Column Layout Component
 *
 * Renders blocks in a responsive multi-column layout
 */
'use client'

import { ContentBlock, ColumnsBlockContent } from '@/types/cms'
import BlockRenderer from './BlockRenderer'

interface ColumnsBlockProps {
  content: ColumnsBlockContent
  block: ContentBlock  // The columns block itself
}

export default function ColumnsBlock({ content, block }: ColumnsBlockProps) {
  const {
    column_count = 2,
    gap = 'md',
    stack_on_mobile = true
  } = content

  // Nested blocks are the column content
  const nestedBlocks = block.blocks || []
  const visibleBlocks = nestedBlocks.filter(b => b.is_visible)

  if (visibleBlocks.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        <p>This columns block is empty. Add blocks to create columns.</p>
      </div>
    )
  }

  // Gap sizes mapping
  const gapClasses = {
    none: 'gap-0',
    xs: 'gap-2',
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-12'
  }

  // Column grid classes based on column count
  const gridClasses = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4'
  }

  // Distribute blocks across columns
  const blocksPerColumn = Math.ceil(visibleBlocks.length / column_count)
  const columns: ContentBlock[][] = []

  for (let i = 0; i < column_count; i++) {
    const start = i * blocksPerColumn
    const end = start + blocksPerColumn
    const columnBlocks = visibleBlocks.slice(start, end)
    if (columnBlocks.length > 0) {
      columns.push(columnBlocks)
    }
  }

  return (
    <div
      className={`
        grid
        ${stack_on_mobile ? 'grid-cols-1' : gridClasses[column_count]}
        ${gridClasses[column_count]}
        ${gapClasses[gap]}
      `}
    >
      {columns.map((columnBlocks, columnIndex) => (
        <div key={columnIndex} className="column space-y-4">
          {columnBlocks.map((nestedBlock) => (
            <BlockRenderer key={nestedBlock.id} block={nestedBlock} />
          ))}
        </div>
      ))}
    </div>
  )
}
