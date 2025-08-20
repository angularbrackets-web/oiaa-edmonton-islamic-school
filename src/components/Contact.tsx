'use client'

import { useState } from 'react'

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
            Get In Touch
          </h2>
          <div className="w-24 h-1 bg-wood mx-auto mb-8"></div>
          <p className="text-xl text-soft-beige-lightest max-w-3xl mx-auto">
            We welcome you to visit our campus and learn more about our programs. 
            Contact us today to schedule a tour or discuss enrollment.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-wood rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                <span className="text-warm-white text-xl">📍</span>
              </div>
              <div className="text-warm-white">
                <h3 className="text-xl font-bold mb-2">Address</h3>
                <p className="text-soft-beige-lightest">
                  123 Islamic Center Drive<br />
                  Edmonton, AB T6X 1A1<br />
                  Canada
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-wood rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                <span className="text-warm-white text-xl">📞</span>
              </div>
              <div className="text-warm-white">
                <h3 className="text-xl font-bold mb-2">Phone & Email</h3>
                <p className="text-soft-beige-lightest">
                  Phone: (780) 123-4567<br />
                  Email: info@oiaaedmonton.ca<br />
                  Admissions: admissions@oiaaedmonton.ca
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-wood rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                <span className="text-warm-white text-xl">🕐</span>
              </div>
              <div className="text-warm-white">
                <h3 className="text-xl font-bold mb-2">School Hours</h3>
                <p className="text-soft-beige-lightest">
                  Monday - Friday: 8:00 AM - 3:30 PM<br />
                  Saturday: 9:00 AM - 2:00 PM (Weekend School)<br />
                  Office Hours: 8:00 AM - 4:00 PM
                </p>
              </div>
            </div>
          </div>

          <div className="bg-warm-white rounded-lg p-8 shadow-lg border border-soft-beige">
            <h3 className="text-2xl font-bold text-terracotta-red mb-6">Send us a Message</h3>
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
                  <option value="admissions">Admissions</option>
                  <option value="programs">Programs Information</option>
                  <option value="visit">Campus Visit</option>
                  <option value="donation">Donation & Support</option>
                  <option value="career">Career Opportunities</option>
                  <option value="other">Other</option>
                </select>
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Your message... *"
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
                    'Send Message'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex space-x-6">
            <a href="#" className="text-wood hover:text-soft-beige-lightest transition-colors duration-300">
              <span className="text-2xl">📘</span>
            </a>
            <a href="#" className="text-wood hover:text-soft-beige-lightest transition-colors duration-300">
              <span className="text-2xl">📸</span>
            </a>
            <a href="#" className="text-wood hover:text-soft-beige-lightest transition-colors duration-300">
              <span className="text-2xl">🐦</span>
            </a>
            <a href="#" className="text-wood hover:text-soft-beige-lightest transition-colors duration-300">
              <span className="text-2xl">📺</span>
            </a>
          </div>
          <p className="text-soft-beige-lightest mt-4">
            Follow us on social media for updates and news
          </p>
        </div>
      </div>
    </section>
  )
}