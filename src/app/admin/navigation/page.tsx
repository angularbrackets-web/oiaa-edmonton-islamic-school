'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import { EyeIcon, EyeSlashIcon, PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline'
import { Page } from '@/types/cms'

interface NavigationItem {
  id: string
  label_en: string
  label_ar?: string
  href: string
  icon?: string
  level: number
  parent_id?: string
  display_order: number
  is_visible: boolean
  is_featured: boolean
  description_en?: string
  description_ar?: string
  children?: NavigationItem[]
}

type TabType = 'navigation' | 'reusable'

export default function NavigationAdminPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabType>('navigation')
  const [navigationData, setNavigationData] = useState<NavigationItem[]>([])
  const [reusablePages, setReusablePages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const [showHidden, setShowHidden] = useState(true)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
  const [showAddForm, setShowAddForm] = useState(false)
  const [addFormData, setAddFormData] = useState({
    label_en: '',
    label_ar: '',
    href: '',
    description_en: '',
    parent_id: '',
    is_visible: true,
    is_featured: false
  })
  const [savingItem, setSavingItem] = useState(false)

  useEffect(() => {
    loadNavigation()
    loadReusablePages()
  }, [])

  const loadNavigation = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/navigation?admin=true&tree=true')
      const data = await response.json()
      if (data.success) {
        setNavigationData(data.data || [])
      }
    } catch (error) {
      console.error('Error loading navigation:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadReusablePages = async () => {
    try {
      const response = await fetch('/api/pages?reusable=true')
      const data = await response.json()
      if (data.success) {
        setReusablePages(data.data || [])
      }
    } catch (error) {
      console.error('Error loading reusable pages:', error)
    }
  }

  const handleEditPage = async (navigationItem: NavigationItem) => {
    // Special case: Home page should go to Home CMS
    if (navigationItem.href === '/' || navigationItem.href === '') {
      router.push('/admin/home')
      return
    }

    // Find page linked to this navigation item
    try {
      const response = await fetch(`/api/pages`)
      const data = await response.json()
      if (data.success) {
        const linkedPage = data.data.find((p: Page) => p.navigation_id === navigationItem.id)
        if (linkedPage) {
          router.push(`/admin/pages/${linkedPage.id}/edit`)
        } else {
          // No page exists - offer to create one
          const shouldCreate = confirm(
            `No page exists for "${navigationItem.label_en}".\n\n` +
            `Would you like to create a new page linked to this navigation item?`
          )

          if (shouldCreate) {
            // Generate proper slug from href
            let slug = navigationItem.href.replace(/^\//, '') // Remove leading slash
            if (!slug) {
              slug = navigationItem.label_en.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '')
            }

            // Create new page linked to this navigation item
            const createResponse = await fetch('/api/pages', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                title: navigationItem.label_en,
                slug: slug,
                navigation_id: navigationItem.id,
                is_published: false,
                meta_description: navigationItem.description_en || `${navigationItem.label_en} page`
              })
            })

            if (createResponse.ok) {
              const newPageData = await createResponse.json()
              router.push(`/admin/pages/${newPageData.data.id}/edit`)
            } else {
              const errorData = await createResponse.json()
              alert(`Failed to create page: ${errorData.error || 'Unknown error'}`)
            }
          }
        }
      }
    } catch (error) {
      console.error('Error finding linked page:', error)
      alert('Error finding linked page')
    }
  }

  const toggleVisibility = async (id: string, currentVisibility: boolean) => {
    try {
      const response = await fetch(`/api/navigation/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_visible: !currentVisibility
        })
      })

      if (response.ok) {
        loadNavigation() // Refresh the list
      } else {
        const data = await response.json()
        alert(`Failed to update visibility: ${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error toggling visibility:', error)
      alert('Error updating visibility')
    }
  }

  const handleDelete = async (id: string, label: string) => {
    if (!confirm(`Are you sure you want to delete "${label}"? This will also delete all sub-items.`)) {
      return
    }

    try {
      const response = await fetch(`/api/navigation/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        loadNavigation()
      } else {
        const data = await response.json()
        alert(`Failed to delete navigation item: ${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error deleting item:', error)
      alert('Error deleting navigation item')
    }
  }

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const handleAddMenuItem = async () => {
    if (!addFormData.label_en.trim()) {
      alert('Label (English) is required')
      return
    }
    if (!addFormData.href.trim()) {
      alert('URL path is required')
      return
    }

    setSavingItem(true)
    try {
      // Determine level based on parent selection
      const level = addFormData.parent_id ? 2 : 1

      // Get max display order for this level/parent
      let maxOrder = 0
      if (addFormData.parent_id) {
        const parent = navigationData.find(item => item.id === addFormData.parent_id)
        maxOrder = parent?.children?.length || 0
      } else {
        maxOrder = navigationData.length
      }

      const response = await fetch('/api/navigation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          label_en: addFormData.label_en,
          label_ar: addFormData.label_ar || null,
          href: addFormData.href.startsWith('/') ? addFormData.href : `/${addFormData.href}`,
          description_en: addFormData.description_en || null,
          parent_id: addFormData.parent_id || null,
          level,
          display_order: maxOrder + 1,
          is_visible: addFormData.is_visible,
          is_featured: addFormData.is_featured
        })
      })

      if (response.ok) {
        setShowAddForm(false)
        setAddFormData({
          label_en: '',
          label_ar: '',
          href: '',
          description_en: '',
          parent_id: '',
          is_visible: true,
          is_featured: false
        })
        loadNavigation()
      } else {
        const data = await response.json()
        alert(`Failed to add menu item: ${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error adding menu item:', error)
      alert('Error adding menu item')
    } finally {
      setSavingItem(false)
    }
  }

  const renderNavigationItem = (item: NavigationItem, level = 0) => {
    const shouldShow = showHidden || item.is_visible
    if (!shouldShow) return null

    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems.has(item.id)

    return (
      <div key={item.id} className={`${level > 0 ? 'ml-8' : ''}`}>
        <div className={`
          bg-white rounded-lg p-4 mb-2 border-l-4
          ${item.is_visible ? 'border-terracotta-red' : 'border-gray-300'}
          ${!item.is_visible ? 'opacity-60' : ''}
        `}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                {/* Expand/Collapse button for items with children */}
                {hasChildren && (
                  <button
                    onClick={() => toggleExpanded(item.id)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                    title={isExpanded ? 'Collapse' : 'Expand'}
                  >
                    <svg
                      className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
                <h3 className="text-lg font-semibold text-deep-teal">
                  {item.label_en}
                </h3>
                {!item.is_visible && (
                  <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded">
                    Hidden
                  </span>
                )}
                {item.is_featured && (
                  <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded">
                    Featured
                  </span>
                )}
              </div>
              <div className="mt-1 text-sm text-gray-600">
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">{item.href}</span>
                {item.description_en && (
                  <span className="ml-2">{item.description_en}</span>
                )}
              </div>
              {hasChildren && (
                <button
                  onClick={() => toggleExpanded(item.id)}
                  className="mt-2 text-sm text-terracotta-red hover:text-terracotta-red-dark cursor-pointer"
                >
                  {isExpanded ? '▼' : '▶'} {item.children!.length} sub-item{item.children!.length !== 1 ? 's' : ''}
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleVisibility(item.id, item.is_visible)}
                className={`
                  p-2 rounded-lg transition-colors
                  ${item.is_visible
                    ? 'bg-terracotta-red/10 text-terracotta-red hover:bg-terracotta-red/20'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }
                `}
                title={item.is_visible ? 'Hide from navigation' : 'Show in navigation'}
              >
                {item.is_visible ? (
                  <EyeIcon className="w-5 h-5" />
                ) : (
                  <EyeSlashIcon className="w-5 h-5" />
                )}
              </button>

              <button
                onClick={() => handleEditPage(item)}
                className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                title="Edit page content"
              >
                <PencilIcon className="w-5 h-5" />
              </button>

              <button
                onClick={() => handleDelete(item.id, item.label_en)}
                className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                title="Delete navigation item"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-2">
            {item.children!.map(child => renderNavigationItem(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <AdminLayout title="Navigation Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-deep-teal">Site Management</h1>
              <p className="text-gray-600 mt-1">
                Manage navigation menu and reusable page sections
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md p-2">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('navigation')}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'navigation'
                  ? 'bg-terracotta-red text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              📋 Navigation Menu
            </button>
            <button
              onClick={() => setActiveTab('reusable')}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'reusable'
                  ? 'bg-terracotta-red text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              🔗 Reusable Sections ({reusablePages.length})
            </button>
          </div>
        </div>

        {/* Navigation Tab Content */}
        {activeTab === 'navigation' && (
          <>
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-md p-4">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showHidden}
                    onChange={(e) => setShowHidden(e.target.checked)}
                    className="w-4 h-4 text-terracotta-red rounded"
                  />
                  <span className="text-sm text-gray-700">Show hidden items</span>
                </label>
                <div className="h-4 w-px bg-gray-300"></div>
                <span className="text-sm text-gray-600">
                  {navigationData.length} top-level items
                </span>
                <div className="ml-auto">
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="px-4 py-2 bg-terracotta-red text-white rounded-lg hover:bg-terracotta-red-dark transition-colors flex items-center gap-2"
                  >
                    <PlusIcon className="w-5 h-5" />
                    Add Menu Item
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation Items */}
            <div>
              {loading ? (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                  <div className="inline-block w-8 h-8 border-4 border-terracotta-red border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 text-gray-600">Loading navigation...</p>
                </div>
              ) : navigationData.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                  <p className="text-gray-600">No navigation items found</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {navigationData.map(item => renderNavigationItem(item))}
                </div>
              )}
            </div>

            {/* Help Section */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Quick Tips</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span><strong>Hide items:</strong> Click the eye icon to hide menu items from the public navigation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span><strong>Edit page:</strong> Click the pencil icon to edit page content</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span><strong>Sub-items:</strong> Hidden parent items will also hide all their sub-items</span>
                </li>
              </ul>
            </div>
          </>
        )}

        {/* Reusable Sections Tab Content */}
        {activeTab === 'reusable' && (
          <div className="space-y-4">
            {/* Header with Add Button */}
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                Reusable sections are pages that can be embedded in other pages using the Page Embed block
              </p>
              <button
                onClick={() => router.push('/admin/pages/create?reusable=true')}
                className="px-4 py-2 bg-terracotta-red text-white rounded-lg hover:bg-terracotta-red-dark transition-colors flex items-center gap-2"
              >
                <PlusIcon className="w-5 h-5" />
                New Reusable Section
              </button>
            </div>

            {/* Reusable Pages List */}
            {reusablePages.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  🔗
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reusable Sections Yet</h3>
                <p className="text-gray-600 mb-4">
                  Create reusable page sections that can be embedded across your website
                </p>
                <button
                  onClick={() => router.push('/admin/pages/create?reusable=true')}
                  className="px-6 py-2 bg-terracotta-red text-white rounded-lg hover:bg-terracotta-red-dark transition-colors"
                >
                  Create First Section
                </button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {reusablePages.map(page => (
                  <div
                    key={page.id}
                    className="bg-white rounded-xl shadow-md p-6 border-l-4 border-terracotta-red hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-deep-teal flex-1">
                        {page.title}
                      </h3>
                      {page.is_published ? (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Published
                        </span>
                      ) : (
                        <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                          Draft
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-xs">
                        /{page.slug}
                      </span>
                    </p>

                    {page.meta_description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {page.meta_description}
                      </p>
                    )}

                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => router.push(`/admin/pages/${page.id}/edit`)}
                        className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                      >
                        <PencilIcon className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => router.push(`/${page.slug}`)}
                        className="flex-1 px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                      >
                        <EyeIcon className="w-4 h-4" />
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Help Section */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">About Reusable Sections</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span><strong>Purpose:</strong> Create content once, use it in multiple pages</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span><strong>How to use:</strong> Add a "Page Embed" block to any page and select a reusable section</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span><strong>Updates:</strong> Changes to a reusable section automatically appear everywhere it's embedded</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Add Menu Item Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-deep-teal">Add Menu Item</h2>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {/* Label (English) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Label (English) *
                  </label>
                  <input
                    type="text"
                    value={addFormData.label_en}
                    onChange={(e) => setAddFormData(prev => ({ ...prev, label_en: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
                    placeholder="e.g., About Us"
                  />
                </div>

                {/* Label (Arabic) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Label (Arabic)
                  </label>
                  <input
                    type="text"
                    value={addFormData.label_ar}
                    onChange={(e) => setAddFormData(prev => ({ ...prev, label_ar: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
                    placeholder="e.g., من نحن"
                    dir="rtl"
                  />
                </div>

                {/* URL Path */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL Path *
                  </label>
                  <div className="flex items-center">
                    <span className="px-3 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-500">
                      /
                    </span>
                    <input
                      type="text"
                      value={addFormData.href.replace(/^\//, '')}
                      onChange={(e) => setAddFormData(prev => ({ ...prev, href: e.target.value }))}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
                      placeholder="e.g., about-us"
                    />
                  </div>
                </div>

                {/* Parent Menu (for submenus) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Parent Menu (leave empty for main menu)
                  </label>
                  <select
                    value={addFormData.parent_id}
                    onChange={(e) => setAddFormData(prev => ({ ...prev, parent_id: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
                  >
                    <option value="">-- Main Menu Item --</option>
                    {navigationData.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.label_en}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={addFormData.description_en}
                    onChange={(e) => setAddFormData(prev => ({ ...prev, description_en: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
                    placeholder="Brief description for tooltips"
                  />
                </div>

                {/* Visibility & Featured */}
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={addFormData.is_visible}
                      onChange={(e) => setAddFormData(prev => ({ ...prev, is_visible: e.target.checked }))}
                      className="w-4 h-4 text-terracotta-red rounded"
                    />
                    <span className="text-sm text-gray-700">Visible in navigation</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={addFormData.is_featured}
                      onChange={(e) => setAddFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                      className="w-4 h-4 text-terracotta-red rounded"
                    />
                    <span className="text-sm text-gray-700">Featured</span>
                  </label>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex gap-3">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddMenuItem}
                  disabled={savingItem}
                  className="flex-1 px-4 py-2 bg-terracotta-red text-white rounded-lg hover:bg-terracotta-red-dark transition-colors disabled:opacity-50"
                >
                  {savingItem ? 'Adding...' : 'Add Menu Item'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
