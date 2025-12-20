-- Migration: Add CTA (Call to Action) fields to achievements table
-- This allows each achievement slide to have a configurable button

-- Add CTA fields to achievements table
ALTER TABLE achievements
ADD COLUMN IF NOT EXISTS cta_text TEXT,
ADD COLUMN IF NOT EXISTS cta_url TEXT,
ADD COLUMN IF NOT EXISTS cta_style TEXT DEFAULT 'primary';

-- Add comment for documentation
COMMENT ON COLUMN achievements.cta_text IS 'Button text for the achievement CTA (e.g., "Learn More", "Book Tour")';
COMMENT ON COLUMN achievements.cta_url IS 'URL/link for the CTA button';
COMMENT ON COLUMN achievements.cta_style IS 'Button style: primary (filled), secondary (outlined)';

-- Also add sports and arts to the achievement_type enum if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'sports' AND enumtypid = 'achievement_type'::regtype) THEN
        ALTER TYPE achievement_type ADD VALUE 'sports';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'arts' AND enumtypid = 'achievement_type'::regtype) THEN
        ALTER TYPE achievement_type ADD VALUE 'arts';
    END IF;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
