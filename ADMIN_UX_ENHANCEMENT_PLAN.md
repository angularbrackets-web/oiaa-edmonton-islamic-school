# Admin UI/UX Enhancement Plan

## 🎯 Critical User Pain Points (Addressed First)

### Issue #1: Layout Controls Too Technical ❌
**User Feedback**: "Layout & Styling options are not user-friendly for basic users"
**Current Problem**: Terms like "contained (1152px)", "XS - 16px", "SM - 24px" confuse non-technical editors

### Issue #2: No Visual Preview ❌
**User Feedback**: "There is no way to visualize the page preview containing all the different block elements"
**Current Problem**: Must switch tabs to see changes, no instant feedback

### Issue #3: Card Layout Missing ❌
**User Feedback**: "Can we make every block show as a card by default with an option to disable?"
**Current Problem**: Blocks appear flat on frontend, no visual hierarchy

---

## 💡 Proposed Solutions (Quick Wins)

### Solution #1: Simplified Layout Controls (2 days)

**Replace technical controls with visual, intuitive options:**

#### Before vs After Comparison:

**Container Width**
```
❌ BEFORE:
Dropdown: "narrow | contained | wide | full"
Help text: "768px | 1152px | 1280px | 100%"

✅ AFTER:
Radio buttons with icons and descriptions:
○ 📖 Perfect for reading (articles, blog posts)
○ 📄 Standard page layout (most content) [SELECTED]
○ 🖼️ Wide display (galleries, images)
○ ⬛ Edge-to-edge (full backgrounds)
```

**Spacing** (replaces Padding + Margins)
```
❌ BEFORE:
Padding: none | small | medium | large
Margin Top: none | xs | sm | md | lg | xl | 2xl (with pixel values)
Margin Bottom: none | xs | sm | md | lg | xl | 2xl

✅ AFTER:
Simple visual sliders:

Inner Spacing (padding):
Compact [----●---------] Generous
         ↑ Live preview shows gray box expanding

Space Above (margin top):
None [----●---------] Lots
      ↑ Shows gray bar above block

Space Below (margin bottom):
None [----●---------] Lots
      ↑ Shows gray bar below block
```

**Background Color**
```
❌ BEFORE:
Color picker + hex input

✅ AFTER:
Preset palette + custom option:
[●Teal] [○Terracotta] [○Gold] [○Light Gray] [○White] [○None] [Custom...]
Site color palette shown first, easy one-click selection
```

**Implementation Preview:**
```tsx
// New component: SimplifiedLayoutControls.tsx
<div className="space-y-4">
  <div>
    <label className="text-sm font-medium mb-3 block">Content Width</label>
    <div className="space-y-2">
      <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
        <input type="radio" name="width" value="reading" />
        <div>
          <div className="font-medium">📖 Perfect for Reading</div>
          <div className="text-xs text-gray-500">Best for articles and long text</div>
        </div>
      </label>
      {/* More options... */}
    </div>
  </div>

  <div>
    <label className="text-sm font-medium mb-2 block">Inner Spacing</label>
    <input
      type="range"
      min="0"
      max="3"
      step="1"
      className="w-full"
      // Visual preview updates as you drag
    />
    <div className="flex justify-between text-xs text-gray-500">
      <span>Compact</span>
      <span>Comfortable</span>
      <span>Spacious</span>
      <span>Generous</span>
    </div>
    {/* Live preview box */}
    <div className="mt-2 border-2 border-dashed border-gray-300 rounded p-4 bg-gray-50">
      <div className="bg-white rounded p-[var(--preview-padding)]">
        Preview: This is how your content will look
      </div>
    </div>
  </div>
</div>
```

---

### Solution #2: Live Preview System (3 days)

**Three implementation options:**

