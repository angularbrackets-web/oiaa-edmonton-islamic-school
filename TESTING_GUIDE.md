# 🧪 Testing Guide - Container Blocks System

**Status**: ✅ Migrations Complete
**Ready to Test**: Yes!
**Dev Server**: http://localhost:3000

---

## ✅ Pre-Testing Checklist

- [x] Migration 005 applied (layout fields)
- [x] Migration 006 applied (nested blocks)
- [x] Dev server running
- [x] No compilation errors

---

## 🎯 Test Plan

### Test 1: Verify Block Types Available (2 minutes)

1. Navigate to: http://localhost:3000/admin/pages
2. Click on any existing page (or create new one)
3. Click **"Add Block"** dropdown
4. **Expected**: You should see new block types:
   - 📦 Section Container
   - 📐 Columns Layout
   - Plus all existing blocks (Text, Image, Video, CTA, Cards, Page Embed)

**Screenshot checkpoint**: Block type dropdown shows new container blocks

---

### Test 2: Create Section Block (5 minutes)

#### Step 1: Add Section Block
1. Click **"Add Block"** → Select **"📦 Section Container"**
2. Block editor should open
3. **Expected**: See blue info banner explaining section blocks

#### Step 2: Configure Layout
Scroll to **"Layout & Styling"** section (bottom of editor):
- **Container Width**: Select "Full"
- **Padding**: Select "Large"
- **Background Color**: Enter `#1A5F7A` (teal)
- **Margin Bottom**: Select "xl"

#### Step 3: Save
1. Click **"Save"** button
2. **Expected**: Block saves successfully
3. **Expected**: Block appears in page editor with:
   - 📦 icon
   - "Section Container" label
   - Teal border (indicating it's visible)

#### Step 4: View Frontend
1. Open page in new tab (frontend URL)
2. **Expected**: See empty section with:
   - Teal background
   - Large padding
   - Message: "This section is empty. Add blocks to it in the admin panel."

**Result**: ✅ Section block works!

---

### Test 3: Create Columns Block (5 minutes)

#### Step 1: Add Columns Block
1. Back in admin, click **"Add Block"** → Select **"📐 Columns Layout"**
2. Block editor should open

#### Step 2: Configure Columns
In the editor:
- **Number of Columns**: Click "3 Columns"
- **Gap Between Columns**: Select "Medium (24px)"
- **Stack on Mobile**: Keep checked ✅

#### Step 3: Configure Layout
Scroll to **"Layout & Styling"**:
- **Container Width**: "Contained" (default is fine)
- **Padding**: "Medium"
- **Margin Top**: "lg"
- **Margin Bottom**: "lg"

#### Step 4: Save and View
1. Click **"Save"**
2. View frontend
3. **Expected**: See empty columns block with message

**Result**: ✅ Columns block works!

---

### Test 4: Layout Controls on Existing Blocks (5 minutes)

#### Test Text Block Layout
1. Find or create a **Text Block**
2. Click to edit it
3. Scroll down to **"Layout & Styling"** section
4. **Expected**: See all layout controls:
   - Container Width dropdown
   - Padding dropdown
   - Margin Top dropdown
   - Margin Bottom dropdown
   - Background Color input
   - Custom CSS Class input

#### Try Different Widths
1. Save text block with **Container Width: "Narrow"**
2. View frontend
3. **Expected**: Text block is narrower (max 768px)

4. Edit again, change to **"Full"**
5. View frontend
6. **Expected**: Text block spans full width

**Result**: ✅ Layout controls work on all blocks!

---

### Test 5: Background Colors and Spacing (3 minutes)

#### Add Background to CTA Block
1. Create or edit a **CTA Block**
2. Add title: "Join Our School"
3. Add button: "Enroll Now" → "/admissions"
4. **Layout & Styling**:
   - Background Color: `#F4F4F4` (light gray)
   - Padding: "Large"
   - Margin Top: "xl"
   - Margin Bottom: "xl"

5. Save and view frontend
6. **Expected**: CTA has light gray background, large padding, lots of space around it

**Result**: ✅ Background colors and spacing work!

---

### Test 6: Responsive Design (5 minutes)

#### Test on Different Screen Sizes
1. Open frontend page with columns block
2. Open browser DevTools (F12)
3. Click device toolbar (Ctrl/Cmd + Shift + M)

#### Desktop View (1280px)
- **Expected**: Columns display side-by-side
- **Expected**: Container widths respect max-width

#### Tablet View (768px)
- **Expected**: Columns may adjust to 2 columns
- **Expected**: Padding adjusts (smaller on mobile)

#### Mobile View (375px)
- **Expected**: Columns stack vertically (if "stack on mobile" was checked)
- **Expected**: All content remains readable
- **Expected**: Touch targets are large enough

**Result**: ✅ Responsive design works!

---

## 🎨 Advanced Testing

### Test 7: Create a Full Page Layout (10 minutes)

Try building this page structure:

```
1. Hero Section (Section Block)
   - Full width, teal background (#1A5F7A), large padding
   - [Future: Add text + CTA inside]

2. Features (Columns Block)
   - 3 columns, medium gap
   - Contained width, medium padding
   - [Future: Add image + text in each column]

3. Call-to-Action (CTA Block)
   - Light gray background (#F4F4F4)
   - Large padding
   - Extra large margins (top & bottom)

4. Text Content (Text Block)
   - Narrow width (for readability)
   - Medium padding
```

#### Expected Result:
A professionally laid out page with:
- ✅ Full-width hero section
- ✅ 3-column features area
- ✅ Highlighted CTA section
- ✅ Narrow readable text content

---

## 🐛 Troubleshooting

### Issue: Block types not showing
**Solution**:
1. Refresh page (Ctrl/Cmd + R)
2. Clear browser cache
3. Restart dev server: Ctrl+C, then `npm run dev`

### Issue: Layout controls not appearing
**Solution**:
1. Make sure you clicked "Edit" on the block
2. Scroll down - controls are at bottom
3. Check migration 005 ran successfully

### Issue: Cannot save blocks
**Solution**:
1. Check browser console (F12) for errors
2. Verify Supabase connection
3. Check network tab for failed API calls

### Issue: Frontend not updating
**Solution**:
1. Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R)
2. Check block is set to "visible" (eye icon)
3. Verify page is published

