-- Migration: Add component_id to content_blocks table
-- Purpose: Allow blocks to belong to either a page OR a component (unified block system)
-- Date: 2026-01-08
-- Description: Unifies the block editing system so components can use the same
--              database-driven block architecture as pages, enabling full feature
--              parity including columns, sections, and all nested blocks.

-- ============================================================================
-- STEP 1: Make page_id nullable (blocks can belong to page OR component)
-- ============================================================================

-- First, we need to drop the NOT NULL constraint on page_id
ALTER TABLE content_blocks
ALTER COLUMN page_id DROP NOT NULL;

COMMENT ON COLUMN content_blocks.page_id IS
  'ID of the page this block belongs to (NULL if block belongs to a component)';

-- ============================================================================
-- STEP 2: Add component_id column
-- ============================================================================

-- Add the component_id column with foreign key constraint
ALTER TABLE content_blocks
ADD COLUMN IF NOT EXISTS component_id UUID
  REFERENCES reusable_components(id) ON DELETE CASCADE;

COMMENT ON COLUMN content_blocks.component_id IS
  'ID of the component this block belongs to (NULL if block belongs to a page)';

-- ============================================================================
-- STEP 3: Add constraint to ensure exactly one parent (page OR component)
-- ============================================================================

-- Add check constraint: exactly one of page_id or component_id must be set
ALTER TABLE content_blocks
ADD CONSTRAINT block_parent_exclusive CHECK (
  (page_id IS NOT NULL AND component_id IS NULL) OR
  (page_id IS NULL AND component_id IS NOT NULL)
);

COMMENT ON CONSTRAINT block_parent_exclusive ON content_blocks IS
  'Ensures each block belongs to exactly one parent: either a page OR a component, never both or neither';

-- ============================================================================
-- STEP 4: Add indexes for performance
-- ============================================================================

-- Create index for querying blocks by component
CREATE INDEX IF NOT EXISTS idx_content_blocks_component
ON content_blocks(component_id)
WHERE component_id IS NOT NULL;

-- Create composite index for querying blocks by component with ordering
CREATE INDEX IF NOT EXISTS idx_content_blocks_component_order
ON content_blocks(component_id, display_order)
WHERE component_id IS NOT NULL;

-- ============================================================================
-- STEP 5: Update RLS policies (if needed)
-- ============================================================================

-- The existing RLS policies should continue to work, but let's add a policy
-- for component blocks to ensure they're accessible

-- Drop and recreate the public read policy for content blocks to include component blocks
DROP POLICY IF EXISTS "Public read access to content blocks" ON content_blocks;

CREATE POLICY "Public read access to content blocks"
  ON content_blocks
  FOR SELECT
  USING (
    -- Allow if block belongs to a published page
    (page_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM pages WHERE id = content_blocks.page_id AND is_published = true
    ))
    OR
    -- Allow if block belongs to an active component
    (component_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM reusable_components WHERE id = content_blocks.component_id AND is_active = true
    ))
  );

-- ============================================================================
-- VERIFICATION QUERIES (run manually to verify migration)
-- ============================================================================

-- Check that page_id is now nullable:
-- SELECT column_name, is_nullable, data_type
-- FROM information_schema.columns
-- WHERE table_name = 'content_blocks' AND column_name = 'page_id';

-- Check that component_id column exists:
-- SELECT column_name, is_nullable, data_type
-- FROM information_schema.columns
-- WHERE table_name = 'content_blocks' AND column_name = 'component_id';

-- Check that the constraint exists:
-- SELECT constraint_name, constraint_type
-- FROM information_schema.table_constraints
-- WHERE table_name = 'content_blocks' AND constraint_name = 'block_parent_exclusive';

-- Check that indexes were created:
-- SELECT indexname, indexdef
-- FROM pg_indexes
-- WHERE tablename = 'content_blocks'
-- AND indexname LIKE '%component%';
