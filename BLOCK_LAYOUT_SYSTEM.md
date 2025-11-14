# 🎨 Block Layout Management System

**Date**: 2025-01-10
**Status**: 🟢 Implemented (Database migration needed)

---

## Overview

A comprehensive layout management system that gives you full control over how content blocks are displayed on your pages, including container widths, spacing, padding, and responsive behavior.

---

## Features

### 1. Container Width Control 📏

Choose how wide each block should be:

- **Narrow** (`max-w-3xl` / 768px)
  Perfect for: Text-heavy content, blog posts, focused reading

- **Contained** (`max-w-6xl` / 1152px) - Default
  Perfect for: Standard pages, general content

- **Wide** (`max-w-7xl` / 1280px)
  Perfect for: Image galleries, wide layouts

- **Full** (100% width)
  Perfect for: Hero sections, full-bleed images, backgrounds

### 2. Vertical Spacing 📐

**Padding** (Inside the block):
- **None**: No padding
- **Small**: `py-4 md:py-6` (16px mobile / 24px desktop)
- **Medium**: `py-8 md:py-12` (32px mobile / 48px desktop) - Default
- **Large**: `py-12 md:py-20` (48px mobile / 80px desktop)

**Margins** (Between blocks):
- **None**: No margin
- **XS**: 1rem (16px)
- **SM**: 1.5rem (24px)
- **MD**: 2rem (32px)
- **LG**: 3rem (48px)
- **XL**: 4rem (64px)
- **2XL**: 6rem (96px)

### 3. Background Colors 🎨

Set custom background colors for any block to create visual sections and hierarchy.

### 4. Custom CSS Classes 💅

Add your own CSS classes for complete customization freedom.

---

## How It Works

### Architecture

```
┌─────────────────────────────────────────┐
│      BlockLayoutWrapper                 │  ← Handles layout
│  ┌───────────────────────────────────┐  │
│  │   Container (Width Control)       │  │
│  │ ┌───────────────────────────────┐ │  │
│  │ │  Block Content (Text/Image)   │ │  │  ← Your content
│  │ └───────────────────────────────┘ │  │
│  └───────────────────────────────────┘  │
│  Padding / Margins / Background         │
└─────────────────────────────────────────┘
```

### Component Structure

**`BlockLayoutWrapper`** - The master wrapper that:
- Applies container width
- Adds padding (vertical spacing inside)
- Adds margins (spacing between blocks)
- Sets background colors
- Adds custom CSS classes

**Individual Block Components** - Now simplified:
- Focus only on their content
- No hardcoded max-widths
- Wrapper handles all layout

---

## Usage

### For Admins (In the CMS)

When editing a page block, you'll see layout controls:

1. **Container Width**
   - Dropdown: Narrow / Contained / Wide / Full
   - Default: Contained

2. **Padding**
   - Dropdown: None / Small / Medium / Large
   - Default: Medium

3. **Margin Top**
   - Dropdown: None / XS / SM / MD / LG / XL / 2XL
   - Use to add space above the block

4. **Margin Bottom**
   - Dropdown: None / XS / SM / MD / LG / XL / 2XL
   - Use to add space below the block

5. **Background Color**
   - Color picker or hex input
   - Leave empty for transparent

6. **Custom CSS Class**
   - Advanced: Add your own Tailwind classes
   - Example: `border-2 border-gray-200 rounded-xl`

### Examples

#### Example 1: Hero Section
```
Container Width: Full
Padding: Large
Margin Top: None
Margin Bottom: 2XL
Background: #1A5F7A (Deep Teal)
```

#### Example 2: Body Text
```
Container Width: Narrow
Padding: Medium
Margin Top: MD
Margin Bottom: MD
Background: None
```

#### Example 3: Full-Width Image
```
Container Width: Full
Padding: None
Margin Top: LG
Margin Bottom: LG
Background: None
```

#### Example 4: Call-to-Action
```
Container Width: Contained
Padding: Large
Margin Top: XL
Margin Bottom: XL
Background: #F4F4F4 (Light Gray)
```

---

## Responsive Behavior

All layouts are **mobile-first** and **fully responsive**:

- **Padding**: Automatically scales between mobile and desktop
  - Small: 16px → 24px
  - Medium: 32px → 48px
  - Large: 48px → 80px

- **Container widths**: Fluid on mobile, max-width on desktop
  - All containers add horizontal padding on mobile
  - Breakpoints: 768px (tablet), 1024px (desktop)

- **Margins**: Consistent across breakpoints
  - May want to adjust for mobile (future enhancement)

---

## Database Schema

### New Fields Added to `content_blocks` Table

```sql
-- Container width: controls max-width
container_width TEXT CHECK (container_width IN ('narrow', 'contained', 'wide', 'full')),

-- Vertical spacing inside block
padding TEXT CHECK (padding IN ('none', 'small', 'medium', 'large')),

-- Spacing above block
margin_top TEXT CHECK (margin_top IN ('none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl')),

-- Spacing below block
margin_bottom TEXT CHECK (margin_bottom IN ('none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl')),

-- Background color (hex or named color)
background_color TEXT,

-- Custom CSS classes for advanced styling
custom_css_class TEXT
```

