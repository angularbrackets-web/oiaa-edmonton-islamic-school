/**
 * Simplified Layout Controls Component
 *
 * User-friendly interface for managing block layout properties
 * Replaces technical dropdowns with visual, intuitive controls
 */

'use client'

import { useState } from 'react'
import { ContainerWidth, PaddingSize, SpacingSize, DisplayStyle, CardBorderRadius, CardShadow } from '@/types/cms'

interface SimplifiedLayoutControlsProps {
  containerWidth?: ContainerWidth | null
  padding?: PaddingSize | null
  paddingHorizontal?: PaddingSize | null
  marginTop?: SpacingSize | null
  marginBottom?: SpacingSize | null
  marginHorizontal?: SpacingSize | null
  backgroundColor?: string | null
  customClass?: string | null
  displayStyle?: DisplayStyle | null
  cardBorderRadius?: CardBorderRadius | null
  cardShadow?: CardShadow | null
  cardHoverEffect?: boolean | null
  hideHeader?: boolean // Hide the header when used in a collapsible context
  onChange: (updates: {
    container_width?: ContainerWidth | null
    padding?: PaddingSize | null
    padding_horizontal?: PaddingSize | null
    margin_top?: SpacingSize | null
    margin_bottom?: SpacingSize | null
    margin_horizontal?: SpacingSize | null
    background_color?: string | null
    custom_css_class?: string | null
    display_style?: DisplayStyle | null
    card_border_radius?: CardBorderRadius | null
    card_shadow?: CardShadow | null
    card_hover_effect?: boolean | null
  }) => void
}

// Islamic color presets
const PRESET_COLORS = [
  { name: 'White', value: '#FFFFFF', color: 'bg-white border-2 border-gray-300' },
  { name: 'Light Gray', value: '#F4F4F4', color: 'bg-gray-100' },
  { name: 'Teal', value: '#1A5F7A', color: 'bg-[#1A5F7A]' },
  { name: 'Terracotta', value: '#D04845', color: 'bg-[#D04845]' },
  { name: 'Gold', value: '#F4A261', color: 'bg-[#F4A261]' },
  { name: 'Cream', value: '#FFF8E7', color: 'bg-[#FFF8E7]' },
]

// Container width options
const WIDTH_OPTIONS = [
  {
    value: 'narrow' as ContainerWidth,
    icon: '📖',
    label: 'Perfect for Reading',
    description: 'Best for articles and long text (768px)',
    example: 'w-3/5'
  },
  {
    value: 'contained' as ContainerWidth,
    icon: '📄',
    label: 'Standard Width',
    description: 'Default balanced layout (1152px)',
    example: 'w-4/5'
  },
  {
    value: 'wide' as ContainerWidth,
    icon: '🖼️',
    label: 'Wide Layout',
    description: 'Great for galleries and media (1280px)',
    example: 'w-11/12'
  },
  {
    value: 'full' as ContainerWidth,
    icon: '⬛',
    label: 'Edge-to-Edge',
    description: 'Full width, no margins (100%)',
    example: 'w-full'
  }
]

// Spacing level mappings
const PADDING_MAP: PaddingSize[] = ['none', 'small', 'medium', 'large']
const SPACING_MAP: SpacingSize[] = ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl']
const PADDING_PX = [0, 16, 32, 48]
const SPACING_PX = [0, 16, 24, 32, 48, 64, 96]

