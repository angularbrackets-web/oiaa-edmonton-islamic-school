/**
 * Block Layout Wrapper
 *
 * Provides consistent layout, spacing, and responsiveness for all content blocks
 */

import { ReactNode } from 'react'
import { ContainerWidth, PaddingSize, SpacingSize, DisplayStyle, CardBorderRadius, CardShadow } from '@/types/cms'

interface BlockLayoutWrapperProps {
  children: ReactNode
  containerWidth?: ContainerWidth | null
  padding?: PaddingSize | null
  paddingHorizontal?: PaddingSize | null
  marginTop?: SpacingSize | null
  marginBottom?: SpacingSize | null
  marginHorizontal?: SpacingSize | null
  backgroundColor?: string | null
  customClass?: string | null
  // Card display properties
  displayStyle?: DisplayStyle | null
  cardBorderColor?: string | null
  cardBorderRadius?: CardBorderRadius | null
  cardShadow?: CardShadow | null
  cardHoverEffect?: boolean | null
}

// Container width mappings
const containerWidthClasses: Record<ContainerWidth, string> = {
  narrow: 'max-w-3xl mx-auto px-4',      // 768px - For focused content
  contained: 'max-w-6xl mx-auto px-4',   // 1152px - Standard width
  wide: 'max-w-7xl mx-auto px-4',        // 1280px - Wide layouts
  full: 'w-full'                          // 100% - Full bleed
}

// Padding size mappings (vertical padding only)
const paddingSizeClasses: Record<PaddingSize, string> = {
  none: '',
  small: 'py-4 md:py-6',
  medium: 'py-8 md:py-12',
  large: 'py-12 md:py-20'
}

// Horizontal padding size mappings
const horizontalPaddingSizeClasses: Record<PaddingSize, string> = {
  none: '',
  small: 'px-4 md:px-6',
  medium: 'px-8 md:px-12',
  large: 'px-12 md:px-20'
}

// Spacing size mappings (margin) - Complete class names for Tailwind JIT
const marginTopClasses: Record<SpacingSize, string> = {
  none: '',
  xs: 'mt-4',
  sm: 'mt-6',
  md: 'mt-8',
  lg: 'mt-12',
  xl: 'mt-16',
  '2xl': 'mt-24'
}

const marginBottomClasses: Record<SpacingSize, string> = {
  none: '',
  xs: 'mb-4',
  sm: 'mb-6',
  md: 'mb-8',
  lg: 'mb-12',
  xl: 'mb-16',
  '2xl': 'mb-24'
}

const marginHorizontalClasses: Record<SpacingSize, string> = {
  none: '',
  xs: 'mx-4',
  sm: 'mx-6',
  md: 'mx-8',
  lg: 'mx-12',
  xl: 'mx-16',
  '2xl': 'mx-24'
}

// Card display style mappings
const displayStyleClasses: Record<DisplayStyle, string> = {
  flat: '',  // No card styling
  card: 'border border-gray-200 rounded-lg shadow-sm bg-white',  // Default card
  featured: 'border border-gray-100 rounded-xl shadow-lg bg-white'  // Elevated card
}

// Card border radius mappings
const borderRadiusClasses: Record<CardBorderRadius, string> = {
  none: 'rounded-none',
  small: 'rounded',
  medium: 'rounded-lg',
  large: 'rounded-xl'
}

// Card shadow mappings
const shadowClasses: Record<CardShadow, string> = {
  none: 'shadow-none',
  subtle: 'shadow-sm',
  medium: 'shadow-md',
  strong: 'shadow-lg'
}

export default function BlockLayoutWrapper({
  children,
  containerWidth = 'full',  // Changed: Default to full width (stretch-fit)
  padding = 'none',  // Changed: Default to no padding (let blocks stretch-fit)
  paddingHorizontal = 'none',  // Changed: Default to no horizontal padding
  marginTop = 'none',
  marginBottom = 'none',
  marginHorizontal = 'none',
  backgroundColor,
  customClass,
  displayStyle = 'flat',  // Changed: Default to flat (no borders/shadows)
  cardBorderColor,
  cardBorderRadius,
  cardShadow,
  cardHoverEffect = false
}: BlockLayoutWrapperProps) {
  // Container width class
  const widthClass = containerWidth ? containerWidthClasses[containerWidth] : containerWidthClasses.full

  // Padding classes - use none as default if not specified
  const paddingClass = padding ? paddingSizeClasses[padding] : ''
  const paddingHorizontalClass = paddingHorizontal ? horizontalPaddingSizeClasses[paddingHorizontal] : ''

  // Margin classes
  const marginTopClass = marginTop ? marginTopClasses[marginTop] : ''
  const marginBottomClass = marginBottom ? marginBottomClasses[marginBottom] : ''
  const marginHorizontalClass = marginHorizontal ? marginHorizontalClasses[marginHorizontal] : ''

  // Card display style - use flat as default if not specified
  const cardStyle = displayStyle ? displayStyleClasses[displayStyle] : ''

  // Custom card border radius (overrides default from displayStyle)
  const customBorderRadius = cardBorderRadius ? borderRadiusClasses[cardBorderRadius] : ''

  // Custom card shadow (overrides default from displayStyle)
  const customShadow = cardShadow ? shadowClasses[cardShadow] : ''

  // Hover effect
  const hoverClass = cardHoverEffect && displayStyle !== 'flat'
    ? 'hover:shadow-xl hover:scale-[1.01] transition-all duration-300'
    : ''

  // Background color (inline style for dynamic colors)
  const backgroundStyle: React.CSSProperties = {}
  if (backgroundColor) {
    backgroundStyle.backgroundColor = backgroundColor
  }
  if (cardBorderColor) {
    backgroundStyle.borderColor = cardBorderColor
  }

  // Combine all classes
  const wrapperClasses = `
    ${paddingClass}
    ${paddingHorizontalClass}
    ${marginTopClass}
    ${marginBottomClass}
    ${marginHorizontalClass}
    ${cardStyle}
    ${customBorderRadius}
    ${customShadow}
    ${hoverClass}
    ${customClass || ''}
  `.trim().replace(/\s+/g, ' ')

  // For full-width blocks, skip the inner container div to allow stretch-fit
  const shouldUseContainer = containerWidth && containerWidth !== 'full'

  // Check if we need the wrapper at all (no styling, no background, no custom class)
  const hasAnyStyles = wrapperClasses.length > 0 || Object.keys(backgroundStyle).length > 0

  // If no styling needed and full-width, return children directly (no wrapper elements)
  if (!hasAnyStyles && !shouldUseContainer) {
    return <>{children}</>
  }

  return (
    <section className={wrapperClasses} style={Object.keys(backgroundStyle).length > 0 ? backgroundStyle : undefined}>
      {shouldUseContainer ? (
        <div className={widthClass}>
          {children}
        </div>
      ) : (
        children
      )}
    </section>
  )
}

/**
 * Utility function to get container width class
 */
export function getContainerWidthClass(width?: ContainerWidth | null): string {
  if (!width) return containerWidthClasses.contained
  return containerWidthClasses[width]
}

/**
 * Utility function to get padding class
 */
export function getPaddingClass(padding?: PaddingSize | null): string {
  if (!padding) return paddingSizeClasses.medium
  return paddingSizeClasses[padding]
}
