-- Migration 006: Add Nested Blocks Support
-- Enables container blocks (Section, Columns) to hold child blocks
-- Date: 2025-01-11

-- Add parent_block_id for hierarchical block relationships
ALTER TABLE content_blocks
ADD COLUMN IF NOT EXISTS parent_block_id UUID REFERENCES content_blocks(id) ON DELETE CASCADE;

-- Add index for faster queries of nested blocks
CREATE INDEX IF NOT EXISTS idx_blocks_parent_id ON content_blocks(parent_block_id);

-- Add index for queries that need both page and parent filters
CREATE INDEX IF NOT EXISTS idx_blocks_page_parent ON content_blocks(page_id, parent_block_id);

-- Add column comment for documentation
COMMENT ON COLUMN content_blocks.parent_block_id IS 'Parent block ID for nested blocks. NULL means top-level block. Used for Section and Columns containers.';

-- Verify the changes
SELECT
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'content_blocks'
AND column_name = 'parent_block_id';

-- Sample query to understand block hierarchy
-- Uncomment to see structure:
-- SELECT
--   b1.id as block_id,
--   b1.block_type,
--   b1.parent_block_id,
--   b2.block_type as parent_type
-- FROM content_blocks b1
-- LEFT JOIN content_blocks b2 ON b1.parent_block_id = b2.id
-- ORDER BY b1.page_id, b1.display_order;
