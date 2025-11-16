'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import Link from 'next/link'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  DocumentDuplicateIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import { Page } from '@/types/cms'

export default function PagesAdminPage() {
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all')

  useEffect(() => {
    loadPages()
  }, [])

  const loadPages = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/pages')
      const data = await response.json()
      if (data.success) {
        setPages(data.data || [])
      }
    } catch (error) {
      console.error('Error loading pages:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This will also delete all content blocks.`)) {
      return
    }

    try {
      const response = await fetch(`/api/pages/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        loadPages()
      } else {
        const data = await response.json()
        alert(`Failed to delete page: ${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error deleting page:', error)
      alert('Error deleting page')
    }
  }

  const handleTogglePublish = async (id: string) => {
    try {
      const response = await fetch(`/api/pages/${id}?action=toggle_publish`, {
        method: 'PATCH',
      })

      if (response.ok) {
        loadPages()
      } else {
        const data = await response.json()
        alert(`Failed to toggle publish status: ${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error toggling publish status:', error)
      alert('Error updating page')
    }
  }

  const handleDuplicate = async (id: string) => {
    try {
      const response = await fetch(`/api/pages/${id}?action=duplicate`, {
        method: 'PATCH',
      })

      if (response.ok) {
        loadPages()
      } else {
        const data = await response.json()
        alert(`Failed to duplicate page: ${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Error duplicating page:', error)
      alert('Error duplicating page')
    }
  }

  // Filter pages
  const filteredPages = pages.filter(page => {
    const matchesSearch = page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         page.slug.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || page.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string, isPublished: boolean) => {
    if (isPublished && status === 'published') {
      return (
        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
          Published
        </span>
      )
    }
    if (status === 'draft') {
      return (
        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
          Draft
        </span>
      )
    }
    if (status === 'archived') {
      return (
        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
          Archived
        </span>
      )
    }
    return null
  }

  return (
    <AdminLayout title="Pages Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-deep-teal">Page Content Manager</h1>
              <p className="text-gray-600 mt-1">
                Create and manage dynamic pages with block-based content
              </p>
            </div>
            <Link
              href="/admin/pages/new"
              className="px-4 py-2 bg-terracotta-red text-white rounded-lg hover:bg-terracotta-red-dark transition-colors flex items-center gap-2"
            >
              <PlusIcon className="w-5 h-5" />
              Create New Page
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search pages by title or slug..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>

            <div className="text-sm text-gray-600">
              {filteredPages.length} of {pages.length} pages
            </div>
          </div>
        </div>

        {/* Pages List */}
        <div>
          {loading ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <div className="inline-block w-8 h-8 border-4 border-terracotta-red border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading pages...</p>
            </div>
          ) : filteredPages.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <p className="text-gray-600">
                {searchQuery || statusFilter !== 'all'
                  ? 'No pages match your filters'
                  : 'No pages created yet'}
              </p>
              {!searchQuery && statusFilter === 'all' && (
                <Link
                  href="/admin/pages/new"
                  className="inline-block mt-4 px-6 py-2 bg-terracotta-red text-white rounded-lg hover:bg-terracotta-red-dark transition-colors"
                >
                  Create Your First Page
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPages.map(page => (
                <div
                  key={page.id}
                  className="bg-white rounded-lg p-4 border-l-4 border-terracotta-red shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-deep-teal">
                          {page.title}
                        </h3>
                        {getStatusBadge(page.status, page.is_published)}
                      </div>
                      <div className="mt-1 flex items-center gap-4 text-sm text-gray-600">
                        <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                          /{page.slug}
                        </span>
                        {page.template_type !== 'standard' && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {page.template_type}
                          </span>
                        )}
                        <span>
                          Updated {new Date(page.updated_at).toLocaleDateString()}
                        </span>
                      </div>
                      {page.meta_description && (
                        <p className="mt-2 text-sm text-gray-500 line-clamp-1">
                          {page.meta_description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Toggle Publish */}
                      <button
                        onClick={() => handleTogglePublish(page.id)}
                        className={`
                          p-2 rounded-lg transition-colors
                          ${page.is_published
                            ? 'bg-green-100 text-green-600 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }
                        `}
                        title={page.is_published ? 'Unpublish page' : 'Publish page'}
                      >
                        {page.is_published ? (
                          <EyeIcon className="w-5 h-5" />
                        ) : (
                          <EyeSlashIcon className="w-5 h-5" />
                        )}
                      </button>

                      {/* Edit */}
                      <Link
                        href={`/admin/pages/${page.id}/edit`}
                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        title="Edit page"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </Link>

                      {/* Duplicate */}
                      <button
                        onClick={() => handleDuplicate(page.id)}
                        className="p-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-colors"
                        title="Duplicate page"
                      >
                        <DocumentDuplicateIcon className="w-5 h-5" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(page.id, page.title)}
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                        title="Delete page"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Quick Guide</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span>•</span>
              <span><strong>Create Page:</strong> Click "Create New Page" to add a new dynamic page</span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span><strong>Edit Content:</strong> Use the block-based editor to add text, images, videos, and more</span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span><strong>Publish:</strong> Pages must be published to appear on the website</span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span><strong>Slug:</strong> The URL path for the page (e.g., "about/mission" → /about/mission)</span>
            </li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  )
}
