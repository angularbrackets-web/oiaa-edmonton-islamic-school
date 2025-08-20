'use client'

import { useState } from 'react'
import Image from 'next/image'
import PrayerTimes from '@/components/PrayerTimes'

interface GalleryCategory {
  id: string
  name: string
  description: string
  color: string
  icon: string
  images: string[]
}

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('new-center')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // Static gallery data - in a real app this would come from an API
  const galleryCategories: GalleryCategory[] = [
    {
      id: 'new-center',
      name: 'New Centre Vision',
      description: 'Architectural renderings and construction progress',
      color: 'terracotta-red',
      icon: '🏗️',
      images: [
        '/uploads/images/new-center/new.oiac.1.png',
        '/uploads/images/new-center/new.oiac.2.png',
        '/uploads/images/new-center/new.oiac.3.png',
        '/uploads/images/new-center/new.oiac.4.png',
        '/uploads/images/new-center/new.oiac.5.png',
        '/uploads/images/new-center/new.oiac.6.png',
        '/uploads/images/new-center/new.oiac.7.png',
        '/uploads/images/new-center/new.oiac.8.png',
        '/uploads/images/new-center/new.oiac.9.png',
        '/uploads/images/new-center/new.oiac.10.png',
        '/uploads/images/new-center/new.oiac.11.png',
        '/uploads/images/new-center/new.oiac.12.png',
        '/uploads/images/new-center/new.oiac.13.png',
        '/uploads/images/new-center/new.oiac.14.png',
        '/uploads/images/new-center/new.oiac.15.png',
        '/uploads/images/new-center/new.oiac.16.png',
        '/uploads/images/new-center/new.oiac.17.png',
        '/uploads/images/new-center/new.oiac.18.png',
        '/uploads/images/new-center/new.oiac.19.png',
        '/uploads/images/new-center/new.oiac.20.png',
        '/uploads/images/new-center/new.oiac.21.png',
        '/uploads/images/new-center/new.oiac.22.png',
        '/uploads/images/new-center/new.oiac.23.png',
        '/uploads/images/new-center/new.oiac.24.png',
        '/uploads/images/new-center/new.oiac.25.png',
        '/uploads/images/new-center/new.oiac.26.png',
        '/uploads/images/new-center/new.oiac.27.png',
        '/uploads/images/new-center/new.oiac.28.png',
        '/uploads/images/new-center/new.oiac.29.png',
        '/uploads/images/new-center/new.oiac.30.png',
      ]
    },
    {
      id: 'groundbreaking',
      name: 'Ground Breaking Ceremony',
      description: 'Historic moments from our ceremony on July 23, 2025',
      color: 'sage-green',
      icon: '🎉',
      images: [
        '/uploads/images/new-center/ground-breaking-ceremony/MAIN.JPG',
        '/uploads/images/new-center/ground-breaking-ceremony/GP_B0537.JPG',
        '/uploads/images/new-center/ground-breaking-ceremony/GP_B0546.JPG',
        '/uploads/images/new-center/ground-breaking-ceremony/GP_B0555.JPG',
        '/uploads/images/new-center/ground-breaking-ceremony/GP_B0608.JPG',
        '/uploads/images/new-center/ground-breaking-ceremony/GP_B0631.JPG',
        '/uploads/images/new-center/ground-breaking-ceremony/GP_B0654.JPG',
        '/uploads/images/new-center/ground-breaking-ceremony/GP_B0681.JPG',
        '/uploads/images/new-center/ground-breaking-ceremony/GP_B0683.JPG',
        '/uploads/images/new-center/ground-breaking-ceremony/GP_B0693.JPG',
      ]
    },
    {
      id: 'current-school',
      name: 'Current School Life',
      description: 'Students and teachers in our current facility',
      color: 'wood',
      icon: '🎓',
      images: [] // Will be populated when you add images
    },
    {
      id: 'community',
      name: 'Community Events',
      description: 'Celebrations, fundraisers, and gatherings',
      color: 'deep-teal',
      icon: '🤝',
      images: [] // Will be populated when you add images
    }
  ]

  const activeCategory = galleryCategories.find(cat => cat.id === selectedCategory)

  return (
    <div className="min-h-screen bg-soft-beige-lightest">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-wood to-sage-green text-warm-white py-20">
        <div className="absolute inset-0 islamic-pattern opacity-10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Gallery
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
            Explore our journey from vision to reality through photos of our community, events, and new centre progress
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Category Navigation */}
            <div className="bg-warm-white rounded-lg p-6 shadow-lg border border-soft-beige">
              <h2 className="text-2xl font-bold text-terracotta-red mb-6">
                Gallery Categories
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {galleryCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`p-4 rounded-lg border-2 text-left transition-all duration-300 ${
                      selectedCategory === category.id
                        ? `border-${category.color} bg-${category.color} text-warm-white shadow-lg transform scale-105`
                        : 'border-soft-beige hover:border-sage-green hover:bg-soft-beige-lightest'
                    }`}
                  >
                    <div className="flex items-start">
                      <div className="text-3xl mr-4">{category.icon}</div>
                      <div>
                        <h3 className={`font-bold mb-2 ${
                          selectedCategory === category.id ? 'text-warm-white' : 'text-terracotta-red'
                        }`}>
                          {category.name}
                        </h3>
                        <p className={`text-sm ${
                          selectedCategory === category.id ? 'text-warm-white/90' : 'text-deep-teal'
                        }`}>
                          {category.description}
                        </p>
                        <p className={`text-xs mt-2 ${
                          selectedCategory === category.id ? 'text-warm-white/75' : 'text-sage-green'
                        }`}>
                          {category.images.length} images
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Image Grid */}
            {activeCategory && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-terracotta-red">
                    {activeCategory.name}
                  </h2>
                  <span className="text-sage-green font-medium">
                    {activeCategory.images.length} images
                  </span>
                </div>

                {activeCategory.images.length === 0 ? (
                  <div className="bg-warm-white rounded-lg p-12 text-center shadow-lg border border-soft-beige">
                    <div className="text-6xl mb-4">{activeCategory.icon}</div>
                    <h3 className="text-2xl font-bold text-terracotta-red mb-2">
                      Coming Soon
                    </h3>
                    <p className="text-deep-teal">
                      We're working on adding photos for this category. Check back soon!
                    </p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeCategory.images.map((imagePath, index) => (
                      <div
                        key={index}
                        className="relative aspect-square bg-soft-beige rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
                        onClick={() => setSelectedImage(imagePath)}
                      >
                        <Image
                          src={imagePath}
                          alt={`${activeCategory.name} ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                          <div className="text-warm-white opacity-0 hover:opacity-100 transition-opacity duration-300">
                            <div className="bg-black/50 rounded-full p-3">
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Prayer Times Widget */}
            <PrayerTimes />

            {/* Gallery Stats */}
            <div className="bg-warm-white rounded-lg p-6 shadow-lg border border-soft-beige">
              <h3 className="text-xl font-bold text-terracotta-red mb-4">
                Gallery Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-deep-teal">Total Images</span>
                  <span className="font-bold text-terracotta-red">
                    {galleryCategories.reduce((sum, cat) => sum + cat.images.length, 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-deep-teal">Categories</span>
                  <span className="font-bold text-sage-green">
                    {galleryCategories.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-deep-teal">Latest Update</span>
                  <span className="font-bold text-wood">
                    Jan 2025
                  </span>
                </div>
              </div>
            </div>

            {/* Upload Request */}
            <div className="bg-warm-white rounded-lg p-6 shadow-lg border border-soft-beige">
              <h3 className="text-xl font-bold text-terracotta-red mb-4">
                Share Your Photos
              </h3>
              <p className="text-deep-teal mb-4 text-sm">
                Have photos from our events or activities? We'd love to feature them in our gallery!
              </p>
              <a
                href="mailto:media@oiacedmonton.ca"
                className="block w-full bg-sage-green hover:bg-sage-green-dark text-warm-white py-3 text-center rounded-lg font-semibold transition-colors duration-300"
              >
                Submit Photos
              </a>
            </div>

            {/* Quick Links */}
            <div className="bg-warm-white rounded-lg p-6 shadow-lg border border-soft-beige">
              <h3 className="text-xl font-bold text-terracotta-red mb-4">
                Related
              </h3>
              <div className="space-y-3">
                <a
                  href="/new-centre"
                  className="block text-deep-teal hover:text-terracotta-red transition-colors duration-200"
                >
                  → New Centre Project
                </a>
                <a
                  href="/events"
                  className="block text-deep-teal hover:text-terracotta-red transition-colors duration-200"
                >
                  → Event Videos
                </a>
                <a
                  href="/news"
                  className="block text-deep-teal hover:text-terracotta-red transition-colors duration-200"
                >
                  → Latest News
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-6xl max-h-[90vh] w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-warm-white hover:text-soft-beige text-3xl z-10 bg-black/50 rounded-full w-10 h-10 flex items-center justify-center"
            >
              ×
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