export default function SimplifiedLayoutControls({
  containerWidth = 'contained',
  padding = 'medium',
  paddingHorizontal = 'medium',
  marginTop = 'none',
  marginBottom = 'none',
  marginHorizontal = 'none',
  backgroundColor,
  customClass,
  displayStyle = 'card',
  cardBorderRadius = 'medium',
  cardShadow = 'subtle',
  cardHoverEffect = false,
  hideHeader = false,
  onChange
}: SimplifiedLayoutControlsProps) {
  const [showCustomPicker, setShowCustomPicker] = useState(false)

  // Convert values to slider levels
  const paddingLevel = PADDING_MAP.indexOf(padding || 'medium')
  const paddingHorizontalLevel = PADDING_MAP.indexOf(paddingHorizontal || 'medium')
  const marginTopLevel = SPACING_MAP.indexOf(marginTop || 'none')
  const marginBottomLevel = SPACING_MAP.indexOf(marginBottom || 'none')
  const marginHorizontalLevel = SPACING_MAP.indexOf(marginHorizontal || 'none')

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 space-y-6 border border-gray-200 shadow-sm">
      {!hideHeader && (
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-base text-gray-800 flex items-center gap-2">
            <span className="text-xl">🎨</span>
            Layout & Styling
          </h4>
          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">Simplified</span>
        </div>
      )}

      {/* Container Width */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Container Width
        </label>
        <div className="space-y-2">
          {WIDTH_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-white hover:shadow-md ${
                containerWidth === option.value
                  ? 'bg-white border-terracotta-red shadow-md ring-2 ring-terracotta-red ring-opacity-20'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="width"
                value={option.value}
                checked={containerWidth === option.value}
                onChange={(e) => onChange({ container_width: e.target.value as ContainerWidth })}
                className="mt-1 w-4 h-4 text-terracotta-red focus:ring-terracotta-red"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{option.icon}</span>
                  <span className="font-medium text-gray-800">{option.label}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{option.description}</p>
                {/* Visual width indicator */}
                <div className="mt-2 bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r from-terracotta-red to-deep-teal ${option.example}`}></div>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Vertical Padding */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Vertical Padding (Top & Bottom)
        </label>
        <p className="text-xs text-gray-500 mb-3">Breathing room above and below content</p>

        <input
          type="range"
          min="0"
          max="3"
          step="1"
          value={paddingLevel}
          onChange={(e) => {
            const level = parseInt(e.target.value)
            onChange({ padding: PADDING_MAP[level] })
          }}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-terracotta"
        />
        <div className="flex justify-between text-xs text-gray-600 mt-1 px-1">
          <span className={paddingLevel === 0 ? 'font-bold text-terracotta-red' : ''}>None</span>
          <span className={paddingLevel === 1 ? 'font-bold text-terracotta-red' : ''}>Compact</span>
          <span className={paddingLevel === 2 ? 'font-bold text-terracotta-red' : ''}>Comfortable</span>
          <span className={paddingLevel === 3 ? 'font-bold text-terracotta-red' : ''}>Generous</span>
        </div>

        {/* Live preview box */}
        <div className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-2 bg-white">
          <div
            className="bg-gradient-to-br from-gray-50 to-gray-100 rounded transition-all duration-300"
            style={{ paddingTop: `${PADDING_PX[paddingLevel]}px`, paddingBottom: `${PADDING_PX[paddingLevel]}px`, paddingLeft: '16px', paddingRight: '16px' }}
          >
            <div className="bg-white rounded p-3 text-center text-sm text-gray-600 shadow-sm">
              <div className="font-medium">Preview</div>
              <div className="text-xs mt-1">
                {PADDING_PX[paddingLevel]}px top/bottom
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Padding */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Horizontal Padding (Left & Right)
        </label>
        <p className="text-xs text-gray-500 mb-3">Breathing room on the sides of content</p>

        <input
          type="range"
          min="0"
          max="3"
          step="1"
          value={paddingHorizontalLevel}
          onChange={(e) => {
            const level = parseInt(e.target.value)
            onChange({ padding_horizontal: PADDING_MAP[level] })
          }}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-terracotta"
        />
        <div className="flex justify-between text-xs text-gray-600 mt-1 px-1">
          <span className={paddingHorizontalLevel === 0 ? 'font-bold text-terracotta-red' : ''}>None</span>
          <span className={paddingHorizontalLevel === 1 ? 'font-bold text-terracotta-red' : ''}>Compact</span>
          <span className={paddingHorizontalLevel === 2 ? 'font-bold text-terracotta-red' : ''}>Comfortable</span>
          <span className={paddingHorizontalLevel === 3 ? 'font-bold text-terracotta-red' : ''}>Generous</span>
        </div>

        {/* Live preview box */}
        <div className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-2 bg-white">
          <div
            className="bg-gradient-to-br from-gray-50 to-gray-100 rounded transition-all duration-300"
            style={{ paddingLeft: `${PADDING_PX[paddingHorizontalLevel]}px`, paddingRight: `${PADDING_PX[paddingHorizontalLevel]}px`, paddingTop: '16px', paddingBottom: '16px' }}
          >
            <div className="bg-white rounded p-3 text-center text-sm text-gray-600 shadow-sm">
              <div className="font-medium">Preview</div>
              <div className="text-xs mt-1">
                {PADDING_PX[paddingHorizontalLevel]}px left/right
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Space Above */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Space Above Block
        </label>
        <p className="text-xs text-gray-500 mb-3">Distance from the block above</p>

        <input
          type="range"
          min="0"
          max="6"
          step="1"
          value={marginTopLevel}
          onChange={(e) => {
            const level = parseInt(e.target.value)
            onChange({ margin_top: SPACING_MAP[level] })
          }}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-teal"
        />
        <div className="flex justify-between text-xs text-gray-600 mt-1 px-1">
          <span className={marginTopLevel === 0 ? 'font-bold text-deep-teal' : ''}>None</span>
          <span className={marginTopLevel === 1 ? 'font-bold text-deep-teal' : ''}>XS</span>
          <span className={marginTopLevel === 2 ? 'font-bold text-deep-teal' : ''}>SM</span>
          <span className={marginTopLevel === 3 ? 'font-bold text-deep-teal' : ''}>MD</span>
          <span className={marginTopLevel === 4 ? 'font-bold text-deep-teal' : ''}>LG</span>
          <span className={marginTopLevel === 5 ? 'font-bold text-deep-teal' : ''}>XL</span>
          <span className={marginTopLevel === 6 ? 'font-bold text-deep-teal' : ''}>2XL</span>
        </div>

        {/* Visual height indicator */}
        <div className="mt-3 flex items-end gap-2 h-24 bg-white rounded-lg p-3 border border-gray-200">
          <div className="text-xs text-gray-500 mr-2">Height:</div>
          <div
            className="bg-gradient-to-t from-deep-teal to-deep-teal/50 rounded transition-all duration-300"
            style={{
              width: '40px',
              height: `${Math.max(8, (SPACING_PX[marginTopLevel] / 96) * 100)}%`
            }}
          ></div>
          <div className="text-xs font-medium text-gray-700">{SPACING_PX[marginTopLevel]}px</div>
        </div>
      </div>

      {/* Space Below */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Space Below Block
        </label>
        <p className="text-xs text-gray-500 mb-3">Distance to the next block</p>

        <input
          type="range"
          min="0"
          max="6"
          step="1"
          value={marginBottomLevel}
          onChange={(e) => {
            const level = parseInt(e.target.value)
            onChange({ margin_bottom: SPACING_MAP[level] })
          }}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-teal"
        />
        <div className="flex justify-between text-xs text-gray-600 mt-1 px-1">
          <span className={marginBottomLevel === 0 ? 'font-bold text-deep-teal' : ''}>None</span>
          <span className={marginBottomLevel === 1 ? 'font-bold text-deep-teal' : ''}>XS</span>
          <span className={marginBottomLevel === 2 ? 'font-bold text-deep-teal' : ''}>SM</span>
          <span className={marginBottomLevel === 3 ? 'font-bold text-deep-teal' : ''}>MD</span>
          <span className={marginBottomLevel === 4 ? 'font-bold text-deep-teal' : ''}>LG</span>
          <span className={marginBottomLevel === 5 ? 'font-bold text-deep-teal' : ''}>XL</span>
          <span className={marginBottomLevel === 6 ? 'font-bold text-deep-teal' : ''}>2XL</span>
        </div>

        {/* Visual height indicator */}
        <div className="mt-3 flex items-end gap-2 h-24 bg-white rounded-lg p-3 border border-gray-200">
          <div className="text-xs text-gray-500 mr-2">Height:</div>
          <div
            className="bg-gradient-to-t from-deep-teal to-deep-teal/50 rounded transition-all duration-300"
            style={{
              width: '40px',
              height: `${Math.max(8, (SPACING_PX[marginBottomLevel] / 96) * 100)}%`
            }}
          ></div>
          <div className="text-xs font-medium text-gray-700">{SPACING_PX[marginBottomLevel]}px</div>
        </div>
      </div>

      {/* Edge Spacing (Horizontal Margins) */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Edge Spacing (Left & Right)
        </label>
        <p className="text-xs text-gray-500 mb-3">Distance from browser edges - prevents sticking</p>

        <input
          type="range"
          min="0"
          max="6"
          step="1"
          value={marginHorizontalLevel}
          onChange={(e) => {
            const level = parseInt(e.target.value)
            onChange({ margin_horizontal: SPACING_MAP[level] })
          }}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-teal"
        />
        <div className="flex justify-between text-xs text-gray-600 mt-1 px-1">
          <span className={marginHorizontalLevel === 0 ? 'font-bold text-deep-teal' : ''}>None</span>
          <span className={marginHorizontalLevel === 1 ? 'font-bold text-deep-teal' : ''}>XS</span>
          <span className={marginHorizontalLevel === 2 ? 'font-bold text-deep-teal' : ''}>SM</span>
          <span className={marginHorizontalLevel === 3 ? 'font-bold text-deep-teal' : ''}>MD</span>
          <span className={marginHorizontalLevel === 4 ? 'font-bold text-deep-teal' : ''}>LG</span>
          <span className={marginHorizontalLevel === 5 ? 'font-bold text-deep-teal' : ''}>XL</span>
          <span className={marginHorizontalLevel === 6 ? 'font-bold text-deep-teal' : ''}>2XL</span>
        </div>

        {/* Visual width indicator */}
        <div className="mt-3 flex items-center justify-center gap-2 h-24 bg-white rounded-lg p-3 border border-gray-200">
          <div
            className="bg-gradient-to-r from-deep-teal to-deep-teal/50 rounded transition-all duration-300 h-16 flex items-center justify-center"
            style={{
              width: `${Math.max(8, (SPACING_PX[marginHorizontalLevel] / 96) * 100)}%`
            }}
          >
            <span className="text-xs font-medium text-white">{SPACING_PX[marginHorizontalLevel]}px</span>
          </div>
        </div>
      </div>

      {/* Background Color */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Background Color
        </label>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {PRESET_COLORS.map((preset) => (
            <button
              key={preset.value}
              onClick={() => onChange({ background_color: preset.value })}
              className={`h-16 rounded-lg ${preset.color} transition-all hover:scale-105 flex flex-col items-center justify-center gap-1 ${
                backgroundColor === preset.value
                  ? 'ring-4 ring-terracotta-red ring-opacity-50 shadow-lg'
                  : 'ring-1 ring-gray-200 hover:ring-2 hover:ring-gray-300'
              }`}
              title={preset.name}
            >
              <span className="text-xs font-medium text-gray-700">{preset.name}</span>
            </button>
          ))}
        </div>

        {/* Custom Color Section */}
        <div className="space-y-2">
          <button
            onClick={() => setShowCustomPicker(!showCustomPicker)}
            className="w-full py-2 px-4 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-colors flex items-center justify-center gap-2 bg-white"
          >
            <span className="text-xl">🎨</span>
            <span className="text-sm font-medium text-gray-700">Custom Color</span>
          </button>

          {showCustomPicker && (
            <div className="bg-white rounded-lg p-4 border-2 border-gray-200 space-y-3">
              <div className="flex gap-2">
                <input
                  type="color"
                  value={backgroundColor || '#ffffff'}
                  onChange={(e) => onChange({ background_color: e.target.value })}
                  className="h-12 w-20 rounded-lg cursor-pointer border-2 border-gray-300"
                />
                <input
                  type="text"
                  value={backgroundColor || ''}
                  onChange={(e) => onChange({ background_color: e.target.value })}
                  placeholder="#ffffff or transparent"
                  className="flex-1 px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent font-mono"
                />
              </div>
              {backgroundColor && (
                <button
                  onClick={() => onChange({ background_color: null })}
                  className="w-full py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700"
                >
                  Clear Background
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Card Display Style */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Card Display Style
        </label>
        <p className="text-xs text-gray-500 mb-3">Choose how this block appears visually</p>

        <div className="space-y-2">
          {/* Flat Option */}
          <label
            className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-white hover:shadow-md ${
              displayStyle === 'flat'
                ? 'bg-white border-terracotta-red shadow-md ring-2 ring-terracotta-red ring-opacity-20'
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="displayStyle"
              value="flat"
              checked={displayStyle === 'flat'}
              onChange={(e) => onChange({
                display_style: e.target.value as DisplayStyle,
                card_border_radius: 'none',
                card_shadow: 'none',
                card_hover_effect: false
              })}
              className="mt-1 w-4 h-4 text-terracotta-red focus:ring-terracotta-red"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xl">▭</span>
                <span className="font-medium text-gray-800">Flat (No Card)</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Transparent background, no borders or shadows</p>
            </div>
          </label>

          {/* Card Option (Default) */}
          <label
            className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-white hover:shadow-md ${
              displayStyle === 'card'
                ? 'bg-white border-terracotta-red shadow-md ring-2 ring-terracotta-red ring-opacity-20'
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="displayStyle"
              value="card"
              checked={displayStyle === 'card'}
              onChange={(e) => onChange({ display_style: e.target.value as DisplayStyle })}
              className="mt-1 w-4 h-4 text-terracotta-red focus:ring-terracotta-red"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎴</span>
                <span className="font-medium text-gray-800">Card (Default)</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Clean card with border and subtle shadow</p>
            </div>
          </label>

          {/* Featured Option */}
          <label
            className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-white hover:shadow-md ${
              displayStyle === 'featured'
                ? 'bg-white border-terracotta-red shadow-md ring-2 ring-terracotta-red ring-opacity-20'
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="displayStyle"
              value="featured"
              checked={displayStyle === 'featured'}
              onChange={(e) => onChange({ display_style: e.target.value as DisplayStyle })}
              className="mt-1 w-4 h-4 text-terracotta-red focus:ring-terracotta-red"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xl">⭐</span>
                <span className="font-medium text-gray-800">Featured</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Elevated card with stronger shadow for emphasis</p>
            </div>
          </label>
        </div>

        {/* Card Options (Only show if not flat) */}
        {displayStyle !== 'flat' && (
          <div className="mt-4 space-y-4 bg-white rounded-lg p-4 border border-gray-200">
            {/* Border Radius */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Corner Rounding</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { value: 'none', label: 'None', icon: '▪️' },
                  { value: 'small', label: 'Small', icon: '▫️' },
                  { value: 'medium', label: 'Medium', icon: '◽' },
                  { value: 'large', label: 'Large', icon: '⚪' }
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => onChange({ card_border_radius: option.value as CardBorderRadius })}
                    className={`py-2 px-3 rounded text-xs font-medium transition-all ${
                      cardBorderRadius === option.value
                        ? 'bg-terracotta-red text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <div>{option.icon}</div>
                    <div className="text-xs">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Shadow Depth */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Shadow Depth</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { value: 'none', label: 'None' },
                  { value: 'subtle', label: 'Subtle' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'strong', label: 'Strong' }
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => onChange({ card_shadow: option.value as CardShadow })}
                    className={`py-2 px-3 rounded text-xs font-medium transition-all ${
                      cardShadow === option.value
                        ? 'bg-deep-teal text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Hover Effect Toggle */}
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cardHoverEffect || false}
                  onChange={(e) => onChange({ card_hover_effect: e.target.checked })}
                  className="w-5 h-5 text-terracotta-red rounded focus:ring-2 focus:ring-terracotta-red"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700">Enable Hover Effect</span>
                  <p className="text-xs text-gray-500">Card lifts slightly on mouse hover</p>
                </div>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Custom CSS Class (Collapsed by default) */}
      <details className="bg-white rounded-lg border border-gray-200">
        <summary className="px-4 py-3 cursor-pointer text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          ⚙️ Advanced: Custom CSS Classes
        </summary>
        <div className="px-4 pb-4 pt-2">
          <input
            type="text"
            value={customClass || ''}
            onChange={(e) => onChange({ custom_css_class: e.target.value })}
            placeholder="e.g., border-2 border-gray-200 rounded-xl"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent font-mono"
          />
          <p className="text-xs text-gray-500 mt-2">
            Add custom Tailwind CSS classes for advanced styling
          </p>
        </div>
      </details>

      {/* Custom slider styles */}
      <style jsx>{`
        .slider-terracotta::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #D04845;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .slider-terracotta::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #D04845;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .slider-teal::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #1A5F7A;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .slider-teal::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #1A5F7A;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  )
}
