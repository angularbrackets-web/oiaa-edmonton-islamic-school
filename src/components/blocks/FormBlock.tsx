'use client'

import { useState, FormEvent } from 'react'
import { FormBlockContent, FormField } from '@/types/cms'

interface FormBlockProps {
  content: FormBlockContent
}

export default function FormBlock({ content }: FormBlockProps) {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  // Validate a single field
  const validateField = (field: FormField, value: any): string | null => {
    // Required validation
    if (field.required && (!value || (typeof value === 'string' && !value.trim()))) {
      return `${field.label} is required`
    }

    // Type-specific validation
    if (value && typeof value === 'string' && value.trim()) {
      switch (field.type) {
        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailRegex.test(value)) {
            return 'Please enter a valid email address'
          }
          break
        case 'phone':
          const phoneRegex = /^[\d\s\-\+\(\)]+$/
          if (!phoneRegex.test(value)) {
            return 'Please enter a valid phone number'
          }
          break
        case 'number':
          if (isNaN(Number(value))) {
            return 'Please enter a valid number'
          }
          break
      }

      // Custom validation pattern
      if (field.validation) {
        try {
          const regex = new RegExp(field.validation)
          if (!regex.test(value)) {
            return `Please enter a valid ${field.label.toLowerCase()}`
          }
        } catch (e) {
          console.error('Invalid validation regex:', e)
        }
      }
    }

    return null
  }

  // Validate all fields
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    content.fields.forEach(field => {
      const error = validateField(field, formData[field.id])
      if (error) {
        newErrors[field.id] = error
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle field change
  const handleFieldChange = (field: FormField, value: any) => {
    setFormData(prev => ({ ...prev, [field.id]: value }))
    // Clear error when user starts typing
    if (errors[field.id]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field.id]
        return newErrors
      })
    }
  }

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // Honeypot check - if filled, it's a bot
    const honeypot = (e.target as HTMLFormElement).querySelector<HTMLInputElement>('[name="_hp"]')
    if (honeypot && honeypot.value) {
      console.log('Bot detected')
      return
    }

    // Validate form
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/form-submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          form_name: content.form_name,
          form_data: formData,
          notify_email: content.notify_email,
          email_subject: content.email_subject || `New submission from ${content.form_name}`
        })
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setSubmitStatus('success')
        setFormData({}) // Clear form
      } else {
        setSubmitStatus('error')
        console.error('Form submission error:', result.error)
      }
    } catch (error) {
      setSubmitStatus('error')
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Render form field based on type
  const renderField = (field: FormField) => {
    const fieldError = errors[field.id]
    const fieldValue = formData[field.id] || ''

    const baseInputClasses = `w-full px-4 py-3 border rounded-lg transition-all focus:ring-2 focus:ring-terracotta-red focus:border-transparent ${
      fieldError ? 'border-red-500' : 'border-gray-300'
    }`

    const fieldWrapper = (children: React.ReactNode) => (
      <div className={field.width === 'half' ? 'md:col-span-1' : 'md:col-span-2'}>
        <label className="block text-sm font-medium text-deep-teal mb-2">
          {field.label}
          {field.required && <span className="text-terracotta-red ml-1">*</span>}
        </label>
        {children}
        {fieldError && (
          <p className="mt-1 text-sm text-red-600">{fieldError}</p>
        )}
      </div>
    )

    switch (field.type) {
      case 'textarea':
        return fieldWrapper(
          <textarea
            value={fieldValue}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            className={baseInputClasses}
            aria-invalid={!!fieldError}
            aria-describedby={fieldError ? `${field.id}-error` : undefined}
          />
        )

      case 'select':
        return fieldWrapper(
          <select
            value={fieldValue}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            className={baseInputClasses}
            aria-invalid={!!fieldError}
            aria-describedby={fieldError ? `${field.id}-error` : undefined}
          >
            <option value="">Select an option...</option>
            {field.options?.map((option, idx) => (
              <option key={idx} value={option}>{option}</option>
            ))}
          </select>
        )

      case 'checkbox':
        return fieldWrapper(
          <div className="space-y-2">
            {field.options?.map((option, idx) => (
              <label key={idx} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={option}
                  checked={Array.isArray(fieldValue) && fieldValue.includes(option)}
                  onChange={(e) => {
                    const currentValues = Array.isArray(fieldValue) ? fieldValue : []
                    const newValues = e.target.checked
                      ? [...currentValues, option]
                      : currentValues.filter(v => v !== option)
                    handleFieldChange(field, newValues)
                  }}
                  className="w-4 h-4 text-terracotta-red border-gray-300 rounded focus:ring-terracotta-red"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        )

      case 'radio':
        return fieldWrapper(
          <div className="space-y-2">
            {field.options?.map((option, idx) => (
              <label key={idx} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={field.id}
                  value={option}
                  checked={fieldValue === option}
                  onChange={(e) => handleFieldChange(field, e.target.value)}
                  className="w-4 h-4 text-terracotta-red border-gray-300 focus:ring-terracotta-red"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        )

      case 'date':
      case 'number':
      case 'email':
      case 'phone':
      case 'text':
      default:
        return fieldWrapper(
          <input
            type={field.type === 'phone' ? 'tel' : field.type}
            value={fieldValue}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            placeholder={field.placeholder}
            className={baseInputClasses}
            aria-invalid={!!fieldError}
            aria-describedby={fieldError ? `${field.id}-error` : undefined}
          />
        )
    }
  }

  // Don't render if no fields
  if (!content.fields || content.fields.length === 0) {
    return null
  }

  const buttonStyleClasses = content.button_style === 'secondary'
    ? 'bg-deep-teal text-white hover:bg-deep-teal/90'
    : 'bg-terracotta-red text-white hover:bg-terracotta-red-dark'

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Form Header */}
        {(content.title || content.description) && (
          <div className="mb-8 text-center">
            {content.title && (
              <h2 className="text-3xl font-bold text-deep-teal mb-3">
                {content.title}
              </h2>
            )}
            {content.description && (
              <p className="text-gray-600 text-lg">
                {content.description}
              </p>
            )}
          </div>
        )}

        {/* Success Message */}
        {submitStatus === 'success' && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800">
              {content.success_message || 'Thank you for your submission!'}
            </p>
          </div>
        )}

        {/* Error Message */}
        {submitStatus === 'error' && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">
              {content.error_message || 'There was an error submitting the form. Please try again.'}
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Honeypot field (hidden from users, visible to bots) */}
          <input
            type="text"
            name="_hp"
            tabIndex={-1}
            autoComplete="off"
            className="absolute opacity-0 pointer-events-none"
            aria-hidden="true"
          />

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {content.fields.map(field => (
              <div key={field.id}>
                {renderField(field)}
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="text-center pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-8 py-3 rounded-lg font-semibold transition-all ${buttonStyleClasses} ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : 'shadow-lg hover:shadow-xl'
              }`}
            >
              {isSubmitting ? 'Submitting...' : (content.submit_button_text || 'Submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
