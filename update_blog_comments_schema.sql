-- Update blog_comments table to use text for user_id instead of uuid
-- This is needed because Clerk user IDs are strings, not UUIDs

-- First, drop the existing table (this will lose existing data)
DROP TABLE IF EXISTS public.blog_comments CASCADE;

-- Recreate the table with correct data types
CREATE TABLE public.blog_comments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  blog_id uuid NOT NULL,
  user_id text NOT NULL, -- Changed from uuid to text for Clerk user IDs
  content text NOT NULL,
  created_at timestamp with time zone NULL DEFAULT timezone('utc'::text, now()),
  parent_id uuid NULL,
  depth integer NULL DEFAULT 0,
  reaction_counts jsonb NULL DEFAULT '{}'::jsonb,
  is_moderated boolean NULL DEFAULT false,
  moderation_reason text NULL,
  flagged_count integer NULL DEFAULT 0,
  CONSTRAINT blog_comments_pkey PRIMARY KEY (id),
  CONSTRAINT blog_comments_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES blog_comments (id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- Recreate indexes
CREATE INDEX IF NOT EXISTS idx_blog_comments_blog_id ON public.blog_comments USING btree (blog_id) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_blog_comments_user_id ON public.blog_comments USING btree (user_id) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_blog_comments_parent_id ON public.blog_comments USING btree (parent_id) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_blog_comments_depth ON public.blog_comments USING btree (depth) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_blog_comments_blog_id_parent_id ON public.blog_comments USING btree (blog_id, parent_id) TABLESPACE pg_default;

-- Recreate the trigger
CREATE TRIGGER trigger_calculate_depth BEFORE INSERT ON blog_comments FOR EACH ROW
EXECUTE FUNCTION calculate_comment_depth(); 