-- Migration: Add component support to home_sections
-- Allow home sections to reference reusable components

-- Add component_id column to reference the reusable_components table
ALTER TABLE home_sections
ADD COLUMN IF NOT EXISTS component_id UUID REFERENCES reusable_components(id) ON DELETE CASCADE;

-- Create index for component lookups
CREATE INDEX IF NOT EXISTS idx_home_sections_component_id ON home_sections(component_id);

-- Update the section_id column to allow NULL (when using component_id instead)
ALTER TABLE home_sections
ALTER COLUMN section_id DROP NOT NULL;

-- Drop the unique constraint on section_id to allow multiple instances
-- of the same component on the home page
ALTER TABLE home_sections
DROP CONSTRAINT IF EXISTS home_sections_section_id_key;

-- Add a comment explaining the dual approach
COMMENT ON COLUMN home_sections.section_id IS 'Legacy section identifier (e.g., hero, news). Use component_id for new components.';
COMMENT ON COLUMN home_sections.component_id IS 'Reference to reusable component. If set, this overrides section_id.';
