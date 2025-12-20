'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { HomeSection, ReusableComponent } from '@/types/cms'
import toast from 'react-hot-toast'
import {
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
  EyeSlashIcon,
  TrashIcon,
  PlusIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

export default function AdminHomePage() {
  const [sections, setSections] = useState<HomeSection[]>([])
  const [components, setComponents] = useState<ReusableComponent[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    loadSections()
    loadComponents()
  }, [])

  const loadSections = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/home-sections')
      const data = await response.json()
      if (data.success) {
        setSections(data.data || [])
      } else {
        toast.error('Failed to load sections')
      }
    } catch (error) {
      console.error('Error loading sections:', error)
      toast.error('Error loading sections')
    } finally {
      setLoading(false)
    }
  }

  const loadComponents = async () => {
    try {
      const response = await fetch('/api/components')
      const data = await response.json()
      if (data.success) {
        setComponents(data.data || [])
      }
    } catch (error) {
      console.error('Error loading components:', error)
    }
  }

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...sections]
    const targetIndex = direction === 'up' ? index - 1 : index + 1

    if (targetIndex < 0 || targetIndex >= newSections.length) {
      return
    }

    // Swap sections
    ;[newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]]

    // Update display_order for all sections
    newSections.forEach((section, idx) => {
      section.display_order = idx
    })

    setSections(newSections)
  }

  const toggleVisibility = async (id: string, currentVisibility: boolean) => {
    const section = sections.find(s => s.id === id)
    const toastId = toast.loading(`${currentVisibility ? 'Hiding' : 'Showing'} ${section?.section_name || 'section'}...`)

    try {
      const response = await fetch(`/api/home-sections/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_visible: !currentVisibility })
      })

      if (response.ok) {
        setSections(sections.map(s =>
          s.id === id ? { ...s, is_visible: !currentVisibility } : s
        ))
        toast.success(
          `${section?.section_name || 'Section'} is now ${!currentVisibility ? 'visible' : 'hidden'}`,
          { id: toastId }
        )
      } else {
        toast.error('Failed to update visibility', { id: toastId })
      }
    } catch (error) {
      console.error('Error toggling visibility:', error)
      toast.error('Error updating visibility', { id: toastId })
    }
  }

  const saveOrder = async () => {
    setSaving(true)
    const toastId = toast.loading('Saving section order...')

    try {
      const response = await fetch('/api/home-sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sections: sections.map(s => ({ id: s.id, display_order: s.display_order }))
        })
      })

      if (response.ok) {
        toast.success('Section order saved successfully!', { id: toastId })
      } else {
        toast.error('Failed to save section order', { id: toastId })
      }
    } catch (error) {
      console.error('Error saving order:', error)
      toast.error('Error saving section order', { id: toastId })
    } finally {
      setSaving(false)
    }
  }

  const addComponent = async (component: ReusableComponent) => {
    const toastId = toast.loading(`Adding ${component.name}...`)

    try {
      const response = await fetch('/api/home-sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          component_id: component.id,
          section_name: component.name,
          section_type: component.category || 'component',
          is_visible: true,
          config: {}
        })
      })

      const data = await response.json()

      if (data.success) {
        setSections([...sections, data.data])
        toast.success(`${component.name} added successfully!`, { id: toastId })
        setShowAddModal(false)
      } else {
        toast.error(data.error || 'Failed to add component', { id: toastId })
      }
    } catch (error) {
      console.error('Error adding component:', error)
      toast.error('Error adding component', { id: toastId })
    }
  }

  const deleteSection = async (id: string) => {
    const section = sections.find(s => s.id === id)
    const toastId = toast.loading(`Deleting ${section?.section_name || 'section'}...`)

    try {
      const response = await fetch(`/api/home-sections/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setSections(sections.filter(s => s.id !== id))
        toast.success(`${section?.section_name || 'Section'} deleted successfully!`, { id: toastId })
        setDeleteConfirm(null)
      } else {
        toast.error('Failed to delete section', { id: toastId })
      }
    } catch (error) {
      console.error('Error deleting section:', error)
      toast.error('Error deleting section', { id: toastId })
    }
  }

  // Get components that are available to add
  const availableComponents = components.filter(comp => comp.is_active)

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-terracotta-red mx-auto mb-4"></div>
            <p className="text-gray-600">Loading sections...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-deep-teal mb-2">
              Home Page Management
            </h1>
            <p className="text-gray-600">
              Manage the order and visibility of components on the homepage
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-deep-teal text-white rounded-lg hover:bg-deep-teal-dark transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            Add Component
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">How to use:</h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Use <strong>up/down arrows</strong> to reorder components</li>
            <li>Click the <strong>eye icon</strong> to show/hide components (saved immediately)</li>
            <li>Click <strong>"Save Order"</strong> to persist your reordering changes</li>
            <li>Use the <strong>trash icon</strong> to remove a component from the homepage</li>
            <li>Click <strong>"Add Component"</strong> to add reusable components to the homepage</li>
            <li>Create components in the <strong>Component Library</strong> page first</li>
          </ul>
        </div>

        {/* Sections List */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          {sections.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600 mb-4">No components added to homepage yet</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-terracotta-red text-white rounded-lg hover:bg-terracotta-red-dark transition-colors"
              >
                <PlusIcon className="w-5 h-5" />
                Add Your First Component
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {sections.map((section, index) => (
                <div
                  key={section.id}
                  className={`p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors ${
                    !section.is_visible ? 'opacity-60 bg-gray-50' : ''
                  }`}
                >
                  {/* Order Number */}
                  <div className="flex-shrink-0 w-12 text-center">
                    <span className="text-2xl font-bold text-gray-400">
                      {index + 1}
                    </span>
                  </div>

                  {/* Section Info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-deep-teal text-lg">
                      {section.section_name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Component: {section.section_type}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div className="flex-shrink-0">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        section.is_visible
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {section.is_visible ? 'Visible' : 'Hidden'}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {/* Up Arrow */}
                    <button
                      onClick={() => moveSection(index, 'up')}
                      disabled={index === 0}
                      className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Move up"
                    >
                      <ArrowUpIcon className="w-5 h-5" />
                    </button>

                    {/* Down Arrow */}
                    <button
                      onClick={() => moveSection(index, 'down')}
                      disabled={index === sections.length - 1}
                      className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Move down"
                    >
                      <ArrowDownIcon className="w-5 h-5" />
                    </button>

                    {/* Visibility Toggle */}
                    <button
                      onClick={() => toggleVisibility(section.id, section.is_visible)}
                      className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                      title={section.is_visible ? 'Hide section' : 'Show section'}
                    >
                      {section.is_visible ? (
                        <EyeIcon className="w-5 h-5" />
                      ) : (
                        <EyeSlashIcon className="w-5 h-5" />
                      )}
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => setDeleteConfirm(section.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete section"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Save Button */}
        {sections.length > 0 && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={saveOrder}
              disabled={saving}
              className="px-6 py-3 bg-terracotta-red text-white rounded-lg hover:bg-terracotta-red-dark transition-colors font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Order'}
            </button>
          </div>
        )}
      </div>

      {/* Add Component Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-deep-teal">Add Component to Homepage</h2>
                <p className="text-sm text-gray-600 mt-1">Select a component from your library</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              {availableComponents.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">
                    No active components available.
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Create and activate components in the Component Library first.
                  </p>
                  <a
                    href="/admin/components"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-terracotta-red text-white rounded-lg hover:bg-terracotta-red-dark transition-colors"
                  >
                    <PlusIcon className="w-5 h-5" />
                    Go to Component Library
                  </a>
                </div>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {availableComponents.map((component) => (
                    <button
                      key={component.id}
                      onClick={() => addComponent(component)}
                      className="text-left p-4 border-2 border-gray-200 rounded-lg hover:border-deep-teal hover:bg-deep-teal/5 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-deep-teal">{component.name}</h3>
                        <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                          {component.category || 'General'}
                        </span>
                      </div>
                      {component.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">{component.description}</p>
                      )}
                      <div className="mt-2 text-xs text-gray-400">
                        {component.blocks_config?.length || 0} block(s)
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-deep-teal mb-4">Delete Section?</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{sections.find(s => s.id === deleteConfirm)?.section_name}</strong>?
              This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteSection(deleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
