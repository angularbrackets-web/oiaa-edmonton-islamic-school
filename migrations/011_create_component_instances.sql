/**
 * Component Instances Migration
 *
 * Creates tracking table for component instances that links reusable
 * components to their usage across pages. Enables reference mode where
 * updating a component automatically updates all instances.
 *
 * Features:
 * - Instance tracking
 * - Reference mode support
 * - Per-instance overrides
 * - Cascade deletion
 * - Usage analytics
 */

-- ============================================================================
-- 1. COMPONENT INSTANCES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS component_instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relationships
  component_id UUID NOT NULL REFERENCES reusable_components(id) ON DELETE CASCADE,
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,

  -- Position & Ordering
  display_order INTEGER DEFAULT 0 NOT NULL,

  -- Instance Customization
  -- Allows per-instance overrides without breaking reference link
  -- Example: { "background_color": "#custom", "padding": "large" }
  overrides JSONB DEFAULT '{}'::jsonb,

  -- Instance Metadata
  instance_name TEXT, -- Optional friendly name for this instance

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  last_synced_at TIMESTAMPTZ, -- When instance was last synced with component

  -- Constraints
  CONSTRAINT valid_display_order CHECK (display_order >= 0)
);

-- ============================================================================
-- 2. INDEXES FOR PERFORMANCE
-- ============================================================================

-- Instance lookup
CREATE INDEX IF NOT EXISTS idx_instances_component ON component_instances(component_id);
CREATE INDEX IF NOT EXISTS idx_instances_page ON component_instances(page_id);
CREATE INDEX IF NOT EXISTS idx_instances_page_order ON component_instances(page_id, display_order);
CREATE INDEX IF NOT EXISTS idx_instances_created ON component_instances(created_at DESC);

-- Composite index for common queries
CREATE INDEX IF NOT EXISTS idx_instances_component_page
  ON component_instances(component_id, page_id);

-- ============================================================================
-- 3. ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS
ALTER TABLE component_instances ENABLE ROW LEVEL SECURITY;

-- Public read access to instances of published pages
CREATE POLICY "Public read access to instances"
  ON component_instances
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM pages
      WHERE pages.id = component_instances.page_id
      AND pages.is_published = TRUE
      AND pages.status = 'published'
    )
  );

-- Admin full access
CREATE POLICY "Admin full access to instances"
  ON component_instances
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================================================
-- 4. HELPER FUNCTIONS
-- ============================================================================

