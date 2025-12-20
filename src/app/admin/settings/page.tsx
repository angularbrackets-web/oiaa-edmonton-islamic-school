'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import toast from 'react-hot-toast'
import {
  BuildingOfficeIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'

interface Setting {
  id: string
  setting_key: string
  setting_value: string | null
  setting_type: string
  category: string
  label: string
  description: string | null
}

const CATEGORY_ICONS: Record<string, any> = {
  general: BuildingOfficeIcon,
  contact: PhoneIcon,
  hours: ClockIcon,
  social: GlobeAltIcon
}

const CATEGORY_LABELS: Record<string, string> = {
  general: 'School Information',
  contact: 'Contact Details',
  hours: 'Operating Hours',
  social: 'Social Media'
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([])
  const [values, setValues] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/site-settings')
      const data = await response.json()

      if (data.success) {
        setSettings(data.data || [])
        // Initialize values from settings
        const initialValues: Record<string, string> = {}
        data.data?.forEach((s: Setting) => {
          initialValues[s.setting_key] = s.setting_value || ''
        })
        setValues(initialValues)
        setHasChanges(false)
      } else {
        toast.error('Failed to load settings')
      }
    } catch (error) {
      console.error('Error loading settings:', error)
      toast.error('Error loading settings')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (key: string, value: string) => {
    setValues(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const saveSettings = async () => {
    setSaving(true)
    const toastId = toast.loading('Saving settings...')

    try {
      const response = await fetch('/api/site-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: values })
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Settings saved successfully!', { id: toastId })
        setHasChanges(false)
      } else {
        toast.error(data.error || 'Failed to save settings', { id: toastId })
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Error saving settings', { id: toastId })
    } finally {
      setSaving(false)
    }
  }

  // Group settings by category
  const groupedSettings = settings.reduce((acc, setting) => {
    const category = setting.category || 'general'
    if (!acc[category]) acc[category] = []
    acc[category].push(setting)
    return acc
  }, {} as Record<string, Setting[]>)

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-terracotta-red mx-auto mb-4"></div>
            <p className="text-gray-600">Loading settings...</p>
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
              Site Settings
            </h1>
            <p className="text-gray-600">
              Manage contact information displayed in header and footer
            </p>
          </div>
          {hasChanges && (
            <button
              onClick={saveSettings}
              disabled={saving}
              className="px-6 py-3 bg-terracotta-red text-white rounded-lg hover:bg-terracotta-red-dark transition-colors font-semibold shadow-lg disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          )}
        </div>

        {/* Settings by Category */}
        <div className="space-y-8">
          {Object.entries(CATEGORY_LABELS).map(([category, label]) => {
            const categorySettings = groupedSettings[category] || []
            if (categorySettings.length === 0) return null

            const CategoryIcon = CATEGORY_ICONS[category] || BuildingOfficeIcon

            return (
              <div key={category} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <CategoryIcon className="w-6 h-6 text-deep-teal" />
                    <h2 className="text-lg font-bold text-deep-teal">{label}</h2>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {categorySettings.map((setting) => (
                    <div key={setting.id}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {setting.label}
                      </label>
                      {setting.description && (
                        <p className="text-xs text-gray-500 mb-2">{setting.description}</p>
                      )}

                      {setting.setting_key.includes('email') ? (
                        <div className="relative">
                          <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="email"
                            value={values[setting.setting_key] || ''}
                            onChange={(e) => handleChange(setting.setting_key, e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-teal focus:border-transparent"
                            placeholder={setting.label}
                          />
                        </div>
                      ) : setting.setting_key.includes('phone') ? (
                        <div className="relative">
                          <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="tel"
                            value={values[setting.setting_key] || ''}
                            onChange={(e) => handleChange(setting.setting_key, e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-teal focus:border-transparent"
                            placeholder={setting.label}
                          />
                        </div>
                      ) : setting.setting_key.includes('address') ? (
                        <div className="relative">
                          <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            value={values[setting.setting_key] || ''}
                            onChange={(e) => handleChange(setting.setting_key, e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-teal focus:border-transparent"
                            placeholder={setting.label}
                          />
                        </div>
                      ) : setting.setting_key.includes('social') ? (
                        <div className="relative">
                          <GlobeAltIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="url"
                            value={values[setting.setting_key] || ''}
                            onChange={(e) => handleChange(setting.setting_key, e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-teal focus:border-transparent"
                            placeholder="https://..."
                          />
                        </div>
                      ) : (
                        <input
                          type="text"
                          value={values[setting.setting_key] || ''}
                          onChange={(e) => handleChange(setting.setting_key, e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-deep-teal focus:border-transparent"
                          placeholder={setting.label}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Save Button (fixed at bottom when scrolling) */}
        {hasChanges && (
          <div className="sticky bottom-4 mt-8 flex justify-end">
            <button
              onClick={saveSettings}
              disabled={saving}
              className="px-8 py-4 bg-terracotta-red text-white rounded-lg hover:bg-terracotta-red-dark transition-colors font-semibold shadow-xl disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save All Changes'}
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
