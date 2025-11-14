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

-- Verify the changes
SELECT
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'content_blocks'
AND column_name IN ('container_width', 'margin_top', 'margin_bottom')
ORDER BY column_name;
