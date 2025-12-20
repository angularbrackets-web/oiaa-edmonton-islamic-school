-- Migration: Create home_sections table
-- Phase 4: Home Page CMS with section ordering

-- Create home_sections table to manage homepage section order and visibility
CREATE TABLE IF NOT EXISTS home_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Section identification
  section_id VARCHAR(50) UNIQUE NOT NULL, -- e.g., 'hero', 'news', 'about', 'contact'
  section_name VARCHAR(100) NOT NULL, -- Display name
  section_type VARCHAR(50) NOT NULL, -- Component name

  -- Ordering and visibility
  display_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN DEFAULT TRUE,

  -- Section configuration (JSONB for flexibility)
  config JSONB DEFAULT '{}',

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for ordering queries
CREATE INDEX IF NOT EXISTS idx_home_sections_display_order ON home_sections(display_order);
CREATE INDEX IF NOT EXISTS idx_home_sections_visible ON home_sections(is_visible);

-- Insert default sections based on current home page
INSERT INTO home_sections (section_id, section_name, section_type, display_order, is_visible, config) VALUES
  ('hero', 'Hero Section', 'Hero', 0, TRUE, '{"description": "Main hero section with achievements carousel"}'),
  ('news', 'News & Events', 'News', 1, TRUE, '{"background": "diagonal", "colors": ["emerald-800", "teal-900", "rose-800", "red-900"]}'),
  ('about', 'About Us', 'About', 2, TRUE, '{"description": "School mission, vision, and statistics"}'),
  ('contact', 'Contact & Visit', 'Contact', 3, TRUE, '{"background": "diagonal", "colors": ["red-900", "red-800", "red-800", "red-700"]}')
ON CONFLICT (section_id) DO NOTHING;

-- Enable RLS
ALTER TABLE home_sections ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public to view visible sections
CREATE POLICY "Allow public to view visible sections" ON home_sections
  FOR SELECT
  TO anon
  USING (is_visible = TRUE);

-- Policy: Allow authenticated users to view all sections
CREATE POLICY "Allow authenticated to view all sections" ON home_sections
  FOR SELECT
  TO authenticated
  USING (TRUE);

-- Policy: Allow authenticated users to update sections
CREATE POLICY "Allow authenticated to update sections" ON home_sections
  FOR UPDATE
  TO authenticated
  USING (TRUE);

-- Policy: Allow authenticated users to insert sections
CREATE POLICY "Allow authenticated to insert sections" ON home_sections
  FOR INSERT
  TO authenticated
  WITH CHECK (TRUE);

-- Policy: Allow authenticated users to delete sections
CREATE POLICY "Allow authenticated to delete sections" ON home_sections
  FOR DELETE
  TO authenticated
  USING (TRUE);

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_home_sections_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS home_sections_updated_at ON home_sections;
CREATE TRIGGER home_sections_updated_at
  BEFORE UPDATE ON home_sections
  FOR EACH ROW
  EXECUTE FUNCTION update_home_sections_updated_at();
