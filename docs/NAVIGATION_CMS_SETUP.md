# Navigation CMS - Quick Setup Guide

This guide will help you quickly set up the dynamic navigation system for OIA Academy Edmonton.

## Prerequisites

- Supabase project configured
- Environment variables set (`.env.local`)
- Node.js and npm installed

## Setup Steps

### 1. Run Database Migration

Open your Supabase SQL Editor and execute the migration:

```bash
# File location: /migrations/001_create_navigation_table.sql
```

**Or via Supabase CLI:**
```bash
supabase db push
```

This creates:
- ✅ `navigation_items` table
- ✅ Indexes for performance
- ✅ Triggers for auto-updates
- ✅ Row Level Security policies
- ✅ Helper functions

**Verify migration succeeded:**
```sql
SELECT COUNT(*) FROM navigation_items;
-- Should return 0 (empty table)
```

---

### 2. Seed Navigation Data

Run the seed script to populate all 36 menu items:

```bash
npm run seed-navigation
```

**Expected output:**
```
🌱 Starting navigation data seeding...

📝 Inserting top-level navigation items...
✅ Inserted 8 top-level items

📝 Inserting sub-menu items...
✅ Inserted 28 sub-menu items

✨ Successfully seeded navigation data!
📊 Total items in database: 36
   - Top-level items: 8
   - Sub-menu items: 28

📋 Navigation Structure:
   Home (0 children)
   About Us (5 children)
   Admissions (5 children)
   Academics (4 children)
   News & Events (4 children)
   New Centre (4 children)
   Donate (3 children)
   Contact Us (4 children)

🎉 Seeding completed successfully!
```

**Verify data:**
```sql
SELECT level, COUNT(*) FROM navigation_items GROUP BY level;
-- Should return:
-- level | count
--   1   |   8
--   2   |  28
```

---

### 3. Test API Endpoints

**Get all navigation items:**
```bash
curl http://localhost:3000/api/navigation?visible=true
```

**Get navigation tree structure:**
```bash
curl http://localhost:3000/api/navigation?tree=true
```

**Get single item:**
```bash
# Replace {id} with actual UUID from database
curl http://localhost:3000/api/navigation/{id}
```

---

### 4. Update Frontend Header Component

Replace hardcoded navigation in `/src/components/Header.tsx`:

**Before:**
```typescript
const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '#about' },
  // ... hardcoded items
]
```

**After:**
```typescript
import { useState, useEffect } from 'react'
import { NavigationTreeNode } from '@/types/navigation'

export default function Header() {
  const [navigation, setNavigation] = useState<NavigationTreeNode[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/navigation?tree=true')
      .then(res => res.json())
      .then(data => {
        setNavigation(data.data)
        setIsLoading(false)
      })
      .catch(error => {
        console.error('Failed to load navigation:', error)
        setIsLoading(false)
      })
  }, [])

  if (isLoading) {
    return <div>Loading navigation...</div>
  }

  return (
    <header>
      <nav>
        {navigation.map((item) => (
          <div key={item.id}>
            <Link href={item.href}>
              {item.icon && <span>{item.icon}</span>}
              {item.label_en}
            </Link>

            {/* Sub-menu */}
            {item.children.length > 0 && (
              <ul>
                {item.children.map((child) => (
                  <li key={child.id}>
                    <Link href={child.href}>
                      {child.label_en}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </nav>
    </header>
  )
}
```

---

### 5. Create Admin Interface (Optional)

Create an admin page to manage navigation:

**File:** `/src/app/admin/navigation/page.tsx`

