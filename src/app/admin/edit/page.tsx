'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface SchoolInfo {
  school: {
    name: string
    tagline: string
    mission: string
    arabicText: string
  }
  contact: {
    address: {
      street: string
      city: string
      province: string
      postalCode: string
      country: string
    }
    phone: string
    email: string
    admissionsEmail: string
    hours: {
      weekdays: string
      saturday: string
      office: string
    }
  }
  features: Array<{
    title: string
    description: string
    icon: string
    color: string
  }>
}

export default function AdminEdit() {
  const [activeTab, setActiveTab] = useState('school-info')
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo | null>(null)
  const [programs, setPrograms] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const router = useRouter()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [schoolRes, programsRes] = await Promise.all([
        fetch('/api/school-info'),
        fetch('/api/programs')
      ])
      
      const schoolData = await schoolRes.json()
      const programsData = await programsRes.json()
      
      setSchoolInfo(schoolData)
      setPrograms(programsData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSchoolInfo = async () => {
    if (!schoolInfo) return
    
    setSaving(true)
    try {
      const response = await fetch('/api/school-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(schoolInfo)
      })
      
      if (response.ok) {
        setMessage('School information saved successfully!')
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('Error saving school information')
      }
    } catch (error) {
      setMessage('Error saving school information')
    } finally {
      setSaving(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
        setUploadedImages(prev => [...prev, result.url])
        setMessage(`File uploaded successfully: ${result.filename}`)
      } else {
        setMessage('Error uploading file')
      }
    } catch (error) {
      setMessage('Error uploading file')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-soft-beige-lightest flex items-center justify-center">
        <div className="text-2xl text-terracotta-red">Loading admin panel...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-soft-beige-lightest">
      {/* Header */}
      <div className="bg-terracotta-red text-warm-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Content Editor</h1>
              <p className="text-soft-beige-lightest">Edit your Islamic school website</p>
            </div>
            <button 
              onClick={() => router.push('/admin')}
              className="bg-wood hover:bg-wood-dark px-4 py-2 rounded-lg transition-colors"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="bg-sage-green-lighter border border-sage-green text-sage-green-darker px-4 py-3 rounded-lg">
            {message}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="bg-warm-white rounded-lg shadow-lg border border-soft-beige overflow-hidden">
          <div className="flex border-b border-soft-beige">
            <button
              onClick={() => setActiveTab('school-info')}
              className={`px-6 py-4 font-semibold transition-colors ${
                activeTab === 'school-info'
                  ? 'bg-terracotta-red text-warm-white'
                  : 'text-deep-teal hover:bg-soft-beige-lightest'
              }`}
            >
              🏫 School Information
            </button>
            <button
              onClick={() => setActiveTab('programs')}
              className={`px-6 py-4 font-semibold transition-colors ${
                activeTab === 'programs'
                  ? 'bg-terracotta-red text-warm-white'
                  : 'text-deep-teal hover:bg-soft-beige-lightest'
              }`}
            >
              🎓 Programs
            </button>
            <button
              onClick={() => setActiveTab('media')}
              className={`px-6 py-4 font-semibold transition-colors ${
                activeTab === 'media'
                  ? 'bg-terracotta-red text-warm-white'
                  : 'text-deep-teal hover:bg-soft-beige-lightest'
              }`}
            >
              📷 Media Upload
            </button>
          </div>

          {/* School Information Tab */}
          {activeTab === 'school-info' && schoolInfo && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-terracotta-red mb-6">Edit School Information</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-deep-teal mb-2">School Name</label>
                  <input
                    type="text"
                    value={schoolInfo.school.name}
                    onChange={(e) => setSchoolInfo({
                      ...schoolInfo,
                      school: { ...schoolInfo.school, name: e.target.value }
                    })}
                    className="w-full px-4 py-3 border border-soft-beige rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-deep-teal mb-2">Tagline</label>
                  <textarea
                    value={schoolInfo.school.tagline}
                    onChange={(e) => setSchoolInfo({
                      ...schoolInfo,
                      school: { ...schoolInfo.school, tagline: e.target.value }
                    })}
                    rows={3}
                    className="w-full px-4 py-3 border border-soft-beige rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-deep-teal mb-2">Mission Statement</label>
                  <textarea
                    value={schoolInfo.school.mission}
                    onChange={(e) => setSchoolInfo({
                      ...schoolInfo,
                      school: { ...schoolInfo.school, mission: e.target.value }
                    })}
                    rows={4}
                    className="w-full px-4 py-3 border border-soft-beige rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-deep-teal mb-2">Arabic Text</label>
                  <input
                    type="text"
                    value={schoolInfo.school.arabicText}
                    onChange={(e) => setSchoolInfo({
                      ...schoolInfo,
                      school: { ...schoolInfo.school, arabicText: e.target.value }
                    })}
                    className="w-full px-4 py-3 border border-soft-beige rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent arabic-text"
                    dir="rtl"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-deep-teal mb-2">Phone</label>
                    <input
                      type="text"
                      value={schoolInfo.contact.phone}
                      onChange={(e) => setSchoolInfo({
                        ...schoolInfo,
                        contact: { ...schoolInfo.contact, phone: e.target.value }
                      })}
                      className="w-full px-4 py-3 border border-soft-beige rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-deep-teal mb-2">Email</label>
                    <input
                      type="email"
                      value={schoolInfo.contact.email}
                      onChange={(e) => setSchoolInfo({
                        ...schoolInfo,
                        contact: { ...schoolInfo.contact, email: e.target.value }
                      })}
                      className="w-full px-4 py-3 border border-soft-beige rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSaveSchoolInfo}
                  disabled={saving}
                  className="bg-terracotta-red hover:bg-terracotta-red-dark text-warm-white px-8 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save School Information'}
                </button>
              </div>
            </div>
          )}

          {/* Media Upload Tab */}
          {activeTab === 'media' && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-terracotta-red mb-6">Media Management</h2>
              
              <div className="space-y-8">
                {/* Upload Section */}
                <div className="border-2 border-dashed border-sage-green rounded-lg p-8 text-center">
                  <div className="text-4xl mb-4">📁</div>
                  <h3 className="text-lg font-semibold text-deep-teal mb-4">Upload Images, Videos, or Documents</h3>
                  <p className="text-sage-green mb-6">Supported: JPEG, PNG, GIF, WebP, MP4, WebM, PDF</p>
                  
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    accept="image/*,video/*,.pdf"
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="bg-sage-green hover:bg-sage-green-dark text-warm-white px-6 py-3 rounded-lg font-semibold cursor-pointer transition-colors inline-block"
                  >
                    Choose File to Upload
                  </label>
                </div>

                {/* Recent Uploads */}
                {uploadedImages.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-deep-teal mb-4">Recent Uploads</h3>
                    <div className="grid md:grid-cols-4 gap-4">
                      {uploadedImages.map((url, index) => (
                        <div key={index} className="border border-soft-beige rounded-lg p-4">
                          <img src={url} alt={`Upload ${index + 1}`} className="w-full h-32 object-cover rounded mb-2" />
                          <p className="text-xs text-sage-green break-all">{url}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Usage Instructions */}
                <div className="bg-sage-green-lighter rounded-lg p-6 border border-sage-green">
                  <h3 className="text-lg font-semibold text-sage-green-darker mb-3">📝 How to Use Uploaded Media</h3>
                  <div className="text-sage-green-dark space-y-2 text-sm">
                    <p>• <strong>Images:</strong> Copy the URL and use in your content or website</p>
                    <p>• <strong>Videos:</strong> Embed in pages for school tours or presentations</p>
                    <p>• <strong>Documents:</strong> Link to PDFs for forms, policies, or handbooks</p>
                    <p>• <strong>File Location:</strong> Files are stored in <code>/public/uploads/</code></p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Programs Tab */}
          {activeTab === 'programs' && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-terracotta-red mb-6">Edit Programs</h2>
              <div className="text-sage-green">
                Programs editing interface coming soon... 
                <br />For now, you can edit programs in <code>src/data/programs.json</code>
              </div>
            </div>
          )}
        </div>

        {/* Quick Preview */}
        <div className="mt-8 bg-warm-white rounded-lg shadow-lg border border-soft-beige p-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-terracotta-red">Quick Actions</h3>
            <a 
              href="/" 
              target="_blank" 
              className="bg-wood hover:bg-wood-dark text-warm-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              🌐 View Live Website
            </a>
          </div>
          <p className="text-deep-teal mt-2">Changes are saved instantly and appear on the live website immediately.</p>
        </div>
      </div>
    </div>
  )
}