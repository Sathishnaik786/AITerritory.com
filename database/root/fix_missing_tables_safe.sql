-- Fix missing blog_likes table (Safe version)
CREATE TABLE IF NOT EXISTS public.blog_likes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  blog_id text NOT NULL,
  user_id text NOT NULL,
  created_at timestamp with time zone NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT blog_likes_pkey PRIMARY KEY (id),
  CONSTRAINT blog_likes_blog_id_user_id_key UNIQUE (blog_id, user_id)
) TABLESPACE pg_default;

-- Create indexes for blog_likes (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_blog_likes_blog_id ON public.blog_likes USING btree (blog_id) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_blog_likes_user_id ON public.blog_likes USING btree (user_id) TABLESPACE pg_default;

-- Enable RLS for blog_likes
ALTER TABLE public.blog_likes ENABLE ROW LEVEL SECURITY;

-- Policies for blog_likes (only if they don't exist)
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

-- Grant permissions for blog_likes
GRANT SELECT, INSERT, DELETE ON public.blog_likes TO anon, authenticated;

-- Enable RLS for blog_bookmarks (only if not already enabled)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'blog_bookmarks' AND rowsecurity = true) THEN
        ALTER TABLE public.blog_bookmarks ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Policies for blog_bookmarks (only if they don't exist)
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

-- Grant permissions for blog_bookmarks
GRANT SELECT, INSERT, DELETE ON public.blog_bookmarks TO anon, authenticated;

-- Enable RLS for blog_comments (only if not already enabled)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'blog_comments' AND rowsecurity = true) THEN
        ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Policies for blog_comments (only if they don't exist)
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

-- Grant permissions for blog_comments
GRANT SELECT, INSERT, DELETE ON public.blog_comments TO anon, authenticated;

-- Enable RLS for blog_events (only if not already enabled)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'blog_events' AND rowsecurity = true) THEN
        ALTER TABLE public.blog_events ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Policies for blog_events (only if they don't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'blog_events' AND policyname = 'Allow public read access to blog_events') THEN
        CREATE POLICY "Allow public read access to blog_events" ON public.blog_events FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'blog_events' AND policyname = 'Allow authenticated users to insert blog_events') THEN
        CREATE POLICY "Allow authenticated users to insert blog_events" ON public.blog_events FOR INSERT WITH CHECK (true);
    END IF;
END $$;

-- Grant permissions for blog_events
GRANT SELECT, INSERT ON public.blog_events TO anon, authenticated;

-- Create the calculate_comment_depth function if it doesn't exist
CREATE OR REPLACE FUNCTION calculate_comment_depth()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.parent_id IS NULL THEN
    NEW.depth := 0;
  ELSE
    SELECT depth + 1 INTO NEW.depth
    FROM blog_comments
    WHERE id = NEW.parent_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql; 