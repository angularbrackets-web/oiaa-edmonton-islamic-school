'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import CloudinaryUploadWidget from '@/components/admin/CloudinaryUploadWidget'
import { MagnifyingGlassIcon, TrashIcon, PhotoIcon, VideoCameraIcon, DocumentIcon } from '@heroicons/react/24/outline'

interface MediaFile {
  id: string
  filename: string
  url: string
  type: 'image' | 'video' | 'document'
  size_bytes: number
  width?: number
  height?: number
  usage_count: number
  uploaded_at: string
}

export default function MediaLibraryPage() {
  const [media, setMedia] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    loadMedia()
  }, [typeFilter])

  const loadMedia = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (typeFilter !== 'all') params.append('type', typeFilter)
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
      await fetch('/api/media', {
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
      loadMedia()
    } catch (error) {
      console.error('Error saving media:', error)
    }
  }

  const handleDelete = async (id: string, usageCount: number) => {
    if (usageCount > 0) {
      alert(`Cannot delete media that is in use (${usageCount} usage(s))`)
      return
    }

    if (!confirm('Delete this media file?')) return

    setDeleting(id)
    try {
      const response = await fetch(`/api/media/${id}`, { method: 'DELETE' })
      const data = await response.json()
      if (data.success) {
        loadMedia()
      } else {
        alert(data.error || 'Failed to delete media')
      }
    } catch (error) {
      alert('Failed to delete media')
    } finally {
      setDeleting(null)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const filteredMedia = media.filter(m =>
    m.filename.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AdminLayout title="Media Library">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-deep-teal mb-2">Media Library</h1>
          <p className="text-gray-600">Manage images, videos, and documents</p>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-soft-beige p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 w-full md:max-w-md">
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

            {/* Filters */}
            <div className="flex gap-2">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red"
              >
                <option value="all">All Types</option>
                <option value="image">Images</option>
                <option value="video">Videos</option>
                <option value="document">Documents</option>
              </select>

              {/* Upload */}
              <CloudinaryUploadWidget
                onSuccess={handleUploadSuccess}
                folder="media"
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-soft-beige p-4">
            <div className="text-2xl font-bold text-terracotta-red">{media.length}</div>
            <div className="text-sm text-gray-600">Total Files</div>
          </div>
          <div className="bg-white rounded-lg border border-soft-beige p-4">
            <div className="text-2xl font-bold text-blue-600">{media.filter(m => m.type === 'image').length}</div>
            <div className="text-sm text-gray-600">Images</div>
          </div>
          <div className="bg-white rounded-lg border border-soft-beige p-4">
            <div className="text-2xl font-bold text-purple-600">{media.filter(m => m.type === 'video').length}</div>
            <div className="text-sm text-gray-600">Videos</div>
          </div>
          <div className="bg-white rounded-lg border border-soft-beige p-4">
            <div className="text-2xl font-bold text-green-600">
              {formatFileSize(media.reduce((sum, m) => sum + m.size_bytes, 0))}
            </div>
            <div className="text-sm text-gray-600">Total Size</div>
          </div>
        </div>

        {/* Media Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-terracotta-red border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredMedia.length === 0 ? (
          <div className="bg-soft-beige-lightest rounded-lg p-12 text-center">
            <PhotoIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No media files found</p>
            <CloudinaryUploadWidget onSuccess={handleUploadSuccess} folder="media" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredMedia.map((file) => (
              <div key={file.id} className="bg-white rounded-lg border border-soft-beige overflow-hidden group hover:shadow-lg transition-shadow">
                {/* Thumbnail */}
                <div className="aspect-square bg-soft-beige-lightest flex items-center justify-center relative">
                  {file.type === 'image' ? (
                    <img src={file.url} alt={file.filename} className="w-full h-full object-cover" />
                  ) : file.type === 'video' ? (
                    <VideoCameraIcon className="w-12 h-12 text-gray-400" />
                  ) : (
                    <DocumentIcon className="w-12 h-12 text-gray-400" />
                  )}

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(file.id, file.usage_count)}
                    disabled={deleting === file.id}
                    className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 disabled:opacity-50"
                    title={file.usage_count > 0 ? `In use (${file.usage_count})` : 'Delete'}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className="text-sm font-medium text-deep-teal truncate" title={file.filename}>
                    {file.filename}
                  </p>
                  <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                    <span>{formatFileSize(file.size_bytes)}</span>
                    {file.width && file.height && (
                      <span>{file.width}×{file.height}</span>
                    )}
                  </div>
                  {file.usage_count > 0 && (
                    <div className="mt-2 text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                      Used {file.usage_count}×
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
