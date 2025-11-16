---
name: islamic-design-system
description: Apply Islamic design elements including color palettes (terracotta, teal, gold), typography (Arabic/English), geometric patterns, and cultural sensitivity. Use when creating new UI components, updating design systems, or ensuring cultural appropriateness in Islamic School website design.
---

# Islamic Design System Skill

Apply authentic Islamic design principles to create culturally appropriate, visually stunning components.

## When to Use This Skill

- Creating new UI components with Islamic aesthetic
- Choosing colors for new features
- Adding geometric patterns or calligraphy
- Ensuring cultural appropriateness
- Designing bilingual (Arabic + English) interfaces

## Color Palette

```typescript
// From existing design system
const colors = {
  primary: '#8F4843',    // Terracotta (headings, CTAs)
  secondary: '#2E3F44',  // Deep teal (body text)
  accent: {
    gold: '#FFCC00',     // Sacred gold (highlights)
    green: '#4CAF50',    // Paradise green (success, Islamic elements)
    blue: '#2196F3',     // Celestial blue (info, links)
  },
  neutral: {
    cream: '#FAF3E0',    // Warm background
    white: '#FFFFFF',
    gray: '#9E9E9E',
  }
}
```

## Typography

### Arabic Fonts
```css
--font-arabic-modern: 'Cairo', sans-serif;     /* Headings */
--font-arabic-body: 'Tajawal', sans-serif;     /* Body text */
--font-arabic-traditional: 'Amiri', serif;     /* Religious text */
```

### English Fonts (Paired)
```css
--font-english-modern: 'Montserrat', sans-serif;  /* Headings */
--font-english-body: 'Lato', sans-serif;          /* Body text */
```

## Geometric Patterns

```jsx
// 8-pointed star pattern (common in Islamic art)
const StarPattern = () => (
  <svg className="absolute inset-0 opacity-5">
    <defs>
      <pattern id="star" width="100" height="100" patternUnits="userSpaceOnUse">
        <path
          d="M 50 0 L 61.8 38.2 L 100 38.2 L 69.1 61.8 L 80.9 100 L 50 76.4 L 19.1 100 L 30.9 61.8 L 0 38.2 L 38.2 38.2 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#star)" />
  </svg>
)
```

## Cultural Guidelines

```typescript
const culturalDos = [
  '✅ Use green appropriately (sacred color)',
  '✅ Ensure proper Arabic RTL support',
  '✅ Respectful imagery (modest representation)',
  '✅ High contrast for accessibility',
  '✅ Prayer times prominently displayed',
]

const culturalDonts = [
  '❌ Green for errors/warnings',
  '❌ Inappropriate imagery',
  '❌ Religious text in clickable elements',
  '❌ Distorted calligraphy',
]
```

## References

- CLAUDE.md (Design Elements section)
- Existing Tailwind config
- Islamic Design Specialist Agent for complex design questions
