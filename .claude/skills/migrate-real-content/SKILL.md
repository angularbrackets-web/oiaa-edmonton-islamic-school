---
name: migrate-real-content
description: Replace placeholder content with real data from /uploads folders, Supabase database, and CMS. Ensures proper image paths, data validation, and content quality. Use when integrating real content into components or migrating from placeholders.
---

# Migrate Real Content Skill

Replace placeholder content with actual data for the Islamic School website.

## When to Use This Skill

- Replacing Lorem Ipsum with real text
- Integrating actual images from /uploads or Cloudinary
- Connecting components to Supabase/CMS data
- Data migration from old sources

## Content Sources

```typescript
const contentSources = {
  images: [
    '/uploads/images/',           // Local uploads
    'Cloudinary',                 // Cloud storage
    'Supabase storage',           // Database storage
  ],
  data: [
    'Supabase database',          // PostgreSQL
    'Payload CMS collections',    // CMS content
    '/src/data/*.json',           // Static JSON files
  ],
}
```

## Migration Checklist

```typescript
const migrationSteps = {
  before: [
    '✓ Identify all placeholder content',
    '✓ Verify real content exists',
    '✓ Check data format compatibility',
    '✓ Backup existing data',
  ],

  during: [
    '✓ Update image paths (local → Cloudinary)',
    '✓ Replace static text with database queries',
    '✓ Validate data types match component props',
    '✓ Handle missing/null data gracefully',
    '✓ Add proper alt text for images',
  ],

  after: [
    '✓ Test all content displays correctly',
    '✓ Verify images load and are optimized',
    '✓ Check mobile responsiveness with real content',
    '✓ Validate accessibility (alt text, headings)',
    '✓ Test with empty states',
  ],
}
```

## Example: Migrate Events Data

```typescript
// Before: Placeholder
const events = [
  { title: 'Lorem Ipsum', date: '2024-01-01' },
]

// After: Real data from Supabase
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function getEvents() {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('is_public', true)
    .order('start_date', { ascending: false })

  if (error) throw error
  return data
}
```

## Example: Migrate Images

```typescript
// Before: Placeholder images
<img src="/placeholder.jpg" alt="Placeholder" />

// After: Real images from Cloudinary
import { CldImage } from 'next-cloudinary'

<CldImage
  src="oiaa-school/events/science-fair-2024"
  alt="Students presenting at Science Fair 2024"
  width={800}
  height={600}
  crop="fill"
  gravity="auto"
/>
```

## Data Validation

```typescript
import { z } from 'zod'

// Define schema for validation
const EventSchema = z.object({
  title_en: z.string().min(1),
  title_ar: z.string().optional(),
  start_date: z.string().datetime(),
  category: z.enum(['academic', 'sports', 'cultural', 'religious', 'community']),
  is_public: z.boolean(),
})

// Validate before using
try {
  const validEvent = EventSchema.parse(rawData)
  // Safe to use validEvent
} catch (error) {
  console.error('Invalid event data:', error)
  // Handle validation error
}
```

## References

- /src/data/ (static JSON files)
- Supabase documentation for queries
- Cloudinary integration docs
