'use client'

/**
 * Widget Block Editor
 *
 * Admin interface for configuring external widgets
 */

import { useState } from 'react'
import { WidgetBlockContent, WidgetScriptLoading } from '@/types/cms'
import { PlusIcon, TrashIcon, EyeIcon, EyeSlashIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import WidgetBlock from '@/components/blocks/WidgetBlock'

interface WidgetBlockEditorProps {
  content: WidgetBlockContent
  onChange: (content: WidgetBlockContent) => void
}

export default function WidgetBlockEditor({ content, onChange }: WidgetBlockEditorProps) {
  const [showPreview, setShowPreview] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string | null>('basic')

  // Add script URL
  const addScriptUrl = () => {
    onChange({
      ...content,
      script_urls: [...(content.script_urls || []), '']
    })
  }

  // Remove script URL
  const removeScriptUrl = (index: number) => {
    onChange({
      ...content,
      script_urls: content.script_urls.filter((_, i) => i !== index)
    })
  }

  // Update script URL
  const updateScriptUrl = (index: number, value: string) => {
    const newUrls = [...content.script_urls]
    newUrls[index] = value
    onChange({ ...content, script_urls: newUrls })
  }

  // Add stylesheet URL
  const addStylesheetUrl = () => {
    onChange({
      ...content,
      stylesheet_urls: [...(content.stylesheet_urls || []), '']
    })
  }

  // Remove stylesheet URL
  const removeStylesheetUrl = (index: number) => {
    onChange({
      ...content,
      stylesheet_urls: content.stylesheet_urls.filter((_, i) => i !== index)
    })
  }

  // Update stylesheet URL
  const updateStylesheetUrl = (index: number, value: string) => {
    const newUrls = [...content.stylesheet_urls]
    newUrls[index] = value
    onChange({ ...content, stylesheet_urls: newUrls })
  }

  // Add custom attribute
  const addCustomAttribute = () => {
    onChange({
      ...content,
      custom_attributes: {
        ...(content.custom_attributes || {}),
        '': ''
      }
    })
  }

  // Remove custom attribute
  const removeCustomAttribute = (key: string) => {
    const newAttrs = { ...content.custom_attributes }
    delete newAttrs[key]
    onChange({ ...content, custom_attributes: newAttrs })
  }

  // Update custom attribute
  const updateCustomAttribute = (oldKey: string, newKey: string, value: string) => {
    const newAttrs = { ...content.custom_attributes }
    if (oldKey !== newKey) {
      delete newAttrs[oldKey]
    }
    newAttrs[newKey] = value
    onChange({ ...content, custom_attributes: newAttrs })
  }

  const loadingStrategies: { value: WidgetScriptLoading; label: string; description: string }[] = [
    {
      value: 'beforeInteractive',
      label: 'Before Interactive',
      description: 'Load before page becomes interactive (critical widgets only)'
    },
    {
      value: 'afterInteractive',
      label: 'After Interactive (Recommended)',
      description: 'Load after page becomes interactive (default, best for most widgets)'
    },
    {
      value: 'lazyOnload',
      label: 'Lazy Onload',
      description: 'Load during browser idle time (non-critical widgets)'
    }
  ]

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  return (
    <div className="space-y-6">
      {/* Security Warning */}
      <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded">
        <div className="flex">
          <ExclamationTriangleIcon className="h-5 w-5 text-amber-400 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-amber-800 mb-1">Security Notice</h3>
            <p className="text-sm text-amber-700">
              Only add widgets from trusted providers. External scripts can access user data and affect site performance.
              Always verify the script URLs are from official sources.
            </p>
          </div>
        </div>
      </div>

      {/* Preview Toggle */}
      <div className="flex justify-between items-center pb-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Widget Configuration</h3>
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center gap-2 px-4 py-2 bg-deep-teal text-white rounded-md hover:bg-deep-teal/90 transition-colors"
        >
          {showPreview ? (
            <>
              <EyeSlashIcon className="h-5 w-5" />
              Hide Preview
            </>
          ) : (
            <>
              <EyeIcon className="h-5 w-5" />
              Show Preview
            </>
          )}
        </button>
      </div>

      {/* Preview Panel */}
      {showPreview && (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-4">Widget Preview</h4>
          <div className="bg-white rounded-lg shadow-sm">
            <WidgetBlock content={content} />
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Note: Preview shows how the widget will appear on your public pages. Changes are reflected in real-time.
          </p>
        </div>
      )}

      {/* Basic Information Section */}
      <div className="border border-gray-200 rounded-lg">
        <button
          type="button"
          onClick={() => toggleSection('basic')}
          className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors rounded-t-lg"
        >
          <h3 className="text-base font-semibold text-gray-900">Basic Information</h3>
          <span className="text-gray-500">{expandedSection === 'basic' ? '−' : '+'}</span>
        </button>
        {expandedSection === 'basic' && (
          <div className="p-4 space-y-4">
            {/* Provider Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Provider Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={content.provider_name || ''}
                onChange={(e) => onChange({ ...content, provider_name: e.target.value })}
                placeholder="e.g., Keela, Eventbrite, Mailchimp"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-deep-teal focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">The name of the widget provider (required)</p>
            </div>

            {/* Widget Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Widget Name
              </label>
              <input
                type="text"
                value={content.widget_name || ''}
                onChange={(e) => onChange({ ...content, widget_name: e.target.value })}
                placeholder="e.g., Donation Form, Event Calendar"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-deep-teal focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Optional: Specific name for this widget</p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={content.description || ''}
                onChange={(e) => onChange({ ...content, description: e.target.value })}
                placeholder="Internal notes about this widget..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-deep-teal focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Admin notes (not displayed publicly)</p>
            </div>
          </div>
        )}
      </div>

      {/* Scripts Section */}
      <div className="border border-gray-200 rounded-lg">
        <button
          type="button"
          onClick={() => toggleSection('scripts')}
          className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <h3 className="text-base font-semibold text-gray-900">
            Scripts {content.script_urls?.length > 0 && `(${content.script_urls.length})`}
          </h3>
          <span className="text-gray-500">{expandedSection === 'scripts' ? '−' : '+'}</span>
        </button>
        {expandedSection === 'scripts' && (
          <div className="p-4 space-y-4">
            {/* Script URLs */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Script URLs
                </label>
                <button
                  type="button"
                  onClick={addScriptUrl}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-deep-teal text-white rounded-md hover:bg-deep-teal/90"
                >
                  <PlusIcon className="h-4 w-4" />
                  Add Script
                </button>
              </div>
              {content.script_urls && content.script_urls.length > 0 ? (
                <div className="space-y-2">
                  {content.script_urls.map((url, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => updateScriptUrl(index, e.target.value)}
                        placeholder="https://example.com/widget.js"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-deep-teal focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => removeScriptUrl(index)}
                        className="px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">No scripts added yet</p>
              )}
            </div>

            {/* Script Loading Strategy */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loading Strategy
              </label>
              <div className="space-y-2">
                {loadingStrategies.map((strategy) => (
                  <label
                    key={strategy.value}
                    className="flex items-start gap-3 p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="script_loading"
                      value={strategy.value}
                      checked={content.script_loading === strategy.value}
                      onChange={(e) => onChange({ ...content, script_loading: e.target.value as WidgetScriptLoading })}
                      className="mt-1 text-deep-teal focus:ring-deep-teal"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{strategy.label}</div>
                      <div className="text-xs text-gray-500">{strategy.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stylesheets Section */}
      <div className="border border-gray-200 rounded-lg">
        <button
          type="button"
          onClick={() => toggleSection('stylesheets')}
          className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <h3 className="text-base font-semibold text-gray-900">
            Stylesheets {content.stylesheet_urls?.length > 0 && `(${content.stylesheet_urls.length})`}
          </h3>
          <span className="text-gray-500">{expandedSection === 'stylesheets' ? '−' : '+'}</span>
        </button>
        {expandedSection === 'stylesheets' && (
          <div className="p-4 space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Stylesheet URLs
                </label>
                <button
                  type="button"
                  onClick={addStylesheetUrl}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-deep-teal text-white rounded-md hover:bg-deep-teal/90"
                >
                  <PlusIcon className="h-4 w-4" />
                  Add Stylesheet
                </button>
              </div>
              {content.stylesheet_urls && content.stylesheet_urls.length > 0 ? (
                <div className="space-y-2">
                  {content.stylesheet_urls.map((url, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => updateStylesheetUrl(index, e.target.value)}
                        placeholder="https://example.com/widget.css"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-deep-teal focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => removeStylesheetUrl(index)}
                        className="px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">No stylesheets added yet</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Container Section */}
      <div className="border border-gray-200 rounded-lg">
        <button
          type="button"
          onClick={() => toggleSection('container')}
          className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <h3 className="text-base font-semibold text-gray-900">Container Configuration</h3>
          <span className="text-gray-500">{expandedSection === 'container' ? '−' : '+'}</span>
        </button>
        {expandedSection === 'container' && (
          <div className="p-4 space-y-4">
            {/* Container HTML */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Container HTML
              </label>
              <textarea
                value={content.container_html || ''}
                onChange={(e) => onChange({ ...content, container_html: e.target.value })}
                placeholder='<div id="my-widget"></div>'
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-deep-teal focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Raw HTML for the widget container (leave empty to use simple div with ID/class below)
              </p>
            </div>

            {/* Container ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Container ID
              </label>
              <input
                type="text"
                value={content.container_id || ''}
                onChange={(e) => onChange({ ...content, container_id: e.target.value })}
                placeholder="widget-container"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-deep-teal focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">ID attribute for the container div</p>
            </div>

            {/* Container Class */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Container CSS Classes
              </label>
              <input
                type="text"
                value={content.container_class || ''}
                onChange={(e) => onChange({ ...content, container_class: e.target.value })}
                placeholder="widget-wrapper my-custom-class"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-deep-teal focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Space-separated CSS classes</p>
            </div>
          </div>
        )}
      </div>

      {/* Advanced Section */}
      <div className="border border-gray-200 rounded-lg">
        <button
          type="button"
          onClick={() => toggleSection('advanced')}
          className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <h3 className="text-base font-semibold text-gray-900">Advanced Configuration</h3>
          <span className="text-gray-500">{expandedSection === 'advanced' ? '−' : '+'}</span>
        </button>
        {expandedSection === 'advanced' && (
          <div className="p-4 space-y-4">
            {/* Custom Attributes */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Custom Attributes (data-*, etc.)
                </label>
                <button
                  type="button"
                  onClick={addCustomAttribute}
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-deep-teal text-white rounded-md hover:bg-deep-teal/90"
                >
                  <PlusIcon className="h-4 w-4" />
                  Add Attribute
                </button>
              </div>
              {content.custom_attributes && Object.keys(content.custom_attributes).length > 0 ? (
                <div className="space-y-2">
                  {Object.entries(content.custom_attributes).map(([key, value], index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={key}
                        onChange={(e) => updateCustomAttribute(key, e.target.value, value)}
                        placeholder="data-attribute-name"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-deep-teal focus:border-transparent"
                      />
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => updateCustomAttribute(key, key, e.target.value)}
                        placeholder="value"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-deep-teal focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => removeCustomAttribute(key)}
                        className="px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">No custom attributes added yet</p>
              )}
            </div>

            {/* Inline Config */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Inline Configuration Code
              </label>
              <textarea
                value={content.inline_config || ''}
                onChange={(e) => onChange({ ...content, inline_config: e.target.value })}
                placeholder="// JavaScript code to initialize the widget
// Example: MyWidget.init({ apiKey: 'xxx' });"
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-deep-teal focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                JavaScript code executed after scripts load (advanced users only)
              </p>
            </div>

            {/* Min Height */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Height
              </label>
              <input
                type="text"
                value={content.min_height || '400px'}
                onChange={(e) => onChange({ ...content, min_height: e.target.value })}
                placeholder="400px"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-deep-teal focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">CSS height value (e.g., 400px, 50vh)</p>
            </div>

            {/* Loading Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loading Text
              </label>
              <input
                type="text"
                value={content.loading_text || 'Loading widget...'}
                onChange={(e) => onChange({ ...content, loading_text: e.target.value })}
                placeholder="Loading widget..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-deep-teal focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Text shown while widget loads</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
