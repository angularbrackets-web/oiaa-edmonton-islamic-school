/**
 * Columns Block - Multi-Column Layout Component
 *
 * Renders blocks in a responsive multi-column layout with support for:
 * - Variable column widths (ratios like 1:2, 2:1, 1:3, etc.)
 * - Per-column styling (padding, background, borders)
 * - Column-specific block assignment via column_index
 */
'use client'

import { ContentBlock, ColumnsBlockContent, ColumnConfig, ColumnRatio, VerticalAlign, PaddingSize, CardBorderRadius, BorderWidth } from '@/types/cms'
import BlockRenderer from './BlockRenderer'

interface ColumnsBlockProps {
  content: ColumnsBlockContent
  block: ContentBlock  // The columns block itself
}

// Parse column ratio to get individual column spans
// Uses a 12-column grid base for flexibility
function parseColumnRatio(ratio: ColumnRatio | undefined, columnCount: 1 | 2 | 3 | 4): number[] {
  if (!ratio) {
    // Default to equal columns
    const span = 12 / columnCount
    return Array(columnCount).fill(span)
  }

  const parts = ratio.split(':').map(Number)
  const total = parts.reduce((a, b) => a + b, 0)

  // Convert ratio parts to 12-column grid spans
  return parts.map(part => Math.round((part / total) * 12))
}

// Get Tailwind grid column span class
function getColSpanClass(span: number): string {
  const spanClasses: Record<number, string> = {
    1: 'md:col-span-1',
    2: 'md:col-span-2',
    3: 'md:col-span-3',
    4: 'md:col-span-4',
    5: 'md:col-span-5',
    6: 'md:col-span-6',
    7: 'md:col-span-7',
    8: 'md:col-span-8',
    9: 'md:col-span-9',
    10: 'md:col-span-10',
    11: 'md:col-span-11',
    12: 'md:col-span-12'
  }
  return spanClasses[span] || 'md:col-span-6'
}

// Get vertical alignment class
function getVerticalAlignClass(align: VerticalAlign | undefined): string {
  const alignClasses: Record<VerticalAlign, string> = {
    top: 'items-start',
    center: 'items-center',
    bottom: 'items-end',
    stretch: 'items-stretch'
  }
  return alignClasses[align || 'stretch']
}

// Get padding class
function getPaddingClass(padding: PaddingSize | undefined, horizontal: boolean = false): string {
  if (!padding || padding === 'none') return ''

  const paddingClasses: Record<PaddingSize, { vertical: string; horizontal: string }> = {
    none: { vertical: '', horizontal: '' },
    small: { vertical: 'py-2', horizontal: 'px-2' },
    medium: { vertical: 'py-4', horizontal: 'px-4' },
    large: { vertical: 'py-8', horizontal: 'px-8' }
  }

  return horizontal ? paddingClasses[padding].horizontal : paddingClasses[padding].vertical
}

// Get margin class
function getMarginClass(margin: PaddingSize | undefined, horizontal: boolean = false): string {
  if (!margin || margin === 'none') return ''

  const marginClasses: Record<PaddingSize, { vertical: string; horizontal: string }> = {
    none: { vertical: '', horizontal: '' },
    small: { vertical: 'my-2', horizontal: 'mx-2' },
    medium: { vertical: 'my-4', horizontal: 'mx-4' },
    large: { vertical: 'my-8', horizontal: 'mx-8' }
  }

  return horizontal ? marginClasses[margin].horizontal : marginClasses[margin].vertical
}

// Get border radius class
function getBorderRadiusClass(radius: CardBorderRadius | undefined): string {
  if (!radius || radius === 'none') return ''

  const radiusClasses: Record<CardBorderRadius, string> = {
    none: '',
    small: 'rounded',
    medium: 'rounded-lg',
    large: 'rounded-xl'
  }

  return radiusClasses[radius]
}

// Get border width in pixels
function getBorderWidth(width: BorderWidth | undefined): string {
  if (!width || width === 'none') return '0'

  const widthMap: Record<BorderWidth, string> = {
    none: '0',
    thin: '1px',
    medium: '2px',
    thick: '4px'
  }

  return widthMap[width]
}

