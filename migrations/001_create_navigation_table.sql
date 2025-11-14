-- Migration: Create Navigation System Tables
-- Description: Dynamic navigation menu with bilingual support and hierarchy
-- Author: CMS Admin Specialist Agent
-- Date: 2025-11-09

-- ============================================================================
-- FORWARD MIGRATION
-- ============================================================================

-- Create navigation_items table
CREATE TABLE IF NOT EXISTS navigation_items (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Basic Information (Bilingual)
  label_en TEXT NOT NULL,
  label_ar TEXT,
  href TEXT NOT NULL,
  icon TEXT,

  -- Hierarchy & Ordering
  level INTEGER NOT NULL CHECK (level IN (1, 2)),
  parent_id UUID REFERENCES navigation_items(id) ON DELETE CASCADE,
  display_order INTEGER DEFAULT 0 NOT NULL,

  -- Visibility Controls
  is_visible BOOLEAN DEFAULT TRUE NOT NULL,
  is_featured BOOLEAN DEFAULT FALSE NOT NULL,

  -- Optional Descriptions (for mega-menu)
  description_en TEXT,
  description_ar TEXT,

  -- SEO Metadata
  page_title_en TEXT,
  page_title_ar TEXT,
  meta_description_en TEXT,
  meta_description_ar TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Constraints
  CONSTRAINT valid_href CHECK (href ~ '^(/|https?://)'),
  CONSTRAINT valid_hierarchy CHECK (
    (level = 1 AND parent_id IS NULL) OR
    (level = 2 AND parent_id IS NOT NULL)
  ),
  CONSTRAINT unique_href UNIQUE (href)
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Index for parent-child queries
CREATE INDEX IF NOT EXISTS idx_navigation_parent
ON navigation_items(parent_id)
WHERE parent_id IS NOT NULL;

-- Index for ordering queries
CREATE INDEX IF NOT EXISTS idx_navigation_order
ON navigation_items(display_order);

-- Index for visibility filtering
CREATE INDEX IF NOT EXISTS idx_navigation_visible
ON navigation_items(is_visible)
WHERE is_visible = TRUE;

-- Index for level filtering
CREATE INDEX IF NOT EXISTS idx_navigation_level
ON navigation_items(level);

-- Composite index for common query pattern (visible items ordered)
CREATE INDEX IF NOT EXISTS idx_navigation_visible_order
ON navigation_items(is_visible, level, display_order);

-- Index for featured items
CREATE INDEX IF NOT EXISTS idx_navigation_featured
ON navigation_items(is_featured)
WHERE is_featured = TRUE;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_navigation_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call update function before updates
DROP TRIGGER IF EXISTS navigation_updated_at ON navigation_items;
CREATE TRIGGER navigation_updated_at
  BEFORE UPDATE ON navigation_items
  FOR EACH ROW
  EXECUTE FUNCTION update_navigation_updated_at();

-- Function to auto-generate page titles if not provided
CREATE OR REPLACE FUNCTION generate_navigation_page_titles()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-generate English page title if not provided
  IF NEW.page_title_en IS NULL OR NEW.page_title_en = '' THEN
    NEW.page_title_en := NEW.label_en || ' - OIA Academy Edmonton';
  END IF;

  -- Auto-generate Arabic page title if Arabic label exists
  IF NEW.label_ar IS NOT NULL AND NEW.label_ar != '' THEN
    IF NEW.page_title_ar IS NULL OR NEW.page_title_ar = '' THEN
      NEW.page_title_ar := NEW.label_ar || ' - أكاديمية عمر بن الخطاب إدمنتون';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to generate page titles on insert/update
DROP TRIGGER IF EXISTS navigation_generate_titles ON navigation_items;
CREATE TRIGGER navigation_generate_titles
  BEFORE INSERT OR UPDATE ON navigation_items
  FOR EACH ROW
  EXECUTE FUNCTION generate_navigation_page_titles();

-- Function to prevent orphaned children when deleting parent
CREATE OR REPLACE FUNCTION check_navigation_children()
RETURNS TRIGGER AS $$
DECLARE
  child_count INTEGER;
BEGIN
  -- Check if item has children
  SELECT COUNT(*) INTO child_count
  FROM navigation_items
  WHERE parent_id = OLD.id;

  -- If has children, cascade delete will handle it
  -- This is just for logging/notification purposes
  IF child_count > 0 THEN
    RAISE NOTICE 'Deleting navigation item % with % children', OLD.label_en, child_count;
  END IF;

  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Trigger to check children before deletion
DROP TRIGGER IF EXISTS navigation_check_children ON navigation_items;
CREATE TRIGGER navigation_check_children
  BEFORE DELETE ON navigation_items
  FOR EACH ROW
  EXECUTE FUNCTION check_navigation_children();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on the table
ALTER TABLE navigation_items ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read visible navigation items
CREATE POLICY "Public read access to visible navigation"
  ON navigation_items
  FOR SELECT
  USING (is_visible = TRUE);

-- Policy: Authenticated users (admins) can read all items
CREATE POLICY "Admin read access to all navigation"
  ON navigation_items
  FOR SELECT
  TO authenticated
  USING (TRUE);

-- Policy: Authenticated users (admins) can insert
CREATE POLICY "Admin insert access"
  ON navigation_items
  FOR INSERT
  TO authenticated
  WITH CHECK (TRUE);

-- Policy: Authenticated users (admins) can update
CREATE POLICY "Admin update access"
  ON navigation_items
  FOR UPDATE
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

-- Policy: Authenticated users (admins) can delete
CREATE POLICY "Admin delete access"
  ON navigation_items
  FOR DELETE
  TO authenticated
  USING (TRUE);

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to get navigation tree structure
CREATE OR REPLACE FUNCTION get_navigation_tree()
RETURNS TABLE (
  id UUID,
  label_en TEXT,
  label_ar TEXT,
  href TEXT,
  icon TEXT,
  display_order INTEGER,
  is_featured BOOLEAN,
  children JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    n.id,
    n.label_en,
    n.label_ar,
    n.href,
    n.icon,
    n.display_order,
    n.is_featured,
    COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', c.id,
            'label_en', c.label_en,
            'label_ar', c.label_ar,
            'href', c.href,
            'icon', c.icon,
            'display_order', c.display_order,
            'is_featured', c.is_featured
          ) ORDER BY c.display_order
        )
        FROM navigation_items c
        WHERE c.parent_id = n.id AND c.is_visible = TRUE
      ),
      '[]'::jsonb
    ) AS children
  FROM navigation_items n
  WHERE n.level = 1 AND n.is_visible = TRUE
  ORDER BY n.display_order;
