'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface PageTemplateProps {
  title: string
  subtitle?: string
  children: ReactNode
  backgroundPattern?: boolean
}

export default function PageTemplate({
  title,
  subtitle,
  children,
  backgroundPattern = true
}: PageTemplateProps) {
  return (
    <main className="pt-24 min-h-screen bg-warm-white">
      {/* Background Pattern */}
      {backgroundPattern && (
        <div className="fixed inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%238F4843' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }} />
        </div>
      )}

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-deep-teal via-deep-teal/95 to-terracotta-red/20 text-white py-20 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-terracotta-red/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xl md:text-2xl text-warm-white/90 max-w-3xl">
                {subtitle}
              </p>
            )}
          </motion.div>

          {/* Decorative Islamic Pattern Border */}
          <div className="mt-8 h-1 w-32 bg-gradient-to-r from-amber-400 to-transparent" />
        </div>
      </section>

      {/* Content Section */}
      <section className="relative py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {children}
          </motion.div>
        </div>
      </section>
    </main>
  )
}
