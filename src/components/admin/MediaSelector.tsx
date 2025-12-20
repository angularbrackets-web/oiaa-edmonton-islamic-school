'use client'

import { useState } from 'react'
import { PhotoIcon, VideoCameraIcon, TrashIcon } from '@heroicons/react/24/outline'
import CloudinaryUploadWidget from './CloudinaryUploadWidget'
import MediaPicker from './MediaPicker'
import Image from 'next/image'

interface MediaSelectorProps {
  value: string // Current media URL
  onChange: (url: string) => void
  type?: 'image' | 'video' | 'both' // Type of media to allow
  folder?: string // Cloudinary folder for uploads
  label?: string // Label for the field
  compact?: boolean // Use compact mode (for cards, etc.)
  showPreview?: boolean // Show preview of selected media
}

export default function MediaSelector({
  value,
  onChange,
  type = 'image',
  folder = 'cms/pages',
  label = 'Media',
  compact = false,
  showPreview = true
}: MediaSelectorProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'existing'>('upload')
  const [showMediaPicker, setShowMediaPicker] = useState(false)
  const [showSelectionUI, setShowSelectionUI] = useState(false)

  const handleUploadSuccess = (result: {
    secure_url: string
    public_id: string
    width?: number
    height?: number
    format?: string
  }) => {
    onChange(result.secure_url)
    setShowSelectionUI(false)
  }

  const handleUploadError = (error: any) => {
    console.error('Upload error:', error)
  }

  const handleMediaSelect = (media: any) => {
    onChange(media.url)
    setShowMediaPicker(false)
    setShowSelectionUI(false)
  }

  const handleRemove = () => {
    onChange('')
  }

  const isVideo = value && (
    value.includes('.mp4') ||
    value.includes('.webm') ||
    value.includes('.mov') ||
    value.includes('video')
  )

  const Icon = type === 'video' ? VideoCameraIcon : PhotoIcon
  const mediaType = type === 'both' ? 'all' : type

  return (
    <div className="space-y-3">
      {/* Label */}
      {label && !compact && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {/* Tabs - Show when selecting or no media */}
      {(!value || showSelectionUI) && (
        <div className={`flex gap-2 ${compact ? 'mb-2' : 'mb-3'}`}>
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`${compact ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'} rounded-lg font-medium transition-colors ${
              activeTab === 'upload'
                ? 'bg-terracotta-red text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Upload New
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('existing')}
            className={`${compact ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'} rounded-lg font-medium transition-colors ${
              activeTab === 'existing'
                ? 'bg-terracotta-red text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Choose Existing
          </button>
          {value && showSelectionUI && (
            <button
              type="button"
              onClick={() => setShowSelectionUI(false)}
              className={`${compact ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'} rounded-lg font-medium transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200 ml-auto`}
            >
              Cancel
            </button>
          )}
        </div>
      )}

      {/* Preview or Upload Area */}
      {value && showPreview && !showSelectionUI ? (
        // Show Preview Only
        <div className="space-y-2">
          <div className={`relative group ${compact ? 'w-full h-32' : 'w-full max-w-md h-48'} bg-gray-100 rounded-lg overflow-hidden`}>
            {isVideo ? (
              <video
                src={value}
                controls
                className="w-full h-full object-cover"
              />
            ) : (
              <Image
                src={value}
                alt="Preview"
                fill
                className="object-cover"
                sizes={compact ? "200px" : "400px"}
              />
            )}
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>

          {!compact && (
            <button
              type="button"
              onClick={() => setShowSelectionUI(true)}
              className="w-full px-3 py-2 text-sm bg-deep-teal text-white rounded-lg hover:bg-deep-teal-dark transition-colors"
            >
              Change Image
            </button>
          )}
        </div>
      ) : (!value || showSelectionUI) && activeTab === 'upload' ? (
        // Upload UI
        <CloudinaryUploadWidget
          onSuccess={handleUploadSuccess}
          onError={handleUploadError}
          folder={folder}
          buttonText={`Upload ${type === 'video' ? 'Video' : 'Image'}`}
          accept={type === 'video' ? 'video/*' : type === 'both' ? 'image/*,video/*' : 'image/*'}
        />
      ) : (
        // Choose Existing UI
        <div className={`border-2 border-dashed border-gray-300 rounded-lg ${compact ? 'p-4' : 'p-6'} text-center hover:border-terracotta-red transition-colors`}>
          <Icon className={`${compact ? 'w-6 h-6' : 'w-10 h-10'} mx-auto text-gray-400 mb-2`} />
          <p className={`text-gray-600 mb-3 ${compact ? 'text-xs' : 'text-sm'}`}>
            No {type === 'video' ? 'video' : type === 'both' ? 'media' : 'image'} selected
          </p>
          <button
            type="button"
            onClick={() => setShowMediaPicker(true)}
            className={`inline-flex items-center gap-2 px-4 py-2 bg-terracotta-red text-white rounded-lg hover:bg-terracotta-red-dark transition-colors ${compact ? 'text-xs' : 'text-sm'}`}
          >
            <Icon className="w-4 h-4" />
            Browse Library
          </button>
        </div>
      )}

      {/* Compact mode - Change button when media exists */}
      {value && compact && !showSelectionUI && (
        <button
          type="button"
          onClick={() => setShowSelectionUI(true)}
          className="w-full px-2 py-1.5 text-xs bg-deep-teal text-white rounded hover:bg-deep-teal-dark transition-colors"
        >
          Change
        </button>
      )}

      {/* Media Picker Modal */}
      <MediaPicker
        isOpen={showMediaPicker}
        onClose={() => setShowMediaPicker(false)}
        onSelect={handleMediaSelect}
        fileType={mediaType}
        title={`Select ${type === 'video' ? 'Video' : type === 'both' ? 'Media' : 'Image'}`}
      />
    </div>
  )
}
