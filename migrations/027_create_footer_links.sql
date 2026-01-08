-- Migration: Create Footer Links Table
-- Description: Create table for managing footer navigation links dynamically
-- Date: 2026-01-07

-- Create footer_links table
CREATE TABLE IF NOT EXISTS footer_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  label VARCHAR(100) NOT NULL,
  href VARCHAR(500) NOT NULL,
  category VARCHAR(50) NOT NULL DEFAULT 'main',
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  is_external BOOLEAN NOT NULL DEFAULT false,
  open_in_new_tab BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add constraint for valid categories
ALTER TABLE footer_links
ADD CONSTRAINT valid_footer_category CHECK (
  category IN ('main', 'admissions', 'resources', 'support', 'legal')
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_footer_links_category ON footer_links(category);
CREATE INDEX IF NOT EXISTS idx_footer_links_order ON footer_links(display_order);
CREATE INDEX IF NOT EXISTS idx_footer_links_visible ON footer_links(is_visible) WHERE is_visible = true;

-- Enable Row Level Security
ALTER TABLE footer_links ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to visible footer links"
  ON footer_links
  FOR SELECT
  TO public
  USING (is_visible = true);

-- Create policies for authenticated users (admin)
CREATE POLICY "Allow authenticated users full access to footer links"
  ON footer_links
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default footer links
-- Note: Main navigation pages (Home, About Us, Programs, etc.) are NOT included
-- as they belong in the primary navigation menu, not footer
INSERT INTO footer_links (label, href, category, display_order, is_visible) VALUES
  -- Admissions
  ('Application Process', '/admissions/application', 'admissions', 1, true),
  ('Tuition & Fees', '/admissions/tuition', 'admissions', 2, true),
  ('Financial Aid', '/admissions/financial-aid', 'admissions', 3, true),
  ('School Tours', '/admissions/tours', 'admissions', 4, true),

  -- Resources
  ('Academic Calendar', '/resources/calendar', 'resources', 1, true),
  ('Parent Portal', '/resources/parent-portal', 'resources', 2, true),
  ('Student Resources', '/resources/students', 'resources', 3, true),
  ('Prayer Times', '/resources/prayer-times', 'resources', 4, true),

  -- Support
  ('Donate', '/donate', 'support', 1, true),
  ('Volunteer', '/volunteer', 'support', 2, true),
  ('Employment', '/employment', 'support', 3, true),
  ('FAQ', '/faq', 'support', 4, true),

  -- Legal (these appear at bottom)
  ('Privacy Policy', '/privacy', 'legal', 1, true),
  ('Terms of Use', '/terms', 'legal', 2, true),
  ('Accessibility', '/accessibility', 'legal', 3, true),
  ('Sitemap', '/sitemap', 'legal', 4, true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_footer_links_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER footer_links_updated_at
  BEFORE UPDATE ON footer_links
  FOR EACH ROW
  EXECUTE FUNCTION update_footer_links_updated_at();

-- Add comment to table
COMMENT ON TABLE footer_links IS 'Footer navigation links for secondary pages organized by category with display order. Main navigation pages are handled separately in the primary navigation menu.';
