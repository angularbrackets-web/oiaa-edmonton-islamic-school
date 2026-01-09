/**
 * Nested Block Editor Modal
 *
 * A modal dialog for editing blocks inside columns with full functionality.
 * Provides the same editing experience as the main page editor.
 */
'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline'
import {
  ContentBlock,
  BlockContent,
  BLOCK_TYPE_LABELS,
  BLOCK_TYPE_ICONS,
  TextBlockContent,
  HeadingBlockContent,
  ImageBlockContent,
  VideoBlockContent,
  CardsBlockContent,
  CTABlockContent,
  FormBlockContent,
  MapBlockContent,
  DocumentsBlockContent,
  SpacerBlockContent,
  DividerBlockContent,
  WidgetBlockContent,
  ColumnsBlockContent,
  ContainerWidth,
  PaddingSize,
  SpacingSize,
  DisplayStyle,
  CardBorderRadius,
  CardShadow
} from '@/types/cms'

// Import block editors
import TipTapEditor from '@/components/admin/TipTapEditor'
import HeadingBlockEditor from '@/components/admin/blocks/HeadingBlockEditor'
import ImageBlockEditor from '@/components/admin/blocks/ImageBlockEditor'
import VideoBlockEditor from '@/components/admin/blocks/VideoBlockEditor'
import CardsBlockEditor from '@/components/admin/blocks/CardsBlockEditor'
import CTABlockEditor from '@/components/admin/blocks/CTABlockEditor'
import FormBlockEditor from '@/components/admin/blocks/FormBlockEditor'
import MapBlockEditor from '@/components/admin/blocks/MapBlockEditor'
import DocumentsBlockEditor from '@/components/admin/blocks/DocumentsBlockEditor'
import SpacerBlockEditor from '@/components/admin/blocks/SpacerBlockEditor'
import DividerBlockEditor from '@/components/admin/blocks/DividerBlockEditor'
import WidgetBlockEditor from '@/components/admin/blocks/WidgetBlockEditor'
import ColumnsBlockEditor from '@/components/admin/blocks/ColumnsBlockEditor'
import SimplifiedLayoutControls from '@/components/admin/blocks/SimplifiedLayoutControls'

interface NestedBlockEditorModalProps {
  block: ContentBlock
  onSave: (updates: Partial<ContentBlock>) => Promise<void>
  onClose: () => void
  isSaving: boolean
}