#### Option A: Split-Screen Preview (Best UX, most complex)
```
┌──────────────────────────────────────────────────────┐
│ Edit: Homepage           [Desktop ▼] [Save] [Publish]│
├────────────────┬─────────────────────────────────────┤
│ EDITOR  (45%)  │ LIVE PREVIEW (55%)                  │
│                │ ┌───────────────────────────────────┐│
│ 📝 Text Block  │ │                                   ││
│                │ │  Welcome to Our School            ││
│ [Content...]   │ │  Lorem ipsum dolor sit amet...    ││
│ [Layout...]    │ │                                   ││
│                │ └───────────────────────────────────┘│
│ [Save Changes] │ ┌───────────────────────────────────┐│
│                │ │  [Image appears here]             ││
│ 🖼️ Image Block │ └───────────────────────────────────┘│
│ [Content...]   │                                      │
│                │ Updates as you type! 🎉               │
└────────────────┴─────────────────────────────────────┘
```
**Pros**: Real-time, see all blocks together
**Cons**: Complex to build, less space for editing

#### Option B: Preview Modal (Good UX, moderate complexity)
```
┌──────────────────────────────────────────────────────┐
│ Edit: Homepage          [👁 Preview] [Save] [Publish]│
├──────────────────────────────────────────────────────┤
│ 📝 Text Block                                        │
│ [Edit content here...]                               │
└──────────────────────────────────────────────────────┘

Click [👁 Preview] opens:

┌──────────────────────────────────────────────────────┐
│ ✕ Close Preview           [📱] [💻] [🖥️]            │
├──────────────────────────────────────────────────────┤
│ ┌────────────────────────────────────────────────────┤
│ │ Live Preview iframe with actual frontend rendering ││
│ │ Changes update every 2 seconds automatically       ││
│ │                                                     ││
│ │ Welcome to Our School                              ││
│ │ Lorem ipsum...                                     ││
│ │                                                     ││
│ │ [Image displays here]                              ││
│ └────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────┘
```
**Pros**: Full-screen preview, device toggles, easier to build
**Cons**: Modal covers editor

#### Option C: Preview Button (Simplest, fastest to implement)
```
┌──────────────────────────────────────────────────────┐
│ Edit: Homepage          [🔗 View Page] [Save] [Publish]│
├──────────────────────────────────────────────────────┤
│ 📝 Text Block                                        │
│ [Edit content here...]                               │
└──────────────────────────────────────────────────────┘

Click [🔗 View Page] opens frontend in new tab
- Auto-refreshes when you save
- Or add "?preview=draft" URL parameter to see unsaved changes
```
**Pros**: Easiest to implement (2 hours), familiar workflow
**Cons**: Requires tab switching

**Recommendation**: Start with **Option C** (quick win), upgrade to **Option B** later if needed.

---

### Solution #3: Card-Based Block Display (1 day)

**Add card styling option to every block:**

#### New Field in Block Editor: "Display Style"
```
┌──────────────────────────────────────────────────────┐
│ 📝 Text Block Editor                                 │
├──────────────────────────────────────────────────────┤
│ Content: [Rich text editor...]                       │
│                                                      │
│ ─── Layout & Design ────────────────────────────────│
│                                                      │
│ Display Style:                                       │
│ ○ Flat (no card)                                    │
│ ● Card with border    ← RECOMMENDED DEFAULT         │
│ ○ Featured card (with shadow)                       │
│                                                      │
│ [If Card selected, show:]                           │
│                                                      │
│ Card Border:                                         │
│ ● Gray  ○ Teal  ○ None                              │
│                                                      │
│ Card Corners:                                        │
│ Sharp [----●----] Rounded                           │
│                                                      │
│ Card Shadow:                                         │
│ ○ None  ● Subtle  ○ Medium  ○ Strong                │
│                                                      │
│ Padding Inside Card:                                 │
│ Tight [----●----] Generous                          │
└──────────────────────────────────────────────────────┘
```

#### Frontend Rendering Enhancement:
```tsx
// src/components/blocks/BlockLayoutWrapper.tsx
function BlockLayoutWrapper({ block, children }) {
  const displayStyle = block.display_style || 'card' // DEFAULT TO CARD!

  const cardClasses = {
    flat: '',
    card: 'border border-gray-200 rounded-lg shadow-sm bg-white',
    featured: 'border border-gray-100 rounded-xl shadow-lg bg-white'
  }

  return (
    <div className={`
      ${containerWidthClass}
      ${marginClass}
      ${paddingClass}
      ${cardClasses[displayStyle]}
    `}>
      {children}
    </div>
  )
}
```

