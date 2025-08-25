'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { 
  BuildingOfficeIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClockIcon,
  GlobeAltIcon,
  CheckCircleIcon,
  PencilIcon
} from '@heroicons/react/24/outline'

interface SchoolInfo {
  school: {
    name: string
    arabic_name?: string
    established: string
    mission: string
    vision: string
    values: string[]
    contact: {
      phone: string
      email: string
      address: string
      website?: string
    }
    hours: {
      weekdays: string
      weekend?: string
    }
    social_media?: {
      facebook?: string
      instagram?: string
      twitter?: string
    }
    stats?: {
      students: number
      teachers: number
      years_serving: number
    }
  }
}

export default function SchoolInformationPage() {
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo | null>(null)
  const [editingSchool, setEditingSchool] = useState<SchoolInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSchoolInfo()
  }, [])

  const loadSchoolInfo = async () => {
    try {
      const response = await fetch('/api/school-info')
      const data = await response.json()
      setSchoolInfo(data)
    } catch (error) {
      setMessage('Error loading school information')
    } finally {
      setLoading(false)
    }
  }

  const saveSchoolInfo = async (data: SchoolInfo) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/school-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      if (response.ok) {
        setSchoolInfo(data)
        setMessage('School information updated successfully!')
        setTimeout(() => setMessage(''), 3000)
        setShowForm(false)
        setEditingSchool(null)
      } else {
        setMessage('Failed to update school information')
      }
    } catch (error) {
      setMessage('Error updating school information')
    }
    setIsLoading(false)
  }

  const startEditing = () => {
    setEditingSchool(schoolInfo ? JSON.parse(JSON.stringify(schoolInfo)) : {
      school: {
        name: '',
        arabic_name: '',
        established: '',
        mission: '',
        vision: '',
        values: [],
        contact: {
          phone: '',
          email: '',
          address: '',
          website: ''
        },
        hours: {
          weekdays: '',
          weekend: ''
        },
        social_media: {
          facebook: '',
          instagram: '',
          twitter: ''
        },
        stats: {
          students: 0,
          teachers: 0,
          years_serving: 0
        }
      }
    })
    setShowForm(true)
  }

  const updateSchoolField = (path: string, value: any) => {
    if (!editingSchool) return
    
    const pathArray = path.split('.')
    const newSchool = JSON.parse(JSON.stringify(editingSchool))
    
    let current = newSchool
    for (let i = 0; i < pathArray.length - 1; i++) {
      current = current[pathArray[i]]
    }
    current[pathArray[pathArray.length - 1]] = value
    
    setEditingSchool(newSchool)
  }

  const updateValues = (values: string) => {
    const valuesArray = values.split('\n').filter(v => v.trim())
    updateSchoolField('school.values', valuesArray)
  }

  if (loading) {
    return (
      <AdminLayout title="School Information">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deep-teal"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="School Information">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-deep-teal">School Information</h2>
            <p className="text-deep-teal/60">Manage basic school details and contact information</p>
          </div>
          <button
            onClick={startEditing}
            className="flex items-center gap-2 bg-terracotta-red hover:bg-terracotta-red-dark text-white px-4 py-2 rounded-lg transition-colors"
          >
            <PencilIcon className="w-5 h-5" />
            Edit Information
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className="bg-sage-green-lighter border border-sage-green text-sage-green-darker p-4 rounded-lg">
            {message}
          </div>
        )}

        {/* School Information Display */}
        {schoolInfo && (
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg p-6 border border-soft-beige">
              <div className="flex items-center gap-3 mb-6">
                <BuildingOfficeIcon className="w-8 h-8 text-terracotta-red" />
                <h3 className="text-xl font-bold text-deep-teal">Basic Information</h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-deep-teal mb-2">School Name</label>
                  <p className="text-lg font-semibold text-deep-teal">{schoolInfo.school.name}</p>
                  {schoolInfo.school.arabic_name && (
                    <>
                      <label className="block text-sm font-medium text-deep-teal mb-2 mt-4">Arabic Name</label>
                      <p className="text-lg text-deep-teal" dir="rtl">{schoolInfo.school.arabic_name}</p>
                    </>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-deep-teal mb-2">Established</label>
                  <p className="text-lg text-deep-teal">{schoolInfo.school.established}</p>
                </div>
              </div>
            </div>

            {/* Mission & Vision */}
            <div className="bg-white rounded-lg p-6 border border-soft-beige">
              <h3 className="text-xl font-bold text-deep-teal mb-6">Mission & Vision</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-deep-teal mb-2">Mission Statement</label>
                  <p className="text-deep-teal leading-relaxed">{schoolInfo.school.mission}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-deep-teal mb-2">Vision Statement</label>
                  <p className="text-deep-teal leading-relaxed">{schoolInfo.school.vision}</p>
                </div>
                
                {schoolInfo.school.values && schoolInfo.school.values.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-deep-teal mb-2">Core Values</label>
                    <ul className="list-disc list-inside space-y-1">
                      {schoolInfo.school.values.map((value, index) => (
                        <li key={index} className="text-deep-teal">{value}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg p-6 border border-soft-beige">
              <h3 className="text-xl font-bold text-deep-teal mb-6">Contact Information</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <PhoneIcon className="w-5 h-5 text-sage-green" />
                    <div>
                      <label className="block text-sm font-medium text-deep-teal">Phone</label>
                      <p className="text-deep-teal">{schoolInfo.school.contact?.phone || 'Not provided'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <EnvelopeIcon className="w-5 h-5 text-sage-green" />
                    <div>
                      <label className="block text-sm font-medium text-deep-teal">Email</label>
                      <p className="text-deep-teal">{schoolInfo.school.contact?.email || 'Not provided'}</p>
                    </div>
                  </div>
                  
                  {schoolInfo.school.contact?.website && (
                    <div className="flex items-center gap-3">
                      <GlobeAltIcon className="w-5 h-5 text-sage-green" />
                      <div>
                        <label className="block text-sm font-medium text-deep-teal">Website</label>
                        <p className="text-deep-teal">{schoolInfo.school.contact?.website}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <div className="flex items-start gap-3">
                    <MapPinIcon className="w-5 h-5 text-sage-green mt-1" />
                    <div>
                      <label className="block text-sm font-medium text-deep-teal">Address</label>
                      <p className="text-deep-teal leading-relaxed">{schoolInfo.school.contact?.address || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hours & Statistics */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* School Hours */}
              <div className="bg-white rounded-lg p-6 border border-soft-beige">
                <div className="flex items-center gap-3 mb-4">
                  <ClockIcon className="w-6 h-6 text-deep-teal" />
                  <h3 className="text-lg font-bold text-deep-teal">School Hours</h3>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-deep-teal">Weekdays</label>
                    <p className="text-deep-teal">{schoolInfo.school.hours?.weekdays || 'Not provided'}</p>
                  </div>
                  {schoolInfo.school.hours?.weekend && (
                    <div>
                      <label className="block text-sm font-medium text-deep-teal">Weekend</label>
                      <p className="text-deep-teal">{schoolInfo.school.hours?.weekend}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Statistics */}
              {schoolInfo.school.stats && (
                <div className="bg-white rounded-lg p-6 border border-soft-beige">
                  <h3 className="text-lg font-bold text-deep-teal mb-4">School Statistics</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-deep-teal">Students</span>
                      <span className="text-xl font-bold text-terracotta-red">{schoolInfo.school.stats.students}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-deep-teal">Teachers</span>
                      <span className="text-xl font-bold text-sage-green">{schoolInfo.school.stats.teachers}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-deep-teal">Years Serving</span>
                      <span className="text-xl font-bold text-deep-teal">{schoolInfo.school.stats.years_serving}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Social Media */}
            {schoolInfo.school.social_media && (
              <div className="bg-white rounded-lg p-6 border border-soft-beige">
                <h3 className="text-xl font-bold text-deep-teal mb-6">Social Media</h3>
                
                <div className="grid md:grid-cols-3 gap-4">
                  {schoolInfo.school.social_media.facebook && (
                    <div>
                      <label className="block text-sm font-medium text-deep-teal mb-1">Facebook</label>
                      <a 
                        href={schoolInfo.school.social_media.facebook} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-terracotta-red hover:text-terracotta-red-dark transition-colors"
                      >
                        {schoolInfo.school.social_media.facebook}
                      </a>
                    </div>
                  )}
                  {schoolInfo.school.social_media.instagram && (
                    <div>
                      <label className="block text-sm font-medium text-deep-teal mb-1">Instagram</label>
                      <a 
                        href={schoolInfo.school.social_media.instagram} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-terracotta-red hover:text-terracotta-red-dark transition-colors"
                      >
                        {schoolInfo.school.social_media.instagram}
                      </a>
                    </div>
                  )}
                  {schoolInfo.school.social_media.twitter && (
                    <div>
                      <label className="block text-sm font-medium text-deep-teal mb-1">Twitter</label>
                      <a 
                        href={schoolInfo.school.social_media.twitter} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-terracotta-red hover:text-terracotta-red-dark transition-colors"
                      >
                        {schoolInfo.school.social_media.twitter}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* No Data State */}
        {!schoolInfo && (
          <div className="bg-white rounded-lg p-8 border border-soft-beige text-center">
            <BuildingOfficeIcon className="w-12 h-12 text-deep-teal/40 mx-auto mb-4" />
            <p className="text-deep-teal/60 mb-4">No school information found</p>
            <button
              onClick={startEditing}
              className="text-terracotta-red hover:text-terracotta-red-dark transition-colors"
            >
              Add school information
            </button>
          </div>
        )}

        {/* Edit Form Modal */}
        {showForm && editingSchool && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-soft-beige">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-deep-teal">Edit School Information</h3>
                  <button
                    onClick={() => {
                      setShowForm(false)
                      setEditingSchool(null)
                    }}
                    className="text-deep-teal/60 hover:text-deep-teal"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Basic Information */}
                <div>
                  <h4 className="text-lg font-semibold text-deep-teal mb-4">Basic Information</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-deep-teal font-semibold mb-2">School Name *</label>
                      <input
                        type="text"
                        value={editingSchool.school.name}
                        onChange={(e) => updateSchoolField('school.name', e.target.value)}
                        className="w-full p-3 border border-soft-beige rounded-lg focus:ring-2 focus:ring-terracotta-red"
                        placeholder="Enter school name"
                      />
                    </div>
                    <div>
                      <label className="block text-deep-teal font-semibold mb-2">Arabic Name</label>
                      <input
                        type="text"
                        value={editingSchool.school.arabic_name || ''}
                        onChange={(e) => updateSchoolField('school.arabic_name', e.target.value)}
                        className="w-full p-3 border border-soft-beige rounded-lg focus:ring-2 focus:ring-terracotta-red"
                        placeholder="Enter Arabic name"
                        dir="rtl"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-deep-teal font-semibold mb-2">Established</label>
                      <input
                        type="text"
                        value={editingSchool.school.established}
                        onChange={(e) => updateSchoolField('school.established', e.target.value)}
                        className="w-full p-3 border border-soft-beige rounded-lg focus:ring-2 focus:ring-terracotta-red"
                        placeholder="e.g. 2010 or September 2010"
                      />
                    </div>
                  </div>
                </div>

                {/* Mission & Vision */}
                <div>
                  <h4 className="text-lg font-semibold text-deep-teal mb-4">Mission & Vision</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-deep-teal font-semibold mb-2">Mission Statement</label>
                      <textarea
                        value={editingSchool.school.mission}
                        onChange={(e) => updateSchoolField('school.mission', e.target.value)}
                        rows={3}
                        className="w-full p-3 border border-soft-beige rounded-lg focus:ring-2 focus:ring-terracotta-red"
                        placeholder="Enter school mission statement"
                      />
                    </div>
                    <div>
                      <label className="block text-deep-teal font-semibold mb-2">Vision Statement</label>
                      <textarea
                        value={editingSchool.school.vision}
                        onChange={(e) => updateSchoolField('school.vision', e.target.value)}
                        rows={3}
                        className="w-full p-3 border border-soft-beige rounded-lg focus:ring-2 focus:ring-terracotta-red"
                        placeholder="Enter school vision statement"
                      />
                    </div>
                    <div>
                      <label className="block text-deep-teal font-semibold mb-2">Core Values (one per line)</label>
                      <textarea
                        value={editingSchool.school.values?.join('\n') || ''}
                        onChange={(e) => updateValues(e.target.value)}
                        rows={4}
                        className="w-full p-3 border border-soft-beige rounded-lg focus:ring-2 focus:ring-terracotta-red"
                        placeholder="Excellence&#10;Integrity&#10;Compassion&#10;Innovation"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h4 className="text-lg font-semibold text-deep-teal mb-4">Contact Information</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-deep-teal font-semibold mb-2">Phone</label>
                      <input
                        type="tel"
                        value={editingSchool.school.contact.phone}
                        onChange={(e) => updateSchoolField('school.contact.phone', e.target.value)}
                        className="w-full p-3 border border-soft-beige rounded-lg focus:ring-2 focus:ring-terracotta-red"
                        placeholder="(780) 123-4567"
                      />
                    </div>
                    <div>
                      <label className="block text-deep-teal font-semibold mb-2">Email</label>
                      <input
                        type="email"
                        value={editingSchool.school.contact.email}
                        onChange={(e) => updateSchoolField('school.contact.email', e.target.value)}
                        className="w-full p-3 border border-soft-beige rounded-lg focus:ring-2 focus:ring-terracotta-red"
                        placeholder="info@oiaaedmonton.ca"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-deep-teal font-semibold mb-2">Address</label>
                      <textarea
                        value={editingSchool.school.contact.address}
                        onChange={(e) => updateSchoolField('school.contact.address', e.target.value)}
                        rows={2}
                        className="w-full p-3 border border-soft-beige rounded-lg focus:ring-2 focus:ring-terracotta-red"
                        placeholder="Enter school address"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-deep-teal font-semibold mb-2">Website</label>
                      <input
                        type="url"
                        value={editingSchool.school.contact.website || ''}
                        onChange={(e) => updateSchoolField('school.contact.website', e.target.value)}
                        className="w-full p-3 border border-soft-beige rounded-lg focus:ring-2 focus:ring-terracotta-red"
                        placeholder="https://www.oiaaedmonton.ca"
                      />
                    </div>
                  </div>
                </div>

                {/* School Hours */}
                <div>
                  <h4 className="text-lg font-semibold text-deep-teal mb-4">School Hours</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-deep-teal font-semibold mb-2">Weekdays</label>
                      <input
                        type="text"
                        value={editingSchool.school.hours.weekdays}
                        onChange={(e) => updateSchoolField('school.hours.weekdays', e.target.value)}
                        className="w-full p-3 border border-soft-beige rounded-lg focus:ring-2 focus:ring-terracotta-red"
                        placeholder="8:00 AM - 3:30 PM"
                      />
                    </div>
                    <div>
                      <label className="block text-deep-teal font-semibold mb-2">Weekend (Optional)</label>
                      <input
                        type="text"
                        value={editingSchool.school.hours.weekend || ''}
                        onChange={(e) => updateSchoolField('school.hours.weekend', e.target.value)}
                        className="w-full p-3 border border-soft-beige rounded-lg focus:ring-2 focus:ring-terracotta-red"
                        placeholder="Saturday: 9:00 AM - 12:00 PM"
                      />
                    </div>
                  </div>
                </div>

                {/* Statistics */}
                <div>
                  <h4 className="text-lg font-semibold text-deep-teal mb-4">Statistics</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-deep-teal font-semibold mb-2">Number of Students</label>
                      <input
                        type="number"
                        value={editingSchool.school.stats?.students || 0}
                        onChange={(e) => updateSchoolField('school.stats.students', parseInt(e.target.value) || 0)}
                        className="w-full p-3 border border-soft-beige rounded-lg focus:ring-2 focus:ring-terracotta-red"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-deep-teal font-semibold mb-2">Number of Teachers</label>
                      <input
                        type="number"
                        value={editingSchool.school.stats?.teachers || 0}
                        onChange={(e) => updateSchoolField('school.stats.teachers', parseInt(e.target.value) || 0)}
                        className="w-full p-3 border border-soft-beige rounded-lg focus:ring-2 focus:ring-terracotta-red"
                        min="0"
                      />
                    </div>
                    <div>
                      <label className="block text-deep-teal font-semibold mb-2">Years Serving Community</label>
                      <input
                        type="number"
                        value={editingSchool.school.stats?.years_serving || 0}
                        onChange={(e) => updateSchoolField('school.stats.years_serving', parseInt(e.target.value) || 0)}
                        className="w-full p-3 border border-soft-beige rounded-lg focus:ring-2 focus:ring-terracotta-red"
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div>
                  <h4 className="text-lg font-semibold text-deep-teal mb-4">Social Media (Optional)</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-deep-teal font-semibold mb-2">Facebook</label>
                      <input
                        type="url"
                        value={editingSchool.school.social_media?.facebook || ''}
                        onChange={(e) => updateSchoolField('school.social_media.facebook', e.target.value)}
                        className="w-full p-3 border border-soft-beige rounded-lg focus:ring-2 focus:ring-terracotta-red"
                        placeholder="https://facebook.com/..."
                      />
                    </div>
                    <div>
                      <label className="block text-deep-teal font-semibold mb-2">Instagram</label>
                      <input
                        type="url"
                        value={editingSchool.school.social_media?.instagram || ''}
                        onChange={(e) => updateSchoolField('school.social_media.instagram', e.target.value)}
                        className="w-full p-3 border border-soft-beige rounded-lg focus:ring-2 focus:ring-terracotta-red"
                        placeholder="https://instagram.com/..."
                      />
                    </div>
                    <div>
                      <label className="block text-deep-teal font-semibold mb-2">Twitter</label>
                      <input
                        type="url"
                        value={editingSchool.school.social_media?.twitter || ''}
                        onChange={(e) => updateSchoolField('school.social_media.twitter', e.target.value)}
                        className="w-full p-3 border border-soft-beige rounded-lg focus:ring-2 focus:ring-terracotta-red"
                        placeholder="https://twitter.com/..."
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => saveSchoolInfo(editingSchool)}
                    disabled={isLoading || !editingSchool.school.name.trim()}
                    className="bg-terracotta-red hover:bg-terracotta-red-dark text-white px-6 py-3 rounded-lg disabled:opacity-50 transition-colors"
                  >
                    {isLoading ? 'Saving...' : 'Save Information'}
                  </button>
                  <button
                    onClick={() => {
                      setShowForm(false)
                      setEditingSchool(null)
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
        <div className="bg-terracotta-red-lighter rounded-lg p-6 border border-terracotta-red">
          <h3 className="text-lg font-semibold text-terracotta-red-darker mb-3">🏫 School Information</h3>
          <div className="text-terracotta-red-dark space-y-2 text-sm">
            <p>• This information is displayed throughout the website including the hero section and about page</p>
            <p>• School name and mission are prominently featured on the homepage</p>
            <p>• Contact information is used in the footer and contact sections</p>
            <p>• Statistics help showcase the school's impact and growth</p>
            <p>• All fields marked with * are required for proper website display</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}