export default function NestedBlockEditorModal({
  block,
  onSave,
  onClose,
  isSaving
}: NestedBlockEditorModalProps) {
  const [editedContent, setEditedContent] = useState<BlockContent>(block.content)
  const [mounted, setMounted] = useState(false)

  // Layout and styling state
  const [containerWidth, setContainerWidth] = useState<ContainerWidth | null>(block.container_width || null)
  const [padding, setPadding] = useState<PaddingSize | null>(block.padding || null)
  const [paddingHorizontal, setPaddingHorizontal] = useState<PaddingSize | null>(block.padding_horizontal || null)
  const [marginTop, setMarginTop] = useState<SpacingSize | null>(block.margin_top || null)
  const [marginBottom, setMarginBottom] = useState<SpacingSize | null>(block.margin_bottom || null)
  const [marginHorizontal, setMarginHorizontal] = useState<SpacingSize | null>(block.margin_horizontal || null)
  const [backgroundColor, setBackgroundColor] = useState<string | null>(block.background_color || null)
  const [customClass, setCustomClass] = useState<string | null>(block.custom_css_class || null)
  const [displayStyle, setDisplayStyle] = useState<DisplayStyle | null>(block.display_style || null)
  const [cardBorderRadius, setCardBorderRadius] = useState<CardBorderRadius | null>(block.card_border_radius || null)
  const [cardShadow, setCardShadow] = useState<CardShadow | null>(block.card_shadow || null)
  const [cardHoverEffect, setCardHoverEffect] = useState<boolean | null>(block.card_hover_effect || null)

  // Handle mounting for portal
  useEffect(() => {
    setMounted(true)
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSaving) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose, isSaving])

  const handleLayoutChange = (updates: {
    container_width?: ContainerWidth | null
    padding?: PaddingSize | null
    padding_horizontal?: PaddingSize | null
    margin_top?: SpacingSize | null
    margin_bottom?: SpacingSize | null
    margin_horizontal?: SpacingSize | null
    background_color?: string | null
    custom_css_class?: string | null
    display_style?: DisplayStyle | null
    card_border_radius?: CardBorderRadius | null
    card_shadow?: CardShadow | null
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
    if (updates.card_hover_effect !== undefined) setCardHoverEffect(updates.card_hover_effect)
  }

  const handleSave = async () => {
    await onSave({
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

  // Render the appropriate editor based on block type
  const renderEditor = () => {
    switch (block.block_type) {
      case 'text':
        return (
          <TipTapEditor
            content={(editedContent as TextBlockContent).html || ''}
            onChange={(html) => setEditedContent({ ...editedContent, html })}
          />
        )

      case 'heading':
        return (
          <HeadingBlockEditor
            content={editedContent as HeadingBlockContent}
            onChange={setEditedContent}
          />
        )

      case 'image':
        return (
          <ImageBlockEditor
            content={editedContent as ImageBlockContent}
            onChange={setEditedContent}
          />
        )

      case 'video':
        return (
          <VideoBlockEditor
            content={editedContent as VideoBlockContent}
            onChange={setEditedContent}
          />
        )

      case 'cards':
        return (
          <CardsBlockEditor
            content={editedContent as CardsBlockContent}
            onChange={setEditedContent}
          />
        )

      case 'cta':
        return (
          <CTABlockEditor
            content={editedContent as CTABlockContent}
            onChange={setEditedContent}
          />
        )

      case 'form':
        return (
          <FormBlockEditor
            content={editedContent as FormBlockContent}
            onChange={setEditedContent}
          />
        )

      case 'map':
        return (
          <MapBlockEditor
            content={editedContent as MapBlockContent}
            onChange={setEditedContent}
          />
        )

      case 'documents':
        return (
          <DocumentsBlockEditor
            content={editedContent as DocumentsBlockContent}
            onChange={setEditedContent}
          />
        )

      case 'spacer':
        return (
          <SpacerBlockEditor
            content={editedContent as SpacerBlockContent}
            onChange={setEditedContent}
          />
        )

      case 'divider':
        return (
          <DividerBlockEditor
            content={editedContent as DividerBlockContent}
            onChange={setEditedContent}
          />
        )

      case 'widget':
        return (
          <WidgetBlockEditor
            content={editedContent as WidgetBlockContent}
            onChange={setEditedContent}
          />
        )

      case 'columns':
        return (
          <ColumnsBlockEditor
            content={editedContent as ColumnsBlockContent}
            onChange={setEditedContent}
          />
        )

      default:
        return (
          <div className="p-4 bg-yellow-50 text-yellow-700 rounded-lg">
            Editor for {block.block_type} block type is not available in nested mode.
          </div>
        )
    }
  }

  if (!mounted) return null

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSaving) {
          onClose()
        }
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{BLOCK_TYPE_ICONS[block.block_type]}</span>
            <h2 className="text-lg font-semibold text-gray-900">
              Edit {BLOCK_TYPE_LABELS[block.block_type]}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 disabled:opacity-50"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Block Content Editor */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Content</h3>
            {renderEditor()}
          </div>

          {/* Layout & Styling Controls */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Layout & Styling</h3>
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
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-terracotta-red text-white rounded-lg hover:bg-terracotta-red-dark disabled:opacity-50 flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <CheckIcon className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )

  // Use portal to render modal at document body level
  return createPortal(modalContent, document.body)
}
