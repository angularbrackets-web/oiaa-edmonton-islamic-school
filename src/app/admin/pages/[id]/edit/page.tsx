'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowLeftIcon,
  PlusIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { Page, ContentBlock, BlockType, BLOCK_TYPE_LABELS, BLOCK_TYPE_ICONS, getDefaultBlockContent, ContainerWidth, PaddingSize, SpacingSize } from '@/types/cms'
import TipTapEditor from '@/components/admin/TipTapEditor'
import ImageBlockEditor from '@/components/admin/blocks/ImageBlockEditor'
import VideoBlockEditor from '@/components/admin/blocks/VideoBlockEditor'
import CardsBlockEditor from '@/components/admin/blocks/CardsBlockEditor'
import PageEmbedBlockEditor from '@/components/admin/blocks/PageEmbedBlockEditor'
import ComponentBlockEditor from '@/components/admin/blocks/ComponentBlockEditor'
import SectionBlockEditor from '@/components/admin/blocks/SectionBlockEditor'
import ColumnsBlockEditor from '@/components/admin/blocks/ColumnsBlockEditor'
import SimplifiedLayoutControls from '@/components/admin/blocks/SimplifiedLayoutControls'
import { TextBlockContent, ImageBlockContent, CTABlockContent, VideoBlockContent, CardsBlockContent, PageEmbedBlockContent, ComponentBlockContent, SectionBlockContent, ColumnsBlockContent } from '@/types/cms'

