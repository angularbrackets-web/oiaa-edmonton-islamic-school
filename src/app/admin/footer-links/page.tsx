'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import { EyeIcon, EyeSlashIcon, PencilIcon, TrashIcon, PlusIcon, ArrowUpIcon, ArrowDownIcon, DocumentTextIcon } from '@heroicons/react/24/outline'

interface FooterLink {
  id: string
  label: string
  href: string
  category: string
  description?: string
  display_order: number
  is_visible: boolean
  is_external: boolean
  open_in_new_tab: boolean
}

const CATEGORIES = [
  { value: 'main', label: 'Quick Links' },
  { value: 'admissions', label: 'Admissions' },
  { value: 'resources', label: 'Resources' },
  { value: 'support', label: 'Support' },
  { value: 'legal', label: 'Legal' }
]

export default function FooterLinksAdminPage() {
  const router = useRouter()
  const [footerLinks, setFooterLinks] = useState<FooterLink[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingLink, setEditingLink] = useState<FooterLink | null>(null)
  const [formData, setFormData] = useState({
    label: '',
    href: '',
    category: 'main',
    description: '',
    is_visible: true,
    is_external: false,
    open_in_new_tab: false
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadFooterLinks()
  }, [])

  const loadFooterLinks = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/footer-links?visible=false')
      const data = await response.json()
      if (data.success) {
        setFooterLinks(data.data || [])
      }
    } catch (error) {
      console.error('Error loading footer links:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditPage = async (link: FooterLink) => {
    // Skip external links
    if (link.is_external) {
      alert('This is an external link. You can only edit pages for internal links.')
      return
    }

    // Special case: Home page
    if (link.href === '/' || link.href === '') {
      router.push('/admin/home')
      return
    }

    try {
      // Find page with matching href (slug)
      const slug = link.href.replace(/^\//, '') // Remove leading slash
      const response = await fetch(`/api/pages`)
      const data = await response.json()

      if (data.success) {
        const linkedPage = data.data.find((p: any) => p.slug === slug)

        if (linkedPage) {
          router.push(`/admin/pages/${linkedPage.id}/edit`)
        } else {
          // No page exists - offer to create one
          const shouldCreate = confirm(
            `No page exists for "${link.label}".\n\n` +
            `Would you like to create a new page for this link?`
          )

          if (shouldCreate) {
            // Create new page with slug from href
            const createResponse = await fetch('/api/pages', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                title: link.label,
                slug: slug,
                is_published: false,
                meta_description: link.description || `${link.label} page`
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

  const handleSave = async () => {
    if (!formData.label || !formData.href || !formData.category) {
      alert('Label, URL, and Category are required')
      return
    }

    setSaving(true)
    try {
      const url = editingLink ? '/api/footer-links' : '/api/footer-links'
      const method = editingLink ? 'PUT' : 'POST'
      const body = editingLink
        ? { id: editingLink.id, ...formData }
        : formData

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (response.ok) {
        loadFooterLinks()
        resetForm()
      } else {
        const data = await response.json()
        alert(`Failed to save: ${data.error}`)
      }
    } catch (error) {
      console.error('Error saving footer link:', error)
      alert('Error saving footer link')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (link: FooterLink) => {
    setEditingLink(link)
    setFormData({
      label: link.label,
      href: link.href,
      category: link.category,
      description: link.description || '',
      is_visible: link.is_visible,
      is_external: link.is_external,
      open_in_new_tab: link.open_in_new_tab
    })
    setShowAddForm(true)
  }

  const handleDelete = async (id: string, label: string) => {
    if (!confirm(`Are you sure you want to delete "${label}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/footer-links?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        loadFooterLinks()
      } else {
        const data = await response.json()
        alert(`Failed to delete: ${data.error}`)
      }
    } catch (error) {
      console.error('Error deleting footer link:', error)
      alert('Error deleting footer link')
    }
  }

  const toggleVisibility = async (link: FooterLink) => {
    try {
      const response = await fetch('/api/footer-links', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: link.id,
          is_visible: !link.is_visible
        })
      })

      if (response.ok) {
        loadFooterLinks()
      }
    } catch (error) {
      console.error('Error toggling visibility:', error)
    }
  }

  const moveLink = async (link: FooterLink, direction: 'up' | 'down') => {
    const categoryLinks = footerLinks.filter(l => l.category === link.category)
    const currentIndex = categoryLinks.findIndex(l => l.id === link.id)

    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === categoryLinks.length - 1)
    ) {
      return // Can't move further
    }

    const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    const currentLink = categoryLinks[currentIndex]
    const swapLink = categoryLinks[swapIndex]

    try {
      const response = await fetch('/api/footer-links', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          links: [
            { id: currentLink.id, display_order: swapLink.display_order },
            { id: swapLink.id, display_order: currentLink.display_order }
          ]
        })
      })

      if (response.ok) {
        loadFooterLinks()
      }
    } catch (error) {
      console.error('Error reordering links:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      label: '',
      href: '',
      category: 'main',
      description: '',
      is_visible: true,
      is_external: false,
      open_in_new_tab: false
    })
    setEditingLink(null)
    setShowAddForm(false)
  }

  const filteredLinks = selectedCategory === 'all'
    ? footerLinks
    : footerLinks.filter(link => link.category === selectedCategory)

  const groupedLinks = CATEGORIES.reduce((acc, cat) => {
    acc[cat.value] = footerLinks.filter(link => link.category === cat.value)
    return acc
  }, {} as Record<string, FooterLink[]>)

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Footer Links Management</h1>
            <p className="text-gray-600 mt-2">Manage navigation links in the footer</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 bg-terracotta-red text-white px-4 py-2 rounded-lg hover:bg-terracotta-red-dark transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            Add Link
          </button>
        </div>

        {/* Category Filter */}
        <div className="mb-6 flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedCategory === 'all'
                ? 'bg-terracotta-red text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All ({footerLinks.length})
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === cat.value
                  ? 'bg-terracotta-red text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {cat.label} ({groupedLinks[cat.value]?.length || 0})
            </button>
          ))}
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border-2 border-terracotta-red">
            <h2 className="text-xl font-bold mb-4">
              {editingLink ? 'Edit Link' : 'Add New Link'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Label *
                </label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={e => setFormData({ ...formData, label: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
                  placeholder="e.g., Privacy Policy"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL *
                </label>
                <input
                  type="text"
                  value={formData.href}
                  onChange={e => setFormData({ ...formData, href: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
                  placeholder="/privacy or https://example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (optional)
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
                  placeholder="Optional description"
                />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_visible}
                    onChange={e => setFormData({ ...formData, is_visible: e.target.checked })}
                    className="w-4 h-4 text-terracotta-red focus:ring-terracotta-red border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Visible</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_external}
                    onChange={e => setFormData({ ...formData, is_external: e.target.checked })}
                    className="w-4 h-4 text-terracotta-red focus:ring-terracotta-red border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">External Link</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.open_in_new_tab}
                    onChange={e => setFormData({ ...formData, open_in_new_tab: e.target.checked })}
                    className="w-4 h-4 text-terracotta-red focus:ring-terracotta-red border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Open in New Tab</span>
                </label>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-terracotta-red text-white px-6 py-2 rounded-lg hover:bg-terracotta-red-dark transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : editingLink ? 'Update' : 'Add Link'}
              </button>
              <button
                onClick={resetForm}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Links List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-terracotta-red"></div>
            <p className="mt-2 text-gray-600">Loading footer links...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Label
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    URL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLinks.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No footer links found. Add one to get started!
                    </td>
                  </tr>
                ) : (
                  filteredLinks.map(link => (
                    <tr key={link.id} className={!link.is_visible ? 'bg-gray-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{link.label}</div>
                        {link.description && (
                          <div className="text-sm text-gray-500">{link.description}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{link.href}</div>
                        {link.is_external && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            External
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {CATEGORIES.find(c => c.value === link.category)?.label || link.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          link.is_visible
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {link.is_visible ? 'Visible' : 'Hidden'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => moveLink(link, 'up')}
                            className="text-gray-600 hover:text-gray-900"
                            title="Move up"
                          >
                            <ArrowUpIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => moveLink(link, 'down')}
                            className="text-gray-600 hover:text-gray-900"
                            title="Move down"
                          >
                            <ArrowDownIcon className="w-5 h-5" />
                          </button>
                          {!link.is_external && (
                            <button
                              onClick={() => handleEditPage(link)}
                              className="text-purple-600 hover:text-purple-900"
                              title="Edit page content"
                            >
                              <DocumentTextIcon className="w-5 h-5" />
                            </button>
                          )}
                          <button
                            onClick={() => toggleVisibility(link)}
                            className="text-gray-600 hover:text-gray-900"
                            title={link.is_visible ? 'Hide' : 'Show'}
                          >
                            {link.is_visible ? (
                              <EyeIcon className="w-5 h-5" />
                            ) : (
                              <EyeSlashIcon className="w-5 h-5" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(link.id, link.label)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
