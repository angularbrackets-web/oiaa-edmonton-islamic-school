'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeftIcon,
  PlusIcon,
  TrashIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { ReusableComponent, BlockConfiguration, BlockType, BLOCK_TYPE_LABELS, BLOCK_TYPE_ICONS, getDefaultBlockContent } from '@/types/cms'
import TipTapEditor from '@/components/admin/TipTapEditor'
import HeadingBlockEditor from '@/components/admin/blocks/HeadingBlockEditor'
import ImageBlockEditor from '@/components/admin/blocks/ImageBlockEditor'
import VideoBlockEditor from '@/components/admin/blocks/VideoBlockEditor'
import CardsBlockEditor from '@/components/admin/blocks/CardsBlockEditor'
import { TextBlockContent, HeadingBlockContent, ImageBlockContent, VideoBlockContent, CardsBlockContent } from '@/types/cms'

export default function EditComponentBlocksPage() {
  const params = useParams()
  const router = useRouter()
  const componentId = params.id as string

  const [component, setComponent] = useState<ReusableComponent | null>(null)
  const [blocks, setBlocks] = useState<BlockConfiguration[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [showAddBlockMenu, setShowAddBlockMenu] = useState(false)

  useEffect(() => {
    loadComponent()
  }, [componentId])

  const loadComponent = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/components/${componentId}`)
      const data = await response.json()
      if (data.success) {
        setComponent(data.data)
        setBlocks(data.data.blocks_config || [])
      }
    } catch (error) {
      console.error('Error loading component:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveBlocks = async () => {
    setSaving(true)
    try {
      const response = await fetch(`/api/components/${componentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blocks_config: blocks
        })
      })

      if (response.ok) {
        await loadComponent()
        alert('Blocks saved successfully!')
      }
    } catch (error) {
      console.error('Error saving blocks:', error)
      alert('Failed to save blocks')
    } finally {
      setSaving(false)
    }
  }

  const handleAddBlock = (blockType: BlockType) => {
    const newBlock: BlockConfiguration = {
      block_type: blockType,
      content: getDefaultBlockContent(blockType),
      styling: {}
    }
    setBlocks([...blocks, newBlock])
    setShowAddBlockMenu(false)
    setEditingIndex(blocks.length)
  }

  const handleUpdateBlock = (index: number, updates: Partial<BlockConfiguration>) => {
    const updated = [...blocks]
    updated[index] = { ...updated[index], ...updates }
    setBlocks(updated)
  }

  const handleDeleteBlock = (index: number) => {
    if (confirm('Delete this block?')) {
      setBlocks(blocks.filter((_, i) => i !== index))
      setEditingIndex(null)
    }
  }

  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= blocks.length) return

    const updated = [...blocks]
    const temp = updated[index]
    updated[index] = updated[newIndex]
    updated[newIndex] = temp
    setBlocks(updated)
  }

  if (loading) {
    return (
      <AdminLayout title="Edit Component Blocks">
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-terracotta-red border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    )
  }

  if (!component) {
    return (
      <AdminLayout title="Component Not Found">
        <div className="text-center py-12">
          <p className="text-gray-600">Component not found</p>
          <Link href="/admin/components" className="text-terracotta-red hover:underline mt-4 inline-block">
            Back to Components
          </Link>
        </div>
      </AdminLayout>
    )
  }

  const editingBlock = editingIndex !== null ? blocks[editingIndex] : null

  return (
    <AdminLayout title={`Edit Blocks: ${component.name}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/components"
              className="p-2 hover:bg-soft-beige-lightest rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 text-deep-teal" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-deep-teal">{component.name}</h1>
              <p className="text-sm text-gray-600">Edit component blocks</p>
            </div>
          </div>
          <button
            onClick={handleSaveBlocks}
            disabled={saving}
            className="px-6 py-2 bg-terracotta-red text-white rounded-lg hover:bg-terracotta-red/90 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Blocks'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Blocks List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-deep-teal">Blocks ({blocks.length})</h2>
              <button
                onClick={() => setShowAddBlockMenu(!showAddBlockMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-terracotta-red text-white rounded-lg hover:bg-terracotta-red/90 transition-colors"
              >
                <PlusIcon className="w-5 h-5" />
                Add Block
              </button>
            </div>

            {/* Add Block Menu */}
            {showAddBlockMenu && (
              <div className="bg-white rounded-xl shadow-lg p-4 border-2 border-terracotta-red">
                <h3 className="font-semibold text-gray-900 mb-3">Choose Block Type</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {(['text', 'heading', 'image', 'video', 'cards', 'cta'] as BlockType[]).map(type => (
                    <button
                      key={type}
                      onClick={() => handleAddBlock(type)}
                      className="p-4 border border-gray-300 rounded-lg hover:border-terracotta-red hover:bg-terracotta-red/5 transition-colors text-left"
                    >
                      <div className="text-2xl mb-1">{BLOCK_TYPE_ICONS[type]}</div>
                      <div className="text-sm font-medium text-deep-teal">{BLOCK_TYPE_LABELS[type]}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Blocks */}
            {blocks.length === 0 ? (
              <div className="bg-soft-beige-lightest rounded-lg p-8 text-center">
                <p className="text-gray-600">No blocks yet. Click "Add Block" to get started.</p>
              </div>
            ) : (
              blocks.map((block, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-lg p-4 border-2 ${
                    editingIndex === index ? 'border-terracotta-red' : 'border-soft-beige'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{BLOCK_TYPE_ICONS[block.block_type]}</span>
                      <span className="font-medium text-deep-teal">{BLOCK_TYPE_LABELS[block.block_type]}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleMoveBlock(index, 'up')}
                        disabled={index === 0}
                        className="p-1 hover:bg-soft-beige-lightest rounded disabled:opacity-30"
                      >
                        <ArrowUpIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleMoveBlock(index, 'down')}
                        disabled={index === blocks.length - 1}
                        className="p-1 hover:bg-soft-beige-lightest rounded disabled:opacity-30"
                      >
                        <ArrowDownIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingIndex(editingIndex === index ? null : index)}
                        className="px-3 py-1 text-sm bg-soft-beige text-deep-teal rounded hover:bg-soft-beige-light"
                      >
                        {editingIndex === index ? 'Close' : 'Edit'}
                      </button>
                      <button
                        onClick={() => handleDeleteBlock(index)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Block Editor Sidebar */}
          <div className="lg:col-span-1">
            {editingBlock && editingIndex !== null ? (
              <div className="bg-white rounded-lg p-4 border-2 border-terracotta-red sticky top-4">
                <h3 className="font-semibold text-deep-teal mb-4">
                  Editing: {BLOCK_TYPE_LABELS[editingBlock.block_type]}
                </h3>

                {/* Block Content Editors */}
                {editingBlock.block_type === 'text' && (
                  <TipTapEditor
                    content={(editingBlock.content as TextBlockContent).html || ''}
                    onChange={(html) =>
                      handleUpdateBlock(editingIndex, {
                        content: { ...editingBlock.content, html }
                      })
                    }
                  />
                )}

                {editingBlock.block_type === 'heading' && (
                  <HeadingBlockEditor
                    content={editingBlock.content as HeadingBlockContent}
                    onChange={(content) => handleUpdateBlock(editingIndex, { content })}
                  />
                )}

                {editingBlock.block_type === 'image' && (
                  <ImageBlockEditor
                    content={editingBlock.content as ImageBlockContent}
                    onChange={(content) => handleUpdateBlock(editingIndex, { content })}
                  />
                )}

                {editingBlock.block_type === 'video' && (
                  <VideoBlockEditor
                    content={editingBlock.content as VideoBlockContent}
                    onChange={(content) => handleUpdateBlock(editingIndex, { content })}
                  />
                )}

                {editingBlock.block_type === 'cards' && (
                  <CardsBlockEditor
                    content={editingBlock.content as CardsBlockContent}
                    onChange={(content) => handleUpdateBlock(editingIndex, { content })}
                  />
                )}
              </div>
            ) : (
              <div className="bg-soft-beige-lightest rounded-lg p-6 text-center sticky top-4">
                <p className="text-gray-600 text-sm">Select a block to edit</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
