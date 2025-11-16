---
name: create-filter-system
description: Create reusable filter controls with live counts, category organization, and smooth transitions. Based on Hero section gallery filter patterns. Use when adding category filtering, search functionality, or content organization to any section.
---

# Create Filter System Skill

Implement consistent filter controls across the Islamic School website.

## When to Use This Skill

- Adding category filtering to any section
- Creating search/filter interfaces
- Organizing content by multiple criteria
- Implementing live count updates

## Filter System Pattern (from Hero Section)

```jsx
import { motion } from 'framer-motion'
import { useState, useMemo } from 'react'

const FilterSystem = ({ items, categories }) => {
  const [activeFilter, setActiveFilter] = useState('all')

  // Calculate live counts
  const filters = useMemo(() => [
    {
      key: 'all',
      label: 'All Items',
      count: items.length,
      icon: GridIcon,
    },
    ...categories.map(cat => ({
      key: cat.key,
      label: cat.label,
      count: items.filter(item => item.category === cat.key).length,
      icon: cat.icon,
    })),
  ], [items, categories])

  // Filter items
  const filteredItems = useMemo(() => {
    if (activeFilter === 'all') return items
    return items.filter(item => item.category === activeFilter)
  }, [items, activeFilter])

  return (
    <div>
      {/* Filter controls */}
      <div className="bg-black/80 backdrop-blur-sm rounded-full px-6 py-3 flex gap-3 overflow-x-auto">
        {filters.map(filter => (
          <motion.button
            key={filter.key}
            onClick={() => setActiveFilter(filter.key)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              px-4 py-2 rounded-full flex items-center gap-2
              transition-colors duration-200
              ${activeFilter === filter.key
                ? 'bg-white/20 border-white text-white'
                : 'border-white/30 text-white/70 hover:text-white'
              }
              border backdrop-blur-sm whitespace-nowrap
            `}
          >
            {filter.icon && <filter.icon className="w-4 h-4" />}
            <span>{filter.label}</span>
            <span className="text-sm opacity-70">({filter.count})</span>
          </motion.button>
        ))}
      </div>

      {/* Filtered content */}
      <motion.div
        key={activeFilter}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {filteredItems.map(item => (
          <div key={item.id}>{/* Item card */}</div>
        ))}
      </motion.div>
    </div>
  )
}
```

## Key Features

- **Live counts** update automatically
- **Smooth transitions** between filtered states
- **Mobile-responsive** with horizontal scroll
- **Keyboard accessible** tab navigation
- **Icon support** for visual categories

## References

- HERO_SECTION_PATTERNS.md (Filter System Pattern section)
- /src/components/Hero.tsx (gallery filter implementation)