export default function EditPagePage() {
  const params = useParams()
  const router = useRouter()
  const pageId = params.id as string

  const [page, setPage] = useState<Page | null>(null)
  const [blocks, setBlocks] = useState<ContentBlock[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null)
  const [showAddBlockMenu, setShowAddBlockMenu] = useState(false)

  useEffect(() => {
    loadPage()
    loadBlocks()
  }, [pageId])

  const loadPage = async () => {
    try {
      const response = await fetch(`/api/pages/${pageId}`)
      const data = await response.json()
      if (data.success) {
        setPage(data.data)
      }
    } catch (error) {
      console.error('Error loading page:', error)
    }
  }

  const loadBlocks = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/blocks?page_id=${pageId}&admin=true`)
      const data = await response.json()
      if (data.success) {
        setBlocks(data.data || [])
      }
    } catch (error) {
      console.error('Error loading blocks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePage = async (updates: Partial<Page>) => {
    setSaving(true)
    try {
      const response = await fetch(`/api/pages/${pageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      if (response.ok) {
        await loadPage()
      }
    } catch (error) {
      console.error('Error updating page:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleAddBlock = async (blockType: BlockType) => {
    try {
      const maxOrder = blocks.length > 0 ? Math.max(...blocks.map(b => b.display_order)) : -1
      const response = await fetch('/api/blocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page_id: pageId,
          block_type: blockType,
          content: getDefaultBlockContent(blockType),
          display_order: maxOrder + 1,
          is_visible: true
        })
      })
      if (response.ok) {
        await loadBlocks()
        setShowAddBlockMenu(false)
      }
    } catch (error) {
      console.error('Error adding block:', error)
    }
  }

  const handleUpdateBlock = async (blockId: string, updates: Partial<ContentBlock>) => {
    try {
      const response = await fetch(`/api/blocks/${blockId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      if (response.ok) {
        await loadBlocks()
        setEditingBlockId(null)
      }
    } catch (error) {
      console.error('Error updating block:', error)
    }
  }

  const handleDeleteBlock = async (blockId: string) => {
    if (!confirm('Are you sure you want to delete this block?')) return

    try {
      const response = await fetch(`/api/blocks/${blockId}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        await loadBlocks()
      }
    } catch (error) {
      console.error('Error deleting block:', error)
    }
  }

  const handleToggleBlockVisibility = async (blockId: string) => {
    try {
      const response = await fetch(`/api/blocks/${blockId}?action=toggle_visibility`, {
        method: 'PATCH'
      })
      if (response.ok) {
        await loadBlocks()
      }
    } catch (error) {
      console.error('Error toggling visibility:', error)
    }
  }

  const handleMoveBlock = async (blockId: string, direction: 'up' | 'down') => {
    const currentIndex = blocks.findIndex(b => b.id === blockId)
    if (currentIndex === -1) return
    if (direction === 'up' && currentIndex === 0) return
    if (direction === 'down' && currentIndex === blocks.length - 1) return

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    const newBlocks = [...blocks]
    const temp = newBlocks[currentIndex]
    newBlocks[currentIndex] = newBlocks[newIndex]
    newBlocks[newIndex] = temp

    // Update display orders
    const blockIds = newBlocks.map(b => b.id)
    const newOrders = newBlocks.map((_, i) => i)

    try {
      const response = await fetch('/api/blocks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ block_ids: blockIds, new_orders: newOrders })
      })
      if (response.ok) {
        await loadBlocks()
      }
    } catch (error) {
      console.error('Error reordering blocks:', error)
    }
  }

  if (loading || !page) {
    return (
      <AdminLayout title="Edit Page">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block w-8 h-8 border-4 border-terracotta-red border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading page...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title={`Edit: ${page.title}`}>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/pages"
              className="p-2 bg-white rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-deep-teal">{page.title}</h1>
              <p className="text-sm text-gray-600">/{page.slug}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded text-sm ${page.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {page.is_published ? 'Published' : 'Draft'}
            </span>
            <Link
              href={`/${page.slug}?preview=draft`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
            >
              <EyeIcon className="w-5 h-5" />
              View Page
            </Link>
            <button
              onClick={() => handleUpdatePage({ is_published: !page.is_published, status: !page.is_published ? 'published' : 'draft' })}
              disabled={saving}
              className="px-4 py-2 bg-terracotta-red text-white rounded-lg hover:bg-terracotta-red-dark transition-colors disabled:opacity-50"
            >
              {page.is_published ? 'Unpublish' : 'Publish'}
            </button>
          </div>
        </div>

        {/* Page Settings */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-deep-teal mb-4">Page Settings</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={page.title}
                onChange={(e) => setPage({ ...page, title: e.target.value })}
                onBlur={() => handleUpdatePage({ title: page.title })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
              <input
                type="text"
                value={page.slug}
                onChange={(e) => setPage({ ...page, slug: e.target.value })}
                onBlur={() => handleUpdatePage({ slug: page.slug })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent font-mono text-sm"
              />
            </div>
          </div>

          {/* Reusable Checkbox */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={page.is_reusable || false}
                onChange={(e) => {
                  const newValue = e.target.checked
                  setPage({ ...page, is_reusable: newValue })
                  handleUpdatePage({ is_reusable: newValue })
                }}
                className="w-5 h-5 text-terracotta-red rounded focus:ring-2 focus:ring-terracotta-red"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Make this page reusable
                </span>
                <p className="text-xs text-gray-500 mt-0.5">
                  Reusable pages can be embedded as components in other pages using the Page Embed block
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Content Blocks */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-deep-teal">Content Blocks</h2>
            <button
              onClick={() => setShowAddBlockMenu(!showAddBlockMenu)}
              className="px-4 py-2 bg-terracotta-red text-white rounded-lg hover:bg-terracotta-red-dark transition-colors flex items-center gap-2"
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
                {(['text', 'image', 'video', 'cards', 'component', 'page_embed', 'cta'] as BlockType[]).map(type => (
                  <button
                    key={type}
                    onClick={() => handleAddBlock(type)}
                    className="p-4 border border-gray-300 rounded-lg hover:border-terracotta-red hover:bg-terracotta-red/5 transition-colors text-left"
                  >
                    <div className="text-2xl mb-2">{BLOCK_TYPE_ICONS[type]}</div>
                    <div className="font-medium text-sm">{BLOCK_TYPE_LABELS[type]}</div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowAddBlockMenu(false)}
                className="mt-3 text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Blocks List */}
          {blocks.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <p className="text-gray-600 mb-4">No content blocks yet</p>
              <button
                onClick={() => setShowAddBlockMenu(true)}
                className="px-6 py-2 bg-terracotta-red text-white rounded-lg hover:bg-terracotta-red-dark transition-colors"
              >
                Add Your First Block
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {blocks.map((block, index) => (
                <BlockEditor
                  key={block.id}
                  block={block}
                  isEditing={editingBlockId === block.id}
                  onEdit={() => setEditingBlockId(block.id)}
                  onSave={(updates) => handleUpdateBlock(block.id, updates)}
                  onCancel={() => setEditingBlockId(null)}
                  onDelete={() => handleDeleteBlock(block.id)}
                  onToggleVisibility={() => handleToggleBlockVisibility(block.id)}
                  onMoveUp={index > 0 ? () => handleMoveBlock(block.id, 'up') : undefined}
                  onMoveDown={index < blocks.length - 1 ? () => handleMoveBlock(block.id, 'down') : undefined}
                  currentPageId={pageId}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

// Block Editor Component
interface BlockEditorProps {
  block: ContentBlock
  isEditing: boolean
  onEdit: () => void
  onSave: (updates: Partial<ContentBlock>) => void
  onCancel: () => void
  onDelete: () => void
  onToggleVisibility: () => void
  onMoveUp?: () => void
  onMoveDown?: () => void
  currentPageId?: string
}

function BlockEditor({
  block,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onToggleVisibility,
  onMoveUp,
  onMoveDown,
  currentPageId
}: BlockEditorProps) {
  const [editedContent, setEditedContent] = useState(block.content)

  // Layout state
  const [containerWidth, setContainerWidth] = useState<ContainerWidth | null>(block.container_width || 'contained')
  const [padding, setPadding] = useState<PaddingSize | null>(block.padding || 'medium')
  const [paddingHorizontal, setPaddingHorizontal] = useState<PaddingSize | null>(block.padding_horizontal || 'medium')
  const [marginTop, setMarginTop] = useState<SpacingSize | null>(block.margin_top || 'none')
  const [marginBottom, setMarginBottom] = useState<SpacingSize | null>(block.margin_bottom || 'none')
  const [marginHorizontal, setMarginHorizontal] = useState<SpacingSize | null>(block.margin_horizontal || 'none')
  const [backgroundColor, setBackgroundColor] = useState<string | null>(block.background_color || null)
  const [customClass, setCustomClass] = useState<string | null>(block.custom_css_class || null)
  const [displayStyle, setDisplayStyle] = useState(block.display_style || 'card')
  const [cardBorderRadius, setCardBorderRadius] = useState(block.card_border_radius || 'medium')
  const [cardShadow, setCardShadow] = useState(block.card_shadow || 'subtle')
  const [cardHoverEffect, setCardHoverEffect] = useState(block.card_hover_effect || false)

  const handleSave = () => {
    onSave({
      content: editedContent,
      container_width: containerWidth,
      padding: padding,
      padding_horizontal: paddingHorizontal,
      margin_top: marginTop,
      margin_bottom: marginBottom,
      margin_horizontal: marginHorizontal,
      background_color: backgroundColor,
      custom_css_class: customClass,
      display_style: displayStyle,
      card_border_radius: cardBorderRadius,
      card_shadow: cardShadow,
      card_hover_effect: cardHoverEffect
    })
  }

  const handleLayoutChange = (updates: {
    container_width?: ContainerWidth | null
    padding?: PaddingSize | null
    padding_horizontal?: PaddingSize | null
    margin_top?: SpacingSize | null
    margin_bottom?: SpacingSize | null
    margin_horizontal?: SpacingSize | null
    background_color?: string | null
    custom_css_class?: string | null
    display_style?: any
    card_border_radius?: any
    card_shadow?: any
    card_hover_effect?: boolean | null
  }) => {
    if (updates.container_width !== undefined) setContainerWidth(updates.container_width)
    if (updates.padding !== undefined) setPadding(updates.padding)
    if (updates.padding_horizontal !== undefined) setPaddingHorizontal(updates.padding_horizontal)
    if (updates.margin_top !== undefined) setMarginTop(updates.margin_top)
    if (updates.margin_bottom !== undefined) setMarginBottom(updates.margin_bottom)
    if (updates.margin_horizontal !== undefined) setMarginHorizontal(updates.margin_horizontal)
    if (updates.background_color !== undefined) setBackgroundColor(updates.background_color)
    if (updates.custom_css_class !== undefined) setCustomClass(updates.custom_css_class)
    if (updates.display_style !== undefined) setDisplayStyle(updates.display_style)
    if (updates.card_border_radius !== undefined) setCardBorderRadius(updates.card_border_radius)
    if (updates.card_shadow !== undefined) setCardShadow(updates.card_shadow)
    if (updates.card_hover_effect !== undefined) setCardHoverEffect(updates.card_hover_effect ?? false)
  }

  return (
    <div className={`bg-white rounded-lg p-4 border-l-4 ${block.is_visible ? 'border-terracotta-red' : 'border-gray-300'} ${!block.is_visible ? 'opacity-60' : ''}`}>
      {/* Block Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{BLOCK_TYPE_ICONS[block.block_type]}</span>
          <div>
            <h3 className="font-semibold text-gray-900">{BLOCK_TYPE_LABELS[block.block_type]}</h3>
            {!block.is_visible && (
              <span className="text-xs text-gray-500">Hidden</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Move buttons */}
          {onMoveUp && (
            <button onClick={onMoveUp} className="p-2 text-gray-600 hover:bg-gray-100 rounded" title="Move up">
              <ArrowUpIcon className="w-4 h-4" />
            </button>
          )}
          {onMoveDown && (
            <button onClick={onMoveDown} className="p-2 text-gray-600 hover:bg-gray-100 rounded" title="Move down">
              <ArrowDownIcon className="w-4 h-4" />
            </button>
          )}
          {/* Visibility toggle */}
          <button onClick={onToggleVisibility} className="p-2 text-gray-600 hover:bg-gray-100 rounded" title={block.is_visible ? 'Hide' : 'Show'}>
            {block.is_visible ? <EyeIcon className="w-4 h-4" /> : <EyeSlashIcon className="w-4 h-4" />}
          </button>
          {/* Delete */}
          <button onClick={onDelete} className="p-2 text-red-600 hover:bg-red-50 rounded" title="Delete">
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Block Content Editor */}
      {isEditing ? (
        <div className="space-y-4">
          {block.block_type === 'text' && (
            <TextBlockEditor
              content={editedContent as TextBlockContent}
              onChange={setEditedContent}
            />
          )}
          {block.block_type === 'image' && (
            <ImageBlockEditor
              content={editedContent as ImageBlockContent}
              onChange={setEditedContent}
            />
          )}
          {block.block_type === 'video' && (
            <VideoBlockEditor
              content={editedContent as VideoBlockContent}
              onChange={setEditedContent}
            />
          )}
          {block.block_type === 'cards' && (
            <CardsBlockEditor
              content={editedContent as CardsBlockContent}
              onChange={setEditedContent}
            />
          )}
          {block.block_type === 'page_embed' && (
            <PageEmbedBlockEditor
              content={editedContent as PageEmbedBlockContent}
              onChange={setEditedContent}
              currentPageId={currentPageId}
            />
          )}
          {block.block_type === 'component' && (
            <ComponentBlockEditor
              content={editedContent as ComponentBlockContent}
              onChange={setEditedContent}
            />
          )}
          {block.block_type === 'cta' && (
            <CTABlockEditor
              content={editedContent as CTABlockContent}
              onChange={setEditedContent}
            />
          )}
          {block.block_type === 'section' && (
            <SectionBlockEditor
              content={editedContent as SectionBlockContent}
              onChange={setEditedContent}
            />
          )}
          {block.block_type === 'columns' && (
            <ColumnsBlockEditor
              content={editedContent as ColumnsBlockContent}
              onChange={setEditedContent}
            />
          )}

          {/* Layout Controls - Collapsible */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <details className="group bg-gray-50 rounded-lg border border-gray-200">
              <summary className="cursor-pointer list-none">
                <div className="flex items-center justify-between p-4 hover:bg-gray-100 transition-colors rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🎨</span>
                    <div>
                      <h3 className="font-semibold text-gray-800">Layout & Styling</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Customize appearance, spacing, and colors (optional)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 bg-white rounded border border-gray-300 text-gray-600 group-open:hidden">
                      Click to expand
                    </span>
                    <span className="text-xs px-2 py-1 bg-white rounded border border-gray-300 text-gray-600 hidden group-open:inline-block">
                      Click to collapse
                    </span>
                    <svg className="w-5 h-5 text-gray-600 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </summary>
              <div className="px-4 pb-4">
                <SimplifiedLayoutControls
                  containerWidth={containerWidth}
                  padding={padding}
                  paddingHorizontal={paddingHorizontal}
                  marginTop={marginTop}
                  marginBottom={marginBottom}
                  marginHorizontal={marginHorizontal}
                  backgroundColor={backgroundColor}
                  customClass={customClass}
                  displayStyle={displayStyle}
                  cardBorderRadius={cardBorderRadius}
                  cardShadow={cardShadow}
                  cardHoverEffect={cardHoverEffect}
                  hideHeader={true}
                  onChange={handleLayoutChange}
                />
              </div>
            </details>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <button onClick={handleSave} className="px-4 py-2 bg-terracotta-red text-white rounded-lg hover:bg-terracotta-red-dark flex items-center gap-2">
              <CheckIcon className="w-4 h-4" />
              Save
            </button>
            <button onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2">
              <XMarkIcon className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div onClick={onEdit} className="cursor-pointer hover:bg-gray-50 p-3 rounded">
          <BlockPreview block={block} />
          <p className="text-sm text-gray-500 mt-2">Click to edit</p>
        </div>
      )}
    </div>
  )
}

// Block Preview
function BlockPreview({ block }: { block: ContentBlock }) {
  if (block.block_type === 'text') {
    const content = block.content as TextBlockContent
    return <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content.html || '' }} />
  }
  if (block.block_type === 'image') {
    const content = block.content as ImageBlockContent
    return content.url ? (
      <div className="flex items-start gap-3">
        <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={content.url}
            alt={content.alt || 'Preview'}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {content.alt || 'No alt text'}
          </p>
          {content.caption && (
            <p className="text-xs text-gray-500 truncate mt-1">{content.caption}</p>
          )}
          <p className="text-xs text-gray-400 mt-1">
            {content.width && content.height ? `${content.width} × ${content.height}px` : 'Image'}
          </p>
        </div>
      </div>
    ) : (
      <div className="text-sm text-gray-600">No image set</div>
    )
  }
  if (block.block_type === 'video') {
    const content = block.content as VideoBlockContent
    return content.url ? (
      <div className="text-sm text-gray-600">
        <p className="font-medium">🎥 Video: {content.url.substring(0, 50)}...</p>
        {content.caption && (
          <p className="text-xs text-gray-500 mt-1">{content.caption}</p>
        )}
      </div>
    ) : (
      <div className="text-sm text-gray-600">No video URL set</div>
    )
  }
  if (block.block_type === 'cards') {
    const content = block.content as CardsBlockContent
    return content.cards && content.cards.length > 0 ? (
      <div className="text-sm text-gray-600">
        <p className="font-medium">🎴 Cards Block: {content.cards.length} card(s)</p>
        <p className="text-xs text-gray-500 mt-1">{content.columns} columns | {content.card_style} style</p>
      </div>
    ) : (
      <div className="text-sm text-gray-600">No cards added yet</div>
    )
  }
  if (block.block_type === 'page_embed') {
    const content = block.content as PageEmbedBlockContent
    return content.page_id ? (
      <div className="text-sm text-gray-600">
        <p className="font-medium">🔗 Page Embed Block</p>
        <p className="text-xs text-gray-500 mt-1">
          Embedding page: {content.page_id}
          {content.show_title && ' (with title)'}
        </p>
      </div>
    ) : (
      <div className="text-sm text-gray-600">No page selected</div>
    )
  }
  if (block.block_type === 'component') {
    const content = block.content as ComponentBlockContent
    return content.component_id ? (
      <div className="text-sm text-gray-600">
        <p className="font-medium">🧩 Component Block</p>
        <p className="text-xs text-gray-500 mt-1">
          Component ID: {content.component_id}
          {content.show_name && ' (with name)'}
        </p>
      </div>
    ) : (
      <div className="text-sm text-gray-600">No component selected</div>
    )
  }
  if (block.block_type === 'cta') {
    const content = block.content as CTABlockContent
    return (
      <div className="text-sm text-gray-600">
        <strong>{content.title || 'No title'}</strong>
        {content.description && <p>{content.description}</p>}
      </div>
    )
  }
  return <div className="text-sm text-gray-500">Block preview not available</div>
}

// Text Block Editor
function TextBlockEditor({ content, onChange }: { content: TextBlockContent, onChange: (c: any) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
      <TipTapEditor
        content={content.html || ''}
        onChange={(html) => onChange({ ...content, html })}
      />
    </div>
  )
}


// CTA Block Editor
function CTABlockEditor({ content, onChange }: { content: CTABlockContent, onChange: (c: any) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
        <input
          type="text"
          value={content.title || ''}
          onChange={(e) => onChange({ ...content, title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description (optional)</label>
        <textarea
          value={content.description || ''}
          onChange={(e) => onChange({ ...content, description: e.target.value })}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Buttons</label>
        {(content.buttons || []).map((button, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={button.text}
              onChange={(e) => {
                const newButtons = [...(content.buttons || [])]
                newButtons[index] = { ...button, text: e.target.value }
                onChange({ ...content, buttons: newButtons })
              }}
              placeholder="Button text"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              value={button.url}
              onChange={(e) => {
                const newButtons = [...(content.buttons || [])]
                newButtons[index] = { ...button, url: e.target.value }
                onChange({ ...content, buttons: newButtons })
              }}
              placeholder="URL"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
            />
            <button
              onClick={() => {
                const newButtons = (content.buttons || []).filter((_, i) => i !== index)
                onChange({ ...content, buttons: newButtons })
              }}
              className="p-2 text-red-600 hover:bg-red-50 rounded"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        ))}
        <button
          onClick={() => {
            const newButtons = [...(content.buttons || []), { text: '', url: '', style: 'primary' as const }]
            onChange({ ...content, buttons: newButtons })
          }}
          className="text-sm text-terracotta-red hover:underline"
        >
          + Add Button
        </button>
      </div>
    </div>
  )
}
