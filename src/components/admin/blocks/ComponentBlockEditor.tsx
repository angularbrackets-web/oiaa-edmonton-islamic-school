'use client'

import { useState, useEffect } from 'react'
import { ComponentBlockContent, ReusableComponent } from '@/types/cms'
import { CubeIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

interface ComponentBlockEditorProps {
  content: ComponentBlockContent
  onChange: (content: ComponentBlockContent) => void
}

export default function ComponentBlockEditor({
  content,
  onChange
}: ComponentBlockEditorProps) {
  const [components, setComponents] = useState<ReusableComponent[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedComponent, setSelectedComponent] = useState<ReusableComponent | null>(null)

  useEffect(() => {
    loadComponents()
  }, [])

  useEffect(() => {
    // Load selected component details when component_id changes
    if (content.component_id && components.length > 0) {
      const component = components.find(c => c.id === content.component_id)
      setSelectedComponent(component || null)
    }
  }, [content.component_id, components])

  const loadComponents = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/components?active=true')
      const data = await response.json()
      if (data.success) {
        setComponents(data.data || [])
      }
    } catch (error) {
      console.error('Error loading components:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleComponentSelect = (componentId: string) => {
    onChange({
      ...content,
      component_id: componentId
    })
  }

  const handleToggleName = () => {
    onChange({
      ...content,
      show_name: !content.show_name
    })
  }

  return (
    <div className="space-y-4">
      {/* Info Banner */}
      <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r">
        <div className="flex items-start">
          <CubeIcon className="w-5 h-5 text-purple-500 mr-2 mt-0.5" />
          <div className="text-sm text-purple-800">
            <p className="font-medium">Component Block</p>
            <p className="mt-1">This block will display a reusable component from your library. Select a component below.</p>
          </div>
        </div>
      </div>

      {/* Component Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Component *
        </label>
        {loading ? (
          <div className="flex items-center justify-center py-8 text-gray-500">
            <div className="w-6 h-6 border-2 border-terracotta-red border-t-transparent rounded-full animate-spin mr-2"></div>
            Loading components...
          </div>
        ) : components.length === 0 ? (
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <CubeIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600 font-medium">No components found</p>
            <p className="text-sm text-gray-500 mt-1">
              Create a component in the Component Library to use it here.
            </p>
          </div>
        ) : (
          <select
            value={content.component_id || ''}
            onChange={(e) => handleComponentSelect(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
            required
          >
            <option value="">-- Select a component --</option>
            {components.map(component => (
              <option key={component.id} value={component.id}>
                {component.name} ({component.blocks_config.length} block{component.blocks_config.length !== 1 ? 's' : ''})
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Show Name Toggle */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={content.show_name ?? false}
            onChange={handleToggleName}
            className="w-5 h-5 text-terracotta-red rounded focus:ring-2 focus:ring-terracotta-red"
          />
          <span className="text-sm font-medium text-gray-700">
            Show component name
          </span>
        </label>
        <p className="text-xs text-gray-500 mt-1 ml-8">
          Display the component name above the embedded content
        </p>
      </div>

      {/* Selected Component Preview */}
      {selectedComponent && (
        <div className="bg-white border-2 border-purple-500/20 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <CubeIcon className="w-5 h-5 text-purple-500" />
                <h3 className="font-semibold text-deep-teal">{selectedComponent.name}</h3>
              </div>
              {selectedComponent.description && (
                <p className="text-sm text-gray-600 mt-2">
                  {selectedComponent.description}
                </p>
              )}
              <div className="mt-3 flex items-center gap-3 text-xs text-gray-600">
                <span className="bg-soft-beige px-2 py-1 rounded">
                  {selectedComponent.blocks_config.length} block{selectedComponent.blocks_config.length !== 1 ? 's' : ''}
                </span>
                <span className="bg-soft-beige px-2 py-1 rounded capitalize">
                  {selectedComponent.category}
                </span>
                {selectedComponent.usage_count > 0 && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                    Used {selectedComponent.usage_count}x
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 ml-4">
              {selectedComponent.is_active ? (
                <span className="flex items-center gap-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  <EyeIcon className="w-3 h-3" />
                  Active
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                  <EyeSlashIcon className="w-3 h-3" />
                  Inactive
                </span>
              )}
            </div>
          </div>

          {/* Thumbnail Preview */}
          {selectedComponent.thumbnail_url && (
            <div className="mt-4">
              <img
                src={selectedComponent.thumbnail_url}
                alt={selectedComponent.name}
                className="w-full h-32 object-cover rounded-lg border border-gray-200"
              />
            </div>
          )}
        </div>
      )}

      {/* Help Text */}
      <div className="bg-gray-50 border-l-4 border-gray-400 p-4 rounded-r">
        <p className="text-sm text-gray-700">
          <strong>Note:</strong> The component's blocks will be displayed here.
          Any changes to the source component will automatically reflect wherever it's used.
        </p>
      </div>
    </div>
  )
}
