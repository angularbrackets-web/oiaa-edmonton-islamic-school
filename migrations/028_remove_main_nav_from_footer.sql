-- Migration: Remove Main Navigation Pages from Footer Links
-- Description: Remove primary navigation pages (Home, About Us, Programs, Admissions, Contact) from footer
-- Date: 2026-01-07

-- Delete main navigation pages from footer links
DELETE FROM footer_links
WHERE href IN ('/', '/about-us', '/programs', '/admissions', '/contact')
  AND category = 'main';

-- Add comment
COMMENT ON TABLE footer_links IS 'Footer navigation links for secondary pages organized by category with display order. Main navigation pages are handled separately in the primary navigation menu.';
