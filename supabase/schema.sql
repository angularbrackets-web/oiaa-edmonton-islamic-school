-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE staff_department AS ENUM (
  'administration',
  'elementary', 
  'middle-school',
  'high-school',
  'islamic-studies',
  'arabic-language'
);

CREATE TYPE achievement_type AS ENUM (
  'academic',
  'community', 
  'construction'
);

-- School Information table
CREATE TABLE school_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  tagline TEXT,
  mission TEXT,
  arabic_text TEXT,
  contact_info JSONB,
  features JSONB[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Programs table
CREATE TABLE programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  age TEXT,
  description TEXT,
  features TEXT[],
  color TEXT,
  icon TEXT,
  tuition INTEGER,
  curriculum TEXT,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- News articles table
CREATE TABLE news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  date DATE,
  author TEXT,
  published BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  category TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  event_time TEXT,
  location TEXT,
  is_recurring BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Faculty table
CREATE TABLE faculty (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  arabic_name TEXT,
  position TEXT NOT NULL,
  department TEXT NOT NULL,
  email TEXT,
  qualifications TEXT[],
  experience TEXT,
  specialization TEXT,
  bio TEXT,
  image TEXT,
  languages TEXT[],
  subjects TEXT[],
  grade TEXT,
  achievements TEXT[],
  featured BOOLEAN DEFAULT false,
  leadership BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Achievements table
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  date DATE,
  type achievement_type,
  icon TEXT,
  featured BOOLEAN DEFAULT true,
  display_order INTEGER,
  background_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Media table for Cloudinary references
CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  url TEXT NOT NULL,
  alt TEXT,
  public_id TEXT NOT NULL,
  folder TEXT,
  file_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Additional programs table (for weekend school, sports, etc.)
CREATE TABLE additional_programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  schedule TEXT,
  tuition INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_school_info_updated_at BEFORE UPDATE ON school_info FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_programs_updated_at BEFORE UPDATE ON programs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON news FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_faculty_updated_at BEFORE UPDATE ON faculty FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_achievements_updated_at BEFORE UPDATE ON achievements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_media_updated_at BEFORE UPDATE ON media FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_additional_programs_updated_at BEFORE UPDATE ON additional_programs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE school_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE additional_programs ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public can read school_info" ON school_info FOR SELECT USING (true);
CREATE POLICY "Public can read published programs" ON programs FOR SELECT USING (published = true);
CREATE POLICY "Public can read published news" ON news FOR SELECT USING (published = true);
CREATE POLICY "Public can read published events" ON events FOR SELECT USING (published = true);
CREATE POLICY "Public can read published faculty" ON faculty FOR SELECT USING (published = true);
CREATE POLICY "Public can read achievements" ON achievements FOR SELECT USING (true);
CREATE POLICY "Public can read media" ON media FOR SELECT USING (true);
CREATE POLICY "Public can read published additional programs" ON additional_programs FOR SELECT USING (published = true);

-- Create indexes for better performance
CREATE INDEX idx_news_featured ON news(featured) WHERE featured = true;
CREATE INDEX idx_news_published ON news(published) WHERE published = true;
CREATE INDEX idx_programs_published ON programs(published) WHERE published = true;
CREATE INDEX idx_faculty_department ON faculty(department);
CREATE INDEX idx_faculty_grade ON faculty(grade);
CREATE INDEX idx_faculty_published ON faculty(published) WHERE published = true;
CREATE INDEX idx_achievements_order ON achievements(display_order);
CREATE INDEX idx_events_date ON events(event_date);