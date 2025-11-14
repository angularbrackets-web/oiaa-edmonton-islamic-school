/**
 * Add is_reusable field to pages table
 *
 * This migration adds functionality to mark pages as reusable components
 * that can be embedded in other pages.
 */

-- Add is_reusable field to pages table
ALTER TABLE pages ADD COLUMN IF NOT EXISTS is_reusable BOOLEAN DEFAULT FALSE NOT NULL;

-- Add index for faster queries on reusable pages
CREATE INDEX IF NOT EXISTS idx_pages_reusable ON pages(is_reusable) WHERE is_reusable = TRUE;

-- Add comment
COMMENT ON COLUMN pages.is_reusable IS 'When true, this page can be embedded as a reusable component in other pages';

-- Example: Mark a page as reusable (optional, for testing)
-- UPDATE pages SET is_reusable = TRUE WHERE slug = 'sample-reusable-section';
