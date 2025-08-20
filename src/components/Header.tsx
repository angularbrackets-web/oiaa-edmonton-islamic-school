'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
    <header className="fixed top-0 left-0 right-0 z-50 bg-warm-white/95 backdrop-blur-md border-b border-soft-beige shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-terracotta-red rounded-full flex items-center justify-center shadow-md">
                <span className="text-warm-white text-xl">☪</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-terracotta-red">OIA Academy</h1>
                <p className="text-xs text-deep-teal">Edmonton</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-deep-teal hover:text-terracotta-red transition-colors duration-200 font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Donate Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/donate"
              className="bg-terracotta-red hover:bg-terracotta-red-dark text-warm-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              Donate
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-deep-teal hover:text-terracotta-red focus:outline-none focus:text-terracotta-red transition-colors duration-200"
              aria-label="Toggle mobile menu"
            >
              <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path fillRule="evenodd" d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"/>
                ) : (
                  <path fillRule="evenodd" d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"/>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-warm-white border-t border-soft-beige">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-deep-teal hover:text-terracotta-red hover:bg-soft-beige-lightest rounded-md font-medium transition-all duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-soft-beige">
                <Link
                  href="/donate"
                  className="block w-full text-center bg-terracotta-red hover:bg-terracotta-red-dark text-warm-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Donate Now
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}