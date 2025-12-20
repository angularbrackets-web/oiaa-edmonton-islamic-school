'use client'

import { SpacerBlockContent, SpacingSize } from '@/types/cms'

interface SpacerBlockEditorProps {
  content: SpacerBlockContent
  onChange: (content: SpacerBlockContent) => void
}

// Height presets with labels
const HEIGHT_OPTIONS: { value: SpacingSize | 'custom'; label: string; description: string }[] = [
  { value: 'none', label: 'None', description: '0px' },
  { value: 'xs', label: 'Extra Small', description: '8px' },
  { value: 'sm', label: 'Small', description: '16px' },
  { value: 'md', label: 'Medium', description: '32px' },
  { value: 'lg', label: 'Large', description: '48px' },
  { value: 'xl', label: 'Extra Large', description: '64px' },
  { value: '2xl', label: '2X Large', description: '96px' },
  { value: 'custom', label: 'Custom', description: 'Enter your own' }
]

// Height preview sizes
const PREVIEW_HEIGHTS: Record<SpacingSize, string> = {
  none: '0',
  xs: '8px',
  sm: '16px',
  md: '32px',
  lg: '48px',
  xl: '64px',
  '2xl': '96px'
}

export default function SpacerBlockEditor({ content, onChange }: SpacerBlockEditorProps) {
  const { height = 'md', custom_height = '' } = content

  return (
    <div className="space-y-6">
      {/* Height Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Spacer Height
        </label>
        <div className="grid grid-cols-4 gap-2">
          {HEIGHT_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange({ ...content, height: option.value })}
              className={`px-3 py-2 border rounded-lg transition-colors text-center ${
                height === option.value
                  ? 'border-terracotta-red bg-terracotta-red/10 text-terracotta-red'
                  : 'border-gray-300 hover:border-terracotta-red text-gray-700'
              }`}
            >
              <div className="font-semibold text-sm">{option.label}</div>
              <div className="text-xs text-gray-500">{option.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Height Input */}
      {height === 'custom' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Custom Height
          </label>
          <input
            type="text"
            value={custom_height}
            onChange={(e) => onChange({ ...content, custom_height: e.target.value })}
            placeholder="e.g., 100px, 5rem, 10vh"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
          />
          <p className="mt-1 text-xs text-gray-500">
            Enter a valid CSS height value (px, rem, em, vh, %)
          </p>
        </div>
      )}

      {/* Preview */}
      <div className="pt-4 border-t border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Preview
        </label>
        <div className="relative bg-gray-100 rounded-lg overflow-hidden">
          {/* Top section */}
          <div className="bg-deep-teal/20 p-3 text-center text-sm text-gray-600 border-b border-gray-300">
            Content Above
          </div>

          {/* Spacer preview */}
          <div
            className="bg-terracotta-red/20 transition-all duration-300 relative"
            style={{
              height: height === 'custom' && custom_height
                ? custom_height
                : PREVIEW_HEIGHTS[height as SpacingSize] || '32px'
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-terracotta-red text-white text-xs px-2 py-1 rounded">
                {height === 'custom' && custom_height
                  ? custom_height
                  : HEIGHT_OPTIONS.find(o => o.value === height)?.description || '32px'}
              </span>
            </div>
          </div>

          {/* Bottom section */}
          <div className="bg-deep-teal/20 p-3 text-center text-sm text-gray-600 border-t border-gray-300">
            Content Below
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> Spacers add vertical space between blocks. Use consistent spacing throughout your pages for a polished look.
        </p>
      </div>
    </div>
  )
}
