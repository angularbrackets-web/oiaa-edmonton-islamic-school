'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const categories = [
  { id: 'general', name: 'General', description: 'General news and updates' },
  { id: 'announcements', name: 'Announcements', description: 'Important school announcements' },
  { id: 'events', name: 'Events', description: 'School events and activities' },
  { id: 'achievements', name: 'Achievements', description: 'Student and school achievements' },
  { id: 'islamic-calendar', name: 'Islamic Calendar', description: 'Islamic holidays and observances' }
]

export default function NewNewsArticlePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    arabic_title: '',
    slug: '',
    excerpt: '',
    content: '',
    featured_image: '',
    category: 'general',
    tags: '',
    author: '',
    featured: false,
    published: true,
    publish_date: new Date().toISOString().split('T')[0]
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    if (name === 'title' && !formData.slug) {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
        slug: generateSlug(value)
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      const submitData = {
        ...formData,
        tags: tagsArray,
        publish_date: new Date(formData.publish_date).toISOString()
      }

      const response = await fetch('/api/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      if (response.ok) {
        router.push('/admin/news')
      } else {
        const errorData = await response.json()
        alert(`Failed to create article: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Error creating article:', error)
      alert('Error creating article')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-warm-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-terracotta-red mb-2">
              Create New Article
            </h1>
            <p className="text-deep-teal">
              Add a new news article or blog post
            </p>
          </div>
          <Link
            href="/admin/news"
            className="bg-soft-beige hover:bg-soft-beige-lightest text-deep-teal px-4 py-2 rounded-lg font-semibold transition-colors duration-200 mt-4 sm:mt-0"
          >
            ← Back to News
          </Link>
        </div>

        {/* Form */}
        <div className="bg-soft-beige-lightest rounded-lg shadow-lg border border-soft-beige p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-deep-teal mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-soft-beige focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
                placeholder="Enter article title"
              />
            </div>

            {/* Arabic Title */}
            <div>
              <label htmlFor="arabic_title" className="block text-sm font-medium text-deep-teal mb-2">
                Arabic Title (Optional)
              </label>
              <input
                type="text"
                id="arabic_title"
                name="arabic_title"
                value={formData.arabic_title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-soft-beige focus:ring-2 focus:ring-terracotta-red focus:border-transparent arabic-text"
                placeholder="العنوان بالعربية"
                dir="rtl"
              />
            </div>

            {/* Slug */}
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-deep-teal mb-2">
                URL Slug *
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                required
                value={formData.slug}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-soft-beige focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
                placeholder="url-friendly-slug"
              />
              <p className="text-xs text-deep-teal mt-1">
                URL: /news/{formData.slug}
              </p>
            </div>

            {/* Category & Author Row */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-deep-teal mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-soft-beige focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="author" className="block text-sm font-medium text-deep-teal mb-2">
                  Author (Optional)
                </label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-soft-beige focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
                  placeholder="Author name"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-deep-teal mb-2">
                Excerpt (Optional)
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                rows={3}
                value={formData.excerpt}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-soft-beige focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
                placeholder="Brief description or excerpt (will be auto-generated from content if left empty)"
              />
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-deep-teal mb-2">
                Content *
              </label>
              <textarea
                id="content"
                name="content"
                rows={12}
                required
                value={formData.content}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-soft-beige focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
                placeholder="Write your article content here..."
              />
              <p className="text-xs text-deep-teal mt-1">
                Use double line breaks to separate paragraphs
              </p>
            </div>

            {/* Featured Image */}
            <div>
              <label htmlFor="featured_image" className="block text-sm font-medium text-deep-teal mb-2">
                Featured Image URL (Optional)
              </label>
              <input
                type="url"
                id="featured_image"
                name="featured_image"
                value={formData.featured_image}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-soft-beige focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-deep-teal mb-2">
                Tags (Optional)
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-soft-beige focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
                placeholder="education, islamic, students (comma-separated)"
              />
            </div>

            {/* Publish Date */}
            <div>
              <label htmlFor="publish_date" className="block text-sm font-medium text-deep-teal mb-2">
                Publish Date
              </label>
              <input
                type="date"
                id="publish_date"
                name="publish_date"
                value={formData.publish_date}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-soft-beige focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
              />
            </div>

            {/* Checkboxes */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="published"
                  name="published"
                  checked={formData.published}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-terracotta-red bg-warm-white border-soft-beige rounded focus:ring-terracotta-red focus:ring-2"
                />
                <label htmlFor="published" className="ml-2 text-sm font-medium text-deep-teal">
                  Published (visible to public)
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-terracotta-red bg-warm-white border-soft-beige rounded focus:ring-terracotta-red focus:ring-2"
                />
                <label htmlFor="featured" className="ml-2 text-sm font-medium text-deep-teal">
                  Featured article
                </label>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-soft-beige">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-terracotta-red hover:bg-terracotta-red-dark text-warm-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50"
              >
                {isSubmitting ? 'Creating...' : 'Create Article'}
              </button>
              
              <button
                type="button"
                onClick={() => router.back()}
                className="bg-soft-beige hover:bg-soft-beige-lightest text-deep-teal px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}