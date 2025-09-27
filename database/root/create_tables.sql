-- Create blog_likes table
CREATE TABLE IF NOT EXISTS public.blog_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id text NOT NULL,
  user_id text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  UNIQUE (blog_id, user_id)
);

-- Create indexes for blog_likes
CREATE INDEX IF NOT EXISTS idx_blog_likes_blog_id ON public.blog_likes(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_likes_user_id ON public.blog_likes(user_id);

-- Enable RLS for blog_likes
ALTER TABLE public.blog_likes ENABLE ROW LEVEL SECURITY;

-- Policies for blog_likes
CREATE POLICY "Allow public read access to blog_likes" ON public.blog_likes FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to insert blog_likes" ON public.blog_likes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow users to delete their own blog_likes" ON public.blog_likes FOR DELETE USING (true);

-- Grant permissions for blog_likes
GRANT SELECT, INSERT, DELETE ON public.blog_likes TO anon, authenticated;

-- Create blog_bookmarks table
CREATE TABLE IF NOT EXISTS public.blog_bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id text NOT NULL,
  user_id text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  UNIQUE (blog_id, user_id)
);

-- Create indexes for blog_bookmarks
CREATE INDEX IF NOT EXISTS idx_blog_bookmarks_blog_id ON public.blog_bookmarks(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_bookmarks_user_id ON public.blog_bookmarks(user_id);

-- Enable RLS for blog_bookmarks
ALTER TABLE public.blog_bookmarks ENABLE ROW LEVEL SECURITY;

-- Policies for blog_bookmarks
CREATE POLICY "Allow public read access to blog_bookmarks" ON public.blog_bookmarks FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to insert blog_bookmarks" ON public.blog_bookmarks FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow users to delete their own blog_bookmarks" ON public.blog_bookmarks FOR DELETE USING (true);

-- Grant permissions for blog_bookmarks
GRANT SELECT, INSERT, DELETE ON public.blog_bookmarks TO anon, authenticated;

-- Create blog_comments table
CREATE TABLE IF NOT EXISTS public.blog_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id text NOT NULL,
  user_id text NOT NULL,
  content text NOT NULL,
  parent_id uuid REFERENCES public.blog_comments(id) ON DELETE CASCADE,
  depth integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Create indexes for blog_comments
CREATE INDEX IF NOT EXISTS idx_blog_comments_blog_id ON public.blog_comments(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_user_id ON public.blog_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_parent_id ON public.blog_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_depth ON public.blog_comments(depth);

-- Enable RLS for blog_comments
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;

-- Policies for blog_comments
CREATE POLICY "Allow public read access to blog_comments" ON public.blog_comments FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to insert blog_comments" ON public.blog_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow users to delete their own blog_comments" ON public.blog_comments FOR DELETE USING (true);

-- Grant permissions for blog_comments
GRANT SELECT, INSERT, DELETE ON public.blog_comments TO anon, authenticated;

-- Create blog_events table
CREATE TABLE IF NOT EXISTS public.blog_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  blog_id text NOT NULL,
  user_id text,
  platform text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Create indexes for blog_events
CREATE INDEX IF NOT EXISTS idx_blog_events_event_type ON public.blog_events(event_type);
CREATE INDEX IF NOT EXISTS idx_blog_events_blog_id ON public.blog_events(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_events_user_id ON public.blog_events(user_id);
CREATE INDEX IF NOT EXISTS idx_blog_events_created_at ON public.blog_events(created_at);

-- Enable RLS for blog_events
ALTER TABLE public.blog_events ENABLE ROW LEVEL SECURITY;

-- Policies for blog_events
CREATE POLICY "Allow public read access to blog_events" ON public.blog_events FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to insert blog_events" ON public.blog_events FOR INSERT WITH CHECK (true);

-- Grant permissions for blog_events
GRANT SELECT, INSERT ON public.blog_events TO anon, authenticated; 