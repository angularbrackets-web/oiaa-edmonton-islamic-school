'use client'

import { useState, useEffect } from 'react'
import { XMarkIcon, MagnifyingGlassIcon, PhotoIcon } from '@heroicons/react/24/outline'
import CloudinaryUploadWidget from './CloudinaryUploadWidget'

interface MediaFile {
  id: string
  filename: string
  url: string
  type: 'image' | 'video' | 'document'
  width?: number
  height?: number
}

interface MediaPickerProps {
  onSelect: (media: MediaFile) => void
  onClose: () => void
  type?: 'image' | 'video' | 'all'
  title?: string
}

export default function MediaPicker({
  onSelect,
  onClose,
  type = 'all',
  title = 'Select Media'
}: MediaPickerProps) {
  const [media, setMedia] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadMedia()
  }, [type])

  const loadMedia = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (type !== 'all') params.append('type', type)
      if (search) params.append('search', search)

      const response = await fetch(`/api/media?${params}`)
      const data = await response.json()
      if (data.success) {
        setMedia(data.data || [])
      }
    } catch (error) {
      console.error('Error loading media:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUploadSuccess = async (result: any) => {
    // Save to media library
    try {
      const response = await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: result.public_id,
          original_filename: result.original_filename || result.public_id,
          url: result.secure_url,
          type: result.resource_type === 'video' ? 'video' : 'image',
          mime_type: result.format,
          size_bytes: result.bytes,
          width: result.width,
          height: result.height,
          folder: result.folder || 'uploads'
        })
      })

      const data = await response.json()
      if (data.success) {
        // Automatically select the newly uploaded file
        onSelect(data.data)
      }
    } catch (error) {
      console.error('Error saving media:', error)
    }
  }

  const filteredMedia = media.filter(m =>
    m.filename.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000] p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-soft-beige px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-terracotta-red">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-soft-beige-lightest rounded-lg transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-deep-teal" />
          </button>
        </div>

        {/* Search & Upload */}
        <div className="px-6 py-4 border-b border-soft-beige">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyUp={(e) => e.key === 'Enter' && loadMedia()}
                placeholder="Search media..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
              />
            </div>
            <CloudinaryUploadWidget
              onSuccess={handleUploadSuccess}
              folder="media"
            />
          </div>
        </div>

        {/* Media Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-terracotta-red border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="bg-soft-beige-lightest rounded-lg p-12 text-center">
              <PhotoIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No media files found</p>
              <p className="text-sm text-gray-500">Upload a file to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredMedia.map((file) => (
                <button
                  key={file.id}
                  onClick={() => onSelect(file)}
                  className="bg-white rounded-lg border-2 border-soft-beige overflow-hidden hover:border-terracotta-red hover:shadow-lg transition-all text-left"
                >
                  {/* Thumbnail */}
                  <div className="aspect-square bg-soft-beige-lightest flex items-center justify-center">
                    <img src={file.url} alt={file.filename} className="w-full h-full object-cover" />
                  </div>

                  {/* Info */}
                  <div className="p-2">
                    <p className="text-xs text-deep-teal truncate" title={file.filename}>
                      {file.filename}
                    </p>
                    {file.width && file.height && (
                      <p className="text-xs text-gray-500 mt-1">
                        {file.width}×{file.height}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
