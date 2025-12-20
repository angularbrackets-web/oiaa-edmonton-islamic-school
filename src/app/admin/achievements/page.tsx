'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  PhotoIcon,
  TrophyIcon,
  EyeIcon,
  ArrowsUpDownIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'

interface Achievement {
  id: string
  title: string
  description: string
  date: string
  type: string
  icon: string
  featured: boolean
  order: number
  backgroundImage: string
  ctaText?: string
  ctaUrl?: string
  ctaStyle?: 'primary' | 'secondary'
}

export default function AchievementsManagementPage() {
  const [achievements, setAchievements] = useState<{achievements: Achievement[]} | null>(null)
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [uploading, setUploading] = useState(false)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    loadAchievements()
  }, [])

  const loadAchievements = async () => {
    try {
      const response = await fetch('/api/achievements')
      const data = await response.json()
      setAchievements(data)
    } catch (error) {
      setMessage('Error loading achievements data')
    }
  }

  // Save individual achievement (create or update)
  const saveIndividualAchievement = async (achievement: Achievement, isNew: boolean) => {
    setIsLoading(true)
    try {
      const url = isNew ? '/api/achievements' : `/api/achievements/${achievement.id}`
      const method = isNew ? 'POST' : 'PATCH'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isNew ? { achievement } : achievement)
      })

      if (response.ok) {
        await loadAchievements() // Reload from server for consistency
        setMessage(isNew ? 'Achievement added successfully!' : 'Achievement updated successfully!')
        setTimeout(() => setMessage(''), 3000)
        setShowForm(false)
        setEditingAchievement(null)
      } else {
        const errorData = await response.json()
        setMessage(errorData.error || 'Failed to save achievement')
      }
    } catch (error) {
      setMessage('Error saving achievement')
    }
    setIsLoading(false)
  }

  // Bulk save for reordering (still uses bulk update for efficiency)
  const saveAchievements = async (updatedAchievements: Achievement[]) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/achievements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ achievements: updatedAchievements })
      })

      if (response.ok) {
        setAchievements({ achievements: updatedAchievements })
        setMessage('Achievements updated successfully!')
        setTimeout(() => setMessage(''), 3000)
        setShowForm(false)
        setEditingAchievement(null)
      } else {
        setMessage('Failed to update achievements')
      }
    } catch (error) {
      setMessage('Error updating achievements')
    }
    setIsLoading(false)
  }

  const addNewAchievement = () => {
    const newAchievement: Achievement = {
      id: `achievement-${Date.now()}`,
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      type: 'academic',
      icon: 'Award',
      featured: true,
      order: (achievements?.achievements?.length || 0) + 1,
      backgroundImage: '/images/hero-1.jpg',
      ctaText: '',
      ctaUrl: '',
      ctaStyle: 'primary'
    }
    setEditingAchievement(newAchievement)
    setShowForm(true)
  }

  const editAchievement = (achievement: Achievement) => {
    setEditingAchievement(achievement)
    setShowForm(true)
  }

  const updateAchievement = (field: string, value: any) => {
    setEditingAchievement(prev => prev ? ({ ...prev, [field]: value }) : null)
  }

  const saveEditingAchievement = () => {
    if (!editingAchievement || !editingAchievement.title.trim()) {
      setMessage('Title is required')
      setTimeout(() => setMessage(''), 3000)
      return
    }

    // Check if this is a new achievement (id starts with 'achievement-') or existing (UUID)
    const isNew = editingAchievement.id.startsWith('achievement-')
    saveIndividualAchievement(editingAchievement, isNew)
  }

  const deleteAchievement = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/achievements/${id}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          await loadAchievements() // Reload from server
          setMessage('Achievement deleted successfully!')
          setTimeout(() => setMessage(''), 3000)
        } else {
          const errorData = await response.json()
          setMessage(errorData.error || 'Failed to delete achievement')
        }
      } catch (error) {
        setMessage('Error deleting achievement')
      }
      setIsLoading(false)
    }
  }

  const moveAchievement = (index: number, direction: 'up' | 'down') => {
    if (!achievements?.achievements) return
    
    const newList = [...achievements.achievements]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    
    if (newIndex >= 0 && newIndex < newList.length) {
      [newList[index], newList[newIndex]] = [newList[newIndex], newList[index]]
      
      // Update order numbers
      newList.forEach((achievement, idx) => {
        achievement.order = idx + 1
      })
      
      saveAchievements(newList)
    }
  }

  const uploadImage = async (file: File): Promise<string | null> => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'achievements')
      formData.append('alt', `Achievement: ${editingAchievement?.title || 'New Achievement'}`)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
        setMessage('Image uploaded successfully!')
        setTimeout(() => setMessage(''), 3000)
        return result.url
      } else {
        setMessage('Failed to upload image')
        return null
      }
    } catch (error) {
      setMessage('Error uploading image')
      return null
    } finally {
      setUploading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && editingAchievement) {
      const imageUrl = await uploadImage(file)
      if (imageUrl) {
        updateAchievement('backgroundImage', imageUrl)
      }
    }
  }

  const sortedAchievements = achievements?.achievements?.sort((a, b) => a.order - b.order) || []

  return (
    <AdminLayout title="Hero Achievements">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-deep-teal">Hero Section Achievements</h2>
            <p className="text-deep-teal/60">Manage achievement cards displayed in the hero section</p>
          </div>
          <button
            onClick={addNewAchievement}
            className="flex items-center gap-2 bg-deep-teal hover:bg-deep-teal-dark text-white px-4 py-2 rounded-lg transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            Add Achievement
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className="bg-sage-green-lighter border border-sage-green text-sage-green-darker p-4 rounded-lg">
            {message}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-soft-beige">
            <div className="flex items-center gap-3">
              <TrophyIcon className="w-8 h-8 text-deep-teal" />
              <div>
                <p className="text-2xl font-bold text-deep-teal">{achievements?.achievements?.length || 0}</p>
                <p className="text-sm text-deep-teal/60">Total Achievements</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-soft-beige">
            <div className="flex items-center gap-3">
              <EyeIcon className="w-8 h-8 text-sage-green" />
              <div>
                <p className="text-2xl font-bold text-deep-teal">
                  {achievements?.achievements?.filter(a => a.featured).length || 0}
                </p>
                <p className="text-sm text-deep-teal/60">Featured</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-soft-beige">
            <div className="flex items-center gap-3">
              <CalendarIcon className="w-8 h-8 text-terracotta-red" />
              <div>
                <p className="text-sm font-bold text-deep-teal">
                  {achievements?.achievements && achievements.achievements.length > 0 
                    ? new Date(Math.max.apply(Math, achievements.achievements.map(a => new Date(a.date).getTime()))).getFullYear()
                    : 'N/A'
                  }
                </p>
                <p className="text-sm text-deep-teal/60">Latest Year</p>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements List */}
        <div className="bg-white rounded-lg border border-soft-beige overflow-hidden">
          <div className="p-6 border-b border-soft-beige">
            <h3 className="text-lg font-semibold text-deep-teal">
              Achievement Cards ({sortedAchievements.length})
            </h3>
            <p className="text-sm text-deep-teal/60 mt-1">
              These cards are displayed in the hero section. Use the arrows to reorder them.
            </p>
          </div>
          
          <div className="divide-y divide-soft-beige">
            {sortedAchievements.map((achievement, index) => (
              <div key={achievement.id} className="p-6 hover:bg-soft-beige-lightest transition-colors">
                <div className="flex items-center gap-4">
                  {/* Achievement Preview */}
                  <div className="flex-shrink-0">
                    {achievement.backgroundImage && (
                      <img 
                        src={achievement.backgroundImage} 
                        alt={achievement.title}
                        className="w-16 h-10 object-cover rounded border"
                      />
                    )}
                  </div>
                  
                  {/* Achievement Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-terracotta-red text-white px-2 py-1 rounded text-xs font-medium">
                        #{achievement.order}
                      </span>
                      <h4 className="text-lg font-semibold text-deep-teal">{achievement.title}</h4>
                      <span className="bg-sage-green text-white px-2 py-1 rounded text-xs">
                        {achievement.type}
                      </span>
                      {achievement.featured && (
                        <span className="bg-wood text-white px-2 py-1 rounded text-xs">Featured</span>
                      )}
                    </div>
                    <p className="text-deep-teal/80 mb-1">{achievement.description}</p>
                    <p className="text-sm text-deep-teal/60">
                      {new Date(achievement.date).toLocaleDateString()} • Icon: {achievement.icon}
                    </p>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {/* Reorder buttons */}
                    <div className="flex flex-col">
                      <button
                        onClick={() => moveAchievement(index, 'up')}
                        disabled={index === 0}
                        className="p-1 text-deep-teal hover:bg-deep-teal-lighter rounded disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move up"
                      >
                        <ArrowsUpDownIcon className="w-4 h-4 rotate-180" />
                      </button>
                      <button
                        onClick={() => moveAchievement(index, 'down')}
                        disabled={index === sortedAchievements.length - 1}
                        className="p-1 text-deep-teal hover:bg-deep-teal-lighter rounded disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Move down"
                      >
                        <ArrowsUpDownIcon className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => editAchievement(achievement)}
                      className="p-2 bg-sage-green-lighter text-sage-green hover:bg-sage-green-light rounded-lg transition-colors"
                      title="Edit"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteAchievement(achievement.id, achievement.title)}
                      className="p-2 bg-terracotta-red-lighter text-terracotta-red hover:bg-terracotta-red-light rounded-lg transition-colors"
                      title="Delete"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {sortedAchievements.length === 0 && (
              <div className="p-8 text-center">
                <TrophyIcon className="w-12 h-12 text-deep-teal/40 mx-auto mb-4" />
                <p className="text-deep-teal/60">No achievements found</p>
                <button
                  onClick={addNewAchievement}
                  className="mt-4 text-deep-teal hover:text-deep-teal-dark transition-colors"
                >
                  Add your first achievement
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Achievement Form Modal */}
        {showForm && editingAchievement && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-soft-beige">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-deep-teal">
                    {editingAchievement.id.startsWith('achievement-') ? 'Add New Achievement' : 'Edit Achievement'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowForm(false)
                      setEditingAchievement(null)
                    }}
                    className="text-deep-teal/60 hover:text-deep-teal"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-deep-teal font-semibold mb-2">Title *</label>
                    <input
                      type="text"
                      value={editingAchievement.title}
                      onChange={(e) => updateAchievement('title', e.target.value)}
                      className="w-full p-3 border border-soft-beige rounded-lg focus:ring-2 focus:ring-deep-teal"
                      placeholder="Enter achievement title"
                    />
                  </div>
                  <div>
                    <label className="block text-deep-teal font-semibold mb-2">Date</label>
                    <input
                      type="date"
                      value={editingAchievement.date}
                      onChange={(e) => updateAchievement('date', e.target.value)}
                      className="w-full p-3 border border-soft-beige rounded-lg focus:ring-2 focus:ring-deep-teal"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-deep-teal font-semibold mb-2">Description</label>
                  <textarea
                    value={editingAchievement.description}
                    onChange={(e) => updateAchievement('description', e.target.value)}
                    rows={3}
                    className="w-full p-3 border border-soft-beige rounded-lg focus:ring-2 focus:ring-deep-teal"
                    placeholder="Describe the achievement..."
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-deep-teal font-semibold mb-2">Type</label>
                    <select
                      value={editingAchievement.type}
                      onChange={(e) => updateAchievement('type', e.target.value)}
                      className="w-full p-3 border border-soft-beige rounded-lg focus:ring-2 focus:ring-deep-teal"
                    >
                      <option value="academic">Academic</option>
                      <option value="community">Community</option>
                      <option value="construction">Construction</option>
                      <option value="sports">Sports</option>
                      <option value="arts">Arts</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-deep-teal font-semibold mb-2">Icon</label>
                    <select
                      value={editingAchievement.icon}
                      onChange={(e) => updateAchievement('icon', e.target.value)}
                      className="w-full p-3 border border-soft-beige rounded-lg focus:ring-2 focus:ring-deep-teal"
                    >
                      <option value="Award">Award</option>
                      <option value="Users">Users</option>
                      <option value="TrendingUp">Trending Up</option>
                      <option value="Star">Star</option>
                      <option value="Trophy">Trophy</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-deep-teal font-semibold mb-2">Order</label>
                    <input
                      type="number"
                      value={editingAchievement.order}
                      onChange={(e) => updateAchievement('order', parseInt(e.target.value) || 1)}
                      min="1"
                      className="w-full p-3 border border-soft-beige rounded-lg focus:ring-2 focus:ring-deep-teal"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-deep-teal font-semibold mb-2">Background Image</label>
                  
                  {/* Current Image Preview */}
                  {editingAchievement.backgroundImage && (
                    <div className="mb-3">
                      <img 
                        src={editingAchievement.backgroundImage} 
                        alt="Achievement background" 
                        className="w-full h-32 object-cover rounded border"
                      />
                      <p className="text-sm text-deep-teal/60 mt-1">Current image</p>
                    </div>
                  )}

                  {/* File Upload */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 bg-sage-green hover:bg-sage-green-dark text-white px-4 py-2 rounded-lg cursor-pointer transition-colors">
                        <PhotoIcon className="w-5 h-5" />
                        Upload Image
                        <input 
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploading}
                          className="hidden"
                        />
                      </label>
                      {uploading && (
                        <p className="text-sage-green text-sm">Uploading...</p>
                      )}
                    </div>
                    
                    {/* Manual URL Input */}
                    <div>
                      <label className="block text-sm text-deep-teal/80 mb-1">Or enter image URL:</label>
                      <input 
                        type="text"
                        value={editingAchievement.backgroundImage || ''}
                        onChange={(e) => updateAchievement('backgroundImage', e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        className="w-full p-2 border border-soft-beige rounded text-sm focus:ring-2 focus:ring-deep-teal"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editingAchievement.featured}
                      onChange={(e) => updateAchievement('featured', e.target.checked)}
                      className="w-4 h-4 text-deep-teal"
                    />
                    <span className="text-deep-teal font-semibold">Featured Achievement</span>
                  </label>
                </div>

                {/* CTA Button Configuration */}
                <div className="bg-soft-beige-lightest rounded-lg p-4 mb-6">
                  <h4 className="text-deep-teal font-semibold mb-3">Call to Action Button (Optional)</h4>
                  <p className="text-sm text-deep-teal/60 mb-4">Add a button to this slide that links to a page or action</p>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-deep-teal font-medium mb-2">Button Text</label>
                      <input
                        type="text"
                        value={editingAchievement.ctaText || ''}
                        onChange={(e) => updateAchievement('ctaText', e.target.value)}
                        className="w-full p-3 border border-soft-beige rounded-lg focus:ring-2 focus:ring-deep-teal"
                        placeholder="e.g., Learn More, Book Tour"
                      />
                    </div>
                    <div>
                      <label className="block text-deep-teal font-medium mb-2">Button Link</label>
                      <input
                        type="text"
                        value={editingAchievement.ctaUrl || ''}
                        onChange={(e) => updateAchievement('ctaUrl', e.target.value)}
                        className="w-full p-3 border border-soft-beige rounded-lg focus:ring-2 focus:ring-deep-teal"
                        placeholder="e.g., /tours, /admissions"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-deep-teal font-medium mb-2">Button Style</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="ctaStyle"
                          value="primary"
                          checked={editingAchievement.ctaStyle === 'primary' || !editingAchievement.ctaStyle}
                          onChange={(e) => updateAchievement('ctaStyle', e.target.value)}
                          className="w-4 h-4 text-deep-teal"
                        />
                        <span className="bg-terracotta-red text-white px-3 py-1 rounded text-sm">Primary (Filled)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="ctaStyle"
                          value="secondary"
                          checked={editingAchievement.ctaStyle === 'secondary'}
                          onChange={(e) => updateAchievement('ctaStyle', e.target.value)}
                          className="w-4 h-4 text-deep-teal"
                        />
                        <span className="border-2 border-deep-teal text-deep-teal px-3 py-1 rounded text-sm">Secondary (Outlined)</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={saveEditingAchievement}
                    disabled={isLoading}
                    className="bg-deep-teal hover:bg-deep-teal-dark text-white px-6 py-3 rounded-lg disabled:opacity-50 transition-colors"
                  >
                    {isLoading ? 'Saving...' : 'Save Achievement'}
                  </button>
                  <button
                    onClick={() => {
                      setShowForm(false)
                      setEditingAchievement(null)
                    }}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Usage Info */}
        <div className="bg-deep-teal-lighter rounded-lg p-6 border border-deep-teal">
          <h3 className="text-lg font-semibold text-deep-teal-darker mb-3">🏆 Hero Achievements</h3>
          <div className="text-deep-teal-dark space-y-2 text-sm">
            <p>• These achievement cards are displayed prominently in the hero section</p>
            <p>• Use the order field or arrow buttons to control the display sequence</p>
            <p>• Featured achievements get special visual treatment</p>
            <p>• Background images should be high-quality and relevant to the achievement</p>
            <p>• Changes are applied instantly to the live website</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}