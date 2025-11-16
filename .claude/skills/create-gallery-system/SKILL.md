---
name: create-gallery-system
description: Implement image galleries with infinite scroll, dynamic grid spans, hover effects, and responsive layouts. Uses Hero section proven patterns. Use when creating image showcases, photo galleries, or visual content grids.
---

# Create Gallery System Skill

Build consistent, performant image galleries across the Islamic School website.

## When to Use This Skill

- Creating image galleries or photo showcases
- Building visual content grids
- Implementing infinite scroll
- Showcasing student work, events, or facilities

## Infinite Scroll Gallery Pattern

```jsx
import { motion } from 'framer-motion'

const InfiniteGallery = ({ images }) => {
  const imageHeight = 400 // Adjust based on your needs
  const totalHeight = images.length * imageHeight

  return (
    <div className="h-screen overflow-hidden">
      <motion.div
        animate={{ y: [0, `-${totalHeight}px`] }}
        transition={{
          duration: 120, // 2 minutes for comfortable viewing
          repeat: Infinity,
          ease: 'linear',
          repeatType: 'loop',
        }}
        style={{
          willChange: 'transform',
          backfaceVisibility: 'hidden',
        }}
      >
        {/* Triple repetition for seamless loop */}
        {[...images, ...images, ...images].map((image, index) => (
          <motion.div
            key={index}
            className="h-[400px] relative"
            whileHover={{ scale: 1.03, zIndex: 30 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <img
              src={image.url}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
```

## Dynamic Grid Gallery Pattern

```jsx
// Gallery with varying grid spans
const generateGridLayout = (images, cycle = 0) => {
  return images.map((image, index) => {
    const cycleOffset = (index + cycle) % images.length
    const widthSpan = cycleOffset % 7 === 0 ? 2 : 1
    const heightSpan = cycleOffset % 5 === 0 ? 2 : 1
    return { ...image, widthSpan, heightSpan }
  })
}

const GridGallery = ({ images }) => {
  const [cycle, setCycle] = useState(0)
  const layout = generateGridLayout(images, cycle)

  return (
    <div className="grid grid-cols-4 gap-4 auto-rows-[200px]">
      {layout.map((item, index) => (
        <motion.div
          key={index}
          className={`col-span-${item.widthSpan} row-span-${item.heightSpan} relative overflow-hidden rounded-lg`}
          whileHover={{ scale: 1.03, zIndex: 30 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <img
            src={item.url}
            alt={item.alt}
            className="w-full h-full object-cover brightness-100 contrast-105 saturate-110"
          />
        </motion.div>
      ))}
    </div>
  )
}
```

## Image Optimization

```jsx
import Image from 'next/image'

// Use Next.js Image for optimization
<Image
  src={imageUrl}
  alt={altText}
  width={800}
  height={600}
  className="object-cover"
  placeholder="blur"
  quality={85}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

## References

- HERO_SECTION_PATTERNS.md (Gallery Pattern section)
- /src/components/Hero.tsx (gallery implementation)
