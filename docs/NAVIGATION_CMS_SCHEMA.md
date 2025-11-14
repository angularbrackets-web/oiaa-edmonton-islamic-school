# Navigation CMS Schema Documentation

**Version:** 1.0
**Date:** November 9, 2025
**Author:** CMS Admin Specialist Agent

---

## Overview

This document describes the comprehensive Navigation CMS system designed for the OIA Academy Edmonton website. The system provides dynamic, bilingual (English/Arabic), hierarchical menu management with full CRUD capabilities via API.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Database Schema](#database-schema)
3. [TypeScript Types](#typescript-types)
4. [API Endpoints](#api-endpoints)
5. [Usage Examples](#usage-examples)
6. [Admin Guidelines](#admin-guidelines)
7. [Design Decisions](#design-decisions)
8. [Migration & Setup](#migration--setup)

---

## Architecture Overview

### Technology Stack

- **Database**: Supabase (PostgreSQL)
- **Backend**: Next.js 15 API Routes
- **Frontend**: React/TypeScript
- **Authentication**: Supabase Row Level Security (RLS)

### System Components

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐        │
│  │   Header   │  │  Mega Menu │  │ Mobile Nav │        │
│  └──────┬─────┘  └──────┬─────┘  └──────┬─────┘        │
└─────────┼────────────────┼────────────────┼─────────────┘
          │                │                │
          └────────────────┴────────────────┘
                           │
          ┌────────────────▼────────────────────┐
          │     API Routes (Next.js)            │
          │  /api/navigation                    │
          │  /api/navigation/[id]               │
          └────────────────┬────────────────────┘
                           │
          ┌────────────────▼────────────────────┐
          │  Navigation Service (Supabase)      │
          │  - CRUD Operations                  │
          │  - Tree Building                    │
          │  - Validation                       │
          └────────────────┬────────────────────┘
                           │
          ┌────────────────▼────────────────────┐
          │  PostgreSQL Database (Supabase)     │
          │  - navigation_items table           │
          │  - Indexes, Constraints, Triggers   │
          └─────────────────────────────────────┘
```

---

## Database Schema

### Table: `navigation_items`

```sql
CREATE TABLE navigation_items (
  -- Identity
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Basic Information (Bilingual)
  label_en TEXT NOT NULL,
  label_ar TEXT,
  href TEXT NOT NULL UNIQUE,
  icon TEXT,

  -- Hierarchy
  level INTEGER NOT NULL CHECK (level IN (1, 2)),
  parent_id UUID REFERENCES navigation_items(id) ON DELETE CASCADE,
  display_order INTEGER DEFAULT 0 NOT NULL,

  -- Visibility
  is_visible BOOLEAN DEFAULT TRUE NOT NULL,
  is_featured BOOLEAN DEFAULT FALSE NOT NULL,

  -- Descriptions (for mega-menu)
  description_en TEXT,
  description_ar TEXT,

  -- SEO Metadata
  page_title_en TEXT,
  page_title_ar TEXT,
  meta_description_en TEXT,
  meta_description_ar TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
```

### Key Constraints

1. **Level Validation**: Only levels 1 (top) and 2 (sub-menu) are allowed
2. **Hierarchy Constraint**:
   - Level 1 items: `parent_id` MUST be NULL
   - Level 2 items: `parent_id` MUST reference a level 1 item
3. **URL Validation**: `href` must start with `/` or `http(s)://`
4. **Unique URLs**: Each `href` must be unique across all items
5. **Cascade Delete**: Deleting a parent deletes all children automatically

### Indexes

```sql
-- For parent-child lookups
CREATE INDEX idx_navigation_parent ON navigation_items(parent_id);

-- For ordering queries
CREATE INDEX idx_navigation_order ON navigation_items(display_order);

-- For visibility filtering
CREATE INDEX idx_navigation_visible ON navigation_items(is_visible);

-- For level filtering
CREATE INDEX idx_navigation_level ON navigation_items(level);

-- Composite index for common query
CREATE INDEX idx_navigation_visible_order
ON navigation_items(is_visible, level, display_order);

-- For featured items
CREATE INDEX idx_navigation_featured ON navigation_items(is_featured);
```

### Triggers

1. **Auto-update `updated_at`**: Automatically sets timestamp on UPDATE
2. **Auto-generate page titles**: Creates default titles from labels if not provided
3. **Deletion logging**: Logs when parent items with children are deleted

### Row Level Security (RLS)

```sql
-- Public can read visible items
CREATE POLICY "Public read access to visible navigation"
  ON navigation_items FOR SELECT
  USING (is_visible = TRUE);

-- Authenticated users (admins) have full access
CREATE POLICY "Admin full access"
  ON navigation_items FOR ALL
  TO authenticated
  USING (TRUE);
```

---

## TypeScript Types

### Core Types

```typescript
// Base navigation item from database
interface NavigationItem {
  id: string
  label_en: string
  label_ar: string | null
  href: string
  icon: string | null
  level: 1 | 2
  parent_id: string | null
  display_order: number
  is_visible: boolean
  is_featured: boolean
  description_en: string | null
  description_ar: string | null
  page_title_en: string | null
  page_title_ar: string | null
  meta_description_en: string | null
  meta_description_ar: string | null
  created_at: string
  updated_at: string
}

// For creating/updating items
interface NavigationItemInput {
  label_en: string
  label_ar?: string | null
  href: string
  icon?: string | null
  level: 1 | 2
  parent_id?: string | null
  display_order?: number
  is_visible?: boolean
  is_featured?: boolean
  description_en?: string | null
  description_ar?: string | null
  page_title_en?: string | null
  page_title_ar?: string | null
  meta_description_en?: string | null
  meta_description_ar?: string | null
}

// Hierarchical structure for frontend
interface NavigationTreeNode {
  id: string
  label_en: string
  label_ar: string | null
  href: string
  icon: string | null
  is_visible: boolean
  is_featured: boolean
  display_order: number
  children: NavigationTreeNode[]
}
```

---

## API Endpoints

### Collection Operations

#### `GET /api/navigation`

Get all navigation items with optional filtering.

**Query Parameters:**
- `visible` (boolean) - Filter by visibility
- `featured` (boolean) - Filter by featured status
- `level` (1 | 2) - Filter by menu level
- `parent_id` (string | "null") - Filter by parent
- `tree` (boolean) - Return hierarchical tree structure
- `orderBy` (string) - Sort field
- `orderDirection` ("asc" | "desc") - Sort direction

**Examples:**
```bash
# Get all visible items
GET /api/navigation?visible=true

# Get navigation tree
GET /api/navigation?tree=true

# Get top-level items only
GET /api/navigation?level=1&visible=true

# Get children of specific parent
GET /api/navigation?parent_id=uuid-here
```

**Response:**
```json
{
  "success": true,
  "data": [...],
  "count": 36
}
```

#### `POST /api/navigation`

Create new navigation item.

**Request Body:**
```json
{
  "label_en": "About Us",
  "label_ar": "معلومات عنا",
  "href": "/about-us",
  "icon": "📘",
  "level": 1,
  "display_order": 2,
  "is_visible": true,
  "is_featured": false,
  "description_en": "Learn about our mission"
}
```

**Response:**
```json
{
  "success": true,
  "data": { ...created item... },
  "message": "Navigation item created successfully"
}
```

#### `PUT /api/navigation` (Bulk Update)

Update multiple items at once.

**Request Body:**
```json
{
  "item_ids": ["uuid1", "uuid2"],
  "updates": {
    "is_visible": false
  }
}
```

#### `PATCH /api/navigation?action=reorder`

Reorder navigation items.

**Request Body:**
```json
{
  "item_ids": ["uuid1", "uuid2", "uuid3"],
  "new_orders": [1, 2, 3]
}
```

### Single Item Operations

#### `GET /api/navigation/[id]`

Get single navigation item.

**Query Parameters:**
- `include_children` (boolean) - Include child items

**Example:**
```bash
GET /api/navigation/abc123?include_children=true
```

#### `PUT /api/navigation/[id]`

Update navigation item.

**Request Body:**
```json
{
  "label_en": "Updated Label",
  "is_visible": true
}
```

#### `DELETE /api/navigation/[id]`

Delete navigation item (and children via CASCADE).

#### `PATCH /api/navigation/[id]?action=toggle_visibility`

Toggle item visibility.

---

## Usage Examples

### Frontend Component Example

```typescript
'use client'

import { useState, useEffect } from 'react'
import { NavigationTreeNode } from '@/types/navigation'

export default function DynamicNavigation() {
  const [navTree, setNavTree] = useState<NavigationTreeNode[]>([])

  useEffect(() => {
    fetch('/api/navigation?tree=true')
      .then(res => res.json())
      .then(data => setNavTree(data.data))
  }, [])

  return (
    <nav>
      {navTree.map(parent => (
        <div key={parent.id}>
          <a href={parent.href}>
            {parent.icon} {parent.label_en}
          </a>
          {parent.children.length > 0 && (
            <ul>
              {parent.children.map(child => (
                <li key={child.id}>
                  <a href={child.href}>{child.label_en}</a>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </nav>
  )
}
```

### Admin Panel Example

```typescript
import { navigationService } from '@/lib/supabase/navigation'

// Toggle visibility
await navigationService.toggleVisibility(itemId)

// Reorder items
await navigationService.reorder(
  ['id1', 'id2', 'id3'],
  [1, 2, 3]
)

// Create new item
await navigationService.create({
  label_en: 'New Page',
  href: '/new-page',
  level: 2,
  parent_id: parentId
})

// Search items
const results = await navigationService.search('about')
```

---

## Admin Guidelines

### Creating Menu Items

1. **Top-Level Items** (Level 1):
   - Set `level: 1`
   - Leave `parent_id` as `null`
   - Provide icon emoji (optional)
   - Set appropriate `display_order`

2. **Sub-Menu Items** (Level 2):
   - Set `level: 2`
   - Provide `parent_id` of top-level item
   - Ensure parent exists before creating
   - Sub-items inherit parent's visibility context

### Best Practices

1. **Display Order**: Use gaps (10, 20, 30) for easier reordering
2. **Icons**: Use consistent emoji style across all items
3. **Arabic Translation**: Always provide Arabic labels for bilingual UX
4. **URLs**: Use consistent URL patterns (`/section/subsection`)
5. **Descriptions**: Write concise descriptions for mega-menu tooltips
6. **Featured Items**: Use sparingly for call-to-action items (Admissions, Donate)

### Visibility Rules

- Hidden top-level items hide all their children
- Children can be individually hidden even if parent is visible
- Use `is_featured` for items that need special highlighting

---

## Design Decisions

### Why Supabase Instead of Payload CMS?

**Decision**: Use Supabase PostgreSQL as the database backend instead of Payload CMS.

**Rationale**:
1. **Existing Infrastructure**: Project already uses Supabase (in package.json)
2. **Simpler Architecture**: Direct database access without additional CMS layer
3. **Better Performance**: Native PostgreSQL queries are faster
4. **Full Control**: Custom validation, triggers, and RLS policies
5. **Type Safety**: Direct TypeScript integration with Supabase client

### Why Single Table Design?

**Decision**: Store all navigation items in one table with self-referencing foreign key.

**Rationale**:
1. **Simplicity**: Easier to query and maintain
2. **Performance**: Single JOIN for hierarchical queries
3. **Flexibility**: Easy to extend to more levels if needed
4. **Atomic Operations**: Updates affect single table
5. **Consistent Constraints**: All validation rules in one place

### Why Two-Level Hierarchy Constraint?

**Decision**: Enforce exactly 2 levels (top + sub-menu) with database constraint.

**Rationale**:
1. **Requirements**: Specification calls for 2-level structure
2. **UX Simplicity**: Avoids complex mega-menus
3. **Performance**: Predictable query complexity
4. **Mobile-Friendly**: Two levels work well on small screens
5. **Future-Proof**: Can remove constraint if 3+ levels needed

### Why Bilingual Fields Instead of Translation Table?

**Decision**: Store English and Arabic text in same row as separate columns.

**Rationale**:
1. **Performance**: No JOINs for language switching
2. **Simplicity**: Single query returns all language variants
3. **Atomic Updates**: Both languages updated together
4. **Type Safety**: Clear TypeScript types
5. **Common Pattern**: Standard approach for 2-language sites

### Why Auto-Generated Page Titles?

**Decision**: Trigger automatically generates page titles from labels if not provided.

**Rationale**:
1. **Reduces Admin Burden**: Most items use simple title pattern
2. **Consistency**: Standard format across all pages
3. **Flexibility**: Can override for special cases
4. **SEO Best Practice**: Every page has unique title
5. **Branding**: Appends school name to all titles

---

## Migration & Setup

### Step 1: Run Database Migration

```bash
# In Supabase SQL Editor, run:
/migrations/001_create_navigation_table.sql
```

This creates:
- `navigation_items` table
- All indexes
- Triggers and functions
- RLS policies

### Step 2: Seed Initial Data

```bash
npm run seed-navigation
```

This inserts:
- 8 top-level items
- 28 sub-menu items
- Total: 36 navigation items

### Step 3: Verify Installation

```bash
# Query navigation tree
curl https://your-domain.com/api/navigation?tree=true

# Should return hierarchical JSON structure
```

### Step 4: Update Frontend

Replace hardcoded navigation in `/src/components/Header.tsx`:

```typescript
// Before (hardcoded)
const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '#about' },
  // ...
]

// After (dynamic)
const [navigation, setNavigation] = useState([])

useEffect(() => {
  fetch('/api/navigation?tree=true')
    .then(res => res.json())
    .then(data => setNavigation(data.data))
}, [])
```

### Environment Variables Required

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## Maintenance & Updates

### Adding New Menu Items

1. Use API or Supabase Dashboard
2. Ensure correct `parent_id` for sub-items
3. Set appropriate `display_order`
4. Test visibility on frontend

### Reordering Menu

1. Get current items: `GET /api/navigation?level=1`
2. Update display orders: `PATCH /api/navigation?action=reorder`
3. Verify on frontend

### Bulk Operations

Use bulk update endpoint for common tasks:
```bash
# Hide multiple items
PUT /api/navigation
{
  "item_ids": ["id1", "id2"],
  "updates": { "is_visible": false }
}
```

---

## Security Considerations

1. **RLS Policies**: Public can only read visible items
2. **Authentication**: Admin operations require authenticated session
3. **Validation**: All inputs validated before database insertion
4. **SQL Injection**: Parameterized queries via Supabase client
5. **XSS Prevention**: Sanitize user inputs (especially Arabic text)

---

## Performance Optimization

1. **Indexes**: Strategic indexes on frequently queried columns
2. **Caching**: Consider CDN caching for `/api/navigation?tree=true`
3. **Composite Index**: Fast queries for visible items ordered by display_order
4. **Lazy Loading**: Load sub-menus on hover/click for large menus
5. **Database Function**: `get_navigation_tree()` for optimized hierarchy queries

---

## Troubleshooting

### Issue: "Parent not found" error

**Solution**: Ensure parent item exists and is level 1:
```sql
SELECT id, label_en, level FROM navigation_items WHERE level = 1;
```

### Issue: Duplicate href error

**Solution**: Check existing items:
```sql
SELECT * FROM navigation_items WHERE href = '/your-path';
```

### Issue: Children not showing

**Solution**: Check visibility:
```sql
SELECT id, label_en, is_visible, parent_id
FROM navigation_items
WHERE parent_id = 'parent-uuid';
```

---

## Future Enhancements

1. **Multi-level Support**: Remove 2-level constraint for deeper hierarchies
2. **Drag-and-Drop Reordering**: Admin UI for visual reordering
3. **Version History**: Track changes to menu structure
4. **A/B Testing**: Test different menu configurations
5. **Analytics Integration**: Track menu item click rates
6. **Custom Attributes**: Add meta fields for advanced styling
7. **Import/Export**: Backup/restore navigation configuration

---

## API Reference Summary

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/navigation` | GET | List all items (with filters) |
| `/api/navigation` | POST | Create new item |
| `/api/navigation` | PUT | Bulk update items |
| `/api/navigation?action=reorder` | PATCH | Reorder items |
| `/api/navigation/[id]` | GET | Get single item |
| `/api/navigation/[id]` | PUT | Update item |
| `/api/navigation/[id]` | DELETE | Delete item |
| `/api/navigation/[id]?action=toggle_visibility` | PATCH | Toggle visibility |

---

## Support & Resources

- **Database Schema**: `/migrations/001_create_navigation_table.sql`
- **TypeScript Types**: `/src/types/navigation.ts`
- **Service Layer**: `/src/lib/supabase/navigation.ts`
- **API Routes**: `/src/app/api/navigation/`
- **Seed Data**: `/scripts/seed-navigation.ts`

---

**Document Version**: 1.0
**Last Updated**: November 9, 2025
**Status**: Production Ready ✅
