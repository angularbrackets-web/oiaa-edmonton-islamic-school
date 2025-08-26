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
    { name: 'Programs', href: '#programs' },
    { name: 'New Centre', href: '/new-centre' },
    { name: 'Events', href: '/events' },
    { name: 'News', href: '/news' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Careers', href: '/careers' },
    { name: 'Contact', href: '#contact' },
  ]

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    } ${
      isScrolled 
        ? 'bg-warm-white/80 backdrop-blur-xl border-b border-soft-beige/60 shadow-lg shadow-terracotta-red/5' 
        : 'bg-warm-white/95 backdrop-blur-md border-b border-soft-beige shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex justify-between items-center transition-all duration-300 ${
          isScrolled ? 'h-14' : 'h-16'
        }`}>
          {/* Logo with enhanced animations */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative transition-all duration-300 group-hover:scale-105">
                <Image
                  src="/images/OIA_Academy_Logo.png"
                  alt="OIA Academy Edmonton - Omar Ibn Al-Khattab Academy"
                  width={48}
                  height={48}
                  className="w-12 h-12 object-contain transition-transform duration-300 group-hover:scale-110"
                  priority
                />
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-warm-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-terracotta-red group-hover:text-terracotta-red-dark transition-colors duration-200">OIA Academy</h1>
                <p className="text-xs text-deep-teal group-hover:text-terracotta-red transition-colors duration-200">Edmonton</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation with enhanced micro-interactions */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative text-deep-teal hover:text-terracotta-red transition-all duration-300 font-medium group"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="relative z-10">{item.name}</span>
                <div className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-terracotta-red to-terracotta-red-dark scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-terracotta-red/5 to-transparent rounded-lg scale-0 group-hover:scale-100 transition-transform duration-200 -z-10"></div>
              </Link>
            ))}
          </nav>

          {/* Enhanced Donate Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/donate"
              className="relative bg-gradient-to-r from-terracotta-red to-terracotta-red-dark hover:from-terracotta-red-dark hover:to-terracotta-red text-warm-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 group overflow-hidden"
            >
              <span className="relative z-10">Donate</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-warm-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </Link>
          </div>

          {/* Animated Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="relative w-10 h-10 text-deep-teal hover:text-terracotta-red focus:outline-none focus:text-terracotta-red transition-colors duration-200 group"
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

        {/* Enhanced Mobile Navigation Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-500 ease-out ${
          isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="px-2 pt-2 pb-3 space-y-1 bg-warm-white/95 backdrop-blur-xl border-t border-soft-beige/60 shadow-lg">
            {navigation.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-3 py-2 text-deep-teal hover:text-terracotta-red hover:bg-gradient-to-r hover:from-terracotta-red/5 hover:to-transparent rounded-lg font-medium transition-all duration-300 transform ${
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
                  <span className="w-1 h-1 bg-terracotta-red rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
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
                className="block w-full text-center bg-gradient-to-r from-terracotta-red to-terracotta-red-dark hover:from-terracotta-red-dark hover:to-terracotta-red text-warm-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
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