-- Function to auto-update component usage count on instance creation
CREATE OR REPLACE FUNCTION on_instance_created()
RETURNS TRIGGER AS $$
BEGIN
  -- Increment component usage count
  PERFORM increment_component_usage(NEW.component_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to auto-update component usage count on instance deletion
CREATE OR REPLACE FUNCTION on_instance_deleted()
RETURNS TRIGGER AS $$
BEGIN
  -- Decrement component usage count
  PERFORM decrement_component_usage(OLD.component_id);
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Triggers for usage tracking
CREATE TRIGGER instance_created_trigger
  AFTER INSERT ON component_instances
  FOR EACH ROW
  EXECUTE FUNCTION on_instance_created();

CREATE TRIGGER instance_deleted_trigger
  AFTER DELETE ON component_instances
  FOR EACH ROW
  EXECUTE FUNCTION on_instance_deleted();

-- ============================================================================
-- 5. COMPONENT SYNCHRONIZATION FUNCTIONS
-- ============================================================================

-- Function to get all block IDs for a component instance
-- Returns array of content_blocks.id that belong to this instance
CREATE OR REPLACE FUNCTION get_instance_block_ids(instance_uuid UUID)
RETURNS UUID[] AS $$
DECLARE
  result UUID[];
BEGIN
  SELECT ARRAY_AGG(id)
  INTO result
  FROM content_blocks
  WHERE page_id = (SELECT page_id FROM component_instances WHERE id = instance_uuid)
  AND display_order >= (SELECT display_order FROM component_instances WHERE id = instance_uuid)
  AND display_order < (
    SELECT COALESCE(
      (SELECT MIN(display_order) FROM component_instances
       WHERE page_id = (SELECT page_id FROM component_instances WHERE id = instance_uuid)
       AND display_order > (SELECT display_order FROM component_instances WHERE id = instance_uuid)),
      999999
    )
  );

  RETURN COALESCE(result, ARRAY[]::UUID[]);
END;
$$ LANGUAGE plpgsql;

-- Function to count instances per component
CREATE OR REPLACE FUNCTION count_component_instances(component_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  instance_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO instance_count
  FROM component_instances
  WHERE component_id = component_uuid;

  RETURN instance_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get instance usage summary for a component
CREATE OR REPLACE FUNCTION get_component_usage_summary(component_uuid UUID)
RETURNS TABLE(
  page_id UUID,
  page_title TEXT,
  page_slug TEXT,
  instance_count BIGINT,
  last_used TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id AS page_id,
    p.title AS page_title,
    p.slug AS page_slug,
    COUNT(ci.id) AS instance_count,
    MAX(ci.created_at) AS last_used
  FROM component_instances ci
  JOIN pages p ON p.id = ci.page_id
  WHERE ci.component_id = component_uuid
  GROUP BY p.id, p.title, p.slug
  ORDER BY last_used DESC;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 6. VIEWS FOR ANALYTICS
-- ============================================================================

-- View: Component usage statistics
CREATE OR REPLACE VIEW component_usage_stats AS
SELECT
  rc.id,
  rc.name,
  rc.category,
  rc.usage_count,
  COUNT(DISTINCT ci.page_id) AS pages_used_in,
  COUNT(ci.id) AS total_instances,
  MAX(ci.created_at) AS last_instance_created,
  rc.created_at AS component_created_at
FROM reusable_components rc
LEFT JOIN component_instances ci ON ci.component_id = rc.id
GROUP BY rc.id, rc.name, rc.category, rc.usage_count, rc.created_at;

-- View: Page component usage
CREATE OR REPLACE VIEW page_components AS
SELECT
  p.id AS page_id,
  p.title AS page_title,
  p.slug AS page_slug,
  rc.id AS component_id,
  rc.name AS component_name,
  rc.category AS component_category,
  ci.display_order,
  ci.created_at AS instance_created_at
FROM pages p
JOIN component_instances ci ON ci.page_id = p.id
JOIN reusable_components rc ON rc.id = ci.component_id
ORDER BY p.title, ci.display_order;

-- ============================================================================
-- 7. COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE component_instances IS 'Tracks usage of reusable components across pages';
COMMENT ON COLUMN component_instances.component_id IS 'Reference to the reusable component template';
COMMENT ON COLUMN component_instances.page_id IS 'Page where this component instance is used';
COMMENT ON COLUMN component_instances.display_order IS 'Position of component in page (relative to other blocks)';
COMMENT ON COLUMN component_instances.overrides IS 'JSONB of per-instance styling overrides';
COMMENT ON COLUMN component_instances.last_synced_at IS 'Timestamp of last synchronization with component template';

COMMENT ON VIEW component_usage_stats IS 'Analytics view showing component usage statistics';
COMMENT ON VIEW page_components IS 'Shows which components are used on which pages';

-- ============================================================================
-- 8. SAMPLE DATA (for testing)
-- ============================================================================

-- Insert sample instances (linking components to pages)
DO $$
DECLARE
  welcome_component_id UUID;
  cta_component_id UUID;
  sample_page_id UUID;
BEGIN
  -- Get component IDs
  SELECT id INTO welcome_component_id FROM reusable_components WHERE name = 'Welcome Hero' LIMIT 1;
  SELECT id INTO cta_component_id FROM reusable_components WHERE name = 'Contact CTA' LIMIT 1;

  -- Get sample page ID
  SELECT id INTO sample_page_id FROM pages WHERE slug = 'sample-cms-page' LIMIT 1;

  -- Insert instances if components and page exist
  IF welcome_component_id IS NOT NULL AND sample_page_id IS NOT NULL THEN
    INSERT INTO component_instances (component_id, page_id, display_order, instance_name)
    VALUES
      (welcome_component_id, sample_page_id, 0, 'Homepage Hero'),
      (cta_component_id, sample_page_id, 10, 'Contact Section')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
