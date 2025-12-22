/**
 * Columns Block Editor Component
 *
 * Admin interface for editing Columns layout blocks with support for
 * variable column widths (ratios) and vertical alignment
 */
'use client'

import { ColumnsBlockContent, ColumnRatio, VerticalAlign } from '@/types/cms'

interface ColumnsBlockEditorProps {
  content: ColumnsBlockContent
  onChange: (content: ColumnsBlockContent) => void
}

// Column ratio options per column count
const RATIO_OPTIONS: Record<1 | 2 | 3 | 4, { value: ColumnRatio; label: string; visual: string }[]> = {
  1: [
    { value: '1', label: 'Full Width Container', visual: '▇▇▇▇' }
  ],
  2: [
    { value: '1:1', label: 'Equal (50/50)', visual: '▌▐' },
    { value: '1:2', label: 'Left Sidebar (33/66)', visual: '▍▐▐' },
    { value: '2:1', label: 'Right Sidebar (66/33)', visual: '▐▐▍' },
    { value: '1:3', label: 'Narrow Left (25/75)', visual: '▏▐▐▐' },
    { value: '3:1', label: 'Narrow Right (75/25)', visual: '▐▐▐▏' }
  ],
  3: [
    { value: '1:1:1', label: 'Equal (33/33/33)', visual: '▍▍▍' },
    { value: '1:2:1', label: 'Center Focus (25/50/25)', visual: '▏▐▐▏' },
    { value: '2:1:1', label: 'Left Wide (50/25/25)', visual: '▐▐▏▏' },
    { value: '1:1:2', label: 'Right Wide (25/25/50)', visual: '▏▏▐▐' }
  ],
  4: [
    { value: '1:1:1:1', label: 'Equal (25/25/25/25)', visual: '▏▏▏▏' }
  ]
}

// Vertical alignment options
const ALIGN_OPTIONS: { value: VerticalAlign; label: string; icon: string }[] = [
  { value: 'top', label: 'Top', icon: '⬆' },
  { value: 'center', label: 'Center', icon: '⬌' },
  { value: 'bottom', label: 'Bottom', icon: '⬇' },
  { value: 'stretch', label: 'Stretch', icon: '↕' }
]

export default function ColumnsBlockEditor({ content, onChange }: ColumnsBlockEditorProps) {
  const {
    column_count = 2,
    column_ratio,
    gap = 'md',
    stack_on_mobile = true,
    vertical_align = 'stretch'
  } = content

  const handleColumnCountChange = (count: 1 | 2 | 3 | 4) => {
    // Reset ratio when column count changes
    const newRatio = RATIO_OPTIONS[count][0].value
    onChange({ ...content, column_count: count, column_ratio: newRatio })
  }

  const handleRatioChange = (ratio: ColumnRatio) => {
    onChange({ ...content, column_ratio: ratio })
  }

  const handleGapChange = (gap: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl') => {
    onChange({ ...content, gap })
  }

  const handleStackToggle = () => {
    onChange({ ...content, stack_on_mobile: !stack_on_mobile })
  }

  const handleAlignChange = (align: VerticalAlign) => {
    onChange({ ...content, vertical_align: align })
  }

  // Get available ratios for current column count
  const availableRatios = RATIO_OPTIONS[column_count]

  return (
    <div className="space-y-5">
      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">Columns Layout</h4>
        <p className="text-sm text-blue-700">
          Create multi-column layouts with variable widths. Add blocks inside to distribute them across columns.
        </p>
      </div>

      {/* Column Count */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Number of Columns
        </label>
        <div className="grid grid-cols-4 gap-2">
          {([1, 2, 3, 4] as const).map((count) => (
            <button
              key={count}
              type="button"
              onClick={() => handleColumnCountChange(count)}
              className={`
                px-4 py-3 rounded-lg border-2 font-medium transition-colors text-center
                ${column_count === count
                  ? 'bg-terracotta-red text-white border-terracotta-red'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-terracotta-red'
                }
              `}
            >
              {count} {count === 1 ? 'Column' : 'Columns'}
            </button>
          ))}
        </div>
      </div>

      {/* Column Ratio */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Column Widths
        </label>
        <div className="grid grid-cols-1 gap-2">
          {availableRatios.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleRatioChange(option.value)}
              className={`
                px-4 py-3 rounded-lg border-2 transition-colors text-left flex items-center gap-3
                ${column_ratio === option.value
                  ? 'bg-terracotta-red/10 border-terracotta-red text-terracotta-red'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-terracotta-red'
                }
              `}
            >
              <span className="text-2xl font-mono tracking-wide">{option.visual}</span>
              <span className="text-sm">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Visual Preview */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Layout Preview
        </label>
        <div className="bg-gray-100 rounded-lg p-4">
          <div
            className="grid gap-2"
            style={{
              gridTemplateColumns: column_ratio
                ? column_ratio.split(':').map(n => `${n}fr`).join(' ')
                : `repeat(${column_count}, 1fr)`
            }}
          >
            {Array.from({ length: column_count }).map((_, i) => (
              <div
                key={i}
                className="bg-deep-teal/20 rounded-lg p-4 flex items-center justify-center min-h-[60px]"
              >
                <span className="text-sm text-gray-600 font-medium">
                  Column {i + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vertical Alignment */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Vertical Alignment
        </label>
        <div className="flex gap-2">
          {ALIGN_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleAlignChange(option.value)}
              className={`
                flex-1 px-3 py-2 rounded-lg border-2 transition-colors text-center
                ${vertical_align === option.value
                  ? 'bg-terracotta-red/10 border-terracotta-red text-terracotta-red'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-terracotta-red'
                }
              `}
            >
              <div className="text-lg">{option.icon}</div>
              <div className="text-xs">{option.label}</div>
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Controls how content aligns vertically when columns have different heights
        </p>
      </div>

      {/* Gap Size */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Gap Between Columns
        </label>
        <select
          value={gap}
          onChange={(e) => handleGapChange(e.target.value as any)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
        >
          <option value="none">None (0px)</option>
          <option value="xs">Extra Small (8px)</option>
          <option value="sm">Small (16px)</option>
          <option value="md">Medium (24px)</option>
          <option value="lg">Large (32px)</option>
          <option value="xl">Extra Large (48px)</option>
        </select>
      </div>

      {/* Stack on Mobile */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="stack_on_mobile"
          checked={stack_on_mobile}
          onChange={handleStackToggle}
          className="w-4 h-4 text-terracotta-red border-gray-300 rounded focus:ring-terracotta-red"
        />
        <label htmlFor="stack_on_mobile" className="text-sm font-medium text-gray-700">
          Stack columns vertically on mobile devices
        </label>
      </div>
      <p className="text-xs text-gray-500 ml-7">
        Recommended: Keep this enabled for better mobile experience
      </p>

      {/* Usage Tip */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
        <p className="text-xs text-gray-600">
          <strong>Tip:</strong> After saving, add blocks inside this columns container.
          Blocks will be automatically distributed across columns based on their display order.
        </p>
      </div>
    </div>
  )
}
