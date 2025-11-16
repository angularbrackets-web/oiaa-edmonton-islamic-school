'use client'

import { useState } from 'react'
import { ReusableComponent, COMPONENT_CATEGORIES } from '@/types/cms'
import { XMarkIcon } from '@heroicons/react/24/outline'
import CloudinaryUploadWidget from './CloudinaryUploadWidget'

interface EditComponentModalProps {
  component: ReusableComponent
  onClose: () => void
  onUpdated: (component: ReusableComponent) => void
}

export default function EditComponentModal({
  component,
  onClose,
  onUpdated
}: EditComponentModalProps) {
  const [name, setName] = useState(component.name)
  const [description, setDescription] = useState(component.description || '')
  const [category, setCategory] = useState(component.category)
  const [thumbnailUrl, setThumbnailUrl] = useState(component.thumbnail_url || '')
  const [tags, setTags] = useState(component.tags?.join(', ') || '')
  const [isActive, setIsActive] = useState(component.is_active)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setUpdating(true)

    try {
      if (!name.trim()) {
        setError('Component name is required')
        setUpdating(false)
        return
      }

      const tagsArray = tags
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0)

      const response = await fetch(`/api/components/${component.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
          category,
          thumbnail_url: thumbnailUrl || null,
          tags: tagsArray.length > 0 ? tagsArray : null,
          is_active: isActive
        })
      })

      const data = await response.json()

      if (data.success) {
        onUpdated(data.data)
      } else {
        setError(data.error || 'Failed to update component')
      }
    } catch (err) {
      setError('Failed to update component')
      console.error('Error updating component:', err)
    } finally {
      setUpdating(false)
    }
  }

  const handleUploadSuccess = (result: {
    secure_url: string
    public_id: string
    width?: number
    height?: number
    format?: string
  }) => {
    setThumbnailUrl(result.secure_url)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000] p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-soft-beige px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-terracotta-red">Edit Component</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-soft-beige-lightest rounded-lg transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-deep-teal" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Usage Warning */}
          {component.usage_count > 0 && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg">
              <p className="font-semibold mb-1">⚠️ Component in use</p>
              <p className="text-sm">
                This component is used in {component.usage_count} place(s). Changes to blocks will update all instances.
              </p>
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-deep-teal mb-2">
              Component Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-soft-beige rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-deep-teal mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-soft-beige rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent outline-none resize-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-deep-teal mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-soft-beige rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent outline-none"
            >
              {Object.entries(COMPONENT_CATEGORIES).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block text-sm font-semibold text-deep-teal mb-2">
              Thumbnail
            </label>
            {thumbnailUrl ? (
              <div className="relative">
                <img
                  src={thumbnailUrl}
                  alt="Thumbnail"
                  className="w-full h-40 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setThumbnailUrl('')}
                  className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <CloudinaryUploadWidget
                onSuccess={handleUploadSuccess}
                folder="components"
              />
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-deep-teal mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-4 py-2 border border-soft-beige rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent outline-none"
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_active"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 text-terracotta-red border-soft-beige rounded focus:ring-terracotta-red"
            />
            <label htmlFor="is_active" className="text-sm font-semibold text-deep-teal">
              Component is active (can be used in pages)
            </label>
          </div>

          {/* Blocks Preview */}
          <div>
            <label className="block text-sm font-semibold text-deep-teal mb-2">
              Blocks ({component.blocks_config.length})
            </label>
            <div className="bg-soft-beige-lightest rounded-lg p-4 space-y-2">
              {component.blocks_config.map((block, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-sm text-deep-teal"
                >
                  <span className="w-6 h-6 bg-terracotta-red text-white rounded flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </span>
                  <span className="capitalize">{block.block_type.replace('_', ' ')}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-deep-teal/60 mt-2">
              Note: Block content cannot be edited here. Edit blocks in the source page to update this component.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-soft-beige">
            <button
              type="button"
              onClick={onClose}
              disabled={updating}
              className="px-6 py-2 border border-soft-beige rounded-lg hover:bg-soft-beige-lightest transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updating}
              className="px-6 py-2 bg-terracotta-red text-white rounded-lg hover:bg-terracotta-red/90 transition-colors disabled:opacity-50"
            >
              {updating ? 'Updating...' : 'Update Component'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
