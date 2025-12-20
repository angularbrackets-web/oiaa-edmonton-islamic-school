-- Migration: Update block_type CHECK constraint to include all block types
-- Fixes issue where Map, Documents, and other new block types couldn't be created
--
-- The database uses a CHECK constraint (not an ENUM) for block_type validation
-- This migration updates the constraint to include all block types

-- Drop the old constraint
ALTER TABLE content_blocks DROP CONSTRAINT IF EXISTS valid_block_type;

-- Add new constraint with all block types
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
  'map',            -- This migration
  'documents'       -- This migration
));
