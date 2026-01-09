# Flat Block Border/Shadow Fix

## Problem
When changing a block from "Featured Card" or "Card" to "Flat (No Card)", the borders and shadows were still showing up even though "Flat" was selected. This only affected existing blocks that were changed; new blocks worked fine.

## Root Cause
Two issues:
1. **Frontend Rendering**: The `BlockLayoutWrapper` component was applying `card_border_radius` and `card_shadow` classes even when `display_style` was 'flat'
2. **Database State**: When users changed from card to flat, the old card properties (`card_border_radius`, `card_shadow`, `card_hover_effect`) remained in the database and overrode the flat styling

## Solution
Applied a 3-part fix:

### 1. Fixed Frontend Rendering (`BlockLayoutWrapper.tsx`)
**Before:**
```typescript
const customBorderRadius = cardBorderRadius ? borderRadiusClasses[cardBorderRadius] : ''
const customShadow = cardShadow ? shadowClasses[cardShadow] : ''
```
Card properties were applied regardless of display style.

**After:**
```typescript
const customBorderRadius = effectiveDisplayStyle !== 'flat' && cardBorderRadius
  ? borderRadiusClasses[cardBorderRadius]
  : ''
const customShadow = effectiveDisplayStyle !== 'flat' && cardShadow
  ? shadowClasses[cardShadow]
  : ''
```
Card properties are only applied if display style is NOT 'flat'.

### 2. Updated Admin Controls (`SimplifiedLayoutControls.tsx`)
When selecting "Flat (No Card)", automatically reset all card properties:
```typescript
onChange({
  display_style: 'flat',
  card_border_radius: 'none',
  card_shadow: 'none',
  card_hover_effect: false
})
```

### 3. Cleaned Up Existing Blocks (`cleanup-flat-blocks.ts`)
Created and ran a cleanup script that:
- Found 24 blocks with `display_style='flat'` but card properties still set
- Updated 89 blocks total to reset all card properties
- Verified all flat blocks are now clean

## Results
✅ **Fixed 24 problematic blocks** that showed borders/shadows despite being set to flat
✅ **All flat blocks now render correctly** without borders or shadows
✅ **Future changes work properly** - changing to flat now automatically resets card properties
✅ **Build successful** - no compilation errors

## Testing
1. Navigate to a page with blocks in the admin
2. Change a block from "Card" or "Featured" to "Flat (No Card)"
3. Save and view the page
4. The block should now have no borders or shadows ✓

## Files Modified
1. `src/components/blocks/BlockLayoutWrapper.tsx` - Conditional card property application
2. `src/components/admin/blocks/SimplifiedLayoutControls.tsx` - Auto-reset on flat selection
3. `scripts/cleanup-flat-blocks.ts` - Cleanup script for existing blocks (NEW)

## Database Impact
- Updated 89 content_blocks records
- Set `card_border_radius='none'`, `card_shadow='none'`, `card_hover_effect=false`, `card_border_color=NULL` for all blocks with `display_style='flat'`
- No schema changes required

## Prevention
This issue won't happen again because:
- Frontend now ignores card properties when display_style is 'flat'
- Admin UI automatically resets card properties when switching to flat
- New blocks default to proper flat styling
