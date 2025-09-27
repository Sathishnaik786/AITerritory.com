-- Migration: Change user_id from uuid to text in likes and shares tables for Clerk compatibility

-- Drop indexes on user_id
DROP INDEX IF EXISTS idx_likes_user_id;
DROP INDEX IF EXISTS idx_shares_user_id;

-- Alter user_id column type from uuid to text
ALTER TABLE public.likes ALTER COLUMN user_id TYPE text;
ALTER TABLE public.shares ALTER COLUMN user_id TYPE text;

-- Recreate indexes on user_id
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON public.likes(user_id);
CREATE INDEX IF NOT EXISTS idx_shares_user_id ON public.shares(user_id);

-- Add comments for clarity
COMMENT ON COLUMN public.likes.user_id IS 'Clerk user ID (text format)';
COMMENT ON COLUMN public.shares.user_id IS 'Clerk user ID (text format)'; 