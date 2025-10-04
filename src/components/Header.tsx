'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Icon from '@/components/ui/Icon'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)

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

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '#about' },
    { name: 'Programs', href: '/programs' },
    { name: 'Admissions', href: '/admissions' },
    { name: 'New Centre', href: '/new-centre' },
    { name: 'Events', href: '/events' },
    { name: 'News', href: '/news' },
    { name: 'Resources', href: '/resources' },
    { name: 'Careers', href: '/careers' },
    { name: 'Contact', href: '#contact' },
  ]

  const contactInfo = {
    phone: '(780) 123-4567',
    email: 'academy@oiacedmonton.ca',
    address: '123 Islamic Center Drive, Edmonton, AB'
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out max-w-full overflow-x-hidden ${
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
          {/* Logo - Bigger and more to the left */}
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
            <nav className="flex items-center space-x-8">
              {navigation.map((item, index) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="relative text-deep-teal hover:text-terracotta-red transition-all duration-300 text-lg font-semibold group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="relative z-10">{item.name}</span>
                  <div className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-terracotta-red to-terracotta-red-dark scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-terracotta-red/5 to-transparent rounded-lg scale-0 group-hover:scale-100 transition-transform duration-200 -z-10"></div>
                </Link>
              ))}
            </nav>

            {/* Donate Button */}
            <Link
              href="/donate"
              className="ml-8 relative bg-gradient-to-r from-terracotta-red to-terracotta-red-dark hover:from-terracotta-red-dark hover:to-terracotta-red text-warm-white px-6 py-2 rounded-lg text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 group overflow-hidden"
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
            {navigation.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-3 py-3 text-deep-teal hover:text-terracotta-red hover:bg-gradient-to-r hover:from-terracotta-red/5 hover:to-transparent rounded-lg text-lg font-semibold transition-all duration-300 transform ${
                  isMobileMenuOpen
                    ? 'translate-x-0 opacity-100'
                    : 'translate-x-full opacity-0'
                }`}
                style={{
                  transitionDelay: isMobileMenuOpen ? `${index * 50 + 100}ms` : '0ms'
                }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 bg-terracotta-red rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  <span>{item.name}</span>
                </span>
              </Link>
            ))}
            <div className={`pt-4 border-t border-soft-beige/60 transform transition-all duration-500 ${
              isMobileMenuOpen
                ? 'translate-y-0 opacity-100'
                : 'translate-y-4 opacity-0'
            }`}
            style={{
              transitionDelay: isMobileMenuOpen ? `${navigation.length * 50 + 200}ms` : '0ms'
            }}>
              <Link
                href="/donate"
                className="block w-full text-center bg-gradient-to-r from-terracotta-red to-terracotta-red-dark hover:from-terracotta-red-dark hover:to-terracotta-red text-warm-white px-6 py-3 rounded-lg text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                onClick={() => setIsMobileMenuOpen(false)}
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