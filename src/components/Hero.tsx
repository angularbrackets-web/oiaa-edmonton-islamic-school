'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { HeroSlide } from '@/types/cms'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

// Fallback slides if database is empty
const FALLBACK_SLIDES: Partial<HeroSlide>[] = [
  {
    id: 'fallback-1',
    title: 'Welcome to Our Islamic Academy',
    subtitle: 'Nurturing Faith, Knowledge, and Character',
    description: 'Providing excellence in Islamic and academic education',
    slide_type: 'image_text',
    background_image: 'https://images.unsplash.com/photo-1585036156171-384164a8c675?w=1920&q=80',
    background_color: '#145B55',
    background_overlay: true,
    overlay_opacity: 0.5,
    text_color: 'white',
    text_alignment: 'center',
    cta_text: 'Learn More',
    cta_link: '/about',
    cta2_text: 'Apply Now',
    cta2_link: '/admissions',
    duration: 5000,
    is_active: true
  }
]

export default function Hero() {
  const [slides, setSlides] = useState<Partial<HeroSlide>[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const slideContainerRef = useRef<HTMLDivElement>(null)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)

  // Fetch slides from API
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch('/api/hero-slides?active_only=true')
        const data = await response.json()

        if (data.success && data.data && data.data.length > 0) {
          setSlides(data.data)
        } else {
          setSlides(FALLBACK_SLIDES)
        }
      } catch (error) {
        console.error('Error fetching hero slides:', error)
        setSlides(FALLBACK_SLIDES)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSlides()
  }, [])

  // Navigate to specific slide
  const goToSlide = useCallback((index: number) => {
    if (isTransitioning || slides.length === 0) return

    setIsTransitioning(true)
    setCurrentIndex(index)

    setTimeout(() => {
      setIsTransitioning(false)
    }, 700) // Match transition duration
  }, [isTransitioning, slides.length])

  // Navigate to next slide
  const nextSlide = useCallback(() => {
    if (slides.length === 0) return
    goToSlide((currentIndex + 1) % slides.length)
  }, [currentIndex, slides.length, goToSlide])

  // Navigate to previous slide
  const prevSlide = useCallback(() => {
    if (slides.length === 0) return
    goToSlide((currentIndex - 1 + slides.length) % slides.length)
  }, [currentIndex, slides.length, goToSlide])

  // Auto-play functionality
  useEffect(() => {
    if (isPaused || slides.length <= 1 || isLoading) return

    const currentSlide = slides[currentIndex]
    const duration = currentSlide?.duration || 5000

    autoPlayRef.current = setTimeout(() => {
      nextSlide()
    }, duration)

    return () => {
      if (autoPlayRef.current) {
        clearTimeout(autoPlayRef.current)
      }
    }
  }, [currentIndex, isPaused, slides, nextSlide, isLoading])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevSlide()
      } else if (e.key === 'ArrowRight') {
        nextSlide()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nextSlide, prevSlide])

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return

    const touchEnd = e.changedTouches[0].clientX
    const diff = touchStart - touchEnd

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide()
      } else {
        prevSlide()
      }
    }

    setTouchStart(null)
  }

  // Loading state
  if (isLoading) {
    return (
      <section className="relative h-[600px] md:h-[700px] lg:h-[80vh] bg-deep-teal flex items-center justify-center">
        <div className="animate-pulse text-white/50">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>
      </section>
    )
  }

  const currentSlide = slides[currentIndex]
  if (!currentSlide) return null

  return (
    <section
      ref={slideContainerRef}
      className="relative h-[600px] md:h-[700px] lg:h-[80vh] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Hero slideshow"
      role="region"
    >
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id || index}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
          aria-hidden={index !== currentIndex}
        >
          {/* Background */}
          {slide.slide_type !== 'text' && slide.background_image ? (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.background_image})` }}
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{ backgroundColor: slide.background_color || '#145B55' }}
            />
          )}

          {/* Overlay */}
          {slide.background_overlay && (
            <div
              className="absolute inset-0 bg-black"
              style={{ opacity: slide.overlay_opacity || 0.5 }}
            />
          )}

          {/* Islamic Pattern Overlay */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <pattern id="islamic-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M10 0L20 10L10 20L0 10Z" fill="currentColor" className="text-white"/>
              </pattern>
              <rect width="100%" height="100%" fill="url(#islamic-pattern)"/>
            </svg>
          </div>

          {/* Content */}
          {slide.slide_type !== 'image' && (
            <div className="relative z-20 h-full flex items-center">
              <div className="container mx-auto px-6 md:px-12">
                <div
                  className={`max-w-4xl ${
                    slide.text_alignment === 'left' ? 'mr-auto text-left' :
                    slide.text_alignment === 'right' ? 'ml-auto text-right' :
                    'mx-auto text-center'
                  }`}
                >
                  {/* Title */}
                  {slide.title && (
                    <h1
                      className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight ${
                        index === currentIndex ? 'animate-fade-in-up' : ''
                      }`}
                      style={{
                        color: slide.text_color === 'white' ? '#FFFFFF' : '#000000',
                        animationDelay: '0.1s'
                      }}
                    >
                      {slide.title}
                    </h1>
                  )}

                  {/* Subtitle */}
                  {slide.subtitle && (
                    <h2
                      className={`text-xl md:text-2xl lg:text-3xl font-medium mb-6 opacity-90 ${
                        index === currentIndex ? 'animate-fade-in-up' : ''
                      }`}
                      style={{
                        color: slide.text_color === 'white' ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)',
                        animationDelay: '0.2s'
                      }}
                    >
                      {slide.subtitle}
                    </h2>
                  )}

                  {/* Description */}
                  {slide.description && (
                    <p
                      className={`text-lg md:text-xl mb-8 opacity-80 max-w-2xl ${
                        slide.text_alignment === 'center' ? 'mx-auto' : ''
                      } ${index === currentIndex ? 'animate-fade-in-up' : ''}`}
                      style={{
                        color: slide.text_color === 'white' ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)',
                        animationDelay: '0.3s'
                      }}
                    >
                      {slide.description}
                    </p>
                  )}

                  {/* CTA Buttons */}
                  {(slide.cta_text || slide.cta2_text) && (
                    <div
                      className={`flex flex-wrap gap-4 ${
                        slide.text_alignment === 'center' ? 'justify-center' :
                        slide.text_alignment === 'right' ? 'justify-end' : 'justify-start'
                      } ${index === currentIndex ? 'animate-fade-in-up' : ''}`}
                      style={{ animationDelay: '0.4s' }}
                    >
                      {slide.cta_text && slide.cta_link && (
                        <Link
                          href={slide.cta_link}
                          className="inline-flex items-center px-8 py-4 bg-terracotta-red text-white font-semibold rounded-lg
                                   hover:bg-terracotta-red-dark transform hover:scale-105 transition-all duration-300
                                   shadow-lg hover:shadow-xl"
                        >
                          {slide.cta_text}
                          <ChevronRightIcon className="w-5 h-5 ml-2" />
                        </Link>
                      )}
                      {slide.cta2_text && slide.cta2_link && (
                        <Link
                          href={slide.cta2_link}
                          className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white
                                   font-semibold rounded-lg border-2 border-white/30
                                   hover:bg-white/20 hover:border-white/50 transform hover:scale-105
                                   transition-all duration-300"
                        >
                          {slide.cta2_text}
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            disabled={isTransitioning}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-all duration-300 disabled:opacity-50 group"
            aria-label="Previous slide"
          >
            <ChevronLeftIcon className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <button
            onClick={nextSlide}
            disabled={isTransitioning}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-all duration-300 disabled:opacity-50 group"
            aria-label="Next slide"
          >
            <ChevronRightIcon className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? 'w-10 h-3 bg-terracotta-red'
                  : 'w-3 h-3 bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentIndex ? 'true' : 'false'}
            />
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {slides.length > 1 && !isPaused && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20 z-30">
          <div
            className="h-full bg-terracotta-red transition-none"
            style={{
              animation: `progress ${(currentSlide?.duration || 5000) / 1000}s linear`,
              animationPlayState: isPaused ? 'paused' : 'running'
            }}
          />
        </div>
      )}

      {/* Gradient Overlays for text readability */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/30 to-transparent z-10 pointer-events-none" />

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  )
}
