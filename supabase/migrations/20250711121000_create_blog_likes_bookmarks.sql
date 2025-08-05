-- Create blog_likes table for blog post likes
CREATE TABLE IF NOT EXISTS public.blog_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id text NOT NULL,
  user_id text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  UNIQUE (blog_id, user_id)
);

-- Create blog_bookmarks table for blog post bookmarks
CREATE TABLE IF NOT EXISTS public.blog_bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id text NOT NULL,
  user_id text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  UNIQUE (blog_id, user_id)
);

-- Indexes for fast lookup
CREATE INDEX IF NOT EXISTS idx_blog_likes_blog_id ON public.blog_likes(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_likes_user_id ON public.blog_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_blog_bookmarks_blog_id ON public.blog_bookmarks(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_bookmarks_user_id ON public.blog_bookmarks(user_id);

-- Enable Row Level Security
ALTER TABLE public.blog_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_bookmarks ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access
CREATE POLICY "Allow public read access to blog_likes" ON public.blog_likes FOR SELECT USING (true);
CREATE POLICY "Allow public read access to blog_bookmarks" ON public.blog_bookmarks FOR SELECT USING (true);

-- Policy: Allow authenticated users to insert
CREATE POLICY "Allow authenticated users to insert blog_likes" ON public.blog_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Allow authenticated users to insert blog_bookmarks" ON public.blog_bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Allow users to delete their own likes/bookmarks
CREATE POLICY "Allow users to delete their own blog_likes" ON public.blog_likes FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Allow users to delete their own blog_bookmarks" ON public.blog_bookmarks FOR DELETE USING (auth.uid() = user_id);

-- Grant permissions
GRANT SELECT, INSERT, DELETE ON public.blog_likes TO anon, authenticated;
GRANT SELECT, INSERT, DELETE ON public.blog_bookmarks TO anon, authenticated; 