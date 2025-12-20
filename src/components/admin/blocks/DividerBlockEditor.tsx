'use client'

import { DividerBlockContent, DividerStyle } from '@/types/cms'

interface DividerBlockEditorProps {
  content: DividerBlockContent
  onChange: (content: DividerBlockContent) => void
}

// Style options
const STYLE_OPTIONS: { value: DividerStyle; label: string; icon: string }[] = [
  { value: 'solid', label: 'Solid', icon: '━' },
  { value: 'dashed', label: 'Dashed', icon: '┄' },
  { value: 'dotted', label: 'Dotted', icon: '···' },
  { value: 'double', label: 'Double', icon: '═' },
  { value: 'islamic-pattern', label: 'Islamic Pattern', icon: '✦' }
]

// Thickness options
const THICKNESS_OPTIONS = [
  { value: 'thin', label: 'Thin' },
  { value: 'medium', label: 'Medium' },
  { value: 'thick', label: 'Thick' }
]

// Width options
const WIDTH_OPTIONS = [
  { value: 'full', label: '100%' },
  { value: '80', label: '80%' },
  { value: '60', label: '60%' },
  { value: '40', label: '40%' }
]

// Alignment options
const ALIGNMENT_OPTIONS = [
  { value: 'left', label: 'Left', icon: '├' },
  { value: 'center', label: 'Center', icon: '┃' },
  { value: 'right', label: 'Right', icon: '┤' }
]

export default function DividerBlockEditor({ content, onChange }: DividerBlockEditorProps) {
  const {
    style = 'solid',
    color = '#d1d5db',
    thickness = 'thin',
    width = 'full',
    alignment = 'center',
    pattern_color = '#145B55'
  } = content

  return (
    <div className="space-y-6">
      {/* Style Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Divider Style
        </label>
        <div className="grid grid-cols-5 gap-2">
          {STYLE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange({ ...content, style: option.value })}
              className={`px-3 py-3 border rounded-lg transition-colors text-center ${
                style === option.value
                  ? 'border-terracotta-red bg-terracotta-red/10 text-terracotta-red'
                  : 'border-gray-300 hover:border-terracotta-red text-gray-700'
              }`}
            >
              <div className="text-xl mb-1">{option.icon}</div>
              <div className="text-xs">{option.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Color Selection */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Line Color
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={color}
              onChange={(e) => onChange({ ...content, color: e.target.value })}
              className="w-12 h-10 rounded cursor-pointer border border-gray-300"
            />
            <input
              type="text"
              value={color}
              onChange={(e) => onChange({ ...content, color: e.target.value })}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent font-mono text-sm"
            />
          </div>
        </div>

        {/* Pattern Color (only for islamic-pattern) */}
        {style === 'islamic-pattern' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pattern Color
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={pattern_color}
                onChange={(e) => onChange({ ...content, pattern_color: e.target.value })}
                className="w-12 h-10 rounded cursor-pointer border border-gray-300"
              />
              <input
                type="text"
                value={pattern_color}
                onChange={(e) => onChange({ ...content, pattern_color: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent font-mono text-sm"
              />
            </div>
          </div>
        )}
      </div>

      {/* Thickness and Width */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thickness
          </label>
          <select
            value={thickness}
            onChange={(e) => onChange({ ...content, thickness: e.target.value as 'thin' | 'medium' | 'thick' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
          >
            {THICKNESS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Width
          </label>
          <select
            value={width}
            onChange={(e) => onChange({ ...content, width: e.target.value as 'full' | '80' | '60' | '40' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
          >
            {WIDTH_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Alignment (only when width is not full) */}
      {width !== 'full' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Alignment
          </label>
          <div className="flex gap-2">
            {ALIGNMENT_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange({ ...content, alignment: option.value as 'left' | 'center' | 'right' })}
                className={`flex-1 px-4 py-2 border rounded-lg transition-colors text-center ${
                  alignment === option.value
                    ? 'border-terracotta-red bg-terracotta-red/10 text-terracotta-red'
                    : 'border-gray-300 hover:border-terracotta-red text-gray-700'
                }`}
              >
                <div className="text-lg mb-1">{option.icon}</div>
                <div className="text-xs">{option.label}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Preview */}
      <div className="pt-4 border-t border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Preview
        </label>
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="text-center text-sm text-gray-500 mb-4">Content Above</div>

          {/* Divider Preview */}
          <div
            className={`my-4 ${
              alignment === 'left' ? 'mr-auto' :
              alignment === 'right' ? 'ml-auto' : 'mx-auto'
            }`}
            style={{
              width: width === 'full' ? '100%' : `${width}%`
            }}
          >
            {style === 'islamic-pattern' ? (
              <svg
                viewBox="0 0 200 20"
                className="w-full"
                style={{
                  height: thickness === 'thin' ? '16px' : thickness === 'medium' ? '24px' : '32px'
                }}
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <pattern id="preview-islamic-pattern" patternUnits="userSpaceOnUse" width="40" height="20">
                    <path
                      d="M20 0 L25 10 L20 20 L15 10 Z"
                      fill={pattern_color}
                      opacity="0.8"
                    />
                    <path
                      d="M0 10 Q5 5 10 10 Q5 15 0 10"
                      fill={color}
                      opacity="0.6"
                    />
                    <path
                      d="M30 10 Q35 5 40 10 Q35 15 30 10"
                      fill={color}
                      opacity="0.6"
                    />
                    <line
                      x1="10" y1="10" x2="15" y2="10"
                      stroke={pattern_color}
                      strokeWidth="1"
                      opacity="0.5"
                    />
                    <line
                      x1="25" y1="10" x2="30" y2="10"
                      stroke={pattern_color}
                      strokeWidth="1"
                      opacity="0.5"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#preview-islamic-pattern)" />
              </svg>
            ) : (
              <hr
                style={{
                  border: 'none',
                  borderTop: `${
                    thickness === 'thin' ? '1px' :
                    thickness === 'medium' ? '2px' : '4px'
                  } ${style === 'double' ? 'double' : style} ${color}`,
                  margin: 0,
                  borderWidth: style === 'double' ? '3px' : undefined
                }}
              />
            )}
          </div>

          <div className="text-center text-sm text-gray-500 mt-4">Content Below</div>
        </div>
      </div>

      {/* Islamic Pattern Info */}
      {style === 'islamic-pattern' && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            <strong>Islamic Pattern:</strong> This decorative divider uses traditional geometric patterns commonly found in Islamic art and architecture.
          </p>
        </div>
      )}
    </div>
  )
}