// Build inline styles for a column
function getColumnStyles(config: ColumnConfig | undefined): React.CSSProperties {
  if (!config) return {}

  const styles: React.CSSProperties = {}

  if (config.background_color) {
    styles.backgroundColor = config.background_color
  }

  if (config.border_width && config.border_width !== 'none') {
    styles.borderWidth = getBorderWidth(config.border_width)
    styles.borderStyle = 'solid'
    styles.borderColor = config.border_color || '#e5e7eb'
  }

  return styles
}

export default function ColumnsBlock({ content, block }: ColumnsBlockProps) {
  const {
    column_count = 2,
    column_ratio,
    gap = 'md',
    stack_on_mobile = true,
    vertical_align = 'stretch',
    columns: columnConfigs = []
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
  const gapClasses: Record<string, string> = {
    none: 'gap-0',
    xs: 'gap-2',
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-12'
  }

  // Parse the column ratio
  const columnSpans = parseColumnRatio(column_ratio, column_count)
  const numColumns = columnSpans.length

  // Distribute blocks across columns using column_index
  // Blocks with column_index go to their specified column
  // Blocks without column_index are distributed evenly (legacy behavior)
  const columnBlocks: ContentBlock[][] = Array.from({ length: numColumns }, () => [])
  const unassignedBlocks: ContentBlock[] = []

  visibleBlocks.forEach(block => {
    if (block.column_index !== null && block.column_index !== undefined) {
      // Block has a specific column assignment
      const targetColumn = Math.min(block.column_index, numColumns - 1)
      columnBlocks[targetColumn].push(block)
    } else {
      // Block needs to be auto-distributed (legacy behavior)
      unassignedBlocks.push(block)
    }
  })

  // Distribute unassigned blocks evenly (for backwards compatibility)
  if (unassignedBlocks.length > 0) {
    unassignedBlocks.forEach((block, index) => {
      columnBlocks[index % numColumns].push(block)
    })
  }

  // Sort blocks within each column by display_order
  columnBlocks.forEach(colBlocks => {
    colBlocks.sort((a, b) => a.display_order - b.display_order)
  })

  // Build column data with config
  const columns = columnBlocks.map((blocks, index) => ({
    blocks,
    span: columnSpans[index],
    config: columnConfigs[index] || { id: `col-${index}` }
  }))

  // Determine grid class based on whether we're using custom ratios
  // If using ratios, we use 12-column grid; otherwise use simple column count
  const hasRatio = !!column_ratio
  const gridBaseClass = hasRatio ? 'md:grid-cols-12' : `md:grid-cols-${column_count}`
  const containerVerticalAlignClass = getVerticalAlignClass(vertical_align)

  return (
    <div
      className={`
        grid
        ${stack_on_mobile ? 'grid-cols-1' : gridBaseClass}
        ${gridBaseClass}
        ${gapClasses[gap] || 'gap-6'}
        ${containerVerticalAlignClass}
      `.trim().replace(/\s+/g, ' ')}
    >
      {columns.map((column, columnIndex) => {
        const config = column.config
        const columnVerticalAlign = config.vertical_align
          ? getVerticalAlignClass(config.vertical_align)
          : ''

        // Build column classes
        const columnClasses = [
          'column',
          hasRatio ? getColSpanClass(column.span) : '',
          stack_on_mobile ? 'col-span-1 md:col-span-auto' : '',
          getPaddingClass(config.padding),
          getPaddingClass(config.padding_horizontal, true),
          getMarginClass(config.margin),
          getMarginClass(config.margin_horizontal, true),
          getBorderRadiusClass(config.border_radius),
          columnVerticalAlign,
          config.custom_class || ''
        ].filter(Boolean).join(' ')

        return (
          <div
            key={columnIndex}
            className={columnClasses}
            style={getColumnStyles(config)}
          >
            <div className="h-full space-y-6">
              {column.blocks.map((nestedBlock) => (
                <BlockRenderer key={nestedBlock.id} block={nestedBlock} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
