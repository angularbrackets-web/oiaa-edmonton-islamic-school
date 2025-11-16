'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import ComponentGrid from '@/components/admin/ComponentGrid'
import ComponentSearch from '@/components/admin/ComponentSearch'
import CreateComponentModal from '@/components/admin/CreateComponentModal'
import { ReusableComponent } from '@/types/cms'
import { PlusIcon } from '@heroicons/react/24/outline'

export default function ComponentsLibraryPage() {
  const [components, setComponents] = useState<ReusableComponent[]>([])
  const [filteredComponents, setFilteredComponents] = useState<ReusableComponent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  // Load components on mount
  useEffect(() => {
    loadComponents()
  }, [])

  const loadComponents = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/components')
      const data = await response.json()

      if (data.success) {
        setComponents(data.data)
        setFilteredComponents(data.data)
      } else {
        setError(data.error || 'Failed to load components')
      }
    } catch (err) {
      setError('Failed to load components')
      console.error('Error loading components:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (searchQuery: string, category: string) => {
    let filtered = components

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(comp =>
        comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by category
    if (category && category !== 'all') {
      filtered = filtered.filter(comp => comp.category === category)
    }

    setFilteredComponents(filtered)
  }

  const handleComponentCreated = (newComponent: ReusableComponent) => {
    setComponents([newComponent, ...components])
    setFilteredComponents([newComponent, ...filteredComponents])
    setShowCreateModal(false)
  }

  const handleComponentDeleted = (id: string) => {
    setComponents(components.filter(c => c.id !== id))
    setFilteredComponents(filteredComponents.filter(c => c.id !== id))
  }

  const handleComponentUpdated = (updatedComponent: ReusableComponent) => {
    setComponents(components.map(c => c.id === updatedComponent.id ? updatedComponent : c))
    setFilteredComponents(filteredComponents.map(c => c.id === updatedComponent.id ? updatedComponent : c))
  }

  return (
    <AdminLayout title="Component Library">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-terracotta-red">Component Library</h1>
            <p className="text-deep-teal/70 mt-1">
              Create and manage reusable components for your pages
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-terracotta-red text-white rounded-lg hover:bg-terracotta-red/90 transition-colors shadow-sm"
          >
            <PlusIcon className="w-5 h-5" />
            Create Component
          </button>
        </div>

        {/* Search and Filters */}
        <ComponentSearch onSearch={handleSearch} />

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-terracotta-red border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-deep-teal/70 mt-4">Loading components...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredComponents.length === 0 && components.length === 0 && (
          <div className="text-center py-12 bg-soft-beige-lightest rounded-lg border-2 border-dashed border-soft-beige">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-deep-teal mb-2">No components yet</h3>
            <p className="text-deep-teal/70 mb-6">
              Create your first reusable component to get started
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-terracotta-red text-white rounded-lg hover:bg-terracotta-red/90 transition-colors"
            >
              Create Your First Component
            </button>
          </div>
        )}

        {/* No Results */}
        {!loading && !error && filteredComponents.length === 0 && components.length > 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-deep-teal mb-2">No components found</h3>
            <p className="text-deep-teal/70">
              Try adjusting your search or filters
            </p>
          </div>
        )}

        {/* Component Grid */}
        {!loading && !error && filteredComponents.length > 0 && (
          <ComponentGrid
            components={filteredComponents}
            onDelete={handleComponentDeleted}
            onUpdate={handleComponentUpdated}
          />
        )}

        {/* Stats */}
        {!loading && !error && components.length > 0 && (
          <div className="text-sm text-deep-teal/60 text-center">
            Showing {filteredComponents.length} of {components.length} components
          </div>
        )}
      </div>

      {/* Create Component Modal */}
      {showCreateModal && (
        <CreateComponentModal
          onClose={() => setShowCreateModal(false)}
          onCreated={handleComponentCreated}
        />
      )}
    </AdminLayout>
  )
}
