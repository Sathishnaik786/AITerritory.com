-- Create blog_events table for blog post engagement analytics
CREATE TABLE IF NOT EXISTS public.blog_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL, -- e.g., 'view', 'share', 'newsletter_signup'
  blog_id text NOT NULL,
  user_id uuid, -- nullable, Clerk user id if available
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Indexes for fast lookup
CREATE INDEX IF NOT EXISTS idx_blog_events_blog_id ON public.blog_events(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_events_event_type ON public.blog_events(event_type);

-- Enable Row Level Security
ALTER TABLE public.blog_events ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access
CREATE POLICY "Allow public read access to blog_events" ON public.blog_events FOR SELECT USING (true);

-- Policy: Allow anyone to insert (for analytics)
CREATE POLICY "Allow anyone to insert blog_events" ON public.blog_events FOR INSERT WITH CHECK (true);

-- Grant permissions
GRANT SELECT, INSERT ON public.blog_events TO anon, authenticated; 