#### Visual Examples:

**Flat Block (no card)**
```
──────────────────────────────────────
Welcome to Our School
Lorem ipsum dolor sit amet...
──────────────────────────────────────
[Image below]
──────────────────────────────────────
```

**Card Block (default)**
```
┌────────────────────────────────────┐
│ Welcome to Our School              │
│ Lorem ipsum dolor sit amet...      │
└────────────────────────────────────┘

┌────────────────────────────────────┐
│ [Image appears here]               │
└────────────────────────────────────┘
```

**Featured Card (elevated)**
```
┌────────────────────────────────────┐
│░ Welcome to Our School            ░│  ← Shadow
│░ Lorem ipsum dolor sit amet...    ░│
└────────────────────────────────────┘

┌────────────────────────────────────┐
│░ [Image appears here]             ░│
└────────────────────────────────────┘
```

#### Database Migration:
```sql
-- migrations/007_add_card_display_styles.sql
ALTER TABLE content_blocks
ADD COLUMN display_style VARCHAR(20) DEFAULT 'card' CHECK (display_style IN ('flat', 'card', 'featured')),
ADD COLUMN card_border_color VARCHAR(50) DEFAULT 'gray',
ADD COLUMN card_border_radius VARCHAR(20) DEFAULT 'medium' CHECK (card_border_radius IN ('none', 'small', 'medium', 'large')),
ADD COLUMN card_shadow VARCHAR(20) DEFAULT 'subtle' CHECK (card_shadow IN ('none', 'subtle', 'medium', 'strong')),
ADD COLUMN card_padding VARCHAR(20) DEFAULT 'medium';

-- Update existing blocks to use card style by default
UPDATE content_blocks SET display_style = 'card' WHERE display_style IS NULL;
```

---

## 📅 Quick Win Implementation Plan (1 Week)

### Day 1-2: Simplified Layout Controls
- [ ] Create `SimplifiedLayoutControls.tsx` component
- [ ] Replace technical dropdowns with radio buttons + sliders
- [ ] Add live preview boxes showing spacing
- [ ] Add preset color palette for backgrounds
- [ ] Test with non-technical user

### Day 3-4: Live Preview
- [ ] Add "View Page" button opening frontend in new tab
- [ ] Implement auto-refresh on save
- [ ] Add device size toggle (optional)
- [ ] Test preview workflow

### Day 5: Card-Based Blocks
- [ ] Run migration 007 to add display_style columns
- [ ] Update `BlockLayoutWrapper.tsx` with card classes
- [ ] Add card style controls to block editor
- [ ] Update all existing blocks to use 'card' by default
- [ ] Test card rendering on frontend

### Day 6: Testing & Polish
- [ ] End-to-end testing of all changes
- [ ] Mobile responsiveness check
- [ ] User acceptance testing with content editors
- [ ] Bug fixes

### Day 7: Documentation & Training
- [ ] Update admin user guide
- [ ] Create quick reference card
- [ ] Record video tutorial
- [ ] Launch to content team

---

## 🎯 Additional UX Improvements (Bonus)

Beyond the 3 critical issues, here are high-value enhancements:

### 4. Autosave with Visual Feedback (4 hours)
```
Status Bar: ● Saving... → ✓ All changes saved at 3:45 PM
```
- Saves automatically 2 seconds after last edit
- Clear visual indicator
- Never lose work

### 5. Drag-and-Drop Block Reordering (6 hours)
```
⋮⋮ Drag handle on each block
Smooth animations
Touch-friendly for tablets
```
- Replace up/down arrows
- More intuitive reordering
- Faster page building

### 6. Block Templates (4 hours)
```
"Insert Template" button
Pre-built patterns:
- Hero Section
- About Us Layout
- Contact Page
- FAQ Section
```
- Faster page creation
- Consistent design
- Best practices built-in

