# Block Layout Migration Instructions

## Quick Migration via Supabase Dashboard

### Step 1: Open Supabase SQL Editor
1. Go to https://app.supabase.com
2. Select your project for `oiaaedmonton.ca`
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**

### Step 2: Run Migration SQL

Copy and paste the following SQL and click **Run**:

```sql
-- Migration 005: Add Block Layout Fields
-- Adds comprehensive layout control to content blocks
-- Date: 2025-01-10

-- Add layout fields to content_blocks table
ALTER TABLE content_blocks
ADD COLUMN IF NOT EXISTS container_width TEXT CHECK (container_width IN ('narrow', 'contained', 'wide', 'full')),
ADD COLUMN IF NOT EXISTS margin_top TEXT CHECK (margin_top IN ('none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl')),
ADD COLUMN IF NOT EXISTS margin_bottom TEXT CHECK (margin_bottom IN ('none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'));

-- Add indexes for performance (optional but recommended)
CREATE INDEX IF NOT EXISTS idx_blocks_container_width ON content_blocks(container_width);

-- Add column comments for documentation
COMMENT ON COLUMN content_blocks.container_width IS 'Maximum width constraint: narrow (768px), contained (1152px), wide (1280px), full (100%)';
COMMENT ON COLUMN content_blocks.margin_top IS 'Top margin spacing: none, xs (16px), sm (24px), md (32px), lg (48px), xl (64px), 2xl (96px)';
COMMENT ON COLUMN content_blocks.margin_bottom IS 'Bottom margin spacing: none, xs (16px), sm (24px), md (32px), lg (48px), xl (64px), 2xl (96px)';
```

### Step 3: Verify Migration

Run this verification query:

```sql
SELECT
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'content_blocks'
AND column_name IN ('container_width', 'margin_top', 'margin_bottom')
ORDER BY column_name;
```

**Expected Result:**
You should see 3 rows:
- `container_width` | `text` | `YES`
- `margin_bottom` | `text` | `YES`
- `margin_top` | `text` | `YES`

## ✅ Done!

Once you see the 3 columns in the verification query, the migration is complete!

The admin UI will now display layout controls when editing blocks.
