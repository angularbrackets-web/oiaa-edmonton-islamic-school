/**
 * Add 'cards' block type to content_blocks table
 *
 * This migration updates the valid_block_type constraint to include 'cards'
 * as a valid block type for the CMS page builder.
 */

-- Drop the existing constraint
ALTER TABLE content_blocks DROP CONSTRAINT IF EXISTS valid_block_type;

-- Add the updated constraint with 'cards' included
ALTER TABLE content_blocks ADD CONSTRAINT valid_block_type CHECK (block_type IN (
  'text', 'image', 'image_gallery', 'video', 'cards', 'cta', 'hero',
  'stats_grid', 'accordion', 'table', 'staff_grid', 'news_feed'
));

-- Add comment
COMMENT ON CONSTRAINT valid_block_type ON content_blocks IS 'Ensures block_type is one of the supported block types including cards';
