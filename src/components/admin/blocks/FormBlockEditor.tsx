'use client'

import { useState } from 'react'
import { FormBlockContent, FormField, FormFieldType } from '@/types/cms'
import { PlusIcon, TrashIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline'

interface FormBlockEditorProps {
  content: FormBlockContent
  onChange: (content: FormBlockContent) => void
}

export default function FormBlockEditor({ content, onChange }: FormBlockEditorProps) {
  const [expandedField, setExpandedField] = useState<number | null>(null)

  // Generate unique ID for new fields
  const generateFieldId = () => {
    return `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Add new field
  const addField = () => {
    const newField: FormField = {
      id: generateFieldId(),
      type: 'text',
      label: 'New Field',
      placeholder: '',
      required: false,
      width: 'full'
    }
    onChange({
      ...content,
      fields: [...content.fields, newField]
    })
    setExpandedField(content.fields.length)
  }

  // Remove field
  const removeField = (index: number) => {
    onChange({
      ...content,
      fields: content.fields.filter((_, i) => i !== index)
    })
    if (expandedField === index) {
      setExpandedField(null)
    }
  }

  // Update field
  const updateField = (index: number, updates: Partial<FormField>) => {
    const newFields = [...content.fields]
    newFields[index] = { ...newFields[index], ...updates }
    onChange({ ...content, fields: newFields })
  }

  // Move field up
  const moveFieldUp = (index: number) => {
    if (index === 0) return
    const newFields = [...content.fields]
    ;[newFields[index - 1], newFields[index]] = [newFields[index], newFields[index - 1]]
    onChange({ ...content, fields: newFields })
    if (expandedField === index) {
      setExpandedField(index - 1)
    } else if (expandedField === index - 1) {
      setExpandedField(index)
    }
  }

  // Move field down
  const moveFieldDown = (index: number) => {
    if (index === content.fields.length - 1) return
    const newFields = [...content.fields]
    ;[newFields[index], newFields[index + 1]] = [newFields[index + 1], newFields[index]]
    onChange({ ...content, fields: newFields })
    if (expandedField === index) {
      setExpandedField(index + 1)
    } else if (expandedField === index + 1) {
      setExpandedField(index)
    }
  }

  const fieldTypes: { value: FormFieldType; label: string }[] = [
    { value: 'text', label: 'Text' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'number', label: 'Number' },
    { value: 'textarea', label: 'Textarea' },
    { value: 'select', label: 'Select Dropdown' },
    { value: 'checkbox', label: 'Checkboxes' },
    { value: 'radio', label: 'Radio Buttons' },
    { value: 'date', label: 'Date' }
  ]

  return (
    <div className="space-y-6">
      {/* Form Settings */}
      <div className="space-y-4 pb-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Form Settings</h3>

        {/* Form Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Form Name (Internal) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={content.form_name}
            onChange={(e) => onChange({ ...content, form_name: e.target.value })}
            placeholder="contact_form"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
          />
          <p className="mt-1 text-xs text-gray-500">
            Used for tracking submissions (use lowercase, underscores)
          </p>
        </div>

        {/* Form Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Form Title (Displayed to users)
          </label>
          <input
            type="text"
            value={content.title || ''}
            onChange={(e) => onChange({ ...content, title: e.target.value })}
            placeholder="Contact Us"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
          />
        </div>

        {/* Form Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (optional)
          </label>
          <textarea
            value={content.description || ''}
            onChange={(e) => onChange({ ...content, description: e.target.value })}
            placeholder="Fill out the form below and we'll get back to you soon."
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
          />
        </div>

        {/* Layout & Button Style */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Button Style
            </label>
            <select
              value={content.button_style || 'primary'}
              onChange={(e) => onChange({ ...content, button_style: e.target.value as 'primary' | 'secondary' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
            >
              <option value="primary">Primary (Terracotta)</option>
              <option value="secondary">Secondary (Deep Teal)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Submit Button Text
            </label>
            <input
              type="text"
              value={content.submit_button_text || ''}
              onChange={(e) => onChange({ ...content, submit_button_text: e.target.value })}
              placeholder="Submit"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Email Notification Settings */}
      <div className="space-y-4 pb-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Email Notifications</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notification Email
            </label>
            <input
              type="email"
              value={content.notify_email || ''}
              onChange={(e) => onChange({ ...content, notify_email: e.target.value })}
              placeholder="admin@school.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
            />
            <p className="mt-1 text-xs text-gray-500">
              Email address to receive form submissions
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Subject
            </label>
            <input
              type="text"
              value={content.email_subject || ''}
              onChange={(e) => onChange({ ...content, email_subject: e.target.value })}
              placeholder="New form submission"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      <div className="space-y-4 pb-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">User Messages</h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Success Message
          </label>
          <textarea
            value={content.success_message || ''}
            onChange={(e) => onChange({ ...content, success_message: e.target.value })}
            placeholder="Thank you for your submission! We will get back to you soon."
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Error Message
          </label>
          <textarea
            value={content.error_message || ''}
            onChange={(e) => onChange({ ...content, error_message: e.target.value })}
            placeholder="There was an error submitting the form. Please try again."
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
          />
        </div>
      </div>

      {/* Form Fields */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Form Fields ({content.fields.length})
          </label>
          <button
            type="button"
            onClick={addField}
            className="flex items-center gap-2 px-3 py-1.5 bg-terracotta-red text-white rounded-lg hover:bg-terracotta-red-dark text-sm"
          >
            <PlusIcon className="w-4 h-4" />
            Add Field
          </button>
        </div>

        {content.fields.length === 0 ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <p className="text-gray-600 mb-3">No fields yet</p>
            <button
              type="button"
              onClick={addField}
              className="inline-flex items-center gap-2 px-4 py-2 bg-terracotta-red text-white rounded-lg hover:bg-terracotta-red-dark"
            >
              <PlusIcon className="w-5 h-5" />
              Add First Field
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {content.fields.map((field, index) => (
              <div
                key={field.id}
                className="border border-gray-300 rounded-lg overflow-hidden"
              >
                {/* Field Header */}
                <div
                  className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer hover:bg-gray-100"
                  onClick={() => setExpandedField(expandedField === index ? null : index)}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">
                      {field.label || 'Untitled Field'}
                    </span>
                    <span className="text-xs text-gray-500 px-2 py-1 bg-white rounded">
                      {fieldTypes.find(t => t.value === field.type)?.label}
                    </span>
                    {field.required && (
                      <span className="text-xs text-terracotta-red">Required</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        moveFieldUp(index)
                      }}
                      disabled={index === 0}
                      className="p-1 text-gray-600 hover:bg-gray-200 rounded disabled:opacity-30"
                    >
                      <ArrowUpIcon className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        moveFieldDown(index)
                      }}
                      disabled={index === content.fields.length - 1}
                      className="p-1 text-gray-600 hover:bg-gray-200 rounded disabled:opacity-30"
                    >
                      <ArrowDownIcon className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeField(index)
                      }}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Field Content (Expandable) */}
                {expandedField === index && (
                  <div className="p-4 space-y-4 bg-white">
                    {/* Field Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Field Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={field.type}
                        onChange={(e) => updateField(index, { type: e.target.value as FormFieldType })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
                      >
                        {fieldTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Field Label */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Label <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) => updateField(index, { label: e.target.value })}
                        placeholder="Your Name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
                      />
                    </div>

                    {/* Field Placeholder */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Placeholder (optional)
                      </label>
                      <input
                        type="text"
                        value={field.placeholder || ''}
                        onChange={(e) => updateField(index, { placeholder: e.target.value })}
                        placeholder="Enter your name..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
                      />
                    </div>

                    {/* Options for select, checkbox, radio */}
                    {(field.type === 'select' || field.type === 'checkbox' || field.type === 'radio') && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Options (one per line) <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          value={(field.options || []).join('\n')}
                          onChange={(e) => updateField(index, {
                            options: e.target.value.split('\n').filter(o => o.trim())
                          })}
                          placeholder="Option 1&#10;Option 2&#10;Option 3"
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent font-mono text-sm"
                        />
                      </div>
                    )}

                    {/* Field Width & Required */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Field Width
                        </label>
                        <select
                          value={field.width || 'full'}
                          onChange={(e) => updateField(index, { width: e.target.value as 'full' | 'half' })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent"
                        >
                          <option value="full">Full Width</option>
                          <option value="half">Half Width</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Required Field
                        </label>
                        <label className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                          <input
                            type="checkbox"
                            checked={field.required || false}
                            onChange={(e) => updateField(index, { required: e.target.checked })}
                            className="w-4 h-4 text-terracotta-red border-gray-300 rounded focus:ring-terracotta-red"
                          />
                          <span className="text-sm text-gray-700">Required</span>
                        </label>
                      </div>
                    </div>

                    {/* Custom Validation */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Custom Validation (Regex Pattern - optional)
                      </label>
                      <input
                        type="text"
                        value={field.validation || ''}
                        onChange={(e) => updateField(index, { validation: e.target.value })}
                        placeholder="^[A-Z0-9]+$"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-terracotta-red focus:border-transparent font-mono text-sm"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Advanced: Regular expression for custom validation
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
