/**
 * Column Settings Panel Component
 *
 * Expandable panel for configuring individual column settings
 * including padding, background, borders, and alignment
 */
'use client'

import { ColumnConfig, PaddingSize, CardBorderRadius, VerticalAlign, BorderWidth } from '@/types/cms'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

interface ColumnSettingsPanelProps {
  columnIndex: number
  config: ColumnConfig
  onChange: (config: ColumnConfig) => void
}

const PADDING_OPTIONS: { value: PaddingSize; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' }
]

const BORDER_RADIUS_OPTIONS: { value: CardBorderRadius; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' }
]

const BORDER_WIDTH_OPTIONS: { value: BorderWidth; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'thin', label: 'Thin (1px)' },
  { value: 'medium', label: 'Medium (2px)' },
  { value: 'thick', label: 'Thick (4px)' }
]

const VERTICAL_ALIGN_OPTIONS: { value: VerticalAlign; label: string }[] = [
  { value: 'top', label: 'Top' },
  { value: 'center', label: 'Center' },
  { value: 'bottom', label: 'Bottom' },
  { value: 'stretch', label: 'Stretch' }
]

export default function ColumnSettingsPanel({
  columnIndex,
  config,
  onChange
}: ColumnSettingsPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const updateConfig = (updates: Partial<ColumnConfig>) => {
    onChange({ ...config, ...updates })
  }

  // Check if any settings are customized
  const hasCustomSettings = !!(
    config.padding ||
    config.padding_horizontal ||
    config.margin ||
    config.margin_horizontal ||
    config.background_color ||
    config.border_color ||
    config.border_width !== 'none' ||
    config.border_radius !== 'none' ||
    config.vertical_align ||
    config.custom_class
  )

  return (
    <div className="border border-gray-200 rounded-lg bg-gray-50">
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 hover:bg-gray-100 transition-colors rounded-lg"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">
            Column {columnIndex + 1} Settings
          </span>
          {hasCustomSettings && (
            <span className="px-2 py-0.5 text-xs bg-terracotta-red/10 text-terracotta-red rounded-full">
              Customized
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronUpIcon className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDownIcon className="w-4 h-4 text-gray-500" />
        )}
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-4 pt-0 space-y-4 border-t border-gray-200">
          {/* Padding */}
          <div>
            <h4 className="text-xs font-semibold text-gray-700 mb-2">Padding (Inside Column)</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Vertical Padding
                </label>
                <select
                  value={config.padding || 'none'}
                  onChange={(e) => updateConfig({ padding: e.target.value as PaddingSize })}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-terracotta-red focus:border-terracotta-red"
                >
                  {PADDING_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Horizontal Padding
                </label>
                <select
                  value={config.padding_horizontal || 'none'}
                  onChange={(e) => updateConfig({ padding_horizontal: e.target.value as PaddingSize })}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-terracotta-red focus:border-terracotta-red"
                >
                  {PADDING_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Margin */}
          <div>
            <h4 className="text-xs font-semibold text-gray-700 mb-2">Margin (Outside Column)</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Vertical Margin
                </label>
                <select
                  value={config.margin || 'none'}
                  onChange={(e) => updateConfig({ margin: e.target.value as PaddingSize })}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-terracotta-red focus:border-terracotta-red"
                >
                  {PADDING_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Horizontal Margin
                </label>
                <select
                  value={config.margin_horizontal || 'none'}
                  onChange={(e) => updateConfig({ margin_horizontal: e.target.value as PaddingSize })}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-terracotta-red focus:border-terracotta-red"
                >
                  {PADDING_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Background Color */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Background Color
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={config.background_color || '#ffffff'}
                onChange={(e) => updateConfig({ background_color: e.target.value })}
                className="w-10 h-8 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={config.background_color || ''}
                onChange={(e) => updateConfig({ background_color: e.target.value })}
                placeholder="transparent"
                className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-terracotta-red focus:border-terracotta-red font-mono"
              />
              {config.background_color && (
                <button
                  type="button"
                  onClick={() => updateConfig({ background_color: undefined })}
                  className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Border Settings */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Border Width
              </label>
              <select
                value={config.border_width || 'none'}
                onChange={(e) => updateConfig({ border_width: e.target.value as BorderWidth })}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-terracotta-red focus:border-terracotta-red"
              >
                {BORDER_WIDTH_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Border Color
              </label>
              <input
                type="color"
                value={config.border_color || '#e5e7eb'}
                onChange={(e) => updateConfig({ border_color: e.target.value })}
                className="w-full h-8 border border-gray-300 rounded cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Border Radius
              </label>
              <select
                value={config.border_radius || 'none'}
                onChange={(e) => updateConfig({ border_radius: e.target.value as CardBorderRadius })}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-terracotta-red focus:border-terracotta-red"
              >
                {BORDER_RADIUS_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Vertical Alignment */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Vertical Alignment (override)
            </label>
            <select
              value={config.vertical_align || ''}
              onChange={(e) => updateConfig({
                vertical_align: e.target.value ? e.target.value as VerticalAlign : undefined
              })}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-terracotta-red focus:border-terracotta-red"
            >
              <option value="">Use container default</option>
              {VERTICAL_ALIGN_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Custom CSS Class */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Custom CSS Class
            </label>
            <input
              type="text"
              value={config.custom_class || ''}
              onChange={(e) => updateConfig({ custom_class: e.target.value })}
              placeholder="e.g., my-custom-column"
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-terracotta-red focus:border-terracotta-red font-mono"
            />
          </div>

          {/* Reset Button */}
          {hasCustomSettings && (
            <button
              type="button"
              onClick={() => onChange({ id: config.id })}
              className="text-xs text-gray-500 hover:text-terracotta-red underline"
            >
              Reset all settings to defaults
            </button>
          )}
        </div>
      )}
    </div>
  )
}
