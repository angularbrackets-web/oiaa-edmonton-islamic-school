---
name: design-cms-schema
description: Create Payload CMS schemas for content types with proper field types, validation rules, relationships, and hooks. Follows best practices for content modeling. Use when adding new content types, collections, or data structures to the CMS.
---

# Design CMS Schema Skill

Design robust, user-friendly content schemas for Payload CMS.

## When to Use This Skill

- Creating new content types (Events, Programs, Faculty, etc.)
- Adding fields to existing collections
- Designing content relationships
- Setting up validation and hooks

## Basic Collection Structure

```typescript
import { CollectionConfig } from 'payload/types'

export const CollectionName: CollectionConfig = {
  slug: 'collection-name',

  // Admin UI
  admin: {
    useAsTitle: 'title_en',
    defaultColumns: ['title_en', 'category', 'is_public'],
    group: 'Content',
  },

  // Access control
  access: {
    read: () => true,
    create: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },

  // Fields
  fields: [
    // Add fields here
  ],

  // Timestamps
  timestamps: true,
}
```

## Common Field Types

```typescript
// Text field (short)
{
  name: 'title_en',
  type: 'text',
  required: true,
  maxLength: 255,
}

// Text field with RTL support
{
  name: 'title_ar',
  type: 'text',
  label: 'Title (Arabic)',
  admin: {
    rtl: true,
  },
}

// Rich text editor
{
  name: 'description_en',
  type: 'richText',
  required: true,
}

// Select dropdown
{
  name: 'category',
  type: 'select',
  required: true,
  options: [
    { label: 'Academic', value: 'academic' },
    { label: 'Sports', value: 'sports' },
  ],
}

// Date/time
{
  name: 'start_date',
  type: 'date',
  required: true,
  admin: {
    date: {
      pickerAppearance: 'dayAndTime',
    },
  },
}

// Image upload
{
  name: 'featured_image',
  type: 'upload',
  relationTo: 'media',
}

// Checkbox
{
  name: 'is_public',
  type: 'checkbox',
  defaultValue: false,
}

// Number
{
  name: 'display_order',
  type: 'number',
  defaultValue: 0,
}

// Array (repeater)
{
  name: 'curriculum',
  type: 'array',
  fields: [
    {
      name: 'subject',
      type: 'text',
      required: true,
    },
  ],
}

// Group (nested fields)
{
  name: 'seo',
  type: 'group',
  fields: [
    {
      name: 'meta_title',
      type: 'text',
    },
  ],
}
```

## Bilingual Content Pattern

```typescript
// Always provide both English and Arabic fields
{
  name: 'title_en',
  type: 'text',
  required: true,
  label: 'Title (English)',
},
{
  name: 'title_ar',
  type: 'text',
  label: 'Title (Arabic)',
  admin: {
    rtl: true,
  },
}
```

## Validation Hooks

```typescript
hooks: {
  beforeChange: [
    ({ data }) => {
      // Validate end_date is after start_date
      if (data.end_date && data.start_date) {
        if (new Date(data.end_date) < new Date(data.start_date)) {
          throw new Error('End date must be after start date')
        }
      }

      // Auto-generate slug from title
      if (!data.slug && data.title_en) {
        data.slug = data.title_en
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')
      }

      return data
    },
  ],
}
```

## Access Control Patterns

```typescript
// Public read, admin write
access: {
  read: () => true,
  create: ({ req: { user } }) => user?.role === 'admin',
  update: ({ req: { user } }) => user?.role === 'admin',
  delete: ({ req: { user } }) => user?.role === 'admin',
}

// Published content only for public
access: {
  read: ({ req: { user } }) => {
    if (user) return true
    return { is_public: { equals: true } }
  },
}
```

## References

- Payload CMS documentation
- CMS Administrator Agent for complex schemas
- Backend Agent for data validation logic
