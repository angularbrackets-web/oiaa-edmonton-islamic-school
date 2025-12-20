-- Migration: Create hero_slides table
-- Phase 5: Hero Section Redesign - Content-centric slideshow

-- Create hero_slides table for the new slideshow-based hero section
CREATE TABLE IF NOT EXISTS hero_slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Slide content
  title VARCHAR(200),
  subtitle VARCHAR(500),
  description TEXT,

  -- Slide type: 'image', 'text', 'image_text'
  slide_type VARCHAR(20) NOT NULL DEFAULT 'image_text',

  -- Background settings
  background_image VARCHAR(500),
  background_color VARCHAR(50) DEFAULT '#145B55', -- deep-teal default
  background_overlay BOOLEAN DEFAULT TRUE,
  overlay_opacity DECIMAL(3,2) DEFAULT 0.50, -- 0.00 to 1.00

  -- Text styling
  text_color VARCHAR(20) DEFAULT 'white',
  text_alignment VARCHAR(20) DEFAULT 'center', -- left, center, right

  -- CTA Button (optional)
  cta_text VARCHAR(100),
  cta_link VARCHAR(500),
  cta_style VARCHAR(20) DEFAULT 'primary', -- primary, secondary, outline

  -- Secondary CTA (optional)
  cta2_text VARCHAR(100),
  cta2_link VARCHAR(500),
  cta2_style VARCHAR(20) DEFAULT 'secondary',

  -- Slide settings
  display_order INTEGER NOT NULL DEFAULT 0,
  duration INTEGER DEFAULT 5000, -- milliseconds to show before auto-advance
  is_active BOOLEAN DEFAULT TRUE,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_hero_slides_display_order ON hero_slides(display_order);
CREATE INDEX IF NOT EXISTS idx_hero_slides_active ON hero_slides(is_active);

-- Insert sample slides
INSERT INTO hero_slides (
  title, subtitle, description, slide_type, background_image,
  cta_text, cta_link, cta2_text, cta2_link, display_order, is_active
) VALUES
(
  'Welcome to Our Islamic Academy',
  'Nurturing Faith, Knowledge, and Character',
  'Providing excellence in Islamic and academic education for over 20 years',
  'image_text',
  'https://images.unsplash.com/photo-1585036156171-384164a8c675?w=1920&q=80',
  'Learn More',
  '/about',
  'Apply Now',
  '/admissions',
  0,
  TRUE
),
(
  'Excellence in Education',
  'Alberta Curriculum with Islamic Values',
  'Our students consistently achieve above provincial averages while developing strong moral foundations',
  'image_text',
  'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1920&q=80',
  'Our Programs',
  '/programs',
  'Schedule a Tour',
  '/contact',
  1,
  TRUE
),
(
  'Join Our Community',
  'Enroll for the 2025-2026 School Year',
  'Limited spaces available. Give your child the gift of a comprehensive Islamic education.',
  'image_text',
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1920&q=80',
  'Apply Now',
  '/admissions',
  'Contact Us',
  '/contact',
  2,
  TRUE
);

-- Enable RLS
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public to view active slides
CREATE POLICY "Allow public to view active slides" ON hero_slides
  FOR SELECT
  TO anon
  USING (is_active = TRUE);

-- Policy: Allow authenticated to view all slides
CREATE POLICY "Allow authenticated to view all slides" ON hero_slides
  FOR SELECT
  TO authenticated
  USING (TRUE);

-- Policy: Allow authenticated to manage slides
CREATE POLICY "Allow authenticated to insert slides" ON hero_slides
  FOR INSERT
  TO authenticated
  WITH CHECK (TRUE);

CREATE POLICY "Allow authenticated to update slides" ON hero_slides
  FOR UPDATE
  TO authenticated
  USING (TRUE);

CREATE POLICY "Allow authenticated to delete slides" ON hero_slides
  FOR DELETE
  TO authenticated
  USING (TRUE);

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_hero_slides_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS hero_slides_updated_at ON hero_slides;
CREATE TRIGGER hero_slides_updated_at
  BEFORE UPDATE ON hero_slides
  FOR EACH ROW
  EXECUTE FUNCTION update_hero_slides_updated_at();
