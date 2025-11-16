/**
 * Block Layout Controls Component
 *
 * Provides UI controls for managing block layout properties:
 * - Container Width
 * - Padding
 * - Margins (Top/Bottom)
 * - Background Color
 * - Custom CSS Class
 */

import { ContainerWidth, PaddingSize, SpacingSize } from '@/types/cms'

interface BlockLayoutControlsProps {
  containerWidth?: ContainerWidth | null
  padding?: PaddingSize | null
  marginTop?: SpacingSize | null
  marginBottom?: SpacingSize | null
  backgroundColor?: string | null
  customClass?: string | null
  onChange: (updates: {
    container_width?: ContainerWidth | null
    padding?: PaddingSize | null
    margin_top?: SpacingSize | null
    margin_bottom?: SpacingSize | null
    background_color?: string | null
    custom_css_class?: string | null
  }) => void
}

export default function BlockLayoutControls({
  containerWidth = 'contained',
  padding = 'medium',
  marginTop = 'none',
  marginBottom = 'none',
  backgroundColor,
  customClass,
  onChange
}: BlockLayoutControlsProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-4 border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-sm text-gray-700">📐 Layout Settings</h4>
        <span className="text-xs text-gray-500">Control spacing and width</span>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Container Width */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Container Width
          </label>
          <select
            value={containerWidth || 'contained'}
            onChange={(e) => onChange({ container_width: e.target.value as ContainerWidth })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
          >
            <option value="narrow">📱 Narrow (768px) - Best for text</option>
            <option value="contained">📄 Contained (1152px) - Default</option>
            <option value="wide">🖼️ Wide (1280px) - For galleries</option>
            <option value="full">⬛ Full Width (100%) - Full bleed</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Controls maximum width of content
          </p>
        </div>

        {/* Padding */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Vertical Padding
          </label>
          <select
            value={padding || 'medium'}
            onChange={(e) => onChange({ padding: e.target.value as PaddingSize })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
          >
            <option value="none">None - No padding</option>
            <option value="small">Small - Compact spacing</option>
            <option value="medium">Medium - Standard (default)</option>
            <option value="large">Large - Generous spacing</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Inside spacing (top/bottom)
          </p>
        </div>

        {/* Margin Top */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Margin Top
          </label>
          <select
            value={marginTop || 'none'}
            onChange={(e) => onChange({ margin_top: e.target.value as SpacingSize })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
          >
            <option value="none">None</option>
            <option value="xs">XS - 16px</option>
            <option value="sm">SM - 24px</option>
            <option value="md">MD - 32px</option>
            <option value="lg">LG - 48px</option>
            <option value="xl">XL - 64px</option>
            <option value="2xl">2XL - 96px</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Space above this block
          </p>
        </div>

        {/* Margin Bottom */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Margin Bottom
          </label>
          <select
            value={marginBottom || 'none'}
            onChange={(e) => onChange({ margin_bottom: e.target.value as SpacingSize })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
          >
            <option value="none">None</option>
            <option value="xs">XS - 16px</option>
            <option value="sm">SM - 24px</option>
            <option value="md">MD - 32px</option>
            <option value="lg">LG - 48px</option>
            <option value="xl">XL - 64px</option>
            <option value="2xl">2XL - 96px</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Space below this block
          </p>
        </div>
      </div>

      {/* Background Color */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Background Color
        </label>
        <div className="flex gap-2">
          <input
            type="color"
            value={backgroundColor || '#ffffff'}
            onChange={(e) => onChange({ background_color: e.target.value })}
            className="h-10 w-16 rounded cursor-pointer border border-gray-300"
          />
          <input
            type="text"
            value={backgroundColor || ''}
            onChange={(e) => onChange({ background_color: e.target.value })}
            placeholder="#ffffff or transparent"
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent font-mono"
          />
          {backgroundColor && (
            <button
              onClick={() => onChange({ background_color: null })}
              className="px-3 py-2 text-xs bg-gray-200 hover:bg-gray-300 rounded-lg"
            >
              Clear
            </button>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Background color for this block (leave empty for transparent)
        </p>
      </div>

      {/* Custom CSS Class */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Custom CSS Class
          <span className="text-gray-500 font-normal ml-1">(Advanced)</span>
        </label>
        <input
          type="text"
          value={customClass || ''}
          onChange={(e) => onChange({ custom_css_class: e.target.value })}
          placeholder="e.g., border-2 border-gray-200 rounded-xl"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent font-mono"
        />
        <p className="text-xs text-gray-500 mt-1">
          Add custom Tailwind CSS classes for advanced styling
        </p>
      </div>
    </div>
  )
}
