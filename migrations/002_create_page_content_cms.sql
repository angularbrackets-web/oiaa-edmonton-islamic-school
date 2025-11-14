/**
 * Page Content CMS Migration
 *
 * Creates tables for block-based page builder system:
 * - pages: Page metadata and settings
 * - content_blocks: Individual content blocks (text, images, CTAs, etc.)
 * - media_library: Centralized media management
 *
 * Features:
 * - Dynamic page content management
 * - Block-based editing
 * - Media reusability
 * - Draft/publish workflow
 * - SEO optimization
 */

-- ============================================================================
-- 1. PAGES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Basic Information
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  meta_description TEXT,

  -- Navigation Integration
  navigation_id UUID REFERENCES navigation_items(id) ON DELETE SET NULL,

  -- Template & Layout
  template_type TEXT DEFAULT 'standard' NOT NULL,
  -- Options: 'standard', 'landing', 'gallery', 'full_width'

  -- Publishing Workflow
  status TEXT DEFAULT 'draft' NOT NULL,
  -- Options: 'draft', 'published', 'archived'
  is_published BOOLEAN DEFAULT FALSE NOT NULL,
  published_at TIMESTAMPTZ,

  -- Bilingual Support
  title_ar TEXT,
  meta_description_ar TEXT,

  -- SEO
  og_image TEXT,
  keywords TEXT[],

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_by TEXT,
  updated_by TEXT,

  -- Constraints
  CONSTRAINT valid_slug CHECK (slug ~ '^[a-z0-9/\-]+$'),
  CONSTRAINT valid_status CHECK (status IN ('draft', 'published', 'archived')),
  CONSTRAINT valid_template CHECK (template_type IN ('standard', 'landing', 'gallery', 'full_width'))
);

-- ============================================================================
-- 2. CONTENT BLOCKS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS content_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relationship
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,

  -- Block Type & Content
  block_type TEXT NOT NULL,
  -- Options: 'text', 'image', 'image_gallery', 'video', 'cta', 'hero',
  --          'stats_grid', 'accordion', 'table', 'staff_grid', 'news_feed'

  -- Flexible JSON content storage
  content JSONB NOT NULL DEFAULT '{}',
  -- Structure varies by block_type, examples:
  -- text: { "html": "<p>Content</p>", "alignment": "left" }
  -- image: { "url": "/img.jpg", "alt": "...", "caption": "..." }
  -- cta: { "title": "...", "buttons": [{...}] }

  -- Bilingual Content
  content_ar JSONB,

  -- Display & Ordering
  display_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN DEFAULT TRUE NOT NULL,

  -- Styling Options
  background_color TEXT,
  padding TEXT, -- 'none', 'small', 'medium', 'large'
  custom_css_class TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Constraints
  CONSTRAINT valid_block_type CHECK (block_type IN (
    'text', 'image', 'image_gallery', 'video', 'cta', 'hero',
    'stats_grid', 'accordion', 'table', 'staff_grid', 'news_feed'
  )),
  CONSTRAINT valid_padding CHECK (padding IS NULL OR padding IN ('none', 'small', 'medium', 'large'))
);

-- ============================================================================
-- 3. MEDIA LIBRARY TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS media_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- File Information
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  url TEXT NOT NULL UNIQUE,

  -- File Metadata
  type TEXT NOT NULL, -- 'image', 'video', 'document', 'audio'
  mime_type TEXT NOT NULL,
  size_bytes INTEGER NOT NULL,

  -- Image-specific
  width INTEGER,
  height INTEGER,

  -- Descriptive
  alt_text TEXT,
  caption TEXT,
  title TEXT,

  -- Organization
  folder TEXT DEFAULT 'uploads',
  tags TEXT[],

  -- Usage Tracking
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMPTZ,

  -- Timestamps
  uploaded_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  uploaded_by TEXT,

  -- Constraints
  CONSTRAINT valid_type CHECK (type IN ('image', 'video', 'document', 'audio')),
  CONSTRAINT positive_size CHECK (size_bytes > 0)
);

-- ============================================================================
-- 4. INDEXES FOR PERFORMANCE
-- ============================================================================

-- Pages indexes
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_status ON pages(status);
CREATE INDEX IF NOT EXISTS idx_pages_published ON pages(is_published) WHERE is_published = TRUE;
CREATE INDEX IF NOT EXISTS idx_pages_navigation ON pages(navigation_id);
CREATE INDEX IF NOT EXISTS idx_pages_created ON pages(created_at DESC);

-- Content blocks indexes
CREATE INDEX IF NOT EXISTS idx_blocks_page ON content_blocks(page_id);
CREATE INDEX IF NOT EXISTS idx_blocks_type ON content_blocks(block_type);
CREATE INDEX IF NOT EXISTS idx_blocks_order ON content_blocks(page_id, display_order);
CREATE INDEX IF NOT EXISTS idx_blocks_visible ON content_blocks(page_id, is_visible) WHERE is_visible = TRUE;

