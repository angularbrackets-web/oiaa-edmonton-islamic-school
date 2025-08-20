'use client'

import { useState, useEffect } from 'react'

export default function AdminPanel() {
  const [schoolInfo, setSchoolInfo] = useState(null)
  const [programs, setPrograms] = useState(null)
  const [news, setNews] = useState(null)

  useEffect(() => {
    // Load current content
    Promise.all([
      fetch('/api/school-info').then(r => r.json()),
      fetch('/api/programs').then(r => r.json()),
      fetch('/api/news').then(r => r.json())
    ]).then(([schoolData, programsData, newsData]) => {
      setSchoolInfo(schoolData)
      setPrograms(programsData)
      setNews(newsData)
    })
  }, [])

  return (
    <div className="min-h-screen bg-soft-beige-lightest">
      {/* Header */}
      <div className="bg-terracotta-red text-warm-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">OIA Academy Admin Panel</h1>
              <p className="text-soft-beige-lightest">Content Management System</p>
            </div>
            <div className="bg-wood rounded-full p-3">
              <span className="text-2xl">⚙️</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Dashboard Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-warm-white rounded-lg p-6 shadow-lg border border-soft-beige">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-deep-teal">School Info</h3>
                <p className="text-terracotta-red text-2xl font-bold">✓</p>
              </div>
              <div className="text-3xl">🏫</div>
            </div>
          </div>

          <div className="bg-warm-white rounded-lg p-6 shadow-lg border border-soft-beige">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-deep-teal">Programs</h3>
                <p className="text-terracotta-red text-2xl font-bold">{programs?.programs?.length || 0}</p>
              </div>
              <div className="text-3xl">🎓</div>
            </div>
          </div>

          <div className="bg-warm-white rounded-lg p-6 shadow-lg border border-soft-beige">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-deep-teal">News</h3>
                <p className="text-terracotta-red text-2xl font-bold">{news?.news?.length || 0}</p>
              </div>
              <div className="text-3xl">📰</div>
            </div>
          </div>

          <div className="bg-warm-white rounded-lg p-6 shadow-lg border border-soft-beige">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-deep-teal">Website</h3>
                <p className="text-sage-green text-sm font-bold">LIVE</p>
              </div>
              <div className="text-3xl">🌐</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-warm-white rounded-lg p-8 shadow-lg border border-soft-beige mb-8">
          <h2 className="text-2xl font-bold text-terracotta-red mb-6">Content Management</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <a href="/admin/edit" className="bg-terracotta-red hover:bg-terracotta-red-dark text-warm-white p-6 rounded-lg text-left transition-colors block">
              <div className="text-2xl mb-3">🏫</div>
              <h3 className="text-lg font-semibold mb-2">School Information</h3>
              <p className="text-sm opacity-90">Edit school name, mission, and contact details</p>
            </a>

            <a href="/admin/edit" className="bg-sage-green hover:bg-sage-green-dark text-warm-white p-6 rounded-lg text-left transition-colors block">
              <div className="text-2xl mb-3">🎓</div>
              <h3 className="text-lg font-semibold mb-2">Programs</h3>
              <p className="text-sm opacity-90">Manage academic programs and curriculum</p>
            </a>

            <a href="/admin/edit" className="bg-wood hover:bg-wood-dark text-warm-white p-6 rounded-lg text-left transition-colors block">
              <div className="text-2xl mb-3">📰</div>
              <h3 className="text-lg font-semibold mb-2">Media & Files</h3>
              <p className="text-sm opacity-90">Upload images, videos, and documents</p>
            </a>
          </div>
        </div>

        {/* Content Preview */}
        <div className="bg-warm-white rounded-lg p-8 shadow-lg border border-soft-beige">
          <h2 className="text-2xl font-bold text-terracotta-red mb-6">Content Preview</h2>
          
          <div className="space-y-6">
            <div className="border-l-4 border-terracotta-red pl-4">
              <h3 className="text-lg font-semibold text-deep-teal">Current School Name</h3>
              <p className="text-sage-green">{schoolInfo?.school?.name || 'Loading...'}</p>
            </div>

            <div className="border-l-4 border-sage-green pl-4">
              <h3 className="text-lg font-semibold text-deep-teal">Active Programs</h3>
              <p className="text-sage-green">{programs?.programs?.length || 0} programs configured</p>
            </div>

            <div className="border-l-4 border-wood pl-4">
              <h3 className="text-lg font-semibold text-deep-teal">Latest News</h3>
              <p className="text-sage-green">
                {news?.news?.find(n => n.featured)?.title || 'No featured news'}
              </p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-sage-green-lighter rounded-lg p-6 border border-sage-green">
          <h3 className="text-lg font-semibold text-sage-green-darker mb-3">📝 How to Edit Content</h3>
          <div className="text-sage-green-dark space-y-2 text-sm">
            <p>• <strong>School Info:</strong> Edit <code>src/data/school-info.json</code></p>
            <p>• <strong>Programs:</strong> Edit <code>src/data/programs.json</code></p>
            <p>• <strong>News:</strong> Edit <code>src/data/news.json</code></p>
            <p>• Changes are applied instantly after saving the files</p>
            <p>• <strong>Website:</strong> <a href="/" className="underline text-terracotta-red">View Live Site</a></p>
          </div>
        </div>
      </div>
    </div>
  )
}