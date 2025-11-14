-- Verification and Fix Script
-- Run this to check and fix database issues

-- 1. Check if is_reusable column exists
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'pages' AND column_name = 'is_reusable';

-- 2. If above returns nothing, add the column:
ALTER TABLE pages ADD COLUMN IF NOT EXISTS is_reusable BOOLEAN DEFAULT FALSE NOT NULL;
CREATE INDEX IF NOT EXISTS idx_pages_reusable ON pages(is_reusable) WHERE is_reusable = TRUE;
COMMENT ON COLUMN pages.is_reusable IS 'When true, this page can be embedded as a reusable component in other pages';

-- 3. Check if navigation table has data
SELECT COUNT(*) as nav_count FROM navigation;

-- 4. Show all navigation items (if any)
SELECT id, label_en, href, level, is_visible FROM navigation ORDER BY display_order;

-- Success message
SELECT
  CASE
    WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pages' AND column_name = 'is_reusable')
    THEN '✅ is_reusable column exists'
    ELSE '❌ is_reusable column missing'
  END as migration_status,
  (SELECT COUNT(*) FROM navigation) as navigation_items;
