'use client'

import { useState } from 'react'
import { CardsBlockContent } from '@/types/cms'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import MediaSelector from '../MediaSelector'

interface CardsBlockEditorProps {
  content: CardsBlockContent
  onChange: (content: CardsBlockContent) => void
}

export default function CardsBlockEditor({ content, onChange }: CardsBlockEditorProps) {
  const [expandedCard, setExpandedCard] = useState<number | null>(null)

  const addCard = () => {
    const newCard = {
      title: 'New Card',
      description: 'Card description',
      image: '',
      button_text: '',
      button_url: ''
    }
    onChange({
      ...content,
      cards: [...content.cards, newCard]
    })
    setExpandedCard(content.cards.length)
  }

  const removeCard = (index: number) => {
    onChange({
      ...content,
      cards: content.cards.filter((_, i) => i !== index)
    })
    if (expandedCard === index) {
      setExpandedCard(null)
    }
  }

  const updateCard = (index: number, field: string, value: any) => {
    const newCards = [...content.cards]
    newCards[index] = { ...newCards[index], [field]: value }
    onChange({ ...content, cards: newCards })
  }

  return (
    <div className="space-y-4">
      {/* Column Layout */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Columns
        </label>
        <div className="flex flex-wrap gap-2">
          {([1, 2, 3, 4] as const).map((cols) => (
            <button
              key={cols}
              type="button"
              onClick={() => onChange({ ...content, columns: cols })}
              className={`px-4 py-2 border rounded-lg transition-colors ${
                content.columns === cols
                  ? 'border-terracotta-red bg-terracotta-red/10 text-terracotta-red'
                  : 'border-gray-300 hover:border-terracotta-red'
              }`}
            >
              {cols === 1 ? '1 Column (Full Width)' : `${cols} Columns`}
            </button>
          ))}
        </div>
      </div>

      {/* Card Style */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Style
        </label>
        <div className="flex gap-2">
          {(['elevated', 'outlined', 'flat'] as const).map((style) => (
            <button
              key={style}
              type="button"
              onClick={() => onChange({ ...content, card_style: style })}
              className={`px-4 py-2 border rounded-lg transition-colors capitalize ${
                content.card_style === style
                  ? 'border-terracotta-red bg-terracotta-red/10 text-terracotta-red'
                  : 'border-gray-300 hover:border-terracotta-red'
              }`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      {/* Cards List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Cards ({content.cards.length})
          </label>
          <button
            type="button"
            onClick={addCard}
            className="flex items-center gap-2 px-3 py-1.5 bg-terracotta-red text-white rounded-lg hover:bg-terracotta-red-dark text-sm"
          >
            <PlusIcon className="w-4 h-4" />
            Add Card
          </button>
        </div>

        {content.cards.length === 0 ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <p className="text-gray-600 mb-3">No cards yet</p>
            <button
              type="button"
              onClick={addCard}
              className="inline-flex items-center gap-2 px-4 py-2 bg-terracotta-red text-white rounded-lg hover:bg-terracotta-red-dark"
            >
              <PlusIcon className="w-5 h-5" />
              Add First Card
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {content.cards.map((card, index) => (
              <div
                key={index}
                className="border border-gray-300 rounded-lg overflow-hidden"
              >
                {/* Card Header */}
                <div
                  className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer hover:bg-gray-100"
                  onClick={() => setExpandedCard(expandedCard === index ? null : index)}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">
                      Card {index + 1}: {card.title || 'Untitled'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeCard(index)
                      }}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Card Content (Expandable) */}
                {expandedCard === index && (
                  <div className="p-4 space-y-4 bg-white">
                    {/* Card Media (Image or Video) */}
                    <MediaSelector
                      value={card.image || ''}
                      onChange={(url) => updateCard(index, 'image', url)}
                      type="both"
                      folder="cms/cards"
                      label="Card Image/Video (optional)"
                      compact={true}
                      showPreview={true}
                    />

                    {/* Card Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={card.title}
                        onChange={(e) => updateCard(index, 'title', e.target.value)}
                        placeholder="Card title"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
                      />
                    </div>

                    {/* Card Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={card.description}
                        onChange={(e) => updateCard(index, 'description', e.target.value)}
                        placeholder="Card description"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
                      />
                    </div>

                    {/* Card Button */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Button Text (optional)
                        </label>
                        <input
                          type="text"
                          value={card.button_text || ''}
                          onChange={(e) => updateCard(index, 'button_text', e.target.value)}
                          placeholder="Learn More"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Button URL (optional)
                        </label>
                        <input
                          type="text"
                          value={card.button_url || ''}
                          onChange={(e) => updateCard(index, 'button_url', e.target.value)}
                          placeholder="/page"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Full Width Option */}
                    <div className="pt-4 border-t border-gray-200">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={card.full_width || false}
                          onChange={(e) => updateCard(index, 'full_width', e.target.checked)}
                          className="w-4 h-4 text-terracotta-red border-gray-300 rounded focus:ring-terracotta-red"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Full Width Card
                        </span>
                      </label>
                      <p className="text-xs text-gray-500 ml-6 mt-1">
                        Make this card span the full width of the container (useful for featured/hero cards)
                      </p>
                    </div>

                    {/* Advanced: Image Sizing */}
                    <div className="pt-4 border-t border-gray-200">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Image Settings
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">
                            Image Width
                          </label>
                          <select
                            value={card.image_width || 'auto'}
                            onChange={(e) => updateCard(index, 'image_width', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent text-sm"
                          >
                            <option value="auto">Auto</option>
                            <option value="100%">Full Width (100%)</option>
                            <option value="75%">75%</option>
                            <option value="50%">Half (50%)</option>
                            <option value="200px">200px</option>
                            <option value="150px">150px</option>
                            <option value="100px">100px</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">
                            Image Height
                          </label>
                          <select
                            value={card.image_height || 'auto'}
                            onChange={(e) => updateCard(index, 'image_height', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent text-sm"
                          >
                            <option value="auto">Auto</option>
                            <option value="300px">300px</option>
                            <option value="250px">250px</option>
                            <option value="200px">200px</option>
                            <option value="150px">150px</option>
                            <option value="100px">100px</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Advanced: Background Colors */}
                    <div className="pt-4 border-t border-gray-200">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Background Colors
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">
                            Image Area Background
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={card.image_background_color || '#f3f4f6'}
                              onChange={(e) => updateCard(index, 'image_background_color', e.target.value)}
                              className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={card.image_background_color || ''}
                              onChange={(e) => updateCard(index, 'image_background_color', e.target.value)}
                              placeholder="#f3f4f6"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent text-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">
                            Body Background
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              value={card.body_background_color || '#ffffff'}
                              onChange={(e) => updateCard(index, 'body_background_color', e.target.value)}
                              className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
                            />
                            <input
                              type="text"
                              value={card.body_background_color || ''}
                              onChange={(e) => updateCard(index, 'body_background_color', e.target.value)}
                              placeholder="#ffffff"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
