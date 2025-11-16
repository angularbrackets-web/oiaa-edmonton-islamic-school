'use client'

import { useState, useEffect } from 'react'
import { PageEmbedBlockContent, Page } from '@/types/cms'
import { DocumentTextIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

interface PageEmbedBlockEditorProps {
  content: PageEmbedBlockContent
  onChange: (content: PageEmbedBlockContent) => void
  currentPageId?: string // To prevent embedding page in itself
}

export default function PageEmbedBlockEditor({
  content,
  onChange,
  currentPageId
}: PageEmbedBlockEditorProps) {
  const [reusablePages, setReusablePages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPage, setSelectedPage] = useState<Page | null>(null)

  useEffect(() => {
    loadReusablePages()
  }, [])

  useEffect(() => {
    // Load selected page details when page_id changes
    if (content.page_id && reusablePages.length > 0) {
      const page = reusablePages.find(p => p.id === content.page_id)
      setSelectedPage(page || null)
    }
  }, [content.page_id, reusablePages])

  const loadReusablePages = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/pages?reusable=true&include_blocks=false')
      const data = await response.json()
      if (data.success) {
        setReusablePages(data.data || [])
      }
    } catch (error) {
      console.error('Error loading reusable pages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePageSelect = (pageId: string) => {
    onChange({
      ...content,
      page_id: pageId
    })
  }

  const handleToggleTitle = () => {
    onChange({
      ...content,
      show_title: !content.show_title
    })
  }

  // Filter out current page to prevent circular reference
  const availablePages = reusablePages.filter(p => p.id !== currentPageId)

  return (
    <div className="space-y-4">
      {/* Warning Banner */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r">
        <div className="flex items-start">
          <DocumentTextIcon className="w-5 h-5 text-blue-500 mr-2 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium">Page Embed Block</p>
            <p className="mt-1">This block will display content from another page. Select a reusable page below.</p>
          </div>
        </div>
      </div>

      {/* Page Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Reusable Page *
        </label>
        {loading ? (
          <div className="flex items-center justify-center py-8 text-gray-500">
            <div className="w-6 h-6 border-2 border-terracotta-red border-t-transparent rounded-full animate-spin mr-2"></div>
            Loading reusable pages...
          </div>
        ) : availablePages.length === 0 ? (
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 font-medium">No reusable pages found</p>
            <p className="text-sm text-gray-500 mt-1">
              Create a page and mark it as "reusable" to embed it here.
            </p>
          </div>
        ) : (
          <select
            value={content.page_id || ''}
            onChange={(e) => handlePageSelect(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
            required
          >
            <option value="">-- Select a page --</option>
            {availablePages.map(page => (
              <option key={page.id} value={page.id}>
                {page.title} ({page.slug})
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Show Title Toggle */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={content.show_title ?? true}
            onChange={handleToggleTitle}
            className="w-5 h-5 text-terracotta-red rounded focus:ring-2 focus:ring-terracotta-red"
          />
          <span className="text-sm font-medium text-gray-700">
            Show embedded page title
          </span>
        </label>
        <p className="text-xs text-gray-500 mt-1 ml-8">
          Display the page title above the embedded content
        </p>
      </div>

      {/* Selected Page Preview */}
      {selectedPage && (
        <div className="bg-white border-2 border-terracotta-red/20 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <DocumentTextIcon className="w-5 h-5 text-terracotta-red" />
                <h3 className="font-semibold text-deep-teal">{selectedPage.title}</h3>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">
                  /{selectedPage.slug}
                </span>
              </p>
              {selectedPage.meta_description && (
                <p className="text-sm text-gray-600 mt-2">
                  {selectedPage.meta_description}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 ml-4">
              {selectedPage.is_published ? (
                <span className="flex items-center gap-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  <EyeIcon className="w-3 h-3" />
                  Published
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                  <EyeSlashIcon className="w-3 h-3" />
                  Draft
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="bg-gray-50 border-l-4 border-gray-400 p-4 rounded-r">
        <p className="text-sm text-gray-700">
          <strong>Note:</strong> The embedded page's blocks will be displayed here.
          Any changes to the source page will automatically reflect wherever it's embedded.
        </p>
      </div>
    </div>
  )
}
