/**
 * Migration 015: Add Heading Block Type
 *
 * Adds 'heading' to the valid block types for page content
 * Date: 2025-12-09
 */

-- Drop the old constraint
ALTER TABLE content_blocks
DROP CONSTRAINT IF EXISTS valid_block_type;

-- Add the new constraint with heading block type
ALTER TABLE content_blocks
ADD CONSTRAINT valid_block_type CHECK (block_type IN (
  'text',
  'heading',       -- NEW: Heading block (H1-H6 with styling options)
  'image',
  'image_gallery',
  'video',
  'cards',
  'cta',
  'page_embed',
  'component',
  'section',
  'columns',
  'hero',
  'stats_grid',
  'accordion',
  'table',
  'staff_grid',
  'news_feed'
));

-- Add comments for documentation
COMMENT ON CONSTRAINT valid_block_type ON content_blocks IS
'Validates block_type values. Includes heading (H1-H6 with subtitle and divider options)';

-- Verify the constraint
SELECT
  conname as constraint_name,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'content_blocks'::regclass
AND conname = 'valid_block_type';
