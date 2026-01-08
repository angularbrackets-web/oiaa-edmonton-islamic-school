-- Migration 030: Fix Block Styling Defaults
-- Purpose: Update all blocks to have clean defaults (no borders/shadows)
--          unless explicitly set by the user
-- Date: 2026-01-08

-- ============================================================================
-- Update blocks with NULL styling values to clean defaults
-- ============================================================================

-- Show current state before update
SELECT
  COUNT(*) as total_blocks,
  COUNT(*) FILTER (WHERE display_style IS NULL) as null_display_style,
  COUNT(*) FILTER (WHERE card_border_radius IS NULL) as null_border_radius,
  COUNT(*) FILTER (WHERE card_shadow IS NULL) as null_shadow,
  COUNT(*) FILTER (WHERE card_hover_effect IS NULL) as null_hover_effect
FROM content_blocks;

-- Update display_style to 'flat' where NULL
UPDATE content_blocks
SET display_style = 'flat'
WHERE display_style IS NULL;

-- Update card_border_radius to 'none' where NULL
UPDATE content_blocks
SET card_border_radius = 'none'
WHERE card_border_radius IS NULL;

-- Update card_shadow to 'none' where NULL
UPDATE content_blocks
SET card_shadow = 'none'
WHERE card_shadow IS NULL;

-- Update card_hover_effect to false where NULL
UPDATE content_blocks
SET card_hover_effect = false
WHERE card_hover_effect IS NULL;

-- Show results after update
SELECT
  COUNT(*) as total_blocks,
  COUNT(*) FILTER (WHERE display_style = 'flat') as flat_style,
  COUNT(*) FILTER (WHERE card_border_radius = 'none') as no_border_radius,
  COUNT(*) FILTER (WHERE card_shadow = 'none') as no_shadow,
  COUNT(*) FILTER (WHERE card_hover_effect = false) as no_hover_effect
FROM content_blocks;

-- ============================================================================
-- Verification: Show sample of updated blocks
-- ============================================================================

SELECT
  id,
  block_type,
  display_style,
  card_border_radius,
  card_shadow,
  card_hover_effect,
  CASE
    WHEN page_id IS NOT NULL THEN 'page'
    WHEN component_id IS NOT NULL THEN 'component'
    ELSE 'unknown'
  END as parent_type
FROM content_blocks
LIMIT 10;

-- ============================================================================
-- Summary Message
-- ============================================================================

DO $$
DECLARE
  total_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_count FROM content_blocks;
  RAISE NOTICE '✅ Block styling defaults fixed!';
  RAISE NOTICE '📊 Total blocks updated: %', total_count;
  RAISE NOTICE '✨ All blocks now have clean defaults (flat, no borders, no shadows)';
  RAISE NOTICE '🎨 Styling can be enabled on-demand via admin interface';
END $$;
