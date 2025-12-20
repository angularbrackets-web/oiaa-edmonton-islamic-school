-- Migration: Add column_index to content_blocks table
-- Purpose: Allow blocks inside a columns container to be assigned to specific columns
-- Date: 2024-12-20

-- Add column_index field to content_blocks table
-- This is a nullable integer that specifies which column (0-indexed) a block belongs to
-- NULL means the block should be auto-distributed across columns (legacy behavior)
ALTER TABLE content_blocks
ADD COLUMN IF NOT EXISTS column_index INTEGER DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN content_blocks.column_index IS
  'Zero-based column index for blocks inside a columns container. NULL means auto-distribute (legacy behavior).';

-- Create index for efficient querying of blocks by parent and column
-- This helps when rendering column layouts
CREATE INDEX IF NOT EXISTS idx_content_blocks_parent_column
ON content_blocks(parent_block_id, column_index)
WHERE parent_block_id IS NOT NULL;

-- Verification query (run manually to verify migration)
-- SELECT column_name, data_type, is_nullable, column_default
-- FROM information_schema.columns
-- WHERE table_name = 'content_blocks' AND column_name = 'column_index';