---

## 📊 Testing Checklist

Use this checklist to track your testing:

### Basic Functionality
- [ ] Section block appears in "Add Block" dropdown
- [ ] Columns block appears in "Add Block" dropdown
- [ ] Can create section block
- [ ] Can create columns block
- [ ] Section block saves successfully
- [ ] Columns block saves successfully

### Layout Controls
- [ ] Container width controls work
- [ ] Padding controls work
- [ ] Margin controls work
- [ ] Background color controls work
- [ ] Custom CSS class works

### Frontend Rendering
- [ ] Section block renders on frontend
- [ ] Columns block renders on frontend
- [ ] Layout controls apply correctly
- [ ] Background colors display correctly
- [ ] Spacing appears as configured

### Responsive Design
- [ ] Desktop layout works (>1024px)
- [ ] Tablet layout works (768px-1024px)
- [ ] Mobile layout works (<768px)
- [ ] Columns stack on mobile
- [ ] All content remains accessible

### Admin Experience
- [ ] Block editors are intuitive
- [ ] Layout controls are easy to use
- [ ] Save/cancel buttons work
- [ ] Block preview shows correctly
- [ ] No console errors

---

## ✅ Success Criteria

Your implementation is successful if:

1. ✅ You can create Section and Columns blocks
2. ✅ Layout controls appear on all blocks
3. ✅ Changes save and appear on frontend
4. ✅ Responsive design works across devices
5. ✅ No errors in browser console
6. ✅ Admin UI is intuitive and easy to use

---

## 🎉 What You've Achieved

You now have a **professional-grade page builder** with:

- ✅ **8 block types** (Text, Image, Video, CTA, Cards, Page Embed, Section, Columns)
- ✅ **Layout controls** on every block (width, padding, margins, backgrounds)
- ✅ **Container blocks** for advanced layouts
- ✅ **Fully responsive** design
- ✅ **Type-safe** implementation
- ✅ **Production-ready** code

---

## 🚀 Next Steps

After successful testing:

1. **Create example pages** showcasing different layouts
2. **Train content editors** on how to use the system
3. **Optional**: Implement Phase 3 (nested block UI) for drag-and-drop
4. **Optional**: Add more block types (Grid, Tabs, Accordion)

---

## 📞 Need Help?

If you encounter issues:

1. Check browser console for errors (F12 → Console tab)
2. Review `CONTAINER_BLOCKS_SYSTEM.md` for detailed docs
3. Check `BLOCK_LAYOUT_SYSTEM.md` for layout system details
4. Verify both migrations ran in Supabase SQL Editor

---

**Happy Testing!** 🎨

Go to http://localhost:3000/admin/pages and start creating beautiful layouts!
