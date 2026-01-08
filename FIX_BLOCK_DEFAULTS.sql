-- ============================================================================
-- Fix Block Styling Defaults - Quick Version
-- ============================================================================
-- Run this in Supabase SQL Editor to fix all existing blocks
-- Sets clean defaults: flat style, no borders, no shadows
-- ============================================================================

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

-- ============================================================================
-- Done! All blocks now have clean defaults.
-- ============================================================================
