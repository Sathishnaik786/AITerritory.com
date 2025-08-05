-- Verify and fix blog_events table
-- Drop the incorrect blog_events table if it exists with wrong schema
DROP TABLE IF EXISTS public.blog_events CASCADE;

-- Create the correct blog_events table
CREATE TABLE public.blog_events (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  blog_id text NOT NULL,
  user_id text NULL, -- Changed from uuid to text to match Clerk user IDs
  platform text NULL,
  created_at timestamp with time zone NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT blog_events_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

-- Create indexes for blog_events
CREATE INDEX IF NOT EXISTS idx_blog_events_blog_id ON public.blog_events USING btree (blog_id) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_blog_events_event_type ON public.blog_events USING btree (event_type) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_blog_events_user_id ON public.blog_events USING btree (user_id) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_blog_events_created_at ON public.blog_events USING btree (created_at) TABLESPACE pg_default;

-- Enable RLS for blog_events
ALTER TABLE public.blog_events ENABLE ROW LEVEL SECURITY;

-- Policies for blog_events
CREATE POLICY "Allow public read access to blog_events" ON public.blog_events FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to insert blog_events" ON public.blog_events FOR INSERT WITH CHECK (true);

-- Grant permissions for blog_events
GRANT SELECT, INSERT ON public.blog_events TO anon, authenticated; 