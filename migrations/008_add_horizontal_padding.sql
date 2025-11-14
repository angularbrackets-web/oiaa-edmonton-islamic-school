-- Migration 008: Add Horizontal Padding Control
-- Adds padding_horizontal field to enable separate horizontal padding control
-- Complements existing padding field (which is vertical-only)

-- Add horizontal padding column
ALTER TABLE content_blocks
ADD COLUMN IF NOT EXISTS padding_horizontal VARCHAR(20) DEFAULT 'medium'
  CHECK (padding_horizontal IN ('none', 'small', 'medium', 'large'));

-- Set default to medium for existing blocks
UPDATE content_blocks
SET padding_horizontal = 'medium'
WHERE padding_horizontal IS NULL;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_blocks_padding_horizontal
ON content_blocks(padding_horizontal);

-- Update comment to clarify padding vs padding_horizontal
COMMENT ON COLUMN content_blocks.padding IS 'Vertical padding (top/bottom): none, small, medium, large';
COMMENT ON COLUMN content_blocks.padding_horizontal IS 'Horizontal padding (left/right): none, small, medium, large';
