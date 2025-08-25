-- Create news/blog posts table
CREATE TABLE IF NOT EXISTS news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  arabic_title TEXT,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  tags TEXT[],
  author TEXT DEFAULT 'Admin',
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  publish_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_news_published ON news(published);
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
CREATE INDEX IF NOT EXISTS idx_news_publish_date ON news(publish_date DESC);
CREATE INDEX IF NOT EXISTS idx_news_featured ON news(featured);
CREATE INDEX IF NOT EXISTS idx_news_slug ON news(slug);

-- Disable Row Level Security for now (can be enabled later with proper policies)
ALTER TABLE news DISABLE ROW LEVEL SECURITY;

-- Insert some sample news posts
INSERT INTO news (title, slug, excerpt, content, category, featured, publish_date) VALUES
(
  'Welcome to OIA Academy Edmonton - A New Chapter Begins',
  'welcome-to-oia-academy-edmonton',
  'We are thrilled to announce the opening of OIA Academy Edmonton, bringing quality Islamic education to our community.',
  'Assalamu Alaikum dear families and community members,

We are incredibly excited to announce the official opening of OIA Academy Edmonton! After months of planning and preparation, we are ready to welcome students into a nurturing Islamic educational environment.

Our academy is committed to providing:
- High-quality academic education following Alberta curriculum
- Strong Islamic foundation and character development  
- Experienced and dedicated faculty members
- Modern facilities and learning resources
- Small class sizes for personalized attention

We look forward to partnering with families in raising the next generation of confident, knowledgeable, and righteous Muslim leaders.

Barakallahu feekum,
OIA Academy Administration',
  'announcements',
  true,
  NOW() - INTERVAL '2 days'
),
(
  'Ramadan Preparation Activities',
  'ramadan-preparation-activities',
  'Special activities and programs to help our students prepare for the blessed month of Ramadan.',
  'As we approach the blessed month of Ramadan, OIA Academy is organizing special preparation activities for our students:

📚 Ramadan Learning Sessions
- Understanding the significance of Ramadan
- Learning proper fasting etiquette
- Memorizing Ramadan duas and supplications

🤲 Community Service Projects  
- Food drive for local families
- Making iftar boxes for community members
- Charity collection for those in need

🕌 Spiritual Activities
- Daily reflection circles
- Quran recitation practice
- Islamic history storytelling sessions

These activities will help our students develop a deeper connection with their faith and understand the true spirit of Ramadan.

May Allah accept our efforts and grant us a blessed Ramadan.',
  'events',
  true,
  NOW() - INTERVAL '5 days'
),
(
  'Student Achievement: Quran Memorization Milestone',
  'student-achievement-quran-memorization',
  'Congratulations to our Grade 3 student Aisha for completing the memorization of Juz Amma!',
  'Masha''Allah! We are proud to celebrate a wonderful achievement by one of our Grade 3 students.

Aisha has successfully completed the memorization of Juz Amma (the 30th part of the Holy Quran), demonstrating incredible dedication and perseverance over the past year.

This achievement represents:
✨ Hours of daily practice and review
✨ Strong support from family at home
✨ Guidance from our Quran teachers
✨ Personal commitment to Islamic learning

Aisha will be recognized in our upcoming school assembly, and we encourage all students to follow her inspiring example.

May Allah reward Aisha and her family, and may this be a stepping stone toward further Islamic knowledge and spiritual growth.',
  'achievements',
  false,
  NOW() - INTERVAL '1 week'
),
(
  'Parent-Teacher Conference Schedule',
  'parent-teacher-conference-schedule',
  'Important information about upcoming parent-teacher conferences for all grade levels.',
  'Dear Parents and Guardians,

We are pleased to invite you to our upcoming Parent-Teacher Conferences scheduled for the week of March 18-22, 2024.

Conference Schedule:
📅 Monday-Wednesday: Kindergarten through Grade 3
📅 Thursday-Friday: Grades 4-6

Time Slots Available:
⏰ 3:30 PM - 6:00 PM (after school hours)
⏰ 7:00 PM - 8:30 PM (evening sessions)

What to Expect:
- Academic progress review
- Islamic studies development
- Character and behavioral assessment
- Goal setting for remainder of year
- Questions and concerns discussion

To schedule your appointment, please contact the main office at (780) 123-4567 or email admin@oiaacademy.ca by March 15th.

We look forward to meeting with you to discuss your child''s progress and how we can work together to support their continued growth.

Jazakum Allahu khayran,
OIA Academy Faculty',
  'general',
  false,
  NOW() - INTERVAL '10 days'
);