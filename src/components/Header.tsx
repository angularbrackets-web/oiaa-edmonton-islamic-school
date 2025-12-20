'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { NavigationTreeNode } from '@/types/navigation'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)

  // Navigation data state
  const [navigationData, setNavigationData] = useState<NavigationTreeNode[]>([])
  const [isLoadingNav, setIsLoadingNav] = useState(true)
  const [navError, setNavError] = useState<string | null>(null)

  // Mobile accordion state
  const [openAccordions, setOpenAccordions] = useState<Set<string>>(new Set())

  // Fetch navigation data from API
  useEffect(() => {
    fetch('/api/navigation?tree=true')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setNavigationData(data.data || [])
        } else {
          setNavError(data.error || 'Failed to load navigation')
        }
      })
      .catch(err => {
        console.error('Navigation fetch error:', err)
        setNavError(err.message)
      })
      .finally(() => {
        setIsLoadingNav(false)
      })
  }, [])

  // Smart sticky navigation with scroll detection and progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercentage = (currentScrollY / documentHeight) * 100

      // Update scroll state for glassmorphism effect
      setIsScrolled(currentScrollY > 20)
      setScrollProgress(Math.min(scrollPercentage, 100))

      // Smart hide/show behavior
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false) // Hide when scrolling down
      } else {
        setIsVisible(true) // Show when scrolling up
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  // Toggle mobile accordion
  const toggleAccordion = (id: string) => {
    setOpenAccordions(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  // Close mobile menu when navigating
  const handleMobileNavClick = () => {
    setIsMobileMenuOpen(false)
    setOpenAccordions(new Set()) // Reset accordions
  }

  const contactInfo = {
    phone: '(780) 123-4567',
    email: 'academy@oiacedmonton.ca',
    address: '123 Islamic Center Drive, Edmonton, AB'
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ease-out max-w-full overflow-visible ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    } ${
      isScrolled
        ? 'bg-warm-white/80 backdrop-blur-xl border-b border-soft-beige/60 shadow-lg shadow-terracotta-red/5'
        : 'bg-warm-white/95 backdrop-blur-md border-b border-soft-beige shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full box-border">
        {/* ROW 1: Logo + Contact Information */}
        <div className={`flex justify-between items-center transition-all duration-300 w-full border-b border-soft-beige/30 ${
          isScrolled ? 'py-2' : 'py-3'
        }`}>
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-4 group flex-shrink-0">
            <div className="relative transition-all duration-300 group-hover:scale-105">
              <Image
                src="/images/OIA_Academy_Logo.png"
                alt="OIA Academy Edmonton - Omar Ibn Al-Khattab Academy"
                width={80}
                height={80}
                className={`object-contain transition-all duration-300 group-hover:scale-110 ${
                  isScrolled ? 'w-16 h-16' : 'w-20 h-20'
                }`}
                priority
              />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-warm-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div>
              <h1 className={`font-bold text-terracotta-red group-hover:text-terracotta-red-dark transition-colors duration-200 ${
                isScrolled ? 'text-xl' : 'text-2xl'
              }`}>
                OIA Academy
              </h1>
              <p className="text-sm text-deep-teal group-hover:text-terracotta-red transition-colors duration-200">Edmonton</p>
            </div>
          </Link>

          {/* Contact Information - Right Side (Hidden on mobile) */}
          <div className="hidden lg:flex items-center space-x-6 text-xs text-deep-teal">
            <a href={`tel:${contactInfo.phone.replace(/\D/g, '')}`} className="flex items-center space-x-2 hover:text-terracotta-red transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>{contactInfo.phone}</span>
            </a>
            <a href={`mailto:${contactInfo.email}`} className="flex items-center space-x-2 hover:text-terracotta-red transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>{contactInfo.email}</span>
            </a>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{contactInfo.address}</span>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex-shrink-0">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="relative w-10 h-10 text-deep-teal hover:text-terracotta-red focus:outline-none focus:text-terracotta-red transition-colors duration-200 group touch-manipulation"
              aria-label="Toggle mobile menu"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 relative">
                  <span className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 ${
                    isMobileMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-2'
                  }`}></span>
                  <span className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 ${
                    isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                  }`}></span>
                  <span className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 ${
                    isMobileMenuOpen ? '-rotate-45 translate-y-0' : 'translate-y-2'
                  }`}></span>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* ROW 2: Navigation Menu (Desktop) */}
        <div className="hidden lg:block">
          <div className={`flex justify-center items-center transition-all duration-300 ${
            isScrolled ? 'py-2' : 'py-3'
          }`}>
            {isLoadingNav ? (
              // Loading skeleton
              <div className="flex items-center space-x-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-6 w-20 bg-soft-beige/50 rounded animate-pulse" />
                ))}
              </div>
            ) : navError ? (
              // Error fallback - basic navigation
              <nav className="flex items-center space-x-8">
                <Link href="/" className="text-deep-teal hover:text-terracotta-red transition-colors text-sm font-semibold">
                  Home
                </Link>
                <Link href="/about-us" className="text-deep-teal hover:text-terracotta-red transition-colors text-sm font-semibold">
                  About Us
                </Link>
                <Link href="/admissions" className="text-deep-teal hover:text-terracotta-red transition-colors text-sm font-semibold">
                  Admissions
                </Link>
                <Link href="/contact" className="text-deep-teal hover:text-terracotta-red transition-colors text-sm font-semibold">
                  Contact
                </Link>
              </nav>
            ) : (
              // Dynamic navigation with mega-menu
              <nav className="flex items-center space-x-8">
                {navigationData.map((item, index) => (
                  <div key={item.id} className="relative group">
                    {item.children && item.children.length > 0 ? (
                      // Item with dropdown
                      <>
                        <Link
                          href={item.href}
                          className="relative flex items-center gap-2 text-deep-teal hover:text-terracotta-red transition-all duration-300 text-sm font-semibold group/btn"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <span className="relative z-10">{item.label_en}</span>
                          <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                          <div className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-terracotta-red to-terracotta-red-dark scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-left"></div>
                        </Link>

                        {/* Mega-menu dropdown */}
                        <div className="absolute top-full left-0 mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[9999]">
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className="bg-white/95 backdrop-blur-xl border border-soft-beige rounded-lg shadow-2xl min-w-[320px] p-6"
                          >
                            <div className="grid grid-cols-1 gap-2">
                              {/* Parent link at top of dropdown */}
                              <Link
                                href={item.href}
                                className="flex items-start gap-3 p-3 rounded-lg bg-terracotta-red/10 hover:bg-terracotta-red/20 border-b border-soft-beige mb-2 transition-colors duration-200 group/parent"
                              >
                                <div className="flex-1 min-w-0">
                                  <div className="font-bold text-terracotta-red group-hover/parent:text-terracotta-red-dark transition-colors flex items-center gap-2">
                                    {item.label_en} Overview
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                  </div>
                                  {item.description_en && (
                                    <div className="text-sm text-gray-700 mt-1">
                                      {item.description_en}
                                    </div>
                                  )}
                                </div>
                              </Link>

                              {/* Child links */}
                              {item.children.map((child) => (
                                <Link
                                  key={child.id}
                                  href={child.href}
                                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-terracotta-red/5 transition-colors duration-200 group/child"
                                >
                                  <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-deep-teal group-hover/child:text-terracotta-red transition-colors">
                                      {child.label_en}
                                    </div>
                                    {child.description_en && (
                                      <div className="text-sm text-gray-600 mt-1 line-clamp-2">
                                        {child.description_en}
                                      </div>
                                    )}
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        </div>
                      </>
                    ) : (
                      // Simple link (no children)
                      <Link
                        href={item.href}
                        className="relative flex items-center gap-2 text-deep-teal hover:text-terracotta-red transition-all duration-300 text-sm font-semibold group/link"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <span className="relative z-10">{item.label_en}</span>
                        <div className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-terracotta-red to-terracotta-red-dark scale-x-0 group-hover/link:scale-x-100 transition-transform duration-300 origin-left"></div>
                      </Link>
                    )}
                  </div>
                ))}
              </nav>
            )}

            {/* Donate Button - Keep separate with special styling */}
            <Link
              href="/donate"
              className="ml-8 relative bg-gradient-to-r from-terracotta-red to-terracotta-red-dark hover:from-terracotta-red-dark hover:to-terracotta-red text-warm-white px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 group overflow-hidden"
            >
              <span className="relative z-10">Donate</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-warm-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </Link>
          </div>
        </div>

        {/* Enhanced Mobile Navigation Menu */}
        <div className={`lg:hidden overflow-hidden transition-all duration-500 ease-out w-full ${
          isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="px-2 pt-2 pb-3 space-y-1 bg-warm-white/95 backdrop-blur-xl border-t border-soft-beige/60 shadow-lg w-full box-border">
            {isLoadingNav ? (
              // Loading skeleton for mobile
              <div className="space-y-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-12 bg-soft-beige/50 rounded animate-pulse" />
                ))}
              </div>
            ) : navError ? (
              // Error fallback for mobile
              <>
                <Link href="/" className="block px-3 py-3 text-deep-teal hover:text-terracotta-red rounded-lg text-sm font-semibold" onClick={handleMobileNavClick}>
                  Home
                </Link>
                <Link href="/about-us" className="block px-3 py-3 text-deep-teal hover:text-terracotta-red rounded-lg text-sm font-semibold" onClick={handleMobileNavClick}>
                  About Us
                </Link>
                <Link href="/admissions" className="block px-3 py-3 text-deep-teal hover:text-terracotta-red rounded-lg text-sm font-semibold" onClick={handleMobileNavClick}>
                  Admissions
                </Link>
              </>
            ) : (
              // Dynamic mobile navigation with accordion
              navigationData.map((item, index) => (
                <div key={item.id} className={`transform transition-all duration-300 ${
                  isMobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
                }`} style={{ transitionDelay: isMobileMenuOpen ? `${index * 50 + 100}ms` : '0ms' }}>
                  {item.children && item.children.length > 0 ? (
                    // Accordion item
                    <div className="rounded-lg overflow-hidden">
                      <div className="flex items-center gap-1">
                        <Link
                          href={item.href}
                          onClick={handleMobileNavClick}
                          className="flex-1 px-3 py-3 text-deep-teal hover:text-terracotta-red hover:bg-gradient-to-r hover:from-terracotta-red/5 hover:to-transparent rounded-l-lg text-sm font-semibold transition-all duration-300"
                        >
                          <span>{item.label_en}</span>
                        </Link>
                        <button
                          onClick={() => toggleAccordion(item.id)}
                          className="px-3 py-3 text-deep-teal hover:text-terracotta-red hover:bg-gradient-to-r hover:from-terracotta-red/5 hover:to-transparent rounded-r-lg transition-all duration-300"
                          aria-expanded={openAccordions.has(item.id)}
                          aria-label={`Toggle ${item.label_en} submenu`}
                        >
                          <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${
                            openAccordions.has(item.id) ? 'rotate-180' : ''
                          }`} />
                        </button>
                      </div>

                      {/* Accordion content */}
                      <AnimatePresence>
                        {openAccordions.has(item.id) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <div className="pl-8 pr-3 py-2 space-y-1">
                              {item.children.map((child) => (
                                <Link
                                  key={child.id}
                                  href={child.href}
                                  className="flex items-center gap-2 px-3 py-2 text-deep-teal hover:text-terracotta-red hover:bg-terracotta-red/5 rounded-lg transition-colors duration-200"
                                  onClick={handleMobileNavClick}
                                >
                                  <span>{child.label_en}</span>
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    // Simple link (no children)
                    <Link
                      href={item.href}
                      className="block px-3 py-3 text-deep-teal hover:text-terracotta-red hover:bg-gradient-to-r hover:from-terracotta-red/5 hover:to-transparent rounded-lg text-sm font-semibold transition-all duration-300"
                      onClick={handleMobileNavClick}
                    >
                      <span className="flex items-center gap-2">
                        <span>{item.label_en}</span>
                      </span>
                    </Link>
                  )}
                </div>
              ))
            )}

            {/* Donate button in mobile menu */}
            <div className={`pt-4 border-t border-soft-beige/60 transform transition-all duration-500 ${
              isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`} style={{ transitionDelay: isMobileMenuOpen ? `${(navigationData.length || 6) * 50 + 200}ms` : '0ms' }}>
              <Link
                href="/donate"
                className="block w-full text-center bg-gradient-to-r from-terracotta-red to-terracotta-red-dark hover:from-terracotta-red-dark hover:to-terracotta-red text-warm-white px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                onClick={handleMobileNavClick}
              >
                Donate Now
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Progress Indicator */}
      <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-terracotta-red via-terracotta-red-dark to-terracotta-red transition-all duration-300"
           style={{ width: `${scrollProgress}%` }}
      ></div>

      {/* Subtle Islamic Geometric Pattern Accent */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-5">
        <div className="absolute -top-2 -left-2 w-8 h-8 border border-terracotta-red transform rotate-45"></div>
        <div className="absolute -top-2 -right-2 w-8 h-8 border border-terracotta-red transform rotate-45"></div>
        <div className="absolute top-1/2 left-1/2 w-4 h-4 border border-terracotta-red transform -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
      </div>
    </header>
  )
}
