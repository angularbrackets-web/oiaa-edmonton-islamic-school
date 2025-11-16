'use client'

import { useState } from 'react'
import { ImageBlockContent } from '@/types/cms'
import CloudinaryUploadWidget from '../CloudinaryUploadWidget'
import MediaPicker from '../MediaPicker'
import { PhotoIcon, TrashIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'

interface ImageBlockEditorProps {
  content: ImageBlockContent
  onChange: (content: ImageBlockContent) => void
}

export default function ImageBlockEditor({ content, onChange }: ImageBlockEditorProps) {
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [showMediaPicker, setShowMediaPicker] = useState(false)

  const handleUploadSuccess = (result: {
    secure_url: string
    public_id: string
    width?: number
    height?: number
    format?: string
  }) => {
    setIsUploading(false)
    setUploadError(null)
    onChange({
      ...content,
      url: result.secure_url,
      width: result.width,
      height: result.height,
      media_id: result.public_id
    })
  }

  const handleUploadError = (error: any) => {
    setIsUploading(false)
    setUploadError('Failed to upload image. Please try again.')
    console.error('Upload error:', error)
  }

  const handleRemoveImage = () => {
    onChange({
      ...content,
      url: '',
      width: undefined,
      height: undefined,
      media_id: undefined
    })
  }

  const handleMediaSelect = (media: any) => {
    onChange({
      ...content,
      url: media.url,
      width: media.width,
      height: media.height,
      media_id: media.id
    })
    setShowMediaPicker(false)
  }

  return (
    <div className="space-y-4">
      {/* Media Picker Modal */}
      {showMediaPicker && (
        <MediaPicker
          onSelect={handleMediaSelect}
          onClose={() => setShowMediaPicker(false)}
          type="image"
          title="Select Image from Library"
        />
      )}
      {/* Image Upload/Preview Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Image
        </label>

        {content.url ? (
          // Image Preview
          <div className="space-y-3">
            <div className="relative group">
              <div className="relative w-full max-w-md h-64 bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={content.url}
                  alt={content.alt || 'Preview'}
                  fill
                  className="object-contain"
                />
              </div>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                title="Remove image"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>

            {content.width && content.height && (
              <p className="text-sm text-gray-600">
                Dimensions: {content.width} × {content.height}px
              </p>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowMediaPicker(true)}
                className="px-4 py-2 bg-deep-teal text-white rounded-lg hover:bg-deep-teal/90 transition-colors"
              >
                Browse Library
              </button>
              <CloudinaryUploadWidget
                onSuccess={handleUploadSuccess}
                onError={handleUploadError}
                folder="cms/pages"
                buttonText="Replace Image"
                buttonClassName="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
              />
            </div>
          </div>
        ) : (
          // Upload Button
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-terracotta-red transition-colors">
            <PhotoIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">No image selected</p>
            <div className="flex gap-2 justify-center">
              <button
                type="button"
                onClick={() => setShowMediaPicker(true)}
                className="px-4 py-2 bg-deep-teal text-white rounded-lg hover:bg-deep-teal/90 transition-colors"
              >
                Browse Library
              </button>
              <CloudinaryUploadWidget
                onSuccess={handleUploadSuccess}
                onError={handleUploadError}
                folder="cms/pages"
              />
            </div>
            {isUploading && (
              <p className="mt-2 text-sm text-deep-teal">Uploading...</p>
            )}
          </div>
        )}

        {uploadError && (
          <p className="mt-2 text-sm text-red-600">{uploadError}</p>
        )}
      </div>

      {/* Alternative: Manual URL Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Or Enter Image URL
        </label>
        <input
          type="text"
          value={content.url || ''}
          onChange={(e) => onChange({ ...content, url: e.target.value })}
          placeholder="https://example.com/image.jpg"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
        />
      </div>

      {/* Alt Text */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Alt Text <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={content.alt || ''}
          onChange={(e) => onChange({ ...content, alt: e.target.value })}
          placeholder="Describe the image for accessibility"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
        />
        <p className="mt-1 text-xs text-gray-500">
          Important for accessibility and SEO
        </p>
      </div>

      {/* Caption */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Caption (optional)
        </label>
        <input
          type="text"
          value={content.caption || ''}
          onChange={(e) => onChange({ ...content, caption: e.target.value })}
          placeholder="Add a caption to display below the image"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
        />
      </div>

      {/* Alignment */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Alignment
        </label>
        <div className="flex gap-2">
          {(['left', 'center', 'right', 'full'] as const).map((align) => (
            <button
              key={align}
              type="button"
              onClick={() => onChange({ ...content, alignment: align })}
              className={`px-4 py-2 border rounded-lg transition-colors capitalize ${
                content.alignment === align
                  ? 'border-terracotta-red bg-terracotta-red/10 text-terracotta-red'
                  : 'border-gray-300 hover:border-terracotta-red'
              }`}
            >
              {align}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
