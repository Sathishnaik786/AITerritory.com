-- Create blog_comments table for blog post comments
CREATE TABLE IF NOT EXISTS public.blog_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id text NOT NULL, -- Use text if blog slugs are used as IDs; change to uuid if blogs have uuid PKs
  user_id text NOT NULL, -- Clerk user ID
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Index for fast lookup by blog_id
CREATE INDEX IF NOT EXISTS idx_blog_comments_blog_id ON public.blog_comments(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_user_id ON public.blog_comments(user_id);

-- Enable Row Level Security
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access
CREATE POLICY "Allow public read access to blog_comments" ON public.blog_comments
  FOR SELECT USING (true);

-- Policy: Allow authenticated users to insert
CREATE POLICY "Allow authenticated users to insert blog_comments" ON public.blog_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Allow users to delete their own comments
CREATE POLICY "Allow users to delete their own blog_comments" ON public.blog_comments
  FOR DELETE USING (auth.uid() = user_id);

-- Grant permissions
GRANT SELECT, INSERT, DELETE ON public.blog_comments TO anon, authenticated; 