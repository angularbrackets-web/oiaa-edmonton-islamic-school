'use client'

import { ImageBlockContent } from '@/types/cms'
import MediaSelector from '../MediaSelector'

interface ImageBlockEditorProps {
  content: ImageBlockContent
  onChange: (content: ImageBlockContent) => void
}

export default function ImageBlockEditor({ content, onChange }: ImageBlockEditorProps) {
  const handleMediaChange = (url: string) => {
    onChange({
      ...content,
      url
    })
  }

  return (
    <div className="space-y-4">
      {/* Image Selection */}
      <MediaSelector
        value={content.url || ''}
        onChange={handleMediaChange}
        type="image"
        folder="cms/pages"
        label="Image"
        compact={false}
        showPreview={true}
      />

      {/* Alternative: Manual URL Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Or Enter Image URL
        </label>
        <input
          type="text"
          value={content.url || ''}
          onChange={(e) => onChange({ ...content, url: e.target.value })}
          placeholder="https://example.com/image.jpg"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
        />
      </div>

      {/* Alt Text */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Alt Text <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={content.alt || ''}
          onChange={(e) => onChange({ ...content, alt: e.target.value })}
          placeholder="Describe the image for accessibility"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
        />
        <p className="mt-1 text-xs text-gray-500">
          Important for accessibility and SEO
        </p>
      </div>

      {/* Caption */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Caption (optional)
        </label>
        <input
          type="text"
          value={content.caption || ''}
          onChange={(e) => onChange({ ...content, caption: e.target.value })}
          placeholder="Add a caption to display below the image"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
        />
      </div>

      {/* Alignment */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Alignment
        </label>
        <div className="flex gap-2">
          {(['left', 'center', 'right', 'full'] as const).map((align) => (
            <button
              key={align}
              type="button"
              onClick={() => onChange({ ...content, alignment: align })}
              className={`px-4 py-2 border rounded-lg transition-colors capitalize ${
                content.alignment === align
                  ? 'border-terracotta-red bg-terracotta-red/10 text-terracotta-red'
                  : 'border-gray-300 hover:border-terracotta-red'
              }`}
            >
              {align}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
