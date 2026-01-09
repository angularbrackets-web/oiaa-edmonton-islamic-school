/**
 * Nested Blocks Editor Component
 *
 * Visual interface for managing blocks inside a columns container.
 * Shows each column with its blocks and allows adding, editing,
 * moving, and deleting blocks within columns.
 */
'use client'

import { useState, useRef, useEffect } from 'react'
import {
  ContentBlock,
  BlockType,
  ColumnsBlockContent,
  ColumnConfig,
  BLOCK_TYPE_LABELS,
  BLOCK_TYPE_ICONS,
  getDefaultBlockContent
} from '@/types/cms'
import {
  PlusIcon,
  TrashIcon,
  PencilIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  EyeIcon,
  EyeSlashIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import ColumnSettingsPanel from './ColumnSettingsPanel'
import NestedBlockEditorModal from './NestedBlockEditorModal'

// Block types allowed inside columns
const ALLOWED_BLOCK_TYPES: BlockType[] = [
  'text',
  'heading',
  'image',
  'video',
  'cards',
  'cta',
  'form',
  'map',
  'documents',
  'widget',
  'spacer',
  'divider',
  'columns'  // Allow nested columns for complex layouts
]

interface NestedBlocksEditorProps {
  parentBlockId: string
  pageId: string
  content: ColumnsBlockContent
  nestedBlocks: ContentBlock[]
  onContentChange: (content: ColumnsBlockContent) => void
  onAddBlock: (blockType: BlockType, columnIndex: number) => Promise<void>
  onUpdateBlock: (blockId: string, updates: Partial<ContentBlock>) => Promise<void>
  onDeleteBlock: (blockId: string) => Promise<void>
  onMoveBlock: (blockId: string, newColumnIndex: number, newOrder: number) => Promise<void>
  onEditBlock: (blockId: string) => void
}

export default function NestedBlocksEditor({
  parentBlockId,
  pageId,
  content,
  nestedBlocks,
  onContentChange,
  onAddBlock,
  onUpdateBlock,
  onDeleteBlock,
  onMoveBlock,
  onEditBlock
}: NestedBlocksEditorProps) {
  const [addingToColumn, setAddingToColumn] = useState<number | null>(null)
  const [loadingBlockId, setLoadingBlockId] = useState<string | null>(null)
  const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const { column_count = 2, column_ratio, columns = [] } = content

  // Ensure we have column configs for each column
  const columnConfigs: ColumnConfig[] = Array.from({ length: column_count }, (_, i) => {
    return columns[i] || { id: `col-${i}` }
  })

  // Group blocks by column_index
  const blocksByColumn: ContentBlock[][] = Array.from({ length: column_count }, () => [])

  // Distribute blocks to columns
  nestedBlocks.forEach(block => {
    const colIndex = block.column_index ?? 0
    const targetColumn = Math.min(colIndex, column_count - 1)
    blocksByColumn[targetColumn].push(block)
  })

  // Sort blocks within each column by display_order
  blocksByColumn.forEach(colBlocks => {
    colBlocks.sort((a, b) => a.display_order - b.display_order)
  })

  // Calculate column widths based on ratio
  const getColumnWidthClass = (index: number): string => {
    if (!column_ratio) {
      return column_count === 2 ? 'w-1/2' : column_count === 3 ? 'w-1/3' : 'w-1/4'
    }

    const parts = column_ratio.split(':').map(Number)
    const total = parts.reduce((a, b) => a + b, 0)
    const percentage = Math.round((parts[index] / total) * 100)

    // Return approximate Tailwind class
    if (percentage <= 20) return 'w-1/5'
    if (percentage <= 30) return 'w-1/4'
    if (percentage <= 35) return 'w-1/3'
    if (percentage <= 45) return 'w-2/5'
    if (percentage <= 55) return 'w-1/2'
    if (percentage <= 65) return 'w-3/5'
    if (percentage <= 75) return 'w-2/3'
    return 'w-3/4'
  }

  const handleUpdateColumnConfig = (index: number, config: ColumnConfig) => {
    const newColumns = [...columnConfigs]
    newColumns[index] = config
    onContentChange({ ...content, columns: newColumns })
  }

  const handleAddBlock = async (blockType: BlockType, columnIndex: number) => {
    setLoadingBlockId('adding')
    try {
      await onAddBlock(blockType, columnIndex)
      setAddingToColumn(null)
    } catch (error) {
      console.error('Error adding block:', error)
    } finally {
      setLoadingBlockId(null)
    }
  }

  const handleMoveBlockUp = async (block: ContentBlock, columnIndex: number) => {
    const colBlocks = blocksByColumn[columnIndex]
    const currentIdx = colBlocks.findIndex(b => b.id === block.id)
    if (currentIdx <= 0) return

    setLoadingBlockId(block.id)
    const prevBlock = colBlocks[currentIdx - 1]
    try {
      await onUpdateBlock(block.id, { display_order: prevBlock.display_order })
      await onUpdateBlock(prevBlock.id, { display_order: block.display_order })
    } finally {
      setLoadingBlockId(null)
    }
  }

  const handleMoveBlockDown = async (block: ContentBlock, columnIndex: number) => {
    const colBlocks = blocksByColumn[columnIndex]
    const currentIdx = colBlocks.findIndex(b => b.id === block.id)
    if (currentIdx >= colBlocks.length - 1) return

    setLoadingBlockId(block.id)
    const nextBlock = colBlocks[currentIdx + 1]
    try {
      await onUpdateBlock(block.id, { display_order: nextBlock.display_order })
      await onUpdateBlock(nextBlock.id, { display_order: block.display_order })
    } finally {
      setLoadingBlockId(null)
    }
  }

  const handleMoveToColumn = async (block: ContentBlock, fromColumn: number, toColumn: number) => {
    if (toColumn < 0 || toColumn >= column_count) return

    setLoadingBlockId(block.id)
    const targetBlocks = blocksByColumn[toColumn]
    const maxOrder = targetBlocks.length > 0
      ? Math.max(...targetBlocks.map(b => b.display_order))
      : -1

    try {
      await onMoveBlock(block.id, toColumn, maxOrder + 1)
    } finally {
      setLoadingBlockId(null)
    }
  }

  const handleToggleVisibility = async (block: ContentBlock) => {
    setLoadingBlockId(block.id)
    try {
      await onUpdateBlock(block.id, { is_visible: !block.is_visible })
    } finally {
      setLoadingBlockId(null)
    }
  }

  const handleDeleteBlock = async (blockId: string) => {
    if (!confirm('Are you sure you want to delete this block?')) return

    setLoadingBlockId(blockId)
    try {
      await onDeleteBlock(blockId)
    } finally {
      setLoadingBlockId(null)
    }
  }

  const handleEditBlock = (block: ContentBlock) => {
    setEditingBlock(block)
  }

  const handleSaveBlock = async (updates: Partial<ContentBlock>) => {
    if (!editingBlock) return
    setLoadingBlockId(editingBlock.id)
    try {
      await onUpdateBlock(editingBlock.id, updates)
      setEditingBlock(null)
    } finally {
      setLoadingBlockId(null)
    }
  }

  return (
    <div ref={containerRef} className="space-y-4">
      {/* Column Headers with Settings */}
      <div className="flex gap-2">
        {columnConfigs.map((config, index) => (
          <div key={config.id} className={`${getColumnWidthClass(index)} min-w-0`}>
            <ColumnSettingsPanel
              columnIndex={index}
              config={config}
              onChange={(newConfig) => handleUpdateColumnConfig(index, newConfig)}
            />
          </div>
        ))}
      </div>

      {/* Columns with Blocks */}
      <div className="flex gap-3">
        {blocksByColumn.map((colBlocks, columnIndex) => (
          <div
            key={columnIndex}
            className={`${getColumnWidthClass(columnIndex)} min-w-0 flex flex-col`}
          >
            {/* Column Container */}
            <div className="bg-gray-100 rounded-lg p-3 min-h-[200px] flex flex-col">
              {/* Column Label */}
              <div className="text-xs font-medium text-gray-500 mb-2 text-center">
                Column {columnIndex + 1}
                <span className="text-gray-400 ml-1">
                  ({colBlocks.length} block{colBlocks.length !== 1 ? 's' : ''})
                </span>
              </div>

              {/* Blocks */}
              <div className="flex-1 space-y-2">
                {colBlocks.map((block, blockIndex) => {
                  const isBlockLoading = loadingBlockId === block.id
                  return (
                    <div
                      key={block.id}
                      className={`
                        bg-white rounded-lg border-2 p-3 group relative
                        ${block.is_visible ? 'border-gray-200' : 'border-gray-300 opacity-60'}
                        ${isBlockLoading ? 'opacity-50' : ''}
                        hover:border-terracotta-red transition-colors
                      `}
                    >
                      {/* Loading overlay for this block only */}
                      {isBlockLoading && (
                        <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-lg">
                          <span className="w-5 h-5 border-2 border-terracotta-red border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}

                      {/* Block Header */}
                      <div className="flex items-start gap-2">
                        <span className="text-xl flex-shrink-0">
                          {BLOCK_TYPE_ICONS[block.block_type]}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-gray-900 truncate">
                            {BLOCK_TYPE_LABELS[block.block_type]}
                          </div>
                          {!block.is_visible && (
                            <span className="text-xs text-gray-500">Hidden</span>
                          )}
                        </div>
                      </div>

                      {/* Block Preview */}
                      <div className="mt-2 text-xs text-gray-500 truncate">
                        {getBlockPreview(block)}
                      </div>

                      {/* Block Actions */}
                      <div className="mt-2 flex flex-wrap gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* Edit */}
                        <button
                          type="button"
                          onClick={() => handleEditBlock(block)}
                          disabled={isBlockLoading}
                          className="p-1 text-gray-500 hover:text-terracotta-red hover:bg-terracotta-red/10 rounded disabled:opacity-50"
                          title="Edit block"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>

                        {/* Move Up */}
                        {blockIndex > 0 && (
                          <button
                            type="button"
                            onClick={() => handleMoveBlockUp(block, columnIndex)}
                            disabled={isBlockLoading}
                            className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded disabled:opacity-50"
                            title="Move up"
                          >
                            <ArrowUpIcon className="w-4 h-4" />
                          </button>
                        )}

                        {/* Move Down */}
                        {blockIndex < colBlocks.length - 1 && (
                          <button
                            type="button"
                            onClick={() => handleMoveBlockDown(block, columnIndex)}
                            disabled={isBlockLoading}
                            className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded disabled:opacity-50"
                            title="Move down"
                          >
                            <ArrowDownIcon className="w-4 h-4" />
                          </button>
                        )}

                        {/* Move to Left Column */}
                        {columnIndex > 0 && (
                          <button
                            type="button"
                            onClick={() => handleMoveToColumn(block, columnIndex, columnIndex - 1)}
                            disabled={isBlockLoading}
                            className="p-1 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded disabled:opacity-50"
                            title="Move to left column"
                          >
                            <ArrowLeftIcon className="w-4 h-4" />
                          </button>
                        )}

                        {/* Move to Right Column */}
                        {columnIndex < column_count - 1 && (
                          <button
                            type="button"
                            onClick={() => handleMoveToColumn(block, columnIndex, columnIndex + 1)}
                            disabled={isBlockLoading}
                            className="p-1 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded disabled:opacity-50"
                            title="Move to right column"
                          >
                            <ArrowRightIcon className="w-4 h-4" />
                          </button>
                        )}

                        {/* Toggle Visibility */}
                        <button
                          type="button"
                          onClick={() => handleToggleVisibility(block)}
                          disabled={isBlockLoading}
                          className="p-1 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 rounded disabled:opacity-50"
                          title={block.is_visible ? 'Hide' : 'Show'}
                        >
                          {block.is_visible ? (
                            <EyeIcon className="w-4 h-4" />
                          ) : (
                            <EyeSlashIcon className="w-4 h-4" />
                          )}
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => handleDeleteBlock(block.id)}
                          disabled={isBlockLoading}
                          className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
                          title="Delete"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )
                })}

                {/* Empty State */}
                {colBlocks.length === 0 && (
                  <div className="text-center text-gray-400 text-sm py-8">
                    No blocks in this column
                  </div>
                )}
              </div>

              {/* Add Block Button */}
              {addingToColumn === columnIndex ? (
                <div className="mt-3 bg-white rounded-lg border-2 border-terracotta-red p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Add Block</span>
                    <button
                      type="button"
                      onClick={() => setAddingToColumn(null)}
                      className="p-1 text-gray-500 hover:text-gray-700"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-1 max-h-[300px] overflow-y-auto">
                    {ALLOWED_BLOCK_TYPES.map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleAddBlock(type, columnIndex)}
                        disabled={loadingBlockId === 'adding'}
                        className="flex items-center gap-2 p-2 text-left text-sm hover:bg-terracotta-red/10 rounded transition-colors disabled:opacity-50"
                      >
                        <span className="text-lg">{BLOCK_TYPE_ICONS[type]}</span>
                        <span className="truncate">{BLOCK_TYPE_LABELS[type]}</span>
                      </button>
                    ))}
                  </div>
                  {loadingBlockId === 'adding' && (
                    <div className="mt-2 text-center text-sm text-gray-500">
                      <span className="inline-block w-4 h-4 border-2 border-terracotta-red border-t-transparent rounded-full animate-spin mr-2" />
                      Adding block...
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setAddingToColumn(columnIndex)}
                  className="mt-3 w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-terracotta-red hover:text-terracotta-red transition-colors flex items-center justify-center gap-2"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span className="text-sm">Add Block</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Block Editor Modal */}
      {editingBlock && (
        <NestedBlockEditorModal
          block={editingBlock}
          onSave={handleSaveBlock}
          onClose={() => setEditingBlock(null)}
          isSaving={loadingBlockId === editingBlock.id}
        />
      )}
    </div>
  )
}

/**
 * Get a short preview text for a block
 */
function getBlockPreview(block: ContentBlock): string {
  const content = block.content as any

  switch (block.block_type) {
    case 'text':
      const text = (content.html || '').replace(/<[^>]*>/g, '')
      return text.substring(0, 50) + (text.length > 50 ? '...' : '') || 'Empty text'
    case 'heading':
      return content.text || 'Empty heading'
    case 'image':
      return content.alt || content.url?.split('/').pop() || 'No image'
    case 'video':
      return content.url?.substring(0, 40) || 'No video URL'
    case 'cards':
      return `${content.cards?.length || 0} card(s)`
    case 'cta':
      return content.title || 'No title'
    case 'form':
      return content.form_name || 'Contact form'
    case 'map':
      return content.address || 'Map location'
    case 'documents':
      return `${content.documents?.length || 0} document(s)`
    case 'spacer':
      return `Height: ${content.height || 'default'}`
    case 'divider':
      return `${content.style || 'solid'} line`
    case 'columns':
      return `${content.column_count || 2} columns`
    default:
      return 'Block'
  }
}
