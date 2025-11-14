-- Migration 007: Add Card Display Styles
-- Adds display style options for blocks (flat, card, featured)
-- Makes cards the default display mode for better visual hierarchy

-- Add display style columns to content_blocks
ALTER TABLE content_blocks
ADD COLUMN IF NOT EXISTS display_style VARCHAR(20) DEFAULT 'card'
  CHECK (display_style IN ('flat', 'card', 'featured')),
ADD COLUMN IF NOT EXISTS card_border_color VARCHAR(50) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS card_border_radius VARCHAR(20) DEFAULT 'medium'
  CHECK (card_border_radius IN ('none', 'small', 'medium', 'large')),
ADD COLUMN IF NOT EXISTS card_shadow VARCHAR(20) DEFAULT 'subtle'
  CHECK (card_shadow IN ('none', 'subtle', 'medium', 'strong')),
ADD COLUMN IF NOT EXISTS card_hover_effect BOOLEAN DEFAULT false;

-- Update existing blocks to use 'card' display style
UPDATE content_blocks
SET display_style = 'card'
WHERE display_style IS NULL;

-- Add index for performance (display_style is frequently queried)
CREATE INDEX IF NOT EXISTS idx_blocks_display_style
ON content_blocks(display_style);

-- Add comments for documentation
COMMENT ON COLUMN content_blocks.display_style IS 'Visual display mode: flat (no card), card (default with border/shadow), featured (elevated card)';
COMMENT ON COLUMN content_blocks.card_border_color IS 'Custom border color for card display (hex or color name)';
COMMENT ON COLUMN content_blocks.card_border_radius IS 'Corner rounding: none, small, medium (default), large';
COMMENT ON COLUMN content_blocks.card_shadow IS 'Shadow depth: none, subtle (default), medium, strong';
COMMENT ON COLUMN content_blocks.card_hover_effect IS 'Enable hover animation effects for cards';
