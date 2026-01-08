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
  ColumnsBlockContent
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

  const handleSave = async () => {
    await onSave({ content: editedContent })
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
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
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
        <div className="flex-1 overflow-y-auto p-6">
          {renderEditor()}
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
