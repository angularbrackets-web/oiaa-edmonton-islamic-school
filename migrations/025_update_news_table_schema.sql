-- Migration: Update news table to add missing columns
-- This adds slug, arabic_title, featured_image, tags, and publish_date columns

-- Step 1: Add new columns
ALTER TABLE news ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE news ADD COLUMN IF NOT EXISTS arabic_title TEXT;
ALTER TABLE news ADD COLUMN IF NOT EXISTS featured_image TEXT;
ALTER TABLE news ADD COLUMN IF NOT EXISTS tags TEXT[];
ALTER TABLE news ADD COLUMN IF NOT EXISTS publish_date TIMESTAMP WITH TIME ZONE;

-- Step 2: Migrate existing data
-- Generate slugs from titles for existing records
UPDATE news
SET slug = LOWER(REGEXP_REPLACE(REGEXP_REPLACE(title, '[^a-zA-Z0-9]+', '-', 'g'), '(^-|-$)', '', 'g'))
WHERE slug IS NULL;

-- Copy image_url to featured_image if featured_image is null
UPDATE news
SET featured_image = image_url
WHERE featured_image IS NULL AND image_url IS NOT NULL;

-- Copy date to publish_date if publish_date is null
UPDATE news
SET publish_date = COALESCE(date, created_at)
WHERE publish_date IS NULL;

-- Initialize empty tags array for records without tags
UPDATE news
SET tags = ARRAY[]::TEXT[]
WHERE tags IS NULL;

-- Step 3: Handle duplicate slugs by appending row number
WITH ranked_articles AS (
  SELECT
    id,
    slug,
    ROW_NUMBER() OVER (PARTITION BY slug ORDER BY created_at, id::TEXT) as rn
  FROM news
  WHERE slug IS NOT NULL
)
UPDATE news n
SET slug = n.slug || '-' || ra.rn::TEXT
FROM ranked_articles ra
WHERE n.id = ra.id
  AND ra.rn > 1;

-- Step 4: Add constraints
ALTER TABLE news ALTER COLUMN slug SET NOT NULL;
ALTER TABLE news ADD CONSTRAINT news_slug_unique UNIQUE (slug);

-- Step 5: Create index for better performance
CREATE INDEX IF NOT EXISTS idx_news_slug ON news(slug);

-- Optional: You can drop the old 'date' and 'image_url' columns if no longer needed
-- ALTER TABLE news DROP COLUMN IF EXISTS date;
-- ALTER TABLE news DROP COLUMN IF EXISTS image_url;

COMMENT ON COLUMN news.slug IS 'URL-friendly slug for the article';
COMMENT ON COLUMN news.arabic_title IS 'Optional Arabic title';
COMMENT ON COLUMN news.featured_image IS 'URL of the featured image';
COMMENT ON COLUMN news.tags IS 'Array of tags for categorization';
COMMENT ON COLUMN news.publish_date IS 'Date when article should be published';
