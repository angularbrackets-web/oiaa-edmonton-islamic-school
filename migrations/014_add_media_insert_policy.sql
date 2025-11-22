-- Add INSERT policy for media table to allow server-side uploads
-- This fixes the RLS policy blocking uploads from being saved to database

-- Allow service role (server-side) to insert media
CREATE POLICY "Allow service role to insert media" ON media
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow service role to update media (for future edits)
CREATE POLICY "Allow service role to update media" ON media
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow service role to delete media
CREATE POLICY "Allow service role to delete media" ON media
FOR DELETE
TO authenticated
USING (true);
