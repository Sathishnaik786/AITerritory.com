-- Fix user IDs to work with Clerk authentication
-- This migration updates both user_bookmarks and reviews tables

-- First, drop existing triggers and functions
DROP TRIGGER IF EXISTS on_bookmark_change ON user_bookmarks;
DROP FUNCTION IF EXISTS update_bookmark_count();

-- Drop existing tables
DROP TABLE IF EXISTS user_bookmarks;
DROP TABLE IF EXISTS reviews;

-- Recreate user_bookmarks table with text user_id
CREATE TABLE public.user_bookmarks (
  id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  user_id text NOT NULL, -- Changed from uuid to text for Clerk compatibility
  tool_id uuid NOT NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  CONSTRAINT user_bookmarks_pkey PRIMARY KEY (id),
  CONSTRAINT user_bookmarks_user_id_tool_id_key UNIQUE (user_id, tool_id),
  CONSTRAINT user_bookmarks_tool_id_fkey FOREIGN KEY (tool_id) REFERENCES tools (id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- Create indexes for user_bookmarks
CREATE INDEX IF NOT EXISTS idx_user_bookmarks_user_id ON public.user_bookmarks USING btree (user_id) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_user_bookmarks_tool_id ON public.user_bookmarks USING btree (tool_id) TABLESPACE pg_default;

-- Recreate reviews table with text user_id
CREATE TABLE public.reviews (
  id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  tool_id uuid NULL,
  user_id text NULL, -- Changed from uuid to text for Clerk compatibility
  rating integer NULL,
  comment text NULL,
  is_verified boolean NULL DEFAULT false,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  user_name character varying(255) NULL,
  CONSTRAINT reviews_pkey PRIMARY KEY (id),
  CONSTRAINT reviews_tool_id_fkey FOREIGN KEY (tool_id) REFERENCES tools (id) ON DELETE CASCADE,
  CONSTRAINT reviews_rating_check CHECK (
    (rating >= 1) AND (rating <= 5)
  )
) TABLESPACE pg_default;

-- Create indexes for reviews
CREATE INDEX IF NOT EXISTS idx_reviews_tool_id ON public.reviews USING btree (tool_id) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.reviews USING btree (rating) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews USING btree (user_id) TABLESPACE pg_default;

-- Create the bookmark count update function
CREATE OR REPLACE FUNCTION update_bookmark_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE tools 
    SET bookmark_count = bookmark_count + 1 
    WHERE id = NEW.tool_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE tools 
    SET bookmark_count = GREATEST(bookmark_count - 1, 0) 
    WHERE id = OLD.tool_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger for bookmark count updates
CREATE TRIGGER on_bookmark_change
  AFTER INSERT OR DELETE ON user_bookmarks
  FOR EACH ROW
  EXECUTE FUNCTION update_bookmark_count();

-- Create trigger for reviews updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Fix user_id columns for Clerk compatibility
-- Change user_id from UUID to text in reviews and user_bookmarks tables

-- Drop existing foreign key constraints and indexes
ALTER TABLE public.reviews DROP CONSTRAINT IF EXISTS reviews_user_id_fkey;
ALTER TABLE public.user_bookmarks DROP CONSTRAINT IF EXISTS user_bookmarks_user_id_fkey;

DROP INDEX IF EXISTS idx_reviews_user_id;
DROP INDEX IF EXISTS idx_user_bookmarks_user_id;

-- Change user_id column type from UUID to text
ALTER TABLE public.reviews ALTER COLUMN user_id TYPE text;
ALTER TABLE public.user_bookmarks ALTER COLUMN user_id TYPE text;

-- Recreate indexes for text user_id
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews USING btree (user_id) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_user_bookmarks_user_id ON public.user_bookmarks USING btree (user_id) TABLESPACE pg_default;

-- Note: We don't recreate foreign key constraints since Clerk user IDs are not in auth.users table
-- The user_id will be validated at the application level

-- Add comments for clarity
COMMENT ON COLUMN public.reviews.user_id IS 'Clerk user ID (text format)';
COMMENT ON COLUMN public.user_bookmarks.user_id IS 'Clerk user ID (text format)'; 