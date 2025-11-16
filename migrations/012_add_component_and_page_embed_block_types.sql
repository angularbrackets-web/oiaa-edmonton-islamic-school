/**
 * Migration 012: Add Component and Page Embed Block Types
 *
 * Adds 'component' and 'page_embed' to the valid block types
 * Date: 2025-01-16
 */

-- Drop the old constraint
ALTER TABLE content_blocks
DROP CONSTRAINT IF EXISTS valid_block_type;

-- Add the new constraint with additional block types
ALTER TABLE content_blocks
ADD CONSTRAINT valid_block_type CHECK (block_type IN (
  'text',
  'image',
  'image_gallery',
  'video',
  'cards',
  'cta',
  'page_embed',    -- NEW: Embed reusable pages
  'component',     -- NEW: Embed reusable components from library
  'section',       -- Container: Groups blocks with shared styling
  'columns',       -- Container: Multi-column layouts
  'hero',
  'stats_grid',
  'accordion',
  'table',
  'staff_grid',
  'news_feed'
));

-- Add comments for documentation
COMMENT ON CONSTRAINT valid_block_type ON content_blocks IS
'Validates block_type values. New types: component (reusable component from library), page_embed (embed reusable pages)';

-- Verify the constraint
SELECT
  conname as constraint_name,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'content_blocks'::regclass
AND conname = 'valid_block_type';
