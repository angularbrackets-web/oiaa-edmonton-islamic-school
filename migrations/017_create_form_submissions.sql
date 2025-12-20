-- Migration: Create form_submissions table
-- Phase 3.1: Forms block with email + DB storage

-- Create form_submissions table to store all form submissions
CREATE TABLE IF NOT EXISTS form_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_name VARCHAR(255) NOT NULL,
  page_id UUID REFERENCES pages(id) ON DELETE SET NULL,
  block_id UUID REFERENCES content_blocks(id) ON DELETE SET NULL,

  -- Submission data stored as JSONB for flexibility
  data JSONB NOT NULL DEFAULT '{}',

  -- Contact info (extracted for easy querying)
  email VARCHAR(255),
  name VARCHAR(255),
  phone VARCHAR(50),

  -- Status tracking
  status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),

  -- Email notification tracking
  email_sent BOOLEAN DEFAULT FALSE,
  email_sent_at TIMESTAMPTZ,

  -- Metadata
  ip_address VARCHAR(45),
  user_agent TEXT,
  referrer TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_form_submissions_form_name ON form_submissions(form_name);
CREATE INDEX IF NOT EXISTS idx_form_submissions_status ON form_submissions(status);
CREATE INDEX IF NOT EXISTS idx_form_submissions_email ON form_submissions(email);
CREATE INDEX IF NOT EXISTS idx_form_submissions_created_at ON form_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_form_submissions_page_id ON form_submissions(page_id);

-- Enable RLS
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public to insert submissions (forms are public)
CREATE POLICY "Allow public form submissions" ON form_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Allow authenticated users to view all submissions
CREATE POLICY "Allow authenticated to view submissions" ON form_submissions
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Allow authenticated users to update submissions (status changes)
CREATE POLICY "Allow authenticated to update submissions" ON form_submissions
  FOR UPDATE
  TO authenticated
  USING (true);

-- Policy: Allow authenticated users to delete submissions
CREATE POLICY "Allow authenticated to delete submissions" ON form_submissions
  FOR DELETE
  TO authenticated
  USING (true);

-- Add 'form' to block_type enum if not exists
DO $$
BEGIN
  -- Check if 'form' already exists in the enum
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum
    WHERE enumlabel = 'form'
    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'block_type')
  ) THEN
    ALTER TYPE block_type ADD VALUE IF NOT EXISTS 'form';
  END IF;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_form_submissions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS form_submissions_updated_at ON form_submissions;
CREATE TRIGGER form_submissions_updated_at
  BEFORE UPDATE ON form_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_form_submissions_updated_at();
