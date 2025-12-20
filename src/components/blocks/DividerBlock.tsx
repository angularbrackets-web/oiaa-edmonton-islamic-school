/**
 * Divider Block
 *
 * Renders a visual separator line between blocks with multiple styles
 * including an Islamic geometric pattern option
 */

import { DividerBlockContent, DividerStyle } from '@/types/cms'

interface DividerBlockProps {
  content: DividerBlockContent
}

// Thickness mappings
const THICKNESS_MAP = {
  thin: '1px',
  medium: '2px',
  thick: '4px'
}

// Width mappings
const WIDTH_MAP = {
  full: '100%',
  '80': '80%',
  '60': '60%',
  '40': '40%'
}

// Alignment mappings for margin
const ALIGNMENT_MAP = {
  left: 'mr-auto',
  center: 'mx-auto',
  right: 'ml-auto'
}

export default function DividerBlock({ content }: DividerBlockProps) {
  const {
    style = 'solid',
    color = '#d1d5db',
    thickness = 'thin',
    width = 'full',
    alignment = 'center',
    pattern_color = '#145B55'
  } = content

  const computedWidth = WIDTH_MAP[width] || '100%'
  const computedThickness = THICKNESS_MAP[thickness] || '1px'
  const alignmentClass = ALIGNMENT_MAP[alignment] || 'mx-auto'

  // Islamic pattern divider
  if (style === 'islamic-pattern') {
    return (
      <div
        className={`divider-block ${alignmentClass}`}
        style={{ width: computedWidth }}
        role="separator"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 200 20"
          className="w-full"
          style={{ height: thickness === 'thin' ? '16px' : thickness === 'medium' ? '24px' : '32px' }}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Repeating Islamic geometric pattern */}
          <defs>
            <pattern id="islamic-pattern" patternUnits="userSpaceOnUse" width="40" height="20">
              {/* Central diamond */}
              <path
                d="M20 0 L25 10 L20 20 L15 10 Z"
                fill={pattern_color}
                opacity="0.8"
              />
              {/* Side curves */}
              <path
                d="M0 10 Q5 5 10 10 Q5 15 0 10"
                fill={color}
                opacity="0.6"
              />
              <path
                d="M30 10 Q35 5 40 10 Q35 15 30 10"
                fill={color}
                opacity="0.6"
              />
              {/* Connecting lines */}
              <line
                x1="10" y1="10" x2="15" y2="10"
                stroke={pattern_color}
                strokeWidth="1"
                opacity="0.5"
              />
              <line
                x1="25" y1="10" x2="30" y2="10"
                stroke={pattern_color}
                strokeWidth="1"
                opacity="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#islamic-pattern)" />
        </svg>
      </div>
    )
  }

  // Standard line dividers
  const borderStyle = style === 'double' ? 'double' : style
  const borderWidth = style === 'double' ? '3px' : computedThickness

  return (
    <div
      className={`divider-block ${alignmentClass}`}
      style={{ width: computedWidth }}
      role="separator"
      aria-hidden="true"
    >
      <hr
        style={{
          border: 'none',
          borderTop: `${borderWidth} ${borderStyle} ${color}`,
          margin: 0
        }}
      />
    </div>
  )
}
