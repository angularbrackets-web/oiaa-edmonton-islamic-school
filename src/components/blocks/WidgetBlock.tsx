'use client'

/**
 * Widget Block Component
 *
 * Renders external widgets by loading their scripts, stylesheets, and HTML containers
 * Supports providers like Keela, Eventbrite, Mailchimp, etc.
 */

import { WidgetBlockContent } from '@/types/cms'
import Script from 'next/script'
import { useState, useEffect } from 'react'

interface WidgetBlockProps {
  content: WidgetBlockContent
}

export default function WidgetBlock({ content }: WidgetBlockProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [scriptsLoaded, setScriptsLoaded] = useState(0)

  const {
    provider_name,
    widget_name,
    script_urls = [],
    script_loading = 'afterInteractive',
    stylesheet_urls = [],
    container_html,
    container_id,
    container_class,
    custom_attributes = {},
    inline_config_before,
    inline_config,
    min_height = '400px',
    loading_text = 'Loading widget...'
  } = content

  // Execute config BEFORE scripts load (e.g., window.Keela = {...})
  useEffect(() => {
    if (inline_config_before) {
      try {
        const configFunction = new Function(inline_config_before)
        configFunction()
      } catch (error) {
        console.error('Error executing widget pre-initialization config:', error)
        setHasError(true)
      }
    }
  }, [inline_config_before])

  // Track script loading
  const totalScripts = script_urls.length
  const allScriptsLoaded = scriptsLoaded >= totalScripts

  useEffect(() => {
    // Execute inline config after all scripts are loaded
    if (allScriptsLoaded && inline_config && !isLoaded) {
      try {
        // Use Function constructor instead of eval for slightly better security
        const configFunction = new Function(inline_config)
        configFunction()
        setIsLoaded(true)
      } catch (error) {
        console.error('Error executing widget inline config:', error)
        setHasError(true)
      }
    } else if (allScriptsLoaded && !inline_config) {
      setIsLoaded(true)
    }
  }, [allScriptsLoaded, inline_config, isLoaded])

  // Special handling for Keela widgets - manually create iframe
  useEffect(() => {
    if (!allScriptsLoaded || hasError) return

    // Check if this is a Keela widget by looking for keela-embed-form class
    const isKeelaWidget = container_html?.includes('keela-embed-form')

    if (isKeelaWidget) {
      // Wait a tick for DOM to update
      setTimeout(() => {
        const embedForm = document.querySelector('.keela-embed-form')

        if (embedForm && embedForm.children.length === 0) {
          // Only create iframe if it doesn't already exist
          const dataSrc = embedForm.getAttribute('data-src')
          const embedId = embedForm.getAttribute('data-embed-id')

          if (dataSrc && embedId) {
            const iframe = document.createElement('iframe')
            iframe.className = ''
            iframe.frameBorder = '0'
            iframe.setAttribute('data-embed-id', embedId)
            iframe.src = `${dataSrc}?embedId=${embedId}`
            iframe.setAttribute('allow', 'clipboard-write')
            iframe.style.width = '100%'
            iframe.style.border = 'none'

            embedForm.appendChild(iframe)
          }
        }
      }, 100)
    }
  }, [allScriptsLoaded, hasError, container_html])

  // Handle script loading
  const handleScriptLoad = () => {
    setScriptsLoaded(prev => prev + 1)
  }

  const handleScriptError = (error: any) => {
    console.error('Error loading widget script:', error)
    setHasError(true)
  }

  // Build container attributes
  const containerAttributes: Record<string, string> = {}
  if (container_id) {
    containerAttributes.id = container_id
  }
  if (container_class) {
    containerAttributes.className = container_class
  }
  // Add custom attributes (data-*, etc.)
  Object.entries(custom_attributes).forEach(([key, value]) => {
    containerAttributes[key] = value
  })

  return (
    <div className="widget-block-wrapper" style={{ minHeight: min_height }}>
      {/* Load stylesheets */}
      {stylesheet_urls.map((url, index) => (
        <link
          key={`stylesheet-${index}`}
          rel="stylesheet"
          href={url}
        />
      ))}

      {/* Load scripts */}
      {script_urls.map((url, index) => (
        <Script
          key={`script-${index}`}
          src={url}
          strategy={script_loading}
          onLoad={handleScriptLoad}
          onError={handleScriptError}
        />
      ))}

      {/* Loading state */}
      {!allScriptsLoaded && !hasError && (
        <div className="flex items-center justify-center" style={{ minHeight: min_height }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deep-teal mx-auto mb-4"></div>
            <p className="text-gray-600">{loading_text}</p>
            {provider_name && (
              <p className="text-sm text-gray-500 mt-2">
                {provider_name} {widget_name && `- ${widget_name}`}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="flex items-center justify-center" style={{ minHeight: min_height }}>
          <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200">
            <div className="text-red-600 text-4xl mb-3">⚠️</div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">Widget Failed to Load</h3>
            <p className="text-sm text-red-700">
              There was an error loading the {provider_name} widget.
            </p>
            <p className="text-xs text-red-600 mt-2">
              Please check the console for more details or contact support.
            </p>
          </div>
        </div>
      )}

      {/* Widget container */}
      {allScriptsLoaded && !hasError && (
        <div className="widget-container">
          {container_html ? (
            // Render raw HTML if provided
            <div dangerouslySetInnerHTML={{ __html: container_html }} />
          ) : (
            // Or render a simple container with ID/class
            <div {...containerAttributes} />
          )}
        </div>
      )}

      {/* Accessibility info */}
      <div className="sr-only" aria-live="polite">
        {!allScriptsLoaded && `Loading ${provider_name || 'widget'}...`}
        {allScriptsLoaded && !hasError && `${provider_name || 'Widget'} loaded successfully`}
        {hasError && `Failed to load ${provider_name || 'widget'}`}
      </div>
    </div>
  )
}
