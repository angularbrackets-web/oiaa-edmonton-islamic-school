'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import MediaSelector from '@/components/admin/MediaSelector'
import { HeroSlide } from '@/types/cms'
import toast from 'react-hot-toast'
import {
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
  EyeSlashIcon,
  TrashIcon,
  PlusIcon,
  PencilIcon,
  XMarkIcon,
  PhotoIcon
} from '@heroicons/react/24/outline'

const defaultSlide: Partial<HeroSlide> = {
  title: '',
  subtitle: '',
  description: '',
  slide_type: 'image_text',
  background_image: '',
  background_color: '#145B55',
  background_overlay: true,
  overlay_opacity: 0.5,
  text_color: 'white',
  text_alignment: 'center',
  cta_text: '',
  cta_link: '',
  cta_style: 'primary',
  cta2_text: '',
  cta2_link: '',
  cta2_style: 'secondary',
  duration: 5000,
  is_active: true
}

export default function AdminHeroSlidesPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingSlide, setEditingSlide] = useState<Partial<HeroSlide> | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    loadSlides()
  }, [])

  const loadSlides = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/hero-slides')
      const data = await response.json()
      if (data.success) {
        setSlides(data.data || [])
      } else {
        toast.error('Failed to load slides')
      }
    } catch (error) {
      console.error('Error loading slides:', error)
      toast.error('Error loading slides')
    } finally {
      setLoading(false)
    }
  }

  const moveSlide = (index: number, direction: 'up' | 'down') => {
    const newSlides = [...slides]
    const targetIndex = direction === 'up' ? index - 1 : index + 1

    if (targetIndex < 0 || targetIndex >= newSlides.length) {
      return
    }

    ;[newSlides[index], newSlides[targetIndex]] = [newSlides[targetIndex], newSlides[index]]
    newSlides.forEach((slide, idx) => {
      slide.display_order = idx
    })

    setSlides(newSlides)
  }

  const saveOrder = async () => {
    setSaving(true)
    const toastId = toast.loading('Saving slide order...')

    try {
      const response = await fetch('/api/hero-slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slides: slides.map(s => ({ id: s.id, display_order: s.display_order }))
        })
      })

      if (response.ok) {
        toast.success('Slide order saved successfully!', { id: toastId })
      } else {
        toast.error('Failed to save slide order', { id: toastId })
      }
    } catch (error) {
      console.error('Error saving order:', error)
      toast.error('Error saving slide order', { id: toastId })
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (id: string, currentStatus: boolean) => {
    const slide = slides.find(s => s.id === id)
    const toastId = toast.loading(`${currentStatus ? 'Deactivating' : 'Activating'} slide...`)

    try {
      const response = await fetch(`/api/hero-slides/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentStatus })
      })

      if (response.ok) {
        setSlides(slides.map(s =>
          s.id === id ? { ...s, is_active: !currentStatus } : s
        ))
        toast.success(
          `Slide is now ${!currentStatus ? 'active' : 'inactive'}`,
          { id: toastId }
        )
      } else {
        toast.error('Failed to update slide', { id: toastId })
      }
    } catch (error) {
      console.error('Error toggling active:', error)
      toast.error('Error updating slide', { id: toastId })
    }
  }

  const saveSlide = async () => {
    if (!editingSlide) return

    const isNew = !editingSlide.id
    const toastId = toast.loading(isNew ? 'Creating slide...' : 'Updating slide...')

    try {
      const url = isNew ? '/api/hero-slides' : `/api/hero-slides/${editingSlide.id}`
      const method = isNew ? 'POST' : 'PUT'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingSlide)
      })

      const data = await response.json()

      if (data.success) {
        if (isNew) {
          setSlides([...slides, data.data])
        } else {
          setSlides(slides.map(s => s.id === editingSlide.id ? data.data : s))
        }
        toast.success(isNew ? 'Slide created!' : 'Slide updated!', { id: toastId })
        setEditingSlide(null)
      } else {
        toast.error(data.error || 'Failed to save slide', { id: toastId })
      }
    } catch (error) {
      console.error('Error saving slide:', error)
      toast.error('Error saving slide', { id: toastId })
    }
  }

  const deleteSlide = async (id: string) => {
    const toastId = toast.loading('Deleting slide...')

    try {
      const response = await fetch(`/api/hero-slides/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setSlides(slides.filter(s => s.id !== id))
        toast.success('Slide deleted!', { id: toastId })
        setDeleteConfirm(null)
      } else {
        toast.error('Failed to delete slide', { id: toastId })
      }
    } catch (error) {
      console.error('Error deleting slide:', error)
      toast.error('Error deleting slide', { id: toastId })
    }
  }


  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-terracotta-red mx-auto mb-4"></div>
            <p className="text-gray-600">Loading slides...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-deep-teal mb-2">
              Hero Slideshow
            </h1>
            <p className="text-gray-600">
              Manage slides for the homepage hero section
            </p>
          </div>
          <button
            onClick={() => setEditingSlide({ ...defaultSlide })}
            className="flex items-center gap-2 px-4 py-2 bg-deep-teal text-white rounded-lg hover:bg-deep-teal-dark transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            Add Slide
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">Instructions:</h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Slides auto-advance based on their duration setting (default 5 seconds)</li>
            <li>Use arrows to reorder slides, then click "Save Order"</li>
            <li>Toggle the eye icon to show/hide slides</li>
            <li>Each slide can have image, text, or both</li>
          </ul>
        </div>

        {/* Slides List */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          {slides.length === 0 ? (
            <div className="p-8 text-center">
              <PhotoIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600 mb-4">No slides yet</p>
              <button
                onClick={() => setEditingSlide({ ...defaultSlide })}
                className="inline-flex items-center gap-2 px-4 py-2 bg-terracotta-red text-white rounded-lg hover:bg-terracotta-red-dark transition-colors"
              >
                <PlusIcon className="w-5 h-5" />
                Create Your First Slide
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className={`p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors ${
                    !slide.is_active ? 'opacity-60 bg-gray-50' : ''
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="flex-shrink-0 w-32 h-20 rounded-lg overflow-hidden bg-gray-200">
                    {slide.background_image ? (
                      <img
                        src={slide.background_image}
                        alt={slide.title || 'Slide'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ backgroundColor: slide.background_color }}
                      >
                        <PhotoIcon className="w-8 h-8 text-white/50" />
                      </div>
                    )}
                  </div>

                  {/* Slide Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-deep-teal truncate">
                      {slide.title || 'Untitled Slide'}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">
                      {slide.subtitle || 'No subtitle'}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs px-2 py-0.5 bg-gray-100 rounded">
                        {slide.slide_type === 'image' ? 'Image Only' :
                         slide.slide_type === 'text' ? 'Text Only' : 'Image + Text'}
                      </span>
                      <span className="text-xs text-gray-400">
                        {slide.duration / 1000}s duration
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex-shrink-0">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        slide.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {slide.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => moveSlide(index, 'up')}
                      disabled={index === 0}
                      className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Move up"
                    >
                      <ArrowUpIcon className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => moveSlide(index, 'down')}
                      disabled={index === slides.length - 1}
                      className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Move down"
                    >
                      <ArrowDownIcon className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => toggleActive(slide.id, slide.is_active)}
                      className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                      title={slide.is_active ? 'Deactivate' : 'Activate'}
                    >
                      {slide.is_active ? (
                        <EyeIcon className="w-5 h-5" />
                      ) : (
                        <EyeSlashIcon className="w-5 h-5" />
                      )}
                    </button>

                    <button
                      onClick={() => setEditingSlide(slide)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => setDeleteConfirm(slide.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Save Order Button */}
        {slides.length > 1 && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={saveOrder}
              disabled={saving}
              className="px-6 py-3 bg-terracotta-red text-white rounded-lg hover:bg-terracotta-red-dark transition-colors font-semibold shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Order'}
            </button>
          </div>
        )}
      </div>

      {/* Edit/Create Modal */}
      {editingSlide && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full my-8">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-deep-teal">
                {editingSlide.id ? 'Edit Slide' : 'New Slide'}
              </h2>
              <button
                onClick={() => setEditingSlide(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Slide Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Slide Type</label>
                <div className="flex gap-4">
                  {(['image_text', 'image', 'text'] as const).map((type) => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="slide_type"
                        value={type}
                        checked={editingSlide.slide_type === type}
                        onChange={(e) => setEditingSlide({ ...editingSlide, slide_type: e.target.value as any })}
                        className="text-deep-teal focus:ring-deep-teal"
                      />
                      <span className="text-sm">
                        {type === 'image_text' ? 'Image + Text' : type === 'image' ? 'Image Only' : 'Text Only'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Title & Subtitle */}
              {editingSlide.slide_type !== 'image' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={editingSlide.title || ''}
                      onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-teal focus:border-transparent"
                      placeholder="Welcome to Our School"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                    <input
                      type="text"
                      value={editingSlide.subtitle || ''}
                      onChange={(e) => setEditingSlide({ ...editingSlide, subtitle: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-teal focus:border-transparent"
                      placeholder="Nurturing Faith, Knowledge, and Character"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={editingSlide.description || ''}
                      onChange={(e) => setEditingSlide({ ...editingSlide, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-teal focus:border-transparent"
                      placeholder="Optional longer description text..."
                    />
                  </div>
                </>
              )}

              {/* Background Image */}
              {editingSlide.slide_type !== 'text' && (
                <div>
                  <MediaSelector
                    value={editingSlide.background_image || ''}
                    onChange={(url) => setEditingSlide({ ...editingSlide, background_image: url })}
                    type="image"
                    folder="hero-slides"
                    label="Background Image"
                    compact={false}
                    showPreview={true}
                  />
                </div>
              )}

              {/* Background Color (for text-only or as fallback) */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={editingSlide.background_color || '#145B55'}
                      onChange={(e) => setEditingSlide({ ...editingSlide, background_color: e.target.value })}
                      className="h-10 w-16 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={editingSlide.background_color || '#145B55'}
                      onChange={(e) => setEditingSlide({ ...editingSlide, background_color: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Overlay Opacity</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={(editingSlide.overlay_opacity || 0.5) * 100}
                    onChange={(e) => setEditingSlide({ ...editingSlide, overlay_opacity: parseInt(e.target.value) / 100 })}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-500">{Math.round((editingSlide.overlay_opacity || 0.5) * 100)}%</span>
                </div>
              </div>

              {/* Text Alignment */}
              {editingSlide.slide_type !== 'image' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Text Alignment</label>
                  <div className="flex gap-4">
                    {(['left', 'center', 'right'] as const).map((align) => (
                      <label key={align} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="text_alignment"
                          value={align}
                          checked={editingSlide.text_alignment === align}
                          onChange={(e) => setEditingSlide({ ...editingSlide, text_alignment: e.target.value as any })}
                          className="text-deep-teal focus:ring-deep-teal"
                        />
                        <span className="text-sm capitalize">{align}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="border-t pt-4">
                <h3 className="font-medium text-gray-900 mb-4">Call to Action Buttons</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-700">Primary Button</h4>
                    <input
                      type="text"
                      value={editingSlide.cta_text || ''}
                      onChange={(e) => setEditingSlide({ ...editingSlide, cta_text: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Button text"
                    />
                    <input
                      type="text"
                      value={editingSlide.cta_link || ''}
                      onChange={(e) => setEditingSlide({ ...editingSlide, cta_link: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="/about or https://..."
                    />
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-700">Secondary Button</h4>
                    <input
                      type="text"
                      value={editingSlide.cta2_text || ''}
                      onChange={(e) => setEditingSlide({ ...editingSlide, cta2_text: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Button text"
                    />
                    <input
                      type="text"
                      value={editingSlide.cta2_link || ''}
                      onChange={(e) => setEditingSlide({ ...editingSlide, cta2_link: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="/contact or https://..."
                    />
                  </div>
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Duration: {(editingSlide.duration || 5000) / 1000} seconds
                </label>
                <input
                  type="range"
                  min="3000"
                  max="15000"
                  step="1000"
                  value={editingSlide.duration || 5000}
                  onChange={(e) => setEditingSlide({ ...editingSlide, duration: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end p-4 border-t border-gray-200">
              <button
                onClick={() => setEditingSlide(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveSlide}
                className="px-4 py-2 bg-terracotta-red text-white rounded-lg hover:bg-terracotta-red-dark transition-colors"
              >
                {editingSlide.id ? 'Save Changes' : 'Create Slide'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-deep-teal mb-4">Delete Slide?</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this slide? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteSlide(deleteConfirm)}
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
