-- Migration: Add spacer and divider block types
-- Adds new block types for layout control:
--   - spacer: Vertical spacing between blocks
--   - divider: Visual separator line with styling options
--
-- The database uses a CHECK constraint (not an ENUM) for block_type validation
-- This migration updates the constraint to include the new block types

-- Drop the old constraint
ALTER TABLE content_blocks DROP CONSTRAINT IF EXISTS valid_block_type;

-- Add new constraint with all block types including spacer and divider
ALTER TABLE content_blocks ADD CONSTRAINT valid_block_type CHECK (block_type IN (
  -- Original block types
  'text',
  'heading',
  'image',
  'image_gallery',
  'video',
  'cta',
  'hero',
  'stats_grid',
  'accordion',
  'table',
  'staff_grid',
  'news_feed',
  -- Added in migrations
  'cards',          -- Migration 003
  'page_embed',     -- Migration 012
  'component',      -- Migration 012
  'section',        -- For grouping blocks
  'columns',        -- For multi-column layouts
  'form',           -- Migration 017
  'map',            -- Migration 019
  'documents',      -- Migration 019
  -- New in this migration
  'spacer',         -- Vertical spacing between blocks
  'divider'         -- Visual separator line
));
