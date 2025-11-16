'use client'

import { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { PageInput } from '@/types/cms'

export default function NewPagePage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<PageInput>({
    slug: '',
    title: '',
    meta_description: '',
    template_type: 'standard',
    status: 'draft',
    is_published: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Redirect to edit page to add content blocks
        router.push(`/admin/pages/${data.data.id}/edit`)
      } else {
        alert(`Failed to create page: ${data.error || 'Unknown error'}`)
        setSaving(false)
      }
    } catch (error) {
      console.error('Error creating page:', error)
      alert('Error creating page')
      setSaving(false)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      // Auto-generate slug if it hasn't been manually edited
      slug: prev.slug === generateSlug(prev.title) || !prev.slug
        ? generateSlug(title)
        : prev.slug
    }))
  }

  return (
    <AdminLayout title="Create New Page">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/admin/pages"
            className="p-2 bg-white rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-deep-teal">Create New Page</h1>
            <p className="text-gray-600 mt-1">
              Set up your page metadata, then add content blocks
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
              Page Title *
            </label>
            <input
              type="text"
              id="title"
              required
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
              placeholder="e.g., About Our Mission"
            />
            <p className="mt-1 text-xs text-gray-500">
              This will be displayed as the main heading and browser tab title
            </p>
          </div>

          {/* Slug */}
          <div>
            <label htmlFor="slug" className="block text-sm font-semibold text-gray-700 mb-2">
              URL Slug *
            </label>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">/</span>
              <input
                type="text"
                id="slug"
                required
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                pattern="[a-z0-9/\-]+"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent font-mono text-sm"
                placeholder="e.g., about/mission"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Only lowercase letters, numbers, hyphens, and slashes. This determines the page URL.
            </p>
          </div>

          {/* Meta Description */}
          <div>
            <label htmlFor="meta_description" className="block text-sm font-semibold text-gray-700 mb-2">
              Meta Description
            </label>
            <textarea
              id="meta_description"
              value={formData.meta_description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
              placeholder="A brief description for search engines (150-160 characters recommended)"
            />
            <p className="mt-1 text-xs text-gray-500">
              {formData.meta_description?.length || 0} characters
            </p>
          </div>

          {/* Template Type */}
          <div>
            <label htmlFor="template_type" className="block text-sm font-semibold text-gray-700 mb-2">
              Page Template
            </label>
            <select
              id="template_type"
              value={formData.template_type}
              onChange={(e) => setFormData(prev => ({ ...prev, template_type: e.target.value as any }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
            >
              <option value="standard">Standard (default)</option>
              <option value="landing">Landing Page</option>
              <option value="gallery">Gallery</option>
              <option value="full_width">Full Width</option>
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Choose the layout template for this page
            </p>
          </div>

          {/* Initial Status */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Initial Status
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="draft"
                  checked={formData.status === 'draft'}
                  onChange={() => setFormData(prev => ({ ...prev, status: 'draft', is_published: false }))}
                  className="w-4 h-4 text-terracotta-red"
                />
                <span className="text-sm">Draft (not visible on website)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="published"
                  checked={formData.status === 'published' && formData.is_published}
                  onChange={() => setFormData(prev => ({ ...prev, status: 'published', is_published: true }))}
                  className="w-4 h-4 text-terracotta-red"
                />
                <span className="text-sm">Published (visible on website)</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Link
              href="/admin/pages"
              className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-terracotta-red text-white rounded-lg hover:bg-terracotta-red-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Creating...' : 'Create Page & Add Content'}
            </button>
          </div>
        </form>

        {/* Info Box */}
        <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg">
          <h3 className="text-lg font-semibold text-amber-900 mb-2">Next Steps</h3>
          <p className="text-sm text-amber-800">
            After creating the page, you'll be taken to the content editor where you can add text blocks, images, videos, and other content using the block-based editor.
          </p>
        </div>
      </div>
    </AdminLayout>
  )
}