---

## Migration Required ⚠️

To use this system, run the database migration:

### Option 1: Via Supabase Dashboard
1. Go to SQL Editor
2. Create new query
3. Paste migration SQL (see `migrations/005_add_block_layout_fields.sql`)
4. Run

### Option 2: Via psql
```bash
psql $DATABASE_URL -f migrations/005_add_block_layout_fields.sql
```

### Migration SQL
```sql
-- Add layout fields to content_blocks table
ALTER TABLE content_blocks
ADD COLUMN IF NOT EXISTS container_width TEXT CHECK (container_width IN ('narrow', 'contained', 'wide', 'full')),
ADD COLUMN IF NOT EXISTS margin_top TEXT CHECK (margin_top IN ('none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl')),
ADD COLUMN IF NOT EXISTS margin_bottom TEXT CHECK (margin_bottom IN ('none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'));

-- Add indexes for commonly queried fields
CREATE INDEX IF NOT EXISTS idx_blocks_container_width ON content_blocks(container_width);

COMMENT ON COLUMN content_blocks.container_width IS 'Maximum width constraint for block content';
COMMENT ON COLUMN content_blocks.margin_top IS 'Top margin spacing for block';
COMMENT ON COLUMN content_blocks.margin_bottom IS 'Bottom margin spacing for block';
```

---

## Benefits

### For Content Editors
✅ **Visual control** over layout without touching code
✅ **Consistency** across all pages
✅ **Flexibility** to create unique designs
✅ **No developer needed** for layout changes

### For Developers
✅ **DRY code** - layout logic in one place
✅ **Easy maintenance** - change layout system globally
✅ **Type-safe** - Full TypeScript support
✅ **Extensible** - Easy to add new layout options

### For Users/Visitors
✅ **Responsive** on all devices
✅ **Fast loading** - optimized rendering
✅ **Accessible** - semantic HTML structure
✅ **Consistent** visual hierarchy

---

## Best Practices

### 1. Container Width Guidelines

**Use Narrow For:**
- Blog posts and articles
- Terms & conditions, privacy policies
- Long-form text content
- Maximum readability focus

**Use Contained For:**
- Standard page content
- Mixed content (text + images)
- Most use cases (this is the default!)

**Use Wide For:**
- Image galleries
- Data tables
- Product showcases
- Wide layouts with multiple columns

**Use Full For:**
- Hero sections
- Background images
- Full-bleed videos
- Section dividers with colors

### 2. Spacing Guidelines

**Margin Top/Bottom:**
- Use **MD** (2rem) between standard blocks
- Use **LG** (3rem) to create visual sections
- Use **XL** (4rem) before/after major sections
- Use **2XL** (6rem) for dramatic spacing

**Padding:**
- Use **Medium** for most blocks (default)
- Use **Large** for hero sections and CTAs
- Use **Small** for compact layouts
- Use **None** for full-bleed images

### 3. Background Color Guidelines

- Use subtle colors for large sections (#F9F9F9)
- Use brand colors for CTAs and highlights
- Ensure sufficient contrast for text readability
- Test on mobile devices

### 4. Responsive Testing

Always preview your pages on:
- Mobile (375px - 768px)
- Tablet (768px - 1024px)
- Desktop (1024px+)

---

## Troubleshooting

### Block Too Narrow/Wide

**Problem**: Block doesn't look right on desktop/mobile

**Solution**:
- Check `container_width` setting
- Try different width options
- Use Custom CSS for specific needs

### Too Much/Little Space

**Problem**: Spacing feels off between blocks

**Solution**:
- Adjust `margin_top` and `margin_bottom`
- Use preview to test different values
- Aim for visual rhythm and consistency

### Background Color Not Showing

**Problem**: Background color doesn't appear

**Solution**:
- Ensure valid hex color (#RRGGBB)
- Check padding is not "None"
- Verify color isn't transparent

---

## Future Enhancements

- [ ] Visual spacing editor with drag handles
- [ ] Responsive spacing (different values for mobile/desktop)
- [ ] Layout templates/presets
- [ ] Alignment control (left/center/right)
- [ ] Animation controls
- [ ] Grid/Flexbox layouts for multi-column blocks
- [ ] Sticky positioning options
- [ ] Z-index/layering control

---

## Summary

The Block Layout System provides:

✅ **4 container widths** (narrow, contained, wide, full)
✅ **4 padding sizes** (none, small, medium, large)
✅ **7 margin sizes** (none, xs, sm, md, lg, xl, 2xl)
✅ **Custom backgrounds** and CSS classes
✅ **Fully responsive** and mobile-friendly
✅ **Type-safe** TypeScript implementation
✅ **Centralized** layout management

**Result**: Professional, consistent, and flexible page layouts! 🎨

---

*Last Updated: 2025-01-10*
