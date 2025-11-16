/**
 * Reusable Components Migration
 *
 * Creates table for storing reusable component templates that can be
 * inserted into multiple pages with reference mode updates.
 *
 * Features:
 * - Component library management
 * - Block configuration storage
 * - Category and tag organization
 * - Usage analytics tracking
 * - Thumbnail support
 */

-- ============================================================================
-- 1. REUSABLE COMPONENTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS reusable_components (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Component Information
  name TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'general' NOT NULL,

  -- Block Configuration (JSONB array of block definitions)
  -- Format: [{ block_type, content, styling: { background_color, padding, etc } }]
  blocks_config JSONB NOT NULL DEFAULT '[]',

  -- Visual
  thumbnail_url TEXT,

  -- Organization
  tags TEXT[],

  -- Analytics & Tracking
  usage_count INTEGER DEFAULT 0 NOT NULL,
  last_used_at TIMESTAMPTZ,

  -- Visibility
  is_active BOOLEAN DEFAULT TRUE NOT NULL,

  -- Timestamps & Audit
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_by TEXT,
  updated_by TEXT,

  -- Constraints
  CONSTRAINT valid_category CHECK (category ~ '^[a-z0-9_-]+$'),
  CONSTRAINT valid_usage_count CHECK (usage_count >= 0)
);

-- ============================================================================
-- 2. INDEXES FOR PERFORMANCE
-- ============================================================================

-- Component lookup
CREATE INDEX IF NOT EXISTS idx_components_name ON reusable_components(name);
CREATE INDEX IF NOT EXISTS idx_components_category ON reusable_components(category);
CREATE INDEX IF NOT EXISTS idx_components_active ON reusable_components(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_components_created ON reusable_components(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_components_usage ON reusable_components(usage_count DESC);

-- Tag search (GIN index for array operations)
CREATE INDEX IF NOT EXISTS idx_components_tags ON reusable_components USING gin(tags);

-- Full-text search on name and description
CREATE INDEX IF NOT EXISTS idx_components_search
  ON reusable_components
  USING gin(to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, '')));

-- ============================================================================
-- 3. ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS
ALTER TABLE reusable_components ENABLE ROW LEVEL SECURITY;

-- Public read access to active components
CREATE POLICY "Public read access to active components"
  ON reusable_components
  FOR SELECT
  USING (is_active = TRUE);

-- Admin full access (authenticated users)
CREATE POLICY "Admin full access to components"
  ON reusable_components
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================================================
-- 4. HELPER FUNCTIONS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_component_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE TRIGGER update_components_updated_at
  BEFORE UPDATE ON reusable_components
  FOR EACH ROW
  EXECUTE FUNCTION update_component_updated_at();

-- Function to increment component usage
CREATE OR REPLACE FUNCTION increment_component_usage(component_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE reusable_components
  SET
    usage_count = usage_count + 1,
    last_used_at = NOW()
  WHERE id = component_id;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement component usage (when instance deleted)
CREATE OR REPLACE FUNCTION decrement_component_usage(component_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE reusable_components
  SET
    usage_count = GREATEST(0, usage_count - 1)
  WHERE id = component_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 5. VALIDATION FUNCTIONS
-- ============================================================================

-- Validate blocks_config structure
CREATE OR REPLACE FUNCTION validate_blocks_config(config JSONB)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if config is an array
  IF jsonb_typeof(config) != 'array' THEN
    RETURN FALSE;
  END IF;

  -- Check if each item has required fields
  IF EXISTS (
    SELECT 1
    FROM jsonb_array_elements(config) AS item
    WHERE NOT (item ? 'block_type' AND item ? 'content')
  ) THEN
    RETURN FALSE;
  END IF;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Add constraint to ensure valid blocks_config
ALTER TABLE reusable_components
  ADD CONSTRAINT valid_blocks_config
  CHECK (validate_blocks_config(blocks_config));

-- ============================================================================
-- 6. COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE reusable_components IS 'Stores reusable component templates for the CMS';
COMMENT ON COLUMN reusable_components.name IS 'Display name of the component';
COMMENT ON COLUMN reusable_components.blocks_config IS 'JSONB array of block configurations that make up this component';
COMMENT ON COLUMN reusable_components.category IS 'Component category for organization (general, header, footer, cta, etc.)';
COMMENT ON COLUMN reusable_components.usage_count IS 'Number of times this component is used across all pages';
COMMENT ON COLUMN reusable_components.is_active IS 'Whether component is available for use';

-- ============================================================================
-- 7. SAMPLE DATA (for testing)
-- ============================================================================

-- Insert sample components
INSERT INTO reusable_components (name, description, category, blocks_config, tags) VALUES
  (
    'Welcome Hero',
    'Hero section with title and CTA buttons',
    'hero',
    '[
      {
        "block_type": "hero",
        "content": {
          "title": "Welcome to Our Islamic School",
          "subtitle": "Excellence in Islamic Education",
          "alignment": "center",
          "height": "medium",
          "buttons": [
            {"text": "Learn More", "url": "/about", "style": "primary"},
            {"text": "Contact Us", "url": "/contact", "style": "secondary"}
          ]
        },
        "styling": {
          "background_color": "#2C5F4F",
          "padding": "large"
        }
      }
    ]'::jsonb,
    ARRAY['hero', 'welcome', 'homepage']
  ),
  (
    'Contact CTA',
    'Simple call-to-action for contact page',
    'cta',
    '[
      {
        "block_type": "cta",
        "content": {
          "title": "Ready to Get Started?",
          "description": "Contact us today to learn more about our programs",
          "buttons": [
            {"text": "Contact Us", "url": "/contact", "style": "primary"}
          ],
          "alignment": "center"
        },
        "styling": {
          "background_color": "#D4A574",
          "padding": "medium"
        }
      }
    ]'::jsonb,
    ARRAY['cta', 'contact']
  ),
  (
    'School Stats',
    'Statistics grid showing school achievements',
    'stats',
    '[
      {
        "block_type": "stats_grid",
        "content": {
          "stats": [
            {"number": "500+", "label": "Students", "icon": "👨‍🎓"},
            {"number": "30+", "label": "Teachers", "icon": "👨‍🏫"},
            {"number": "20+", "label": "Years", "icon": "📅"},
            {"number": "95%", "label": "Success Rate", "icon": "⭐"}
          ],
          "columns": 4
        },
        "styling": {
          "padding": "medium"
        }
      }
    ]'::jsonb,
    ARRAY['stats', 'achievements']
  )
ON CONFLICT DO NOTHING;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
