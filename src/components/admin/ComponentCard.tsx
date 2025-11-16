'use client'

import { useState } from 'react'
import { ReusableComponent, COMPONENT_CATEGORY_COLORS } from '@/types/cms'
import {
  PencilIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline'

interface ComponentCardProps {
  component: ReusableComponent
  onEdit: (component: ReusableComponent) => void
  onDelete: (id: string) => void
}

export default function ComponentCard({ component, onEdit, onDelete }: ComponentCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [duplicating, setDuplicating] = useState(false)
  const [toggling, setToggling] = useState(false)

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const response = await fetch(`/api/components/${component.id}`, {
        method: 'DELETE'
      })
      const data = await response.json()

      if (data.success) {
        onDelete(component.id)
      } else {
        alert(data.error || 'Failed to delete component')
      }
    } catch (error) {
      alert('Failed to delete component')
      console.error('Error deleting component:', error)
    } finally {
      setDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  const handleDuplicate = async () => {
    setDuplicating(true)
    try {
      // Create a copy
      const response = await fetch('/api/components', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${component.name} (Copy)`,
          description: component.description,
          category: component.category,
          blocks_config: component.blocks_config,
          thumbnail_url: component.thumbnail_url,
          tags: component.tags,
          is_active: false
        })
      })

      const data = await response.json()
      if (data.success) {
        window.location.reload() // Refresh to show new component
      } else {
        alert(data.error || 'Failed to duplicate component')
      }
    } catch (error) {
      alert('Failed to duplicate component')
      console.error('Error duplicating component:', error)
    } finally {
      setDuplicating(false)
    }
  }

  const handleToggleActive = async () => {
    setToggling(true)
    try {
      const response = await fetch(`/api/components/${component.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_active: !component.is_active
        })
      })

      const data = await response.json()
      if (data.success) {
        window.location.reload() // Refresh to update status
      } else {
        alert(data.error || 'Failed to update component')
      }
    } catch (error) {
      alert('Failed to update component')
      console.error('Error updating component:', error)
    } finally {
      setToggling(false)
    }
  }

  const categoryColorClass = COMPONENT_CATEGORY_COLORS[component.category as keyof typeof COMPONENT_CATEGORY_COLORS] || 'bg-gray-100 text-gray-800'

  return (
    <div className="bg-white rounded-lg shadow-sm border border-soft-beige overflow-hidden hover:shadow-md transition-shadow">
      {/* Thumbnail */}
      <div className="h-40 bg-soft-beige-lightest flex items-center justify-center relative">
        {component.thumbnail_url ? (
          <img
            src={component.thumbnail_url}
            alt={component.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-6xl">📦</div>
        )}

        {/* Active/Inactive Badge */}
        <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium ${
          component.is_active
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-600'
        }`}>
          {component.is_active ? 'Active' : 'Inactive'}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category Badge */}
        <div className={`inline-block px-2 py-1 rounded text-xs font-medium mb-2 ${categoryColorClass}`}>
          {component.category}
        </div>

        {/* Name */}
        <h3 className="font-semibold text-lg text-deep-teal mb-1 truncate">
          {component.name}
        </h3>

        {/* Description */}
        {component.description && (
          <p className="text-sm text-deep-teal/70 mb-3 line-clamp-2">
            {component.description}
          </p>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-deep-teal/60 mb-4">
          <div>
            <span className="font-medium">{component.blocks_config.length}</span> blocks
          </div>
          <div>
            <span className="font-medium">{component.usage_count}</span> uses
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(component)}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-terracotta-red text-white rounded hover:bg-terracotta-red/90 transition-colors text-sm"
          >
            <PencilIcon className="w-4 h-4" />
            Edit
          </button>

          <button
            onClick={handleDuplicate}
            disabled={duplicating}
            className="p-2 border border-soft-beige rounded hover:bg-soft-beige-lightest transition-colors"
            title="Duplicate"
          >
            <DocumentDuplicateIcon className="w-4 h-4 text-deep-teal" />
          </button>

          <button
            onClick={handleToggleActive}
            disabled={toggling}
            className="p-2 border border-soft-beige rounded hover:bg-soft-beige-lightest transition-colors"
            title={component.is_active ? 'Deactivate' : 'Activate'}
          >
            {component.is_active ? (
              <EyeSlashIcon className="w-4 h-4 text-deep-teal" />
            ) : (
              <EyeIcon className="w-4 h-4 text-deep-teal" />
            )}
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 border border-red-200 rounded hover:bg-red-50 transition-colors"
            title="Delete"
          >
            <TrashIcon className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-deep-teal mb-2">Delete Component?</h3>
            <p className="text-deep-teal/70 mb-1">
              Are you sure you want to delete "{component.name}"?
            </p>
            {component.usage_count > 0 && (
              <p className="text-red-600 text-sm mb-4">
                ⚠️ This component is used in {component.usage_count} place(s). All instances will be removed.
              </p>
            )}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="px-4 py-2 border border-soft-beige rounded hover:bg-soft-beige-lightest transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
