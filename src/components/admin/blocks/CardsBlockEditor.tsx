'use client'

import { useState } from 'react'
import { CardsBlockContent } from '@/types/cms'
import { PlusIcon, TrashIcon, PhotoIcon } from '@heroicons/react/24/outline'

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
        <div className="flex gap-2">
          {([2, 3, 4] as const).map((cols) => (
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
              {cols} Columns
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
                    {/* Card Image */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Image (optional)
                      </label>
                      {card.image ? (
                        <div className="space-y-2">
                          <div className="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden group">
                            <img
                              src={card.image}
                              alt={card.title}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => updateCard(index, 'image', '')}
                              className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                            >
                              <TrashIcon className="w-4 h-4" />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              // Create a file input and trigger it
                              const input = document.createElement('input')
                              input.type = 'file'
                              input.accept = 'image/*'
                              input.onchange = async (e) => {
                                const file = (e.target as HTMLInputElement).files?.[0]
                                if (file) {
                                  const formData = new FormData()
                                  formData.append('file', file)
                                  formData.append('folder', 'cms/cards')

                                  try {
                                    const response = await fetch('/api/upload', {
                                      method: 'POST',
                                      body: formData
                                    })
                                    const data = await response.json()
                                    if (data.success) {
                                      updateCard(index, 'image', data.url)
                                    }
                                  } catch (error) {
                                    console.error('Upload error:', error)
                                  }
                                }
                              }
                              input.click()
                            }}
                            className="text-sm px-3 py-1.5 bg-gray-600 text-white rounded hover:bg-gray-700"
                          >
                            Replace Image
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            // Create a file input and trigger it
                            const input = document.createElement('input')
                            input.type = 'file'
                            input.accept = 'image/*'
                            input.onchange = async (e) => {
                              const file = (e.target as HTMLInputElement).files?.[0]
                              if (file) {
                                const formData = new FormData()
                                formData.append('file', file)
                                formData.append('folder', 'cms/cards')

                                try {
                                  const response = await fetch('/api/upload', {
                                    method: 'POST',
                                    body: formData
                                  })
                                  const data = await response.json()
                                  if (data.success) {
                                    updateCard(index, 'image', data.url)
                                  }
                                } catch (error) {
                                  console.error('Upload error:', error)
                                }
                              }
                            }
                            input.click()
                          }}
                          className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-terracotta-red transition-colors"
                        >
                          <PhotoIcon className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                          <span className="text-sm text-gray-600 block">Click to Upload Image</span>
                        </button>
                      )}
                    </div>

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