-- Media library indexes
CREATE INDEX IF NOT EXISTS idx_media_type ON media_library(type);
CREATE INDEX IF NOT EXISTS idx_media_folder ON media_library(folder);
CREATE INDEX IF NOT EXISTS idx_media_tags ON media_library USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_media_uploaded ON media_library(uploaded_at DESC);

-- ============================================================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;

-- Public read access to published pages
CREATE POLICY "Public read access to published pages"
  ON pages
  FOR SELECT
  USING (is_published = TRUE AND status = 'published');

-- Public read access to visible blocks of published pages
CREATE POLICY "Public read access to visible blocks"
  ON content_blocks
  FOR SELECT
  USING (
    is_visible = TRUE
    AND EXISTS (
      SELECT 1 FROM pages
      WHERE pages.id = content_blocks.page_id
      AND pages.is_published = TRUE
      AND pages.status = 'published'
    )
  );

-- Public read access to media library
CREATE POLICY "Public read access to media"
  ON media_library
  FOR SELECT
  USING (TRUE);

-- Admin full access to pages (authenticated users)
CREATE POLICY "Admin full access to pages"
  ON pages
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Admin full access to blocks
CREATE POLICY "Admin full access to blocks"
  ON content_blocks
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Admin full access to media
CREATE POLICY "Admin full access to media"
  ON media_library
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================================================
-- 6. HELPER FUNCTIONS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_pages_updated_at
  BEFORE UPDATE ON pages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blocks_updated_at
  BEFORE UPDATE ON content_blocks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to auto-set published_at when status changes to published
CREATE OR REPLACE FUNCTION set_published_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_published = TRUE AND OLD.is_published = FALSE THEN
    NEW.published_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_page_published_at
  BEFORE UPDATE ON pages
  FOR EACH ROW
  EXECUTE FUNCTION set_published_at();

-- Function to increment media usage count
CREATE OR REPLACE FUNCTION increment_media_usage(media_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE media_library
  SET
    usage_count = usage_count + 1,
    last_used_at = NOW()
  WHERE id = media_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 7. COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE pages IS 'Stores page metadata and settings for CMS-managed pages';
COMMENT ON TABLE content_blocks IS 'Individual content blocks that make up page content';
COMMENT ON TABLE media_library IS 'Centralized media file management and tracking';

COMMENT ON COLUMN pages.slug IS 'URL-friendly page identifier (e.g., about/mission-vision)';
COMMENT ON COLUMN pages.template_type IS 'Page layout template to use for rendering';
COMMENT ON COLUMN pages.status IS 'Publishing workflow status';
COMMENT ON COLUMN pages.navigation_id IS 'Optional link to navigation menu item';

COMMENT ON COLUMN content_blocks.block_type IS 'Type of content block (text, image, cta, etc.)';
COMMENT ON COLUMN content_blocks.content IS 'JSONB storage for flexible block-specific content';
COMMENT ON COLUMN content_blocks.display_order IS 'Order in which blocks appear on page (0-indexed)';

COMMENT ON COLUMN media_library.usage_count IS 'Number of times media is referenced in content';
COMMENT ON COLUMN media_library.folder IS 'Organization folder (e.g., images/staff, documents/policies)';

-- ============================================================================
-- 8. SAMPLE DATA (for testing)
-- ============================================================================

-- Insert a sample page
INSERT INTO pages (slug, title, meta_description, status, is_published, template_type)
VALUES
  ('sample-cms-page', 'Sample CMS Page', 'This is a test page created by the CMS', 'published', TRUE, 'standard')
ON CONFLICT (slug) DO NOTHING;

-- Get the page ID for block insertion
DO $$
DECLARE
  sample_page_id UUID;
BEGIN
  SELECT id INTO sample_page_id FROM pages WHERE slug = 'sample-cms-page';

  -- Insert sample blocks
  INSERT INTO content_blocks (page_id, block_type, content, display_order) VALUES
    (sample_page_id, 'text',
     '{"html": "<h2>Welcome to the CMS</h2><p>This page is managed through the content management system. You can edit this text from the admin panel.</p>"}',
     0),
    (sample_page_id, 'image',
     '{"url": "/placeholder.jpg", "alt": "Sample image", "caption": "This is a sample image block"}',
     1),
    (sample_page_id, 'cta',
     '{"title": "Ready to Get Started?", "description": "Learn more about our programs", "buttons": [{"text": "Contact Us", "url": "/contact"}]}',
     2)
  ON CONFLICT DO NOTHING;
END $$;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
