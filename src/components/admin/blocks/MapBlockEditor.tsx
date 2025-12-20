'use client'

import { useState } from 'react'
import { MapBlockContent } from '@/types/cms'

interface MapBlockEditorProps {
  content: MapBlockContent
  onChange: (content: MapBlockContent) => void
}

export default function MapBlockEditor({ content, onChange }: MapBlockEditorProps) {
  const [inputMode, setInputMode] = useState<'embed' | 'address'>(
    content.embed_url ? 'embed' : 'address'
  )

  const handleInputModeChange = (mode: 'embed' | 'address') => {
    setInputMode(mode)
    // Clear opposite mode data when switching
    if (mode === 'embed') {
      onChange({ ...content, address: undefined })
    } else {
      onChange({ ...content, embed_url: undefined })
    }
  }

  // Extract embed URL from iframe code if user pastes full iframe HTML
  const handleEmbedUrlChange = (value: string) => {
    let embedUrl = value.trim()

    // Check if user pasted full iframe code
    if (embedUrl.includes('<iframe') && embedUrl.includes('src=')) {
      const srcMatch = embedUrl.match(/src="([^"]+)"/)
      if (srcMatch && srcMatch[1]) {
        embedUrl = srcMatch[1]
      }
    }

    onChange({ ...content, embed_url: embedUrl })
  }

  return (
    <div className="space-y-6">
      {/* Input Mode Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Map Input Method
        </label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => handleInputModeChange('embed')}
            className={`flex-1 px-4 py-3 border rounded-lg transition-colors text-left ${
              inputMode === 'embed'
                ? 'border-terracotta-red bg-terracotta-red/10 text-terracotta-red'
                : 'border-gray-300 hover:border-terracotta-red'
            }`}
          >
            <div className="font-semibold mb-1">Google Maps Embed</div>
            <div className="text-xs text-gray-600">
              Paste iframe embed code from Google Maps
            </div>
          </button>
          <button
            type="button"
            onClick={() => handleInputModeChange('address')}
            className={`flex-1 px-4 py-3 border rounded-lg transition-colors text-left ${
              inputMode === 'address'
                ? 'border-terracotta-red bg-terracotta-red/10 text-terracotta-red'
                : 'border-gray-300 hover:border-terracotta-red'
            }`}
          >
            <div className="font-semibold mb-1">Simple Address</div>
            <div className="text-xs text-gray-600">
              Enter address with link to Google Maps
            </div>
          </button>
        </div>
      </div>

      {/* Embed URL Input */}
      {inputMode === 'embed' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Google Maps Embed URL
          </label>
          <textarea
            value={content.embed_url || ''}
            onChange={(e) => handleEmbedUrlChange(e.target.value)}
            placeholder="https://www.google.com/maps/embed?pb=... OR paste full iframe code"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent font-mono text-sm"
          />
          <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 font-semibold mb-2">
              How to get embed URL:
            </p>
            <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
              <li>Go to <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer" className="underline">Google Maps</a></li>
              <li>Search for your location</li>
              <li>Click "Share" → "Embed a map"</li>
              <li>Copy the <strong>entire iframe code</strong> OR just the <strong>src URL</strong> starting with "https://www.google.com/maps/embed?pb="</li>
              <li>Paste it here</li>
            </ol>
            <p className="text-xs text-red-700 mt-2 font-semibold">
              ⚠️ DO NOT use shortened URLs (maps.app.goo.gl) - they won't work in embedded maps!
            </p>
          </div>

          {content.embed_url && !content.embed_url.includes('google.com/maps/embed') && (
            <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800 font-semibold">
                ⚠️ Invalid URL Format
              </p>
              <p className="text-xs text-red-700 mt-1">
                The URL must start with "https://www.google.com/maps/embed" to work properly.
                Shortened URLs like "maps.app.goo.gl" will not work.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Address Input */}
      {inputMode === 'address' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address <span className="text-red-500">*</span>
          </label>
          <textarea
            value={content.address || ''}
            onChange={(e) => onChange({ ...content, address: e.target.value })}
            placeholder="123 Islamic Center Drive, Edmonton, AB T5K 2M4, Canada"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
          />
          <p className="mt-1 text-xs text-gray-500">
            Enter the complete address. Users will see a link to open in Google Maps.
          </p>
        </div>
      )}

      {/* Common Settings */}
      <div className="pt-4 border-t border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Map Settings
        </label>

        <div className="space-y-4">
          {/* Location Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location Title (optional)
            </label>
            <input
              type="text"
              value={content.marker_title || ''}
              onChange={(e) => onChange({ ...content, marker_title: e.target.value })}
              placeholder="Our School Location"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
            />
          </div>

          {/* Map Height (only for embed) */}
          {inputMode === 'embed' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Map Height
              </label>
              <select
                value={content.height || '400px'}
                onChange={(e) => onChange({ ...content, height: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
              >
                <option value="300px">Small (300px)</option>
                <option value="400px">Medium (400px)</option>
                <option value="500px">Large (500px)</option>
                <option value="600px">Extra Large (600px)</option>
                <option value="50vh">Half Screen (50vh)</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Preview */}
      {(content.embed_url || content.address) && (
        <div className="pt-4 border-t border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Preview
          </label>
          {inputMode === 'embed' && content.embed_url ? (
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <iframe
                src={content.embed_url}
                width="100%"
                height={content.height || '400px'}
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={content.marker_title || 'Location map'}
              />
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-300">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-terracotta-red rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-deep-teal mb-2">
                    {content.marker_title || 'Our Location'}
                  </h3>
                  <p className="text-gray-600 mb-3">
                    {content.address}
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-terracotta-red text-white rounded-lg font-semibold text-sm">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    Open in Google Maps
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
