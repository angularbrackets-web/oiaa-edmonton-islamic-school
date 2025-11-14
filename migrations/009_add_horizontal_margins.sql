-- Migration 009: Add Horizontal Margins (Edge Spacing)
-- Adds margin_horizontal field to control spacing from left and right edges
-- Prevents cards from sticking to browser edges

-- Add horizontal margin column
ALTER TABLE content_blocks
ADD COLUMN IF NOT EXISTS margin_horizontal VARCHAR(20) DEFAULT 'none'
  CHECK (margin_horizontal IN ('none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'));

-- Set default to none for existing blocks (existing behavior)
UPDATE content_blocks
SET margin_horizontal = 'none'
WHERE margin_horizontal IS NULL;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_blocks_margin_horizontal
ON content_blocks(margin_horizontal);

-- Update comments for clarity
COMMENT ON COLUMN content_blocks.margin_top IS 'Top margin: none, xs, sm, md, lg, xl, 2xl';
COMMENT ON COLUMN content_blocks.margin_bottom IS 'Bottom margin: none, xs, sm, md, lg, xl, 2xl';
COMMENT ON COLUMN content_blocks.margin_horizontal IS 'Left & Right margins (Edge Spacing): none, xs, sm, md, lg, xl, 2xl';
