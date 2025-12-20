-- Migration: Create site_settings table
-- Phase 3: Site Settings Management for Header/Footer content

-- Create site_settings table for managing configurable site content
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Setting identification
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  setting_type VARCHAR(50) DEFAULT 'text', -- text, json, boolean, number

  -- Grouping
  category VARCHAR(50) DEFAULT 'general', -- general, contact, social, hours, etc.
  label VARCHAR(200), -- Human-readable label for admin UI
  description TEXT, -- Help text for admin UI

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(setting_key);
CREATE INDEX IF NOT EXISTS idx_site_settings_category ON site_settings(category);

-- Insert default settings
INSERT INTO site_settings (setting_key, setting_value, setting_type, category, label, description) VALUES
  -- School Info
  ('school_name', 'Our Islamic Academy', 'text', 'general', 'School Name', 'The name of the school'),
  ('school_tagline', 'Excellence in Islamic Education', 'text', 'general', 'Tagline', 'Short slogan or tagline'),

  -- Contact Info
  ('contact_phone', '(780) 123-4567', 'text', 'contact', 'Phone Number', 'Main contact phone number'),
  ('contact_email', 'info@example.com', 'text', 'contact', 'General Email', 'Main contact email address'),
  ('contact_admissions_email', 'admissions@example.com', 'text', 'contact', 'Admissions Email', 'Email for admissions inquiries'),

  -- Address
  ('address_street', '123 Islamic Center Drive', 'text', 'contact', 'Street Address', 'Street address'),
  ('address_city', 'Edmonton', 'text', 'contact', 'City', 'City name'),
  ('address_province', 'AB', 'text', 'contact', 'Province', 'Province or state'),
  ('address_postal', 'T5T 0A0', 'text', 'contact', 'Postal Code', 'Postal or zip code'),
  ('address_country', 'Canada', 'text', 'contact', 'Country', 'Country name'),

  -- Hours
  ('hours_weekday', '8:00 AM - 4:00 PM', 'text', 'hours', 'Weekday Hours', 'Monday to Friday hours'),
  ('hours_saturday', '9:00 AM - 1:00 PM', 'text', 'hours', 'Saturday Hours', 'Saturday hours (if applicable)'),
  ('hours_office', '8:30 AM - 4:30 PM', 'text', 'hours', 'Office Hours', 'Administrative office hours'),

  -- Social Media
  ('social_facebook', '', 'text', 'social', 'Facebook URL', 'Facebook page URL'),
  ('social_instagram', '', 'text', 'social', 'Instagram URL', 'Instagram profile URL'),
  ('social_twitter', '', 'text', 'social', 'Twitter/X URL', 'Twitter/X profile URL'),
  ('social_youtube', '', 'text', 'social', 'YouTube URL', 'YouTube channel URL'),
  ('social_linkedin', '', 'text', 'social', 'LinkedIn URL', 'LinkedIn page URL')

ON CONFLICT (setting_key) DO NOTHING;

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public to read settings
CREATE POLICY "Allow public to read settings" ON site_settings
  FOR SELECT
  TO anon
  USING (TRUE);

-- Policy: Allow authenticated to read settings
CREATE POLICY "Allow authenticated to read settings" ON site_settings
  FOR SELECT
  TO authenticated
  USING (TRUE);

-- Policy: Allow authenticated to update settings
CREATE POLICY "Allow authenticated to update settings" ON site_settings
  FOR UPDATE
  TO authenticated
  USING (TRUE);

-- Policy: Allow authenticated to insert settings
CREATE POLICY "Allow authenticated to insert settings" ON site_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (TRUE);

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_site_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS site_settings_updated_at ON site_settings;
CREATE TRIGGER site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_site_settings_updated_at();
