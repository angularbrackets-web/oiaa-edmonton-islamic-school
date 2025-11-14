-- ================================
-- QUICK FIX SCRIPT FOR NAVIGATION FEATURE
-- Run this in Supabase SQL Editor
-- ================================

-- Step 1: Verify and add is_reusable column
DO $$
BEGIN
  -- Check if column exists
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'pages'
    AND column_name = 'is_reusable'
  ) THEN
    -- Add the column
    ALTER TABLE pages ADD COLUMN is_reusable BOOLEAN DEFAULT FALSE NOT NULL;
    CREATE INDEX idx_pages_reusable ON pages(is_reusable) WHERE is_reusable = TRUE;
    COMMENT ON COLUMN pages.is_reusable IS 'When true, this page can be embedded as a reusable component in other pages';
    RAISE NOTICE 'Column is_reusable added successfully';
  ELSE
    RAISE NOTICE 'Column is_reusable already exists';
  END IF;
END $$;

-- Step 2: Verify all required tables exist
SELECT
  CASE
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'navigation_items')
    THEN '✅ navigation_items table exists'
    ELSE '❌ navigation_items table MISSING'
  END as navigation_status,

  CASE
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'pages')
    THEN '✅ pages table exists'
    ELSE '❌ pages table MISSING'
  END as pages_status,

  CASE
    WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pages' AND column_name = 'is_reusable')
    THEN '✅ is_reusable column exists'
    ELSE '❌ is_reusable column MISSING'
  END as column_status;

-- Step 3: Show data counts
SELECT
  'navigation_items' as table_name,
  COUNT(*) as row_count
FROM navigation_items
UNION ALL
SELECT
  'pages' as table_name,
  COUNT(*) as row_count
FROM pages
UNION ALL
SELECT
  'content_blocks' as table_name,
  COUNT(*) as row_count
FROM content_blocks;

-- Step 4: Show sample navigation data
SELECT
  id,
  label_en,
  href,
  level,
  is_visible,
  display_order
FROM navigation_items
ORDER BY level, display_order
LIMIT 10;

-- Success message
SELECT '✅ Database check complete! If all checks show ✅, you are ready to go!' as status;
