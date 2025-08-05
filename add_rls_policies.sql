-- Add RLS policies to existing tables
-- Enable RLS for all tables
ALTER TABLE public.blog_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_events ENABLE ROW LEVEL SECURITY;

-- Add policies for blog_likes (only if they don't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'blog_likes' AND policyname = 'Allow public read access to blog_likes') THEN
        CREATE POLICY "Allow public read access to blog_likes" ON public.blog_likes FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'blog_likes' AND policyname = 'Allow authenticated users to insert blog_likes') THEN
        CREATE POLICY "Allow authenticated users to insert blog_likes" ON public.blog_likes FOR INSERT WITH CHECK (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'blog_likes' AND policyname = 'Allow users to delete their own blog_likes') THEN
        CREATE POLICY "Allow users to delete their own blog_likes" ON public.blog_likes FOR DELETE USING (true);
    END IF;
END $$;

-- Add policies for blog_bookmarks (only if they don't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'blog_bookmarks' AND policyname = 'Allow public read access to blog_bookmarks') THEN
        CREATE POLICY "Allow public read access to blog_bookmarks" ON public.blog_bookmarks FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'blog_bookmarks' AND policyname = 'Allow authenticated users to insert blog_bookmarks') THEN
        CREATE POLICY "Allow authenticated users to insert blog_bookmarks" ON public.blog_bookmarks FOR INSERT WITH CHECK (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'blog_bookmarks' AND policyname = 'Allow users to delete their own blog_bookmarks') THEN
        CREATE POLICY "Allow users to delete their own blog_bookmarks" ON public.blog_bookmarks FOR DELETE USING (true);
    END IF;
END $$;

-- Add policies for blog_comments (only if they don't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'blog_comments' AND policyname = 'Allow public read access to blog_comments') THEN
        CREATE POLICY "Allow public read access to blog_comments" ON public.blog_comments FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'blog_comments' AND policyname = 'Allow authenticated users to insert blog_comments') THEN
        CREATE POLICY "Allow authenticated users to insert blog_comments" ON public.blog_comments FOR INSERT WITH CHECK (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'blog_comments' AND policyname = 'Allow users to delete their own blog_comments') THEN
        CREATE POLICY "Allow users to delete their own blog_comments" ON public.blog_comments FOR DELETE USING (true);
    END IF;
END $$;

-- Add policies for blog_events (only if they don't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'blog_events' AND policyname = 'Allow public read access to blog_events') THEN
        CREATE POLICY "Allow public read access to blog_events" ON public.blog_events FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'blog_events' AND policyname = 'Allow authenticated users to insert blog_events') THEN
        CREATE POLICY "Allow authenticated users to insert blog_events" ON public.blog_events FOR INSERT WITH CHECK (true);
    END IF;
END $$;

-- Grant permissions to all tables
GRANT SELECT, INSERT, DELETE ON public.blog_likes TO anon, authenticated;
GRANT SELECT, INSERT, DELETE ON public.blog_bookmarks TO anon, authenticated;
GRANT SELECT, INSERT, DELETE ON public.blog_comments TO anon, authenticated;
GRANT SELECT, INSERT ON public.blog_events TO anon, authenticated; 