/**
 * CTA Block Editor Component
 *
 * Admin interface for editing Call-to-Action blocks
 */
'use client'

import { useState } from 'react'
import { CTABlockContent } from '@/types/cms'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'

interface CTABlockEditorProps {
  content: CTABlockContent
  onChange: (content: CTABlockContent) => void
}

export default function CTABlockEditor({ content, onChange }: CTABlockEditorProps) {
  const handleTitleChange = (value: string) => {
    onChange({ ...content, title: value })
  }

  const handleDescriptionChange = (value: string) => {
    onChange({ ...content, description: value })
  }

  const handleAlignmentChange = (alignment: 'left' | 'center' | 'right') => {
    onChange({ ...content, alignment })
  }

  const handleAddButton = () => {
    onChange({
      ...content,
      buttons: [...content.buttons, { text: 'New Button', url: '#', style: 'primary' }]
    })
  }

  const handleButtonChange = (index: number, field: 'text' | 'url' | 'style', value: string) => {
    const updatedButtons = [...content.buttons]
    updatedButtons[index] = { ...updatedButtons[index], [field]: value }
    onChange({ ...content, buttons: updatedButtons })
  }

  const handleRemoveButton = (index: number) => {
    onChange({
      ...content,
      buttons: content.buttons.filter((_, i) => i !== index)
    })
  }

  return (
    <div className="space-y-4">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          CTA Title
        </label>
        <input
          type="text"
          value={content.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
          placeholder="Enter compelling title..."
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description (optional)
        </label>
        <textarea
          value={content.description || ''}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
          placeholder="Add supporting text..."
        />
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
              onClick={() => handleAlignmentChange(align)}
              className={`px-4 py-2 rounded-lg border ${
                content.alignment === align
                  ? 'bg-terracotta-red text-white border-terracotta-red'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {align.charAt(0).toUpperCase() + align.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Buttons
          </label>
          <button
            onClick={handleAddButton}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-deep-teal text-white rounded-lg hover:bg-deep-teal-dark"
          >
            <PlusIcon className="w-4 h-4" />
            Add Button
          </button>
        </div>

        <div className="space-y-3">
          {content.buttons.map((button, index) => (
            <div key={index} className="p-3 border border-gray-200 rounded-lg space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 space-y-2">
                  {/* Button Text */}
                  <input
                    type="text"
                    value={button.text}
                    onChange={(e) => handleButtonChange(index, 'text', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
                    placeholder="Button text..."
                  />

                  {/* Button URL */}
                  <input
                    type="text"
                    value={button.url}
                    onChange={(e) => handleButtonChange(index, 'url', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
                    placeholder="Button URL..."
                  />

                  {/* Button Style */}
                  <select
                    value={button.style || 'primary'}
                    onChange={(e) => handleButtonChange(index, 'style', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
                  >
                    <option value="primary">Primary</option>
                    <option value="secondary">Secondary</option>
                    <option value="outline">Outline</option>
                  </select>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveButton(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  title="Remove button"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {content.buttons.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              No buttons yet. Click "Add Button" to create one.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
