/**
 * Spacer Block
 *
 * Renders vertical spacing between blocks with preset or custom heights
 */

import { SpacerBlockContent, SpacingSize } from '@/types/cms'

interface SpacerBlockProps {
  content: SpacerBlockContent
}

// Height mappings for preset sizes
const HEIGHT_MAP: Record<SpacingSize, string> = {
  none: '0',
  xs: '0.5rem',    // 8px
  sm: '1rem',      // 16px
  md: '2rem',      // 32px
  lg: '3rem',      // 48px
  xl: '4rem',      // 64px
  '2xl': '6rem'    // 96px
}

export default function SpacerBlock({ content }: SpacerBlockProps) {
  const { height = 'md', custom_height } = content

  // Use custom height if set, otherwise use preset
  const computedHeight = height === 'custom' && custom_height
    ? custom_height
    : HEIGHT_MAP[height as SpacingSize] || HEIGHT_MAP.md

  return (
    <div
      className="spacer-block w-full"
      style={{ height: computedHeight }}
      aria-hidden="true"
    />
  )
}