### 7. Keyboard Shortcuts (3 hours)
```
Ctrl+S: Save
Ctrl+P: Preview
Ctrl+K: Add block
Ctrl+D: Duplicate
```
- Power user productivity
- Faster editing
- Professional feel

---

## Executive Summary
Comprehensive plan to enhance the CMS admin interface with modern UX patterns, improved content management capabilities, and streamlined workflows.

---

## 1. Current State Analysis

### ✅ What Exists
- **Block-based page builder** (text, image, CTA)
- **Cloudinary integration** (ready for use)
- **TipTap rich text editor**
- **Block visibility & reordering**
- **Navigation management system**
- **Pages management system**

### ❌ Current Limitations
1. **No image preview** in editor - only shows URL
2. **Manual URL entry** for images - no upload UI
3. **Limited block types** (only 3 of 11 defined types active)
4. **No media library** interface
5. **Legacy admin sections** (school, faculty, news, achievements) - not integrated with new CMS
6. **No drag-and-drop** block reordering
7. **No live preview** of pages while editing
8. **No templates** for quick page creation

---

## 2. Best Practices Research

### 2.1 Industry-Leading CMS Patterns

Studied: **WordPress Gutenberg**, **Strapi**, **Payload CMS**, **Sanity**, **Contentful**

#### Key Findings:

**A. Visual Content Editing**
- Real-time preview alongside edit mode
- Inline editing where possible
- Image previews with thumbnails
- Drag-and-drop file uploads
- Media library with search/filter

**B. Block Management**
- Drag-and-drop reordering (not just up/down buttons)
- Block duplication
- Block templates/patterns
- Nested blocks support
- Quick block switcher (convert text → quote, etc.)

**C. Media Management**
- Dedicated media library page
- Grid view with thumbnails
- Upload by drag-drop, click, or URL
- Bulk upload support
- Image editing (crop, resize, filters)
- Alt text and SEO metadata
- Usage tracking (where is this image used?)

**D. User Experience**
- Auto-save with visual indicator
- Undo/Redo functionality
- Keyboard shortcuts
- Responsive admin (works on mobile)
- Contextual help/tooltips
- Loading states and feedback
- Validation with clear error messages

### 2.2 Accessibility Standards (WCAG 2.1 AA)
- Keyboard navigation for all features
- Screen reader support
- High contrast mode
- Focus indicators
- Error messages with ARIA labels

---

## 3. Recommended Enhancements

### **Priority 1: Critical UX Improvements** (Week 1)

#### 3.1 Image Upload with Cloudinary Widget
**Problem**: Users must manually enter image URLs
**Solution**: Integrate Cloudinary Upload Widget

**Implementation**:
```typescript
// React component for image upload
<CloudinaryUploadButton
  onSuccess={(result) => {
    setImageUrl(result.secure_url)
    setImageId(result.public_id)
  }}
  folder="pages/content"
/>
```

**Benefits**:
- Drag-and-drop upload
- Direct upload from computer/URL/camera
- Image transformations (crop, resize)
- Automatic optimization
- Progress indication

#### 3.2 Image Preview in Editor
**Problem**: No visual feedback for images
**Solution**: Show thumbnail preview next to URL input

**Design**:
```
┌─────────────────────────────────────┐
│ Image URL: [......................]  │
│                                      │
│ ┌──────────────┐                    │
│ │              │ Alt: [............] │
│ │   PREVIEW    │ Caption: [........] │
│ │   IMAGE      │                     │
│ └──────────────┘ [Upload Button]    │
└─────────────────────────────────────┘
```

#### 3.3 Auto-save with Visual Indicator
**Problem**: Users must manually save each change
**Solution**: Auto-save 2 seconds after last edit + indicator

**Design**:
```
┌────────────────────────────────┐
│ ● Saving...                    │
│ ✓ All changes saved (2s ago)   │
│ ⚠ Failed to save - Retry?      │
└────────────────────────────────┘
```

---

### **Priority 2: New Block Types** (Week 2)

