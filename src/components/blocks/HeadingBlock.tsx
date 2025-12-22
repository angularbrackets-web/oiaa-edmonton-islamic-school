import React from 'react'
import { HeadingBlockContent } from '@/types/cms'

interface HeadingBlockProps {
  content: HeadingBlockContent
}

export default function HeadingBlock({ content }: HeadingBlockProps) {
  const { text, level = 2, alignment = 'left', subtitle, show_divider = false, divider_color } = content

  // Heading tag mapping
  const HeadingTag = `h${level}` as const

  // Alignment classes
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  // Size classes based on heading level
  const sizeClasses = {
    1: 'text-4xl md:text-5xl lg:text-6xl font-bold',
    2: 'text-3xl md:text-4xl lg:text-5xl font-bold',
    3: 'text-2xl md:text-3xl lg:text-4xl font-semibold',
    4: 'text-xl md:text-2xl lg:text-3xl font-semibold',
    5: 'text-lg md:text-xl lg:text-2xl font-medium',
    6: 'text-base md:text-lg lg:text-xl font-medium',
  }

  // Divider styling
  const dividerStyle = divider_color
    ? { backgroundColor: divider_color }
    : undefined

  return (
    <div className={alignmentClasses[alignment]}>
      {React.createElement(
        HeadingTag,
        {
          className: `${sizeClasses[level]} text-gray-900 mb-0`
        },
        text
      )}

      {subtitle && (
        <p className="mt-3 text-base md:text-lg text-gray-600 dark:text-gray-400">
          {subtitle}
        </p>
      )}

      {show_divider && (
        <div
          className={`mt-4 h-1 rounded-full ${
            alignment === 'center' ? 'mx-auto' : alignment === 'right' ? 'ml-auto' : ''
          } ${divider_color ? '' : 'bg-gradient-to-r from-teal-600 to-teal-400'}`}
          style={{
            width: alignment === 'center' ? '80px' : '120px',
            ...(dividerStyle || {})
          }}
        />
      )}
    </div>
  )
}
