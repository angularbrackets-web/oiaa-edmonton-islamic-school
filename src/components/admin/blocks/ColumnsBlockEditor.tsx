/**
 * Columns Block Editor Component
 *
 * Admin interface for editing Columns layout blocks
 */
'use client'

import { ColumnsBlockContent } from '@/types/cms'

interface ColumnsBlockEditorProps {
  content: ColumnsBlockContent
  onChange: (content: ColumnsBlockContent) => void
}

export default function ColumnsBlockEditor({ content, onChange }: ColumnsBlockEditorProps) {
  const handleColumnCountChange = (count: 2 | 3 | 4) => {
    onChange({ ...content, column_count: count })
  }

  const handleGapChange = (gap: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl') => {
    onChange({ ...content, gap })
  }

  const handleStackToggle = () => {
    onChange({ ...content, stack_on_mobile: !content.stack_on_mobile })
  }

  return (
    <div className="space-y-4">
      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">📐 Columns Layout</h4>
        <p className="text-sm text-blue-700">
          This block creates a multi-column layout. Add blocks inside to distribute them across columns.
        </p>
      </div>

      {/* Column Count */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Number of Columns
        </label>
        <div className="flex gap-2">
          {([2, 3, 4] as const).map((count) => (
            <button
              key={count}
              onClick={() => handleColumnCountChange(count)}
              className={`
                px-6 py-3 rounded-lg border-2 font-medium transition-colors
                ${content.column_count === count
                  ? 'bg-terracotta-red text-white border-terracotta-red'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-terracotta-red'
                }
              `}
            >
              {count} Columns
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Desktop layout - automatically adjusts for mobile
        </p>
      </div>

      {/* Gap Size */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Gap Between Columns
        </label>
        <select
          value={content.gap || 'md'}
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
          checked={content.stack_on_mobile ?? true}
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
          💡 <strong>Tip:</strong> After saving, add blocks inside this columns container.
          Blocks will be automatically distributed across {content.column_count} columns.
        </p>
      </div>
    </div>
  )
}
