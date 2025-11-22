'use client'

import { useState, useEffect, useCallback } from 'react'
import { MagnifyingGlassIcon, TrashIcon, PhotoIcon, VideoCameraIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import toast from 'react-hot-toast'

interface MediaItem {
  id: string
  url: string
  alt: string | null
  public_id: string
  folder: string | null
  file_type: string
  created_at: string
}

interface MediaLibraryProps {
  onSelect?: (media: MediaItem) => void
  selectedId?: string
  fileType?: 'image' | 'video' | 'all'
  selectable?: boolean
}

export default function MediaLibrary({
  onSelect,
  selectedId,
  fileType = 'all',
  selectable = true
}: MediaLibraryProps) {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [type, setType] = useState<string>(fileType)
  const [sort, setSort] = useState('newest')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  const fetchMedia = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        search,
        type,
        sort
      })

      const response = await fetch(`/api/media?${params}`)
      if (!response.ok) throw new Error('Failed to fetch media')

      const data = await response.json()
      setMedia(data.media)
      setTotalPages(data.pagination.totalPages)
      setTotal(data.pagination.total)
    } catch (error) {
      console.error('Error fetching media:', error)
      toast.error('Failed to load media')
    } finally {
      setLoading(false)
    }
  }, [page, search, type, sort])

  useEffect(() => {
    fetchMedia()
  }, [fetchMedia])

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1) // Reset to page 1 on search
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  const handleDelete = async (id: string, publicId: string) => {
    if (!confirm('Are you sure you want to delete this media? This cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/media/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete media')

      toast.success('Media deleted successfully')
      fetchMedia() // Refresh the list
    } catch (error) {
      console.error('Error deleting media:', error)
      toast.error('Failed to delete media')
    }
  }

  const handleSelect = (item: MediaItem) => {
    if (selectable && onSelect) {
      onSelect(item)
    }
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search media..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
          />
        </div>

        {/* Type Filter */}
        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value)
            setPage(1)
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
        >
          <option value="all">All Types</option>
          <option value="image">Images Only</option>
          <option value="video">Videos Only</option>
        </select>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value)
            setPage(1)
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        {loading ? 'Loading...' : `${total} ${total === 1 ? 'item' : 'items'} found`}
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : media.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <PhotoIcon className="w-12 h-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-600">No media found</p>
          <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {media.map((item) => (
            <div
              key={item.id}
              className={`group relative aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-all ${
                selectedId === item.id
                  ? 'border-terracotta-red ring-2 ring-terracotta-red'
                  : 'border-transparent hover:border-deep-teal'
              } ${selectable ? 'cursor-pointer' : ''}`}
              onClick={() => handleSelect(item)}
            >
              {/* Media Content */}
              {item.file_type === 'video' ? (
                <div className="relative w-full h-full bg-gray-900 flex items-center justify-center">
                  <VideoCameraIcon className="w-12 h-12 text-white/50" />
                  <video
                    src={item.url}
                    className="absolute inset-0 w-full h-full object-cover opacity-50"
                  />
                </div>
              ) : (
                <Image
                  src={item.url}
                  alt={item.alt || 'Media'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                />
              )}

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2">
                <p className="text-white text-xs text-center mb-2 line-clamp-2">
                  {item.alt || item.public_id.split('/').pop()}
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(item.id, item.public_id)
                  }}
                  className="p-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  title="Delete media"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Selected Indicator */}
              {selectedId === item.id && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-terracotta-red rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
