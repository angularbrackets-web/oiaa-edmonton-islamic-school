-- Add metadata fields to media table for better media management

ALTER TABLE media
ADD COLUMN IF NOT EXISTS width INTEGER,
ADD COLUMN IF NOT EXISTS height INTEGER,
ADD COLUMN IF NOT EXISTS file_size BIGINT,
ADD COLUMN IF NOT EXISTS original_filename TEXT;

-- Add index on file_type for faster filtering
CREATE INDEX IF NOT EXISTS idx_media_file_type ON media(file_type);

-- Add index on folder for faster filtering
CREATE INDEX IF NOT EXISTS idx_media_folder ON media(folder);

-- Add index on created_at for faster sorting
CREATE INDEX IF NOT EXISTS idx_media_created_at ON media(created_at DESC);