#### 3.4 Video Block
**Features**:
- YouTube/Vimeo URL support
- Auto-detect video platform
- Thumbnail preview
- Autoplay toggle
- Caption field

**UI**:
```
Video URL: [paste YouTube/Vimeo URL]
┌───────────────────┐
│   ▶ VIDEO EMBED   │
│   Title appears   │
└───────────────────┘
☑ Autoplay  Caption: [........]
```

#### 3.5 Table Block
**Features**:
- Visual table editor
- Add/remove rows & columns
- Header row toggle
- Striped/bordered styles
- Responsive (stacks on mobile)

**UI**: Spreadsheet-like interface with add/delete buttons

#### 3.6 Accordion/FAQ Block
**Features**:
- Add multiple Q&A pairs
- Drag to reorder questions
- Preview open/closed state
- Allow multiple open toggle

#### 3.7 Image Gallery/Carousel Block
**Features**:
- Multiple image upload
- Layout modes: Grid, Carousel, Masonry
- Lightbox preview
- Caption per image
- Column count selector

#### 3.8 Stats/Numbers Block
**Features**:
- Grid of stat cards
- Number, label, optional icon
- Animated counting effect
- 2/3/4 column layouts

#### 3.9 Card Layout Block
**Features**:
- Multiple cards with image/text/CTA
- Grid or row layout
- Hover effects
- Link entire card or just button

---

### **Priority 3: Media Library** (Week 3)

#### 3.10 Dedicated Media Management Page
**Route**: `/admin/media`

**Features**:
- Grid view of all uploaded media
- Upload multiple files
- Search by filename, alt text, tags
- Filter by type (image/video/document)
- Filter by folder
- Sort by date, size, name
- Bulk actions (delete, move to folder, add tags)
- Usage indicator (shows which pages use each image)
- Edit metadata (alt, caption, tags)

**UI Layout**:
```
┌──────────────────────────────────────────────────────┐
│ Media Library                      [Upload Files]     │
├──────────────────────────────────────────────────────┤
│ [🔍 Search] [Type ▾] [Folder ▾] [Sort ▾]            │
├──────────────────────────────────────────────────────┤
│  ┌────┐  ┌────┐  ┌────┐  ┌────┐  ┌────┐            │
│  │ IMG│  │ IMG│  │ IMG│  │ IMG│  │ IMG│            │
│  │    │  │    │  │    │  │    │  │    │            │
│  └────┘  └────┘  └────┘  └────┘  └────┘            │
│  ┌────┐  ┌────┐  ┌────┐  ┌────┐  ┌────┐            │
│  │ IMG│  │ IMG│  │ IMG│  │ IMG│  │ IMG│            │
│  │    │  │    │  │    │  │    │  │    │            │
│  └────┘  └────┘  └────┘  └────┘  └────┘            │
└──────────────────────────────────────────────────────┘
```

#### 3.11 Image Picker Modal
**When selecting image in block**: Open modal to choose from library OR upload new

**Benefits**:
- Reuse existing images
- Consistent branding
- Avoid duplicate uploads
- See all options at once

---

### **Priority 4: Enhanced UX Features** (Week 4)

#### 3.12 Drag-and-Drop Block Reordering
**Library**: `@dnd-kit/core` (modern, accessible, performant)
**Features**:
- Visual drag handles
- Drop indicators
- Smooth animations
- Touch support for mobile
- Keyboard support

#### 3.13 Block Duplication
**Feature**: "Duplicate" button on each block
**Use Case**: Copy formatting/structure, change content

#### 3.14 Live Page Preview
**Options**:
A. **Side-by-side view** (split screen: edit | preview)
B. **Preview modal** (full-screen preview, close to return)
C. **Preview button** (opens page in new tab with ?preview=true)

**Recommendation**: Option C for simplicity

#### 3.15 Block Templates/Patterns
**Feature**: Pre-built block combinations
**Examples**:
- "Hero with CTA"
- "Two-column text with image"
- "FAQ section (3 questions)"
- "Stats grid (4 numbers)"
- "Team member grid"