END;
$$ LANGUAGE plpgsql;

-- Function to reorder navigation items
CREATE OR REPLACE FUNCTION reorder_navigation_items(
  item_ids UUID[],
  new_orders INTEGER[]
)
RETURNS VOID AS $$
DECLARE
  i INTEGER;
BEGIN
  -- Validate arrays have same length
  IF array_length(item_ids, 1) != array_length(new_orders, 1) THEN
    RAISE EXCEPTION 'item_ids and new_orders must have same length';
  END IF;

  -- Update display orders
  FOR i IN 1..array_length(item_ids, 1) LOOP
    UPDATE navigation_items
    SET display_order = new_orders[i]
    WHERE id = item_ids[i];
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- COMMENTS (Documentation)
-- ============================================================================

COMMENT ON TABLE navigation_items IS 'Dynamic navigation menu system with bilingual support and two-level hierarchy';
COMMENT ON COLUMN navigation_items.level IS 'Menu level: 1=top-level, 2=sub-menu';
COMMENT ON COLUMN navigation_items.parent_id IS 'Reference to parent menu item (NULL for top-level)';
COMMENT ON COLUMN navigation_items.display_order IS 'Sort order within same level (lower numbers first)';
COMMENT ON COLUMN navigation_items.is_visible IS 'Show/hide menu item in navigation';
COMMENT ON COLUMN navigation_items.is_featured IS 'Highlight menu item with special styling';
COMMENT ON COLUMN navigation_items.href IS 'URL path (must start with / or http(s)://)';

-- ============================================================================
-- ROLLBACK SCRIPT (Run this to undo migration)
-- ============================================================================

/*
-- Drop RLS policies
DROP POLICY IF EXISTS "Public read access to visible navigation" ON navigation_items;
DROP POLICY IF EXISTS "Admin read access to all navigation" ON navigation_items;
DROP POLICY IF EXISTS "Admin insert access" ON navigation_items;
DROP POLICY IF EXISTS "Admin update access" ON navigation_items;
DROP POLICY IF EXISTS "Admin delete access" ON navigation_items;

-- Drop triggers
DROP TRIGGER IF EXISTS navigation_updated_at ON navigation_items;
DROP TRIGGER IF EXISTS navigation_generate_titles ON navigation_items;
DROP TRIGGER IF EXISTS navigation_check_children ON navigation_items;

-- Drop functions
DROP FUNCTION IF EXISTS update_navigation_updated_at();
DROP FUNCTION IF EXISTS generate_navigation_page_titles();
DROP FUNCTION IF EXISTS check_navigation_children();
DROP FUNCTION IF EXISTS get_navigation_tree();
DROP FUNCTION IF EXISTS reorder_navigation_items(UUID[], INTEGER[]);

-- Drop indexes
DROP INDEX IF EXISTS idx_navigation_parent;
DROP INDEX IF EXISTS idx_navigation_order;
DROP INDEX IF EXISTS idx_navigation_visible;
DROP INDEX IF EXISTS idx_navigation_level;
DROP INDEX IF EXISTS idx_navigation_visible_order;
DROP INDEX IF EXISTS idx_navigation_featured;

-- Drop table
DROP TABLE IF EXISTS navigation_items CASCADE;
*/
