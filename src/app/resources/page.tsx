'use client'

import { useState } from 'react'
import { ChevronDown, Book, Calendar, FileText, Users, Download, ExternalLink, GraduationCap, Heart, Shield } from 'lucide-react'

export default function ResourcesPage() {
  const [openSection, setOpenSection] = useState<number | null>(0)

  const resources = [
    {
      title: 'Parent Portal',
      icon: Users,
      description: 'Access your child\'s grades, attendance, and school communications',
      color: 'from-terracotta-red to-terracotta-red-dark',
      links: [
        { name: 'Login to Parent Portal', url: '/parents', external: false },
        { name: 'Parent Portal Guide (PDF)', url: '#', external: true, download: true },
        { name: 'Reset Password', url: '#', external: false },
        { name: 'Contact Support', url: '#contact', external: false }
      ]
    },
    {
      title: 'Student Portal',
      icon: GraduationCap,
      description: 'Students can access homework, grades, and learning resources',
      color: 'from-sage-green to-deep-teal',
      links: [
        { name: 'Login to Student Portal', url: '/students', external: false },
        { name: 'Student Portal Guide (PDF)', url: '#', external: true, download: true },
        { name: 'Homework Submission', url: '#', external: false },
        { name: 'View Grades & Progress', url: '#', external: false }
      ]
    },
    {
      title: 'Academic Calendar',
      icon: Calendar,
      description: 'Important dates, holidays, and school events throughout the year',
      color: 'from-wood to-wood-dark',
      links: [
        { name: '2024-2025 Academic Calendar (PDF)', url: '#', external: true, download: true },
        { name: 'Islamic Calendar & Observances', url: '#', external: true, download: true },
        { name: 'Exam Schedule', url: '#', external: true, download: true },
        { name: 'School Closure Dates', url: '#', external: false }
      ]
    },
    {
      title: 'Student Handbook',
      icon: Book,
      description: 'Comprehensive guide to school policies, expectations, and procedures',
      color: 'from-deep-teal to-sage-green',
      links: [
        { name: 'Student Handbook 2024-2025 (PDF)', url: '#', external: true, download: true },
        { name: 'Code of Conduct', url: '#', external: true, download: true },
        { name: 'Dress Code Policy', url: '#', external: true, download: true },
        { name: 'Technology Use Policy', url: '#', external: true, download: true }
      ]
    },
    {
      title: 'Forms & Documents',
      icon: FileText,
      description: 'Download important forms and documents',
      color: 'from-terracotta-red to-wood',
      links: [
        { name: 'Enrollment Application Form (PDF)', url: '#', external: true, download: true },
        { name: 'Medical Information Form (PDF)', url: '#', external: true, download: true },
        { name: 'Permission Slip Template (PDF)', url: '#', external: true, download: true },
        { name: 'Volunteer Application (PDF)', url: '#', external: true, download: true },
        { name: 'Transportation Request Form (PDF)', url: '#', external: true, download: true }
      ]
    },
    {
      title: 'Policies & Procedures',
      icon: Shield,
      description: 'School policies, safety procedures, and guidelines',
      color: 'from-sage-green to-wood',
      links: [
        { name: 'School Safety Policies', url: '#', external: true, download: true },
        { name: 'Emergency Procedures', url: '#', external: true, download: true },
        { name: 'Attendance Policy', url: '#', external: true, download: true },
        { name: 'Bullying Prevention Policy', url: '#', external: true, download: true },
        { name: 'Privacy Policy', url: '/privacy', external: false }
      ]
    },
    {
      title: 'Islamic Resources',
      icon: Heart,
      description: 'Islamic learning materials, prayer times, and spiritual resources',
      color: 'from-deep-teal to-terracotta-red',
      links: [
        { name: 'Daily Prayer Times', url: '#', external: false },
        { name: 'Quran Memorization Resources', url: '#', external: true },
        { name: 'Islamic Studies Curriculum', url: '#', external: true, download: true },
        { name: 'Ramadan Schedule & Guidelines', url: '#', external: true, download: true },
        { name: 'Recommended Islamic Reading List', url: '#', external: true, download: true }
      ]
    }
  ]

  return (
    <main className="min-h-screen pt-32">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-wood to-terracotta-red py-20">
        <div className="absolute inset-0 bg-[url('/images/pattern-geometric.svg')] opacity-10"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-warm-white mb-6">Resources & Information</h1>
          <p className="text-xl md:text-2xl text-warm-white/90 max-w-3xl mx-auto">
            Access important documents, portals, and information for students and families
          </p>
        </div>
      </section>

      {/* Resources Accordion */}
      <section className="py-20 bg-warm-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="space-y-4">
            {resources.map((resource, index) => {
              const IconComponent = resource.icon
              const isOpen = openSection === index

              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg border border-soft-beige overflow-hidden transition-all duration-300 hover:shadow-xl"
                >
                  {/* Accordion Header */}
                  <button
                    onClick={() => setOpenSection(isOpen ? null : index)}
                    className="w-full p-6 flex items-center justify-between hover:bg-soft-beige/30 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${resource.color} flex items-center justify-center flex-shrink-0`}>
                        <IconComponent className="w-7 h-7 text-warm-white" />
                      </div>
                      <div className="text-left">
                        <h3 className="text-2xl font-bold text-deep-teal mb-1">{resource.title}</h3>
                        <p className="text-deep-teal/70">{resource.description}</p>
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-8 h-8 text-terracotta-red flex-shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Accordion Content */}
                  {isOpen && (
                    <div className="px-6 pb-6 border-t border-soft-beige bg-soft-beige/20">
                      <div className="pt-6 space-y-3">
                        {resource.links.map((link, linkIndex) => (
                          <a
                            key={linkIndex}
                            href={link.url}
                            target={link.external ? '_blank' : undefined}
                            rel={link.external ? 'noopener noreferrer' : undefined}
                            className="flex items-center justify-between p-4 bg-white rounded-lg hover:bg-soft-beige/50 transition-all duration-200 group border border-soft-beige/50"
                          >
                            <span className="text-deep-teal font-medium group-hover:text-terracotta-red transition-colors">
                              {link.name}
                            </span>
                            <div className="flex items-center space-x-2">
                              {link.download && (
                                <Download className="w-5 h-5 text-sage-green" />
                              )}
                              {link.external && !link.download && (
                                <ExternalLink className="w-5 h-5 text-terracotta-red" />
                              )}
                              {!link.external && !link.download && (
                                <ChevronDown className="w-5 h-5 text-terracotta-red -rotate-90" />
                              )}
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-20 bg-soft-beige-lightest">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-deep-teal mb-6">Need Help?</h2>
          <p className="text-xl text-deep-teal/70 mb-12">
            Can't find what you're looking for? Our support team is here to assist you.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-md border border-soft-beige">
              <div className="w-12 h-12 bg-gradient-to-br from-terracotta-red to-terracotta-red-dark rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-warm-white" />
              </div>
              <h3 className="text-lg font-bold text-deep-teal mb-2">Contact Office</h3>
              <p className="text-deep-teal/70 text-sm mb-4">Speak with our administrative team</p>
              <a href="tel:+17801234567" className="text-terracotta-red font-semibold hover:underline">
                (780) 123-4567
              </a>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-soft-beige">
              <div className="w-12 h-12 bg-gradient-to-br from-sage-green to-deep-teal rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-warm-white" />
              </div>
              <h3 className="text-lg font-bold text-deep-teal mb-2">Email Support</h3>
              <p className="text-deep-teal/70 text-sm mb-4">Get help via email</p>
              <a href="mailto:academy@oiacedmonton.ca" className="text-sage-green font-semibold hover:underline">
                Send Email
              </a>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-soft-beige">
              <div className="w-12 h-12 bg-gradient-to-br from-wood to-wood-dark rounded-lg flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-warm-white" />
              </div>
              <h3 className="text-lg font-bold text-deep-teal mb-2">Office Hours</h3>
              <p className="text-deep-teal/70 text-sm">Monday - Friday<br/>8:00 AM - 4:00 PM</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