**UI**: "Insert Pattern" button shows gallery of templates

#### 3.16 Search/Filter Blocks
**Feature**: When page has many blocks, add search bar
**Use**: Type to filter visible blocks by content/type

---

### **Priority 5: Admin Cleanup & Integration** (Week 5)

#### 3.17 Consolidate Admin Sections
**Current Problem**: Multiple disparate admin sections

**Recommendation**: Unified approach
1. **Keep**: Navigation, Pages, Media (new)
2. **Migrate to CMS**:
   - School Information → CMS Page at `/about-us/school-info`
   - Faculty Management → Staff Grid blocks
   - News & Articles → News Feed blocks or separate News CMS
   - Hero Achievements → Stats Grid blocks
3. **Remove**: Old admin pages after migration

**Migration Path**:
- Create pages for each section using new blocks
- Add "Migrate Content" button in old admin
- Show side-by-side comparison
- Mark old pages as "deprecated"

#### 3.18 Pages List Enhancement
**Feature**: Show navigation structure in pages list
**Show**:
- Which pages are in navigation
- Page hierarchy (parent → child)
- Published vs draft count
- Last edited timestamp
- Quick actions (edit, view, duplicate)

**UI**:
```
Pages (23)  [New Page ▾]  [Templates]

┌─────────────────────────────────────────────────────┐
│ 📄 Home              [Published]  Edit  View  Dupe  │
│ 📁 About Us                                          │
│    📄 Mission & Vision   [Published]  Edit  View    │
│    📄 Our Story          [Published]  Edit  View    │
│    📄 Board             [Draft]      Edit  View      │
│ 📁 Admissions                                        │
│    📄 Why Choose Us     [Published]  Edit  View     │
└─────────────────────────────────────────────────────┘
```

---

## 4. Technical Implementation Details

### 4.1 New Block Editors Structure
```typescript
// src/components/admin/blocks/
VideoBlockEditor.tsx
TableBlockEditor.tsx
AccordionBlockEditor.tsx
GalleryBlockEditor.tsx
StatsBlockEditor.tsx
CardLayoutBlockEditor.tsx
```

### 4.2 Media Library Architecture
```typescript
// New APIs
/api/media
  GET - List all media (paginated, filterable)
  POST - Upload new media
  PUT - Update media metadata
  DELETE - Delete media

/api/media/[id]
  GET - Get single media item
  PUT - Update single item
  DELETE - Delete single item

/api/media/bulk
  POST - Bulk operations
```

### 4.3 Cloudinary Widget Integration
```bash
npm install cloudinary-react
```

```typescript
import { CloudinaryContext, Image, Transformation } from 'cloudinary-react'
import { UploadWidget } from 'cloudinary-react'
```

