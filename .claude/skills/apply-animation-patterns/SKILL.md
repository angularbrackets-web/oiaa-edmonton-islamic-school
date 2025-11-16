---
name: apply-animation-patterns
description: Apply proven animation patterns from Hero section to new components. Use when creating animations, hover effects, infinite scrolls, or transitions. Ensures 2+ minute cycles, 300ms interactions, 60fps performance, and consistent motion design across the Islamic School website.
---

# Apply Animation Patterns Skill

This skill helps you apply the proven animation patterns from the Hero section to new components across the Islamic School website.

## When to Use This Skill

Invoke this skill when you need to:
- Add animations to a new component
- Create hover effects for cards or buttons
- Implement infinite scroll galleries
- Add transitions between states or modes
- Ensure animation performance and consistency

## Animation Principles (from HERO_SECTION_PATTERNS.md)

### Gentle Movement Philosophy

```typescript
// Core timing principles
const animationTiming = {
  // Ambient/background animations
  ambient: {
    duration: 120, // 2 minutes (120 seconds)
    ease: 'linear',
    purpose: 'Comfortable viewing, non-distracting',
    examples: ['Infinite scroll galleries', 'Background pattern movement', 'Subtle background shifts']
  },

  // Interactive animations
  interactive: {
    duration: 0.3, // 300ms
    ease: 'easeOut',
    purpose: 'Responsive feel, not jarring',
    examples: ['Hover effects', 'Button clicks', 'Card flips', 'Modal openings']
  },

  // Quick micro-interactions
  micro: {
    duration: 0.15-0.2, // 150-200ms
    ease: 'easeInOut',
    purpose: 'Instant feedback',
    examples: ['Filter button toggles', 'Checkbox animations', 'Icon state changes']
  }
}
```

### Performance Optimization

```typescript
// Always use GPU-accelerated properties
const performantProperties = {
  ✅ recommended: ['transform', 'opacity', 'filter'],
  ❌ avoid: ['top', 'left', 'width', 'height', 'margin', 'padding'],

  // Performance hints
  optimizations: {
    willChange: 'transform', // Tell browser to optimize
    backfaceVisibility: 'hidden', // Prevent flickering
    perspective: 1000, // For 3D transforms
  }
}
```

## Common Animation Patterns

### 1. Hover Effects (Cards, Buttons, Images)

```jsx
import { motion } from 'framer-motion'

// Card hover pattern from Hero section
<motion.div
  whileHover={{
    scale: 1.03,
    zIndex: 30,
  }}
  transition={{
    duration: 0.3,
    ease: 'easeOut',
  }}
  className="relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl"
  style={{
    willChange: 'transform',
    backfaceVisibility: 'hidden',
  }}
>
  {/* Card content */}
</motion.div>
```

### 2. Infinite Scroll Gallery

```jsx
import { motion } from 'framer-motion'

// Infinite scroll pattern from Hero gallery
const InfiniteScrollGallery = ({ items }) => {
  const itemHeight = 300 // Height of each item
  const totalHeight = items.length * itemHeight

  return (
    <div className="h-screen overflow-hidden">
      <motion.div
        animate={{
          y: [0, `-${totalHeight}px`],
        }}
        transition={{
          duration: 120, // 2 minutes
          repeat: Infinity,
          ease: 'linear',
          repeatType: 'loop',
        }}
        style={{
          willChange: 'transform',
          backfaceVisibility: 'hidden',
        }}
      >
        {/* Repeat items 3x for seamless loop */}
        {[...items, ...items, ...items].map((item, index) => (
          <div key={index} className="h-[300px]">
            {/* Item content */}
          </div>
        ))}
      </motion.div>
    </div>
  )
}
```

### 3. Call-to-Action Button with Multi-layered Animation

```jsx
import { motion } from 'framer-motion'

// CTA button pattern from Hero section
const AnimatedCTA = ({ children, onClick, colorScheme = 'warm' }) => {
  const colors = {
    warm: {
      primary: 'from-red-500 to-orange-500',
      border: 'red-400',
      glow: 'rgba(239, 68, 68, 0.25)',
      icon: 'red-200',
    },
    cool: {
      primary: 'from-teal-500 to-emerald-500',
      border: 'teal-400',
      glow: 'rgba(20, 184, 166, 0.25)',
      icon: 'teal-200',
    },
  }

  const scheme = colors[colorScheme]

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      animate={{
        boxShadow: [
          `0 0 0 0 ${scheme.glow}`,
          `0 0 0 4px ${scheme.glow}`,
          `0 0 0 0 ${scheme.glow}`,
        ],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={`
        relative px-8 py-4 rounded-full
        bg-gradient-to-r ${scheme.primary}
        text-white font-semibold
        overflow-hidden
      `}
    >
      {/* Shimmer background */}
      <motion.div
        className="absolute inset-0 bg-white opacity-20"
        animate={{ x: ['-100%', '100%'] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatDelay: 2,
          ease: 'linear',
        }}
      />

      {/* Button content */}
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}
```

