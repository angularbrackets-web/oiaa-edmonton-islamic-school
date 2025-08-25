'use client'

import { useState } from 'react'
import Icon from '@/components/ui/Icon'
import { CONTACT_INFO } from '@/lib/constants'

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  inquiryType: string
  message: string
}

interface FormState {
  isSubmitting: boolean
  isSuccess: boolean
  error: string | null
}

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    inquiryType: '',
    message: ''
  })
  
  const [formState, setFormState] = useState<FormState>({
    isSubmitting: false,
    isSuccess: false,
    error: null
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (formState.error) {
      setFormState(prev => ({ ...prev, error: null }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setFormState(prev => ({ ...prev, isSubmitting: true, error: null }))
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      const result = await response.json()
      
      if (response.ok) {
        setFormState({
          isSubmitting: false,
          isSuccess: true,
          error: null
        })
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          inquiryType: '',
          message: ''
        })
      } else {
        setFormState({
          isSubmitting: false,
          isSuccess: false,
          error: result.error || 'Something went wrong'
        })
      }
    } catch (error) {
      setFormState({
        isSubmitting: false,
        isSuccess: false,
        error: 'Failed to submit form. Please try again.'
      })
    }
  }
  return (
    <section id="contact" className="py-20 bg-terracotta-red">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-warm-white mb-6">
            Visit Our Campus
          </h2>
          <div className="w-24 h-1 bg-wood mx-auto mb-8"></div>
          <p className="text-xl text-soft-beige-lightest max-w-3xl mx-auto">
            Experience OIA Academy firsthand! Schedule a personalized campus tour, meet our faculty, 
            and discover why families choose our Islamic educational community.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            {/* Quick Action Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a 
                href={`tel:${CONTACT_INFO.phone.link}`}
                className="group bg-wood hover:bg-wood-dark rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <Icon name="phone" size={24} className="text-warm-white group-hover:scale-110 transition-transform" aria-hidden="true" />
                  <h3 className="text-lg font-bold text-warm-white">Call Now</h3>
                </div>
                <p className="text-soft-beige-lightest text-sm mb-2">Speak with our admissions team</p>
                <p className="text-warm-white font-semibold">{CONTACT_INFO.phone.display}</p>
              </a>

              <a 
                href={`https://maps.google.com/?q=${encodeURIComponent(`${CONTACT_INFO.school.address.street} ${CONTACT_INFO.school.address.city} ${CONTACT_INFO.school.address.province}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-wood hover:bg-wood-dark rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <Icon name="location" size={24} className="text-warm-white group-hover:scale-110 transition-transform" aria-hidden="true" />
                  <h3 className="text-lg font-bold text-warm-white">Directions</h3>
                </div>
                <p className="text-soft-beige-lightest text-sm mb-2">Get directions to our campus</p>
                <p className="text-warm-white font-semibold text-sm">{CONTACT_INFO.school.address.street}</p>
              </a>
            </div>

            {/* Tour Booking Card */}
            <div className="bg-warm-white rounded-xl p-6 shadow-lg border-2 border-wood">
              <div className="flex items-center space-x-3 mb-4">
                <Icon name="calendar" size={28} className="text-terracotta-red" aria-hidden="true" />
                <h3 className="text-2xl font-bold text-terracotta-red">Book Your Tour</h3>
              </div>
              <p className="text-deep-teal mb-4">
                Experience our Islamic educational environment, meet our teachers, and see our facilities.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm text-deep-teal">
                  <Icon name="clock" size={16} className="text-terracotta-red" aria-hidden="true" />
                  <span>Tours available {CONTACT_INFO.tour.availability}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-deep-teal">
                  <Icon name="users" size={16} className="text-terracotta-red" aria-hidden="true" />
                  <span>{CONTACT_INFO.tour.description}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-deep-teal">
                  <Icon name="graduation" size={16} className="text-terracotta-red" aria-hidden="true" />
                  <span>Meet with admissions counselor</span>
                </div>
              </div>
              <button className="w-full mt-4 bg-terracotta-red hover:bg-terracotta-red-dark text-warm-white py-3 px-6 rounded-lg font-bold transition-all duration-300 hover:shadow-lg">
                Schedule Tour
              </button>
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap gap-3">
              <a 
                href="/admissions" 
                className="inline-flex items-center space-x-2 bg-warm-white/20 hover:bg-warm-white/30 text-warm-white px-4 py-2 rounded-lg transition-colors duration-300 backdrop-blur-sm"
              >
                <Icon name="info" size={16} aria-hidden="true" />
                <span className="text-sm font-medium">Admissions Info</span>
              </a>
              <a 
                href="/tuition" 
                className="inline-flex items-center space-x-2 bg-warm-white/20 hover:bg-warm-white/30 text-warm-white px-4 py-2 rounded-lg transition-colors duration-300 backdrop-blur-sm"
              >
                <Icon name="donate" size={16} aria-hidden="true" />
                <span className="text-sm font-medium">Tuition & Fees</span>
              </a>
              <a 
                href="/programs" 
                className="inline-flex items-center space-x-2 bg-warm-white/20 hover:bg-warm-white/30 text-warm-white px-4 py-2 rounded-lg transition-colors duration-300 backdrop-blur-sm"
              >
                <Icon name="book" size={16} aria-hidden="true" />
                <span className="text-sm font-medium">Our Programs</span>
              </a>
            </div>
          </div>

          <div className="bg-warm-white rounded-lg p-8 shadow-lg border border-soft-beige">
            <h3 className="text-2xl font-bold text-terracotta-red mb-6">Request Information</h3>
            {formState.isSuccess ? (
              <div className="text-center py-8">
                <div className="text-6xl text-sage-green mb-4">✓</div>
                <h3 className="text-2xl font-bold text-terracotta-red mb-4">Message Sent!</h3>
                <p className="text-deep-teal mb-6">
                  Thank you for your message. We will get back to you soon!
                </p>
                <button
                  onClick={() => setFormState(prev => ({ ...prev, isSuccess: false }))}
                  className="bg-terracotta-red hover:bg-terracotta-red-dark text-warm-white px-6 py-2 rounded-lg font-semibold transition-colors duration-300"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {formState.error && (
                  <div className="bg-terracotta-red/10 border border-terracotta-red/20 text-terracotta-red px-4 py-3 rounded-lg">
                    {formState.error}
                  </div>
                )}
                
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name *"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-soft-beige rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent transition-all duration-200"
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name *"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-soft-beige rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent transition-all duration-200"
                  />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address *"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-soft-beige rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent transition-all duration-200"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-soft-beige rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent transition-all duration-200"
                />
                <select 
                  name="inquiryType"
                  value={formData.inquiryType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-soft-beige rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent text-deep-teal transition-all duration-200"
                >
                  <option value="">Select Inquiry Type</option>
                  <option value="tour">Schedule Campus Tour</option>
                  <option value="admissions">Admissions Inquiry</option>
                  <option value="programs">Programs Information</option>
                  <option value="tuition">Tuition & Financial Aid</option>
                  <option value="enrollment">Current Year Enrollment</option>
                  <option value="transfer">Transfer Student</option>
                  <option value="other">Other Question</option>
                </select>
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Tell us about your interest in OIA Academy, grade level needed, or specific questions... *"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-soft-beige rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent transition-all duration-200"
                ></textarea>
                <button
                  type="submit"
                  disabled={formState.isSubmitting}
                  className="w-full bg-terracotta-red hover:bg-terracotta-red-dark text-warm-white py-3 rounded-lg font-semibold transition-all duration-300 shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {formState.isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-warm-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    'Send Inquiry'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </section>
  )
}