### 4.4 Drag-and-Drop Implementation
```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

### 4.5 Auto-save Hook
```typescript
// Custom hook
function useAutoSave(data, onSave, delay = 2000) {
  const [status, setStatus] = useState('saved')
  // Debounce logic
  // Auto-save on change
  // Return status indicator
}
```

---

## 5. Database Schema Updates

### 5.1 Media Library Table (Already Exists!)
```sql
-- Check if this matches supabase/schema.sql
CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT, -- 'image', 'video', 'document', 'audio'
  mime_type TEXT,
  size_bytes BIGINT,
  width INTEGER,
  height INTEGER,
  alt_text TEXT,
  caption TEXT,
  folder TEXT DEFAULT 'uploads',
  tags TEXT[],
  public_id TEXT, -- Cloudinary public_id
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMP WITH TIME ZONE,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  uploaded_by UUID REFERENCES auth.users(id)
);
```

---

## 6. Implementation Timeline

### Week 1: Critical UX (16 hours)
- [ ] Cloudinary upload widget integration
- [ ] Image preview in editor
- [ ] Auto-save functionality
- [ ] Loading states & error handling
- [ ] Test with existing pages

### Week 2: New Block Types (20 hours)
- [ ] Video block (YouTube/Vimeo)
- [ ] Table block with visual editor
- [ ] Accordion/FAQ block
- [ ] Image gallery block
- [ ] Stats grid block
- [ ] Test all block types
- [ ] Update BlockRenderer for frontend

### Week 3: Media Library (16 hours)
- [ ] Media library page UI
- [ ] Upload multiple files
- [ ] Search & filter
- [ ] Image picker modal
- [ ] Integrate with block editors
- [ ] Test image reuse workflow

### Week 4: Enhanced UX (16 hours)
- [ ] Drag-and-drop reordering
- [ ] Block duplication
- [ ] Live preview (new tab)
- [ ] Block templates/patterns
- [ ] Keyboard shortcuts
- [ ] Polish animations & transitions

### Week 5: Admin Cleanup (12 hours)
- [ ] Audit old admin sections
- [ ] Create migration scripts
- [ ] Update AdminSidebar (remove old items)
- [ ] Enhance pages list view
- [ ] Documentation & training guide

**Total**: ~80 hours (2 weeks full-time)

---

## 7. User Stories

### US1: Content Editor Uploads Image
**As a** content editor
**I want to** easily upload images from my computer
**So that** I don't have to manually host and link images

**Acceptance Criteria**:
- Click "Upload" button
- Drag file or click to browse
- See upload progress
- Image automatically inserted with URL
- Preview shows immediately

### US2: Content Editor Creates FAQ Section
**As a** content editor
**I want to** create an FAQ section with expandable questions
**So that** visitors can find answers quickly

**Acceptance Criteria**:
- Add Accordion block
- Add multiple questions
- Reorder questions by dragging
- Preview open/closed states
- FAQ renders correctly on frontend

### US3: Content Editor Reuses Existing Image
**As a** content editor
**I want to** browse previously uploaded images
**So that** I maintain consistent branding and avoid duplicates

**Acceptance Criteria**:
- Click "Choose Image" button
- Modal opens showing media library
- Search by filename
- Filter by folder/tags
- Click to select image
- Image inserted into block

### US4: Content Editor Finds Image Usage
**As a** content editor
**I want to** see where images are being used
**So that** I don't delete images that are in use

**Acceptance Criteria**:
- Open media library
- Click on image
- See list of pages using this image
- Click page name to navigate

---

## 8. Design System & UI Components

### 8.1 Component Library Additions
```typescript
// src/components/admin/ui/
FileUploader.tsx         // Drag-drop upload zone
ImagePicker.tsx          // Modal to choose from library
MediaCard.tsx            // Thumbnail card for media items
BlockToolbar.tsx         // Floating toolbar with quick actions
AutoSaveIndicator.tsx    // "Saving..." status
ConfirmDialog.tsx        // "Are you sure?" modals
Tooltip.tsx              // Help tooltips
EmptyState.tsx           // "No content yet" placeholders
```

### 8.2 Consistent Styling
- **Primary Color**: Terracotta Red (#D04845)
- **Secondary Color**: Deep Teal (#145B55)
- **Background**: Warm White (#FAF9F6)
- **Borders**: Soft Beige (#E8E4D9)
- **Shadows**: Subtle, warm-toned
- **Border Radius**: 8-12px for panels, 4-6px for inputs
- **Animations**: 200-300ms ease-out

---

## 9. Performance Optimizations

### 9.1 Image Optimization
- Use Cloudinary transformations for thumbnails
- Lazy load media library grid
- Virtual scrolling for large lists (react-window)
- WebP format with fallback

### 9.2 Auto-save Optimization
- Debounce saves (2 second delay)
- Optimistic UI updates
- Queue multiple changes into single save
- Show retry on failure

### 9.3 Block Rendering
- Code splitting per block type
- Lazy load block editors
- Memoize block components
- Virtual list for 50+ blocks

---

## 10. Security Considerations

### 10.1 File Upload Security
- Validate file types (whitelist)
- Limit file size (10MB for images, 50MB for videos)
- Sanitize filenames
- Check MIME types server-side
- Use signed upload tokens (Cloudinary)

### 10.2 Content Security
- Sanitize HTML in text blocks (DOMPurify)
- Validate URLs (no javascript: links)
- CSRF protection on all POST/PUT/DELETE
- Row Level Security (RLS) in Supabase

### 10.3 Media Library Access
- Only authenticated admins can upload
- Track who uploaded each file
- Audit log for deletions
- Prevent direct URL access to admin APIs

---

## 11. Testing Strategy

### 11.1 Unit Tests
- Block editor components
- Media upload flow
- Auto-save logic
- Validation functions

### 11.2 Integration Tests
- Complete page editing workflow
- Image upload → insert → save → view
- Block reordering
- Media library search/filter

### 11.3 E2E Tests (Playwright)
- Create new page
- Add various block types
- Upload images
- Publish page
- Verify frontend rendering

### 11.4 Manual Testing Checklist
- [ ] All blocks render correctly on frontend
- [ ] Images display at correct sizes
- [ ] Responsive on mobile/tablet
- [ ] Keyboard navigation works
- [ ] Screen reader announces content
- [ ] Works in Chrome, Firefox, Safari

---

## 12. Documentation Requirements

### 12.1 Admin User Guide
- How to create a page
- How to add blocks
- How to upload images
- How to manage media library
- How to use templates
- Keyboard shortcuts reference

### 12.2 Developer Documentation
- Block system architecture
- Creating new block types
- Media API reference
- Cloudinary configuration
- Supabase schema
- Deployment checklist

---

## 13. Future Enhancements (Phase 2)

### Beyond Initial Implementation
1. **Versioning & Revisions**
   - Save page history
   - Compare versions
   - Restore previous version

2. **Scheduled Publishing**
   - Set future publish date
   - Automatic publication
   - Countdown indicator

3. **AI Content Assistance**
   - Generate page from description
   - Suggest improvements
   - Auto-generate alt text
   - SEO recommendations

4. **Localization (Arabic)**
   - Switch between EN/AR content
   - RTL editor support
   - Arabic TipTap extensions

5. **Advanced Permissions**
   - Role-based access (editor, author, viewer)
   - Page-level permissions
   - Approval workflows

6. **Analytics Integration**
   - Page view counts in admin
   - Popular content dashboard
   - Broken link checker

---

## 14. Success Metrics

### How We'll Measure Improvement

**Quantitative**:
- Time to create page: Target <5 minutes (from 15+ min)
- Image upload success rate: >98%
- Auto-save reliability: >99.5%
- Page load time (admin): <2 seconds
- User task completion rate: >90%

**Qualitative**:
- User satisfaction survey (1-10 scale)
- Number of support requests (should decrease)
- Content editor feedback sessions
- Usability testing scores

---

## 15. Risks & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Cloudinary quota exceeded | High | Low | Monitor usage, set alerts |
| Breaking existing pages | High | Medium | Comprehensive testing, backup |
| Poor performance with many blocks | Medium | Medium | Virtual scrolling, lazy loading |
| User adoption challenges | Medium | Low | Training, documentation, tooltips |
| Media library storage costs | Low | Medium | Cleanup unused media, compression |

---

## 16. Next Steps for Approval

### Decision Points

1. **Scope**: Approve full plan OR prioritize subset?
2. **Timeline**: 2 weeks focused work OR spread over longer period?
3. **Block Types**: All 8 new blocks OR start with 3-4 most critical?
4. **Media Library**: Build custom OR use Cloudinary Media Library widget?
5. **Admin Cleanup**: Migrate old sections now OR defer to Phase 2?

### Recommended Immediate Actions (if approved)
1. Set up Cloudinary widget (2 hours)
2. Add image preview to existing editor (3 hours)
3. Implement Video block (4 hours)
4. Implement Table block (4 hours)
5. Test and deploy incremental improvements

---

## Questions for Stakeholder

1. Which block types are most critical for content team?
2. Is there a preferred UI/UX style to match? (screenshots?)
3. Any specific workflows that are painful right now?
4. Multilingual (Arabic) support priority?
5. Timeline constraints or deadlines?
6. Budget for tools/services (Cloudinary has free tier)?