```typescript
'use client'

import { useState, useEffect } from 'react'
import { NavigationItem } from '@/types/navigation'

export default function AdminNavigationPage() {
  const [items, setItems] = useState<NavigationItem[]>([])

  useEffect(() => {
    loadNavigation()
  }, [])

  const loadNavigation = async () => {
    const res = await fetch('/api/navigation')
    const data = await res.json()
    setItems(data.data)
  }

  const toggleVisibility = async (id: string) => {
    await fetch(`/api/navigation/${id}?action=toggle_visibility`, {
      method: 'PATCH'
    })
    loadNavigation()
  }

  const deleteItem = async (id: string) => {
    if (confirm('Are you sure?')) {
      await fetch(`/api/navigation/${id}`, { method: 'DELETE' })
      loadNavigation()
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Navigation Management</h1>

      <table className="w-full">
        <thead>
          <tr>
            <th>Label</th>
            <th>URL</th>
            <th>Level</th>
            <th>Visible</th>
            <th>Order</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.icon} {item.label_en}</td>
              <td>{item.href}</td>
              <td>{item.level}</td>
              <td>
                <button onClick={() => toggleVisibility(item.id)}>
                  {item.is_visible ? '✅ Visible' : '❌ Hidden'}
                </button>
              </td>
              <td>{item.display_order}</td>
              <td>
                <button onClick={() => deleteItem(item.id)}>
                  🗑️ Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

---

## Common Tasks

### Adding a New Menu Item

**Via API:**
```bash
curl -X POST http://localhost:3000/api/navigation \
  -H "Content-Type: application/json" \
  -d '{
    "label_en": "New Page",
    "label_ar": "صفحة جديدة",
    "href": "/new-page",
    "level": 1,
    "display_order": 9,
    "is_visible": true
  }'
```

**Via Supabase Dashboard:**
```sql
INSERT INTO navigation_items (
  label_en, label_ar, href, level, display_order, is_visible
) VALUES (
  'New Page', 'صفحة جديدة', '/new-page', 1, 9, true
);
```

### Hiding a Menu Item

```bash
curl -X PATCH http://localhost:3000/api/navigation/{id}?action=toggle_visibility
```

### Reordering Menu Items

```bash
curl -X PATCH http://localhost:3000/api/navigation?action=reorder \
  -H "Content-Type: application/json" \
  -d '{
    "item_ids": ["uuid1", "uuid2", "uuid3"],
    "new_orders": [1, 2, 3]
  }'
```

### Bulk Update (Hide Multiple Items)

```bash
curl -X PUT http://localhost:3000/api/navigation \
  -H "Content-Type: application/json" \
  -d '{
    "item_ids": ["uuid1", "uuid2"],
    "updates": { "is_visible": false }
  }'
```

---

## Verification Checklist

After setup, verify everything works:

- [ ] Migration ran successfully
- [ ] Database has 36 navigation items (8 top + 28 sub)
- [ ] API endpoint `/api/navigation?tree=true` returns data
- [ ] Frontend Header component displays dynamic navigation
- [ ] Sub-menus appear on hover/click
- [ ] Arabic labels display correctly (RTL)
- [ ] Icons render properly
- [ ] Visibility toggle works
- [ ] Admin can create new items
- [ ] Deleting parent removes children (CASCADE)

---

## Troubleshooting

### Issue: "Table does not exist"

**Solution:** Run the migration first:
```bash
# In Supabase SQL Editor, execute:
/migrations/001_create_navigation_table.sql
```

### Issue: "No items returned from API"

**Check 1:** Verify data exists:
```sql
SELECT COUNT(*) FROM navigation_items;
```

**Check 2:** Check RLS policies:
```sql
-- Temporarily disable RLS for testing
ALTER TABLE navigation_items DISABLE ROW LEVEL SECURITY;
```

### Issue: "Environment variables not set"

Ensure `.env.local` contains:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Issue: Seed script fails

**Solution:** Check if data already exists:
```sql
-- Clear existing data
DELETE FROM navigation_items;

-- Then re-run seed script
npm run seed-navigation
```

---

## Next Steps

1. **Customize Styling**: Update Header.tsx with your design system
2. **Add Mega Menu**: Implement rich sub-menu with descriptions
3. **Mobile Navigation**: Create mobile-optimized menu
4. **Admin Panel**: Build full CRUD interface
5. **Analytics**: Track menu item clicks
6. **Search**: Add navigation search functionality

---

## Resources

- **Full Documentation**: `/docs/NAVIGATION_CMS_SCHEMA.md`
- **Database Migration**: `/migrations/001_create_navigation_table.sql`
- **TypeScript Types**: `/src/types/navigation.ts`
- **Service Layer**: `/src/lib/supabase/navigation.ts`
- **API Routes**: `/src/app/api/navigation/`
- **Seed Script**: `/scripts/seed-navigation.ts`

---

## Support

For issues or questions:
1. Check full documentation in `NAVIGATION_CMS_SCHEMA.md`
2. Review error messages in browser console
3. Check Supabase logs for database errors
4. Verify environment variables are set correctly

**Setup complete!** 🎉 Your navigation system is now dynamic and CMS-managed.
