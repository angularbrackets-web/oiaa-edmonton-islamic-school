'use client'

import { useState, useRef } from 'react'
import { PhotoIcon, TrashIcon } from '@heroicons/react/24/outline'
import Avatar from './Avatar'

interface ImageUploadProps {
  currentImage?: string
  onImageChange: (imageUrl: string | null) => void
  name: string
  disabled?: boolean
  folder?: string
}

export default function ImageUpload({ 
  currentImage, 
  onImageChange, 
  name, 
  disabled = false,
  folder = 'faculty'
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const uploadImage = async (file: File): Promise<string | null> => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)
      formData.append('alt', `${name} profile photo`)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
        return result.url
      } else {
        throw new Error('Upload failed')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      return null
    } finally {
      setUploading(false)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Please select an image smaller than 5MB')
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Upload image
    const imageUrl = await uploadImage(file)
    if (imageUrl) {
      onImageChange(imageUrl)
    } else {
      // Reset preview on upload failure
      setPreview(currentImage || null)
      alert('Failed to upload image. Please try again.')
    }
  }

  const handleRemoveImage = () => {
    setPreview(null)
    onImageChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClickUpload = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      <label className="block text-deep-teal font-semibold mb-2">Profile Photo</label>
      
      {/* Current Image/Preview */}
      <div className="flex items-center gap-4">
        <Avatar 
          src={preview || undefined}
          name={name}
          alt={`${name} profile photo`}
          size="xl"
        />
        
        <div className="flex-1">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleClickUpload}
              disabled={disabled || uploading}
              className="flex items-center gap-2 bg-sage-green hover:bg-sage-green-dark text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PhotoIcon className="w-5 h-5" />
              {uploading ? 'Uploading...' : preview ? 'Change Photo' : 'Upload Photo'}
            </button>
            
            {preview && (
              <button
                type="button"
                onClick={handleRemoveImage}
                disabled={disabled || uploading}
                className="flex items-center gap-2 bg-terracotta-red hover:bg-terracotta-red-dark text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <TrashIcon className="w-5 h-5" />
                Remove
              </button>
            )}
          </div>
          
          <p className="text-sm text-deep-teal/60 mt-2">
            Recommended: Square image, at least 200x200px, max 5MB
          </p>
          
          {uploading && (
            <div className="mt-2">
              <div className="w-full bg-soft-beige rounded-full h-2">
                <div className="bg-sage-green h-2 rounded-full animate-pulse w-1/3"></div>
              </div>
              <p className="text-sm text-sage-green mt-1">Uploading image...</p>
            </div>
          )}
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || uploading}
      />
      
      {/* Manual URL Input (fallback) */}
      <div>
        <label className="block text-sm text-deep-teal/80 mb-1">Or enter image URL manually:</label>
        <input
          type="url"
          value={preview || ''}
          onChange={(e) => {
            setPreview(e.target.value)
            onImageChange(e.target.value || null)
          }}
          placeholder="https://example.com/photo.jpg"
          disabled={disabled}
          className="w-full p-2 border border-soft-beige rounded text-sm focus:ring-2 focus:ring-sage-green disabled:opacity-50"
        />
      </div>
    </div>
  )
}