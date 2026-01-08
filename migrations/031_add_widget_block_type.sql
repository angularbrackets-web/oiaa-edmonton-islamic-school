-- Migration: Add widget block type
-- Adds new block type for embedding external widgets (Keela, Eventbrite, etc.)
--   - widget: Embeds third-party widgets via scripts, stylesheets, and HTML containers
--
-- The database uses a CHECK constraint (not an ENUM) for block_type validation
-- This migration updates the constraint to include the new widget block type

-- Drop the old constraint
ALTER TABLE content_blocks DROP CONSTRAINT IF EXISTS valid_block_type;

-- Add new constraint with all block types including widget
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
  'spacer',         -- Migration 023
  'divider',        -- Migration 023
  -- New in this migration
  'widget'          -- External widget embed (scripts, stylesheets, HTML)
));
