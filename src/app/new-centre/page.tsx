'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import PrayerTimes from '@/components/PrayerTimes'

interface NewCentreData {
  newCentre: {
    title: string
    description: string
    vision: string
    callToAction: string
    features: Array<{
      title: string
      description: string
      icon: string
    }>
    gallery: {
      renderings: string[]
      groundBreaking: string[]
    }
  }
}

export default function NewCentrePage() {
  const [centreData, setCentreData] = useState<NewCentreData | null>(null)
  const [activeGallery, setActiveGallery] = useState<'renderings' | 'groundBreaking'>('renderings')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/new-centre')
      .then(res => res.json())
      .then(data => {
        setCentreData(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error loading new centre data:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-soft-beige-lightest">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="animate-pulse space-y-8">
            <div className="h-16 bg-soft-beige rounded max-w-2xl mx-auto"></div>
            <div className="h-48 bg-soft-beige rounded"></div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="h-64 bg-soft-beige rounded"></div>
              <div className="h-64 bg-soft-beige rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!centreData) {
    return (
      <div className="min-h-screen bg-soft-beige-lightest flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-terracotta-red mb-4">
            Unable to load new centre information
          </h1>
          <Link href="/" className="text-sage-green hover:text-sage-green-dark">
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  const { newCentre } = centreData

  return (
    <div className="min-h-screen bg-soft-beige-lightest">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-terracotta-red to-deep-teal text-warm-white py-20">
        <div className="absolute inset-0 islamic-pattern opacity-10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {newCentre.title}
          </h1>
          <p className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed">
            {newCentre.description}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-16">
            {/* Vision Section */}
            <section>
              <h2 className="text-3xl md:text-4xl font-bold text-terracotta-red mb-8">
                Our Vision
              </h2>
              <div className="bg-warm-white rounded-lg p-8 shadow-lg border border-soft-beige">
                <p className="text-lg text-deep-teal leading-relaxed mb-6">
                  {newCentre.vision}
                </p>
                <p className="text-lg text-deep-teal leading-relaxed">
                  {newCentre.callToAction}
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    href="/donate"
                    className="bg-terracotta-red hover:bg-terracotta-red-dark text-warm-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 shadow-md transform hover:scale-105"
                  >
                    Donate Now
                  </Link>
                  <Link
                    href="/events"
                    className="border-2 border-terracotta-red hover:bg-terracotta-red hover:text-warm-white text-terracotta-red px-8 py-3 rounded-lg font-semibold transition-all duration-300"
                  >
                    View Updates
                  </Link>
                </div>
              </div>
            </section>

            {/* Features Grid */}
            <section>
              <h2 className="text-3xl md:text-4xl font-bold text-terracotta-red mb-8">
                Centre Features
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {newCentre.features.map((feature, index) => (
                  <div key={index} className="bg-warm-white rounded-lg p-6 shadow-lg border border-soft-beige hover:shadow-xl transition-shadow duration-300">
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-bold text-terracotta-red mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-deep-teal">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Gallery Section */}
            <section>
              <h2 className="text-3xl md:text-4xl font-bold text-terracotta-red mb-8">
                Vision Gallery
              </h2>
              
              {/* Gallery Toggle */}
              <div className="flex rounded-lg bg-warm-white p-1 mb-8 shadow-md border border-soft-beige">
                <button
                  onClick={() => setActiveGallery('renderings')}
                  className={`flex-1 py-3 px-6 rounded-md font-semibold transition-all duration-200 ${
                    activeGallery === 'renderings'
                      ? 'bg-terracotta-red text-warm-white shadow-md'
                      : 'text-deep-teal hover:bg-soft-beige-lightest'
                  }`}
                >
                  Architectural Renderings
                </button>
                <button
                  onClick={() => setActiveGallery('groundBreaking')}
                  className={`flex-1 py-3 px-6 rounded-md font-semibold transition-all duration-200 ${
                    activeGallery === 'groundBreaking'
                      ? 'bg-terracotta-red text-warm-white shadow-md'
                      : 'text-deep-teal hover:bg-soft-beige-lightest'
                  }`}
                >
                  Ground Breaking Ceremony
                </button>
              </div>

              {/* Gallery Grid */}
              <div className="grid md:grid-cols-3 gap-4">
                {newCentre.gallery[activeGallery].map((imagePath, index) => (
                  <div
                    key={index}
                    className="relative aspect-square bg-soft-beige rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105"
                    onClick={() => setSelectedImage(imagePath)}
                  >
                    <Image
                      src={imagePath}
                      alt={`${activeGallery === 'renderings' ? 'Architectural rendering' : 'Ground breaking ceremony'} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Prayer Times Widget */}
            <PrayerTimes />

            {/* Progress Card */}
            <div className="bg-warm-white rounded-lg p-6 shadow-lg border border-soft-beige">
              <h3 className="text-xl font-bold text-terracotta-red mb-4">
                Project Progress
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-deep-teal">Fundraising</span>
                    <span className="text-terracotta-red font-semibold">42%</span>
                  </div>
                  <div className="w-full bg-soft-beige rounded-full h-3">
                    <div className="bg-terracotta-red h-3 rounded-full" style={{width: '42%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-deep-teal">Construction</span>
                    <span className="text-sage-green font-semibold">15%</span>
                  </div>
                  <div className="w-full bg-soft-beige rounded-full h-3">
                    <div className="bg-sage-green h-3 rounded-full" style={{width: '15%'}}></div>
                  </div>
                </div>
              </div>
              <Link
                href="/donate"
                className="block w-full mt-6 bg-wood hover:bg-wood-dark text-warm-white py-3 text-center rounded-lg font-semibold transition-colors duration-300"
              >
                Support Our Vision
              </Link>
            </div>

            {/* Contact Card */}
            <div className="bg-warm-white rounded-lg p-6 shadow-lg border border-soft-beige">
              <h3 className="text-xl font-bold text-terracotta-red mb-4">
                Questions?
              </h3>
              <p className="text-deep-teal mb-4">
                Have questions about the new centre? We're here to help.
              </p>
              <Link
                href="#contact"
                className="block w-full bg-sage-green hover:bg-sage-green-dark text-warm-white py-3 text-center rounded-lg font-semibold transition-colors duration-300"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-warm-white hover:text-soft-beige text-2xl z-10"
            >
              ✕
            </button>
            <div className="relative w-full h-full">
              <Image
                src={selectedImage}
                alt="Gallery image"
                fill
                className="object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}