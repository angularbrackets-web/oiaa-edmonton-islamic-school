'use client'

import { HeadingBlockContent } from '@/types/cms'

interface HeadingBlockEditorProps {
  content: HeadingBlockContent
  onChange: (content: HeadingBlockContent) => void
}

export default function HeadingBlockEditor({ content, onChange }: HeadingBlockEditorProps) {
  return (
    <div className="space-y-4">
      {/* Heading Text */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Heading Text <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={content.text || ''}
          onChange={(e) => onChange({ ...content, text: e.target.value })}
          placeholder="Enter heading text"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
        />
      </div>

      {/* Heading Level */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Heading Level
        </label>
        <select
          value={content.level || 2}
          onChange={(e) => onChange({ ...content, level: Number(e.target.value) as 1 | 2 | 3 | 4 | 5 | 6 })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
        >
          <option value={1}>H1 - Largest</option>
          <option value={2}>H2 - Large</option>
          <option value={3}>H3 - Medium</option>
          <option value={4}>H4 - Small</option>
          <option value={5}>H5 - Smaller</option>
          <option value={6}>H6 - Smallest</option>
        </select>
        <p className="mt-1 text-xs text-gray-500">
          Choose the appropriate heading level for your content hierarchy
        </p>
      </div>

      {/* Alignment */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Alignment
        </label>
        <div className="flex gap-2">
          {(['left', 'center', 'right'] as const).map((align) => (
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

      {/* Subtitle */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Subtitle (optional)
        </label>
        <input
          type="text"
          value={content.subtitle || ''}
          onChange={(e) => onChange({ ...content, subtitle: e.target.value })}
          placeholder="Add a subtitle or description"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
        />
        <p className="mt-1 text-xs text-gray-500">
          Optional descriptive text displayed below the heading
        </p>
      </div>

      {/* Divider Toggle */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={content.show_divider || false}
            onChange={(e) => onChange({ ...content, show_divider: e.target.checked })}
            className="w-4 h-4 text-terracotta-red border-gray-300 rounded focus:ring-terracotta-red"
          />
          <span className="text-sm font-medium text-gray-700">
            Show divider line below heading
          </span>
        </label>
      </div>

      {/* Divider Color (shown only if divider is enabled) */}
      {content.show_divider && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Divider Color (optional)
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={content.divider_color || '#0D9488'}
              onChange={(e) => onChange({ ...content, divider_color: e.target.value })}
              className="h-10 w-20 border border-gray-300 rounded-lg cursor-pointer"
            />
            <input
              type="text"
              value={content.divider_color || '#0D9488'}
              onChange={(e) => onChange({ ...content, divider_color: e.target.value })}
              placeholder="#0D9488"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => onChange({ ...content, divider_color: undefined })}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:border-gray-400"
            >
              Reset
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Default is teal gradient. Leave empty or click Reset for default.
          </p>
        </div>
      )}

      {/* Preview Section */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs font-medium text-gray-500 mb-3">Preview:</p>
        <div className={`text-${content.alignment || 'left'}`}>
          <div
            className={`font-bold text-gray-900 mb-0`}
            style={{
              fontSize: content.level === 1 ? '2.5rem' :
                        content.level === 2 ? '2rem' :
                        content.level === 3 ? '1.75rem' :
                        content.level === 4 ? '1.5rem' :
                        content.level === 5 ? '1.25rem' : '1rem'
            }}
          >
            {content.text || 'Enter heading text'}
          </div>
          {content.subtitle && (
            <p className="mt-2 text-gray-600">
              {content.subtitle}
            </p>
          )}
          {content.show_divider && (
            <div
              className={`mt-3 h-1 rounded-full ${
                content.alignment === 'center' ? 'mx-auto' : content.alignment === 'right' ? 'ml-auto' : ''
              }`}
              style={{
                width: content.alignment === 'center' ? '80px' : '120px',
                backgroundColor: content.divider_color || '#0D9488'
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
