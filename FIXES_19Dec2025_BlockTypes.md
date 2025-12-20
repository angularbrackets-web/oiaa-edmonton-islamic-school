# Block Types Fixes - December 19, 2025

## Issues Fixed

### 1. ✅ Forms, Map, and Documents Blocks Not Working

**Root Cause:** Database CHECK constraint missing new block types
**Fixed:** Migration 019 updates the `valid_block_type` constraint

**Migration SQL** (already run by user):
```sql
ALTER TABLE content_blocks DROP CONSTRAINT IF EXISTS valid_block_type;
ALTER TABLE content_blocks ADD CONSTRAINT valid_block_type CHECK (block_type IN (
  'text', 'heading', 'image', 'image_gallery', 'video', 'cta', 'hero',
  'stats_grid', 'accordion', 'table', 'staff_grid', 'news_feed',
  'cards', 'page_embed', 'component', 'section', 'columns',
  'form', 'map', 'documents'
));
```

### 2. ✅ Form Submission Error - "Failed to save submission"

**Root Cause:** Using anon client instead of admin client for database insert
**Fixed:** `/src/app/api/form-submissions/route.ts`

**Changes:**
- Uses `supabaseAdmin` instead of `supabase` to bypass RLS
- Extracts common fields (email, name, phone) from form_data
- Fixed GET query to use `created_at` instead of non-existent `submitted_at`

**Testing:**
1. Create a form block in any page
2. Add fields (name, email, message)
3. Submit the form from the frontend
4. Should see success message

### 3. ✅ Map Block - "maps.app.goo.gl refused to connect"

**Root Cause:** User using shortened Google Maps URL instead of embed URL
**Fixed:** `/src/components/admin/blocks/MapBlockEditor.tsx`

**Improvements:**
- Added validation warning for invalid URLs
- Automatic extraction of embed URL from iframe code
- Clear instructions about NOT using shortened URLs
- Visual feedback for incorrect URL format

**How to Use:**
1. Go to Google Maps → Search location → Share → Embed a map
2. Copy the full iframe code OR just the src URL
3. Paste into Map Block editor
4. **Important:** URL must start with `https://www.google.com/maps/embed`

**Alternative:** Use "Simple Address" mode for just an address card with "Open in Google Maps" button

### 4. ✅ Documents Block - Need Upload Option

**Fixed:** `/src/components/admin/blocks/DocumentsBlockEditor.tsx`

**New Features:**
- Upload button next to URL input field
- Accepts: PDF, DOC, DOCX, XLS, XLSX
- Automatic file size calculation
- Loading indicator during upload
- Uses existing Cloudinary upload endpoint

**How to Use:**
1. Add a Documents block
2. Click "Add Document"
3. Click "Upload" button
4. Select file from your computer
5. File uploads to Cloudinary and URL is automatically filled

## Files Modified

1. **migrations/019_add_map_documents_block_types.sql** - NEW
2. **src/app/api/form-submissions/route.ts** - MODIFIED
   - Line 2: Added `supabaseAdmin` import
   - Lines 21-24: Extract email, name, phone from form_data
   - Line 27: Use `supabaseAdmin` instead of `supabase`
   - Line 160: Use `supabaseAdmin` for GET query
   - Line 163: Fixed `created_at` instead of `submitted_at`

3. **src/components/admin/blocks/MapBlockEditor.tsx** - MODIFIED
   - Lines 27-39: Added `handleEmbedUrlChange` function
   - Line 88: Uses new handler
   - Lines 89-104: Added validation warning
   - Lines 94-104: Show error for invalid URLs

4. **src/components/admin/blocks/DocumentsBlockEditor.tsx** - MODIFIED
   - Line 14: Added `uploadingDoc` state
   - Lines 22-53: Added `handleFileUpload` function
   - Lines 288-331: Added upload button UI

## Testing Checklist

### Forms Block ✓
- [ ] Create form with multiple field types (text, email, textarea, select)
- [ ] Submit form from frontend
- [ ] Verify success message displays
- [ ] Check database: Form submission saved correctly
- [ ] Test required field validation

### Map Block ✓
- [ ] Test with Google Maps embed URL
- [ ] Verify map displays correctly on frontend
- [ ] Test "Simple Address" mode with address text
- [ ] Verify "Open in Google Maps" button works

### Documents Block ✓
- [ ] Upload a PDF file
- [ ] Upload a Word document
- [ ] Upload an Excel file
- [ ] Verify all 3 display styles (list, grid, cards)
- [ ] Test download buttons work
- [ ] Test manual URL entry still works

## Next Steps

The following issues from the test report still need to be addressed:

### Remaining Issues
1. **Home Page editing** - "Missing required fields: slug, title" error
2. **Hero Section (Achievements)** - Unable to add items
3. **Hero Section (Achievements)** - Unable to delete items
4. **Navigation Menu** - Unable to navigate to main menu item
5. **Cards Block** - Full width card option (partial fix needed)

Would you like me to continue with these remaining issues?
