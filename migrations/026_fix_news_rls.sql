-- Fix Row Level Security for news table
-- This allows inserts, updates, and deletes on the news table

-- Option 1: Disable RLS completely (simplest for admin CMS)
ALTER TABLE news DISABLE ROW LEVEL SECURITY;

-- Option 2: If you want to keep RLS enabled, create permissive policies
-- Uncomment these lines and comment out the line above:

/*
-- Enable RLS
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Allow all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users" ON news
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Or more specific policies:
CREATE POLICY "Anyone can read published news" ON news
  FOR SELECT
  USING (published = true OR auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert news" ON news
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update news" ON news
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete news" ON news
  FOR DELETE
  USING (auth.role() = 'authenticated');
*/
