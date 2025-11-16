---
name: responsive-testing
description: Test components across all breakpoints using Playwright browser automation and manual checks. Ensures mobile-first responsiveness and cross-device compatibility. Use when validating new components or sections for responsive design.
---

# Responsive Testing Skill

Ensure all components work beautifully across all devices and screen sizes.

## When to Use This Skill

- Testing new components for responsiveness
- Validating section transformations
- Checking mobile usability
- Cross-browser compatibility testing

## Breakpoints (Tailwind Defaults)

```typescript
const breakpoints = {
  sm: '640px',    // Small tablets
  md: '768px',    // Tablets
  lg: '1024px',   // Small laptops
  xl: '1280px',   // Desktops
  '2xl': '1536px', // Large desktops
}

// Common test sizes
const testSizes = {
  mobile: '375px',      // iPhone SE
  mobileLarge: '428px', // iPhone Pro Max
  tablet: '768px',      // iPad
  laptop: '1440px',     // MacBook Pro
  desktop: '1920px',    // Full HD
  ultrawide: '2560px',  // Ultra-wide monitor
}
```

## Manual Testing Checklist

```typescript
const manualTests = {
  visual: [
    '✓ Text is readable at all sizes',
    '✓ Images don\'t distort',
    '✓ No horizontal scrolling (unless intended)',
    '✓ Buttons are touch-friendly (min 44x44px)',
    '✓ Spacing is consistent',
    '✓ Grid layouts adapt properly',
  ],

  functionality: [
    '✓ Navigation works on mobile',
    '✓ Forms are usable on small screens',
    '✓ Modals don\'t overflow',
    '✓ Hover states have touch alternatives',
    '✓ Animations don\'t cause layout shifts',
  ],

  content: [
    '✓ Long Arabic text wraps properly',
    '✓ RTL layout works correctly',
    '✓ Images have appropriate aspect ratios',
    '✓ No cut-off content',
  ],
}
```

## Playwright Automated Testing

```typescript
// /tests/responsive.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Responsive Design Tests', () => {
  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1920, height: 1080 },
  ]

  viewports.forEach(({ name, width, height }) => {
    test(`Hero section on ${name}`, async ({ page }) => {
      await page.setViewportSize({ width, height })
      await page.goto('/')

      // Check critical elements are visible
      await expect(page.locator('h1')).toBeVisible()
      await expect(page.locator('nav')).toBeVisible()

      // Take screenshot for visual comparison
      await page.screenshot({
        path: `screenshots/hero-${name}.png`,
        fullPage: true,
      })
    })
  })
})
```

## Common Responsive Patterns

```jsx
// Mobile-first approach
className="
  text-base md:text-lg lg:text-xl
  p-4 md:p-6 lg:p-8
  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3
  gap-4 md:gap-6 lg:gap-8
"

// Hide/show based on screen size
<div className="block md:hidden">{/* Mobile only */}</div>
<div className="hidden md:block">{/* Desktop only */}</div>

// Responsive images
<img
  src="/image.jpg"
  alt="Description"
  className="w-full h-auto"
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

## Browser Testing

Test on:
- ✅ Chrome/Edge (Chromium) - Latest
- ✅ Safari (macOS/iOS) - Latest
- ✅ Firefox - Latest
- ✅ Mobile Safari (iOS)
- ✅ Chrome Mobile (Android)

## References

- Tailwind responsive design docs
- Playwright testing framework
- Browser DevTools device emulation