### 4. Filter Button Toggle Animation

```jsx
import { motion } from 'framer-motion'

// Filter button from Hero gallery
const FilterButton = ({ active, onClick, label, count, icon: Icon }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    animate={{
      backgroundColor: active ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
    }}
    transition={{
      duration: 0.2,
      ease: 'easeInOut',
    }}
    className={`
      px-4 py-2 rounded-full
      border ${active ? 'border-white' : 'border-white/30'}
      backdrop-blur-sm
      flex items-center gap-2
      text-white
    `}
  >
    {Icon && <Icon className="w-4 h-4" />}
    <span>{label}</span>
    <span className="text-sm opacity-70">({count})</span>
  </motion.button>
)
```

### 5. Modal/Immersive Mode Transition

```jsx
import { motion, AnimatePresence } from 'framer-motion'

// Modal transition pattern
const ImmersiveModal = ({ isOpen, onClose, children }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 bg-black"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full h-full"
        >
          {children}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
)
```

### 6. Staggered List Animation

```jsx
import { motion } from 'framer-motion'

// Stagger children for smooth reveal
const StaggeredList = ({ items }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Delay between each child
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-4"
    >
      {items.map((listItem, index) => (
        <motion.div key={index} variants={item}>
          {/* Item content */}
        </motion.div>
      ))}
    </motion.div>
  )
}
```

## Testing Animation Performance

```typescript
// Ensure 60fps performance
const performanceChecklist = {
  visual: [
    '✓ Open Chrome DevTools Performance tab',
    '✓ Record while animating',
    '✓ Check FPS stays at 60fps',
    '✓ Look for dropped frames (red bars)',
  ],

  optimization: [
    '✓ Use transform and opacity only (GPU accelerated)',
    '✓ Add willChange: "transform" to animated elements',
    '✓ Use backfaceVisibility: "hidden" to prevent flicker',
    '✓ Avoid animating width, height, margin, padding',
    '✓ Reduce number of simultaneous animations',
  ],

  mobile: [
    '✓ Test on actual mobile device (not just emulator)',
    '✓ Check animations don\'t drain battery',
    '✓ Reduce animation complexity on low-end devices',
    '✓ Consider prefers-reduced-motion media query',
  ],
}
```

## Accessibility Considerations

```jsx
// Respect user preferences for reduced motion
import { useReducedMotion } from 'framer-motion'

const AccessibleAnimation = () => {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      animate={
        shouldReduceMotion
          ? {} // No animation
          : { scale: [1, 1.03, 1] } // Full animation
      }
      transition={{
        duration: shouldReduceMotion ? 0 : 2,
        repeat: shouldReduceMotion ? 0 : Infinity,
      }}
    >
      {/* Content */}
    </motion.div>
  )
}
```

## Common Mistakes to Avoid

```typescript
const mistakes = {
  // ❌ BAD: Animating expensive properties
  bad1: {
    animate: { width: [100, 200] }, // Causes layout recalculation
  },

  // ✅ GOOD: Use transform instead
  good1: {
    animate: { scaleX: [1, 2] }, // GPU accelerated
  },

  // ❌ BAD: Too fast for comfort
  bad2: {
    transition: { duration: 0.1 }, // Too jarring
  },

  // ✅ GOOD: Comfortable timing
  good2: {
    transition: { duration: 0.3, ease: 'easeOut' }, // Smooth and responsive
  },

  // ❌ BAD: Infinite animations that are too fast
  bad3: {
    animate: { rotate: 360 },
    transition: { duration: 1, repeat: Infinity }, // Dizzying
  },

  // ✅ GOOD: Slow, gentle infinite animation
  good3: {
    animate: { rotate: 360 },
    transition: { duration: 120, repeat: Infinity, ease: 'linear' }, // Calm
  },
}
```

## Quick Reference

| Animation Type | Duration | Easing | Use Case |
|---|---|---|---|
| Hover effect | 300ms | easeOut | Cards, buttons, images |
| Click/tap | 150ms | easeInOut | Button press feedback |
| Modal open | 300ms | easeOut | Dialog, fullscreen modes |
| Page transition | 400ms | easeInOut | Route changes |
| Infinite scroll | 120s | linear | Background galleries |
| Filter toggle | 200ms | easeInOut | Category switches |
| Stagger delay | 100ms | - | List items appearing |

## References

- **Primary Source**: `HERO_SECTION_PATTERNS.md` (Animation Principles section)
- **Component Examples**: `/src/components/Hero.tsx`
- **Framer Motion Docs**: https://www.framer.com/motion/

## Remember

Animations should:
- ✅ **Enhance** the experience, never distract
- ✅ **Perform** at 60fps on all devices
- ✅ **Respect** user motion preferences
- ✅ **Follow** consistent timing across the site
- ✅ **Use** GPU-accelerated properties only

**Smooth, gentle, performant animations create a premium feel that honors the Islamic School's commitment to quality education.**
