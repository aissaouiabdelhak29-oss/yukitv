-- ============================================
-- YUKI TV - Supabase RLS Policies
-- ============================================

-- 1. تفعيل RLS على جدول content
ALTER TABLE content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read on content" ON content;
CREATE POLICY "Allow public read on content" 
ON content
FOR SELECT 
TO anon, authenticated
USING (status = 'published');

-- 2. تفعيل RLS على جدول genres
ALTER TABLE genres ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read on genres" ON genres;
CREATE POLICY "Allow public read on genres" 
ON genres
FOR SELECT 
TO anon, authenticated
USING (true);

-- 3. تفعيل RLS على جدول categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read on categories" ON categories;
CREATE POLICY "Allow public read on categories" 
ON categories
FOR SELECT 
TO anon, authenticated
USING (true);

-- 4. تفعيل RLS على جدول video_servers
ALTER TABLE video_servers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read on video_servers" ON video_servers;
CREATE POLICY "Allow public read on video_servers" 
ON video_servers
FOR SELECT 
TO anon, authenticated
USING (true);

-- 5. تفعيل RLS على جدول episodes
ALTER TABLE episodes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read on episodes" ON episodes;
CREATE POLICY "Allow public read on episodes" 
ON episodes
FOR SELECT 
TO anon, authenticated
USING (true);

-- 6. تفعيل RLS على جدول episode_servers
ALTER TABLE episode_servers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read on episode_servers" ON episode_servers;
CREATE POLICY "Allow public read on episode_servers" 
ON episode_servers
FOR SELECT 
TO anon, authenticated
USING (true);

-- 7. Policy للـ Storage (صور البوسترات)
-- تأكد أن الـ Bucket "posters" عام وله Policy SELECT
