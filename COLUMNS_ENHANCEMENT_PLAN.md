# Columns Layout Enhancement Plan

## Current State Analysis

### What Works Now
1. **Column count selection**: 2, 3, or 4 columns
2. **Column ratio presets**: Various width ratios (1:1, 1:2, 2:1, 1:3, etc.)
3. **Gap control**: None to XL spacing between columns
4. **Vertical alignment**: Top, center, bottom, stretch
5. **Stack on mobile**: Toggle for responsive behavior
6. **Nested blocks support**: Database has `parent_block_id` field
7. **Block rendering**: Nested blocks are fetched and attached to parent containers

### Current Limitations (Issues Raised)

1. **No way to add blocks inside columns from admin UI**
   - The page editor only adds blocks at the page level
   - No nested block management interface
   - "Tip" message says blocks need to be added after saving, but there's no UI for this

2. **Automatic block distribution is limiting**
   - Blocks are distributed evenly: `blocksPerColumn = ceil(blocks.length / numColumns)`
   - Users cannot control which specific blocks go in which column
   - File: `src/components/blocks/ColumnsBlock.tsx:98-111`

3. **No per-column settings**
   - Cannot set individual column padding
   - Cannot set individual column background color
   - Cannot set individual column borders or styling
   - All columns share the same settings

4. **No nested columns support**
   - Cannot add a columns layout inside a column
   - No recursive container support

5. **No column spacing override**
   - Default spacing exists but no way to remove/override per instance

---

## Proposed Enhancements

### Phase 1: Enhanced Column Configuration

#### 1.1 Update `ColumnsBlockContent` Type
Add per-column configuration to the content type:

```typescript
// src/types/cms.ts
export interface ColumnConfig {
  id: string  // Unique identifier for the column
  padding?: PaddingSize
  padding_horizontal?: PaddingSize
  background_color?: string
  border_color?: string
  border_width?: 'none' | 'thin' | 'medium' | 'thick'
  border_radius?: CardBorderRadius
  vertical_align?: VerticalAlign  // Override container-level alignment
  custom_class?: string
}

export interface ColumnsBlockContent extends BlockContent {
  column_count: 2 | 3 | 4
  column_ratio?: ColumnRatio
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  stack_on_mobile?: boolean
  vertical_align?: VerticalAlign
  // NEW: Per-column configuration
  columns?: ColumnConfig[]
}
```

#### 1.2 Add Column Assignment to Nested Blocks
Extend `ContentBlock` to specify which column a block belongs to:

```typescript
// src/types/cms.ts - ContentBlock interface
export interface ContentBlock {
  // ... existing fields ...
  column_index?: number  // 0-based index for column assignment (null = auto-distribute)
}

// Also update ContentBlockInput
export interface ContentBlockInput {
  // ... existing fields ...
  column_index?: number
}
```

### Phase 2: Admin UI for Nested Block Management

#### 2.1 Create Nested Block Editor Component
New component: `src/components/admin/blocks/NestedBlocksEditor.tsx`

Features:
- Visual column representation
- Drag-and-drop between columns
- Add block button within each column
- Per-column settings panel
- Move blocks up/down within column
- Delete blocks from column

```
┌─────────────────────────────────────────────────────────────┐
│ Columns Layout Editor                                        │
├─────────────────────────────────────────────────────────────┤
│ [Column Settings] [Gap: Medium ▼] [Stack on Mobile: ✓]     │
├──────────────────────┬──────────────────────┬───────────────┤
│ Column 1 (1/3)       │ Column 2 (1/3)       │ Column 3 (1/3)│
│ ⚙️ Settings          │ ⚙️ Settings          │ ⚙️ Settings   │
├──────────────────────┼──────────────────────┼───────────────┤
│ ┌──────────────────┐ │ ┌──────────────────┐ │               │
│ │ 📝 Text Block    │ │ │ 🖼️ Image Block   │ │               │
│ │ [↑] [↓] [✎] [🗑] │ │ │ [↑] [↓] [✎] [🗑] │ │               │
│ └──────────────────┘ │ └──────────────────┘ │               │
│ ┌──────────────────┐ │                      │               │
│ │ 🎴 Cards Block   │ │                      │               │
│ │ [↑] [↓] [✎] [🗑] │ │                      │               │
│ └──────────────────┘ │                      │               │
│                      │                      │               │
│ [+ Add Block]        │ [+ Add Block]        │ [+ Add Block] │
└──────────────────────┴──────────────────────┴───────────────┘
```

#### 2.2 Enhance ColumnsBlockEditor
Update existing editor to include:
- Visual column preview with actual nested blocks
- Per-column settings expandable panels
- Integration with NestedBlocksEditor

#### 2.3 Update Page Editor
Modify `src/app/admin/pages/[id]/edit/page.tsx`:
- Detect when editing a container block (columns/section)
- Show nested block management UI inline
- Handle `parent_block_id` when creating nested blocks
- Handle `column_index` for column assignment

### Phase 3: Column-Specific Block Assignment

#### 3.1 Update Block Distribution Logic
Modify `src/components/blocks/ColumnsBlock.tsx`:

```typescript
// Current (problematic):
const blocksPerColumn = Math.ceil(visibleBlocks.length / numColumns)
for (let i = 0; i < numColumns; i++) {
  const start = i * blocksPerColumn
  const columnBlocks = visibleBlocks.slice(start, start + blocksPerColumn)
}

// Proposed:
const columns = Array.from({ length: numColumns }, (_, i) => ({
  config: content.columns?.[i] || {},
  blocks: visibleBlocks.filter(b => b.column_index === i)
}))

// Fallback for blocks without column_index (auto-distribute)
const unassignedBlocks = visibleBlocks.filter(b => b.column_index === undefined)
unassignedBlocks.forEach((block, i) => {
  columns[i % numColumns].blocks.push(block)
})

// Sort blocks within each column by display_order
columns.forEach(col => {
  col.blocks.sort((a, b) => a.display_order - b.display_order)
})
```

### Phase 4: Database Migration

#### 4.1 Add `column_index` to content_blocks table
```sql
-- migrations/024_add_column_index_to_blocks.sql
ALTER TABLE content_blocks
ADD COLUMN column_index INTEGER DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN content_blocks.column_index IS
  'Zero-based column index for blocks inside a columns container. NULL means auto-distribute.';
```

### Phase 5: API Updates

#### 5.1 Update Block API
Modify `/api/blocks` route to:
- Accept `column_index` in POST/PUT requests
- Accept `parent_block_id` for nested block creation
- Return nested blocks with column assignment info

#### 5.2 Add Nested Block Endpoints
New endpoint: `POST /api/blocks/[id]/nested`
- Create a block as a child of container block
- Automatically set `parent_block_id`
- Accept `column_index` for columns containers

---

## Implementation Priority

### High Priority (Core Functionality)
1. **Per-column block assignment** - Most requested feature
2. **Admin UI for adding blocks to columns** - Critical missing feature
3. **Per-column settings** (padding, background) - High flexibility value

### Medium Priority (Enhanced UX)
4. **Drag-and-drop between columns** - Improves usability
5. **Visual column preview in editor** - Better admin experience
6. **Column-level background/border settings** - Design flexibility

### Lower Priority (Nice-to-Have)
7. **Nested columns** (columns within columns) - Complex, edge case
8. **Column presets/templates** - Saves time for common layouts
9. **Responsive column ratios** - Different ratios per breakpoint

---

## UI/UX Considerations

### Column Settings Panel
Each column should have an expandable settings panel:
```
┌─ Column 1 Settings ─────────────────────┐
│ Background Color: [Color Picker]        │
│ Padding: [None ▼] [Vertical/Horizontal] │
│ Border: [None ▼] [Color] [Radius]       │
│ Vertical Align: [Stretch ▼]             │
│ Custom CSS Class: [_______________]     │
└─────────────────────────────────────────┘
```

### Block Type Restrictions
Consider limiting which blocks can be added inside columns:
- ✅ Text, Image, Video, Cards, CTA, Heading
- ✅ Form, Map, Documents, Spacer, Divider
- ⚠️ Columns (nested) - Allow with warning
- ❌ Hero, Section, Page Embed - May not make sense

### Mobile Preview
Add toggle to preview stacked vs side-by-side layout in admin.

---

## Files to Modify

### Types
- `src/types/cms.ts` - Add ColumnConfig, column_index

### Admin Components
- `src/components/admin/blocks/ColumnsBlockEditor.tsx` - Major enhancement
- `src/components/admin/blocks/NestedBlocksEditor.tsx` - New file
- `src/app/admin/pages/[id]/edit/page.tsx` - Nested block handling

### Frontend Rendering
- `src/components/blocks/ColumnsBlock.tsx` - Column-aware rendering

### Database/API
- `migrations/024_add_column_index_to_blocks.sql` - New migration
- `src/lib/supabase/pages.ts` - Update block services
- `src/app/api/blocks/route.ts` - Handle column_index
- `src/app/api/blocks/[id]/route.ts` - Handle column_index

---

## Estimated Effort

| Phase | Description | Complexity | Estimate |
|-------|-------------|------------|----------|
| 1 | Enhanced Column Configuration (Types) | Low | 1-2 hours |
| 2 | Admin UI for Nested Blocks | High | 8-12 hours |
| 3 | Column-Specific Block Assignment | Medium | 3-4 hours |
| 4 | Database Migration | Low | 30 min |
| 5 | API Updates | Medium | 2-3 hours |
| - | Testing & Polish | Medium | 3-4 hours |

**Total Estimated Effort: 18-26 hours**

---

## Alternative Approaches Considered

### A: WordPress-Style Innerblocks
Each column rendered as a sub-editor with full block capabilities.
- Pro: Very flexible
- Con: Complex implementation, performance concerns

### B: Predefined Column Templates
Offer templates like "Image + Text", "3 Cards", etc.
- Pro: Simpler UX
- Con: Less flexibility, doesn't solve the core issue

### C: JSON-based Column Content
Store column content as JSON within ColumnsBlockContent.
- Pro: No DB changes needed
- Con: Loses block reusability, harder to query

**Recommended: Hybrid of current approach with column_index assignment** - Best balance of flexibility, implementation effort, and existing architecture compatibility.

---

## Success Criteria

1. ✅ Admin can add blocks directly to specific columns
2. ✅ Admin can configure per-column padding and background
3. ✅ Admin can reorder blocks within a column
4. ✅ Admin can move blocks between columns
5. ✅ Gap between columns can be set to zero
6. ✅ Frontend renders column-assigned blocks correctly
7. ✅ Mobile stacking works with assigned blocks
8. ✅ Existing pages with columns continue to work (backward compatible)
