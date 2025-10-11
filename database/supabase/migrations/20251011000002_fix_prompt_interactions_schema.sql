-- Fix prompt interactions schema and constraints
-- This migration addresses issues with foreign key constraints and schema problems

-- First, drop existing foreign key constraints if they exist
ALTER TABLE prompt_likes DROP CONSTRAINT IF EXISTS fk_prompt_likes_prompt_id;
ALTER TABLE prompt_shares DROP CONSTRAINT IF EXISTS fk_prompt_shares_prompt_id;
ALTER TABLE prompt_comments DROP CONSTRAINT IF EXISTS fk_prompt_comments_prompt_id;

-- Add foreign key constraints with ON DELETE CASCADE and ON UPDATE CASCADE
-- This will handle cases where prompts are deleted or updated
DO $$
BEGIN
  -- Add foreign key constraint to prompt_likes if gemini_prompts table exists
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'gemini_prompts') THEN
    ALTER TABLE prompt_likes 
      ADD CONSTRAINT fk_prompt_likes_prompt_id 
      FOREIGN KEY (prompt_id) REFERENCES gemini_prompts(id) 
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  
  -- Add foreign key constraint to prompt_shares if gemini_prompts table exists
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'gemini_prompts') THEN
    ALTER TABLE prompt_shares 
      ADD CONSTRAINT fk_prompt_shares_prompt_id 
      FOREIGN KEY (prompt_id) REFERENCES gemini_prompts(id) 
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  
  -- Add foreign key constraint to prompt_comments if gemini_prompts table exists
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'gemini_prompts') THEN
    ALTER TABLE prompt_comments 
      ADD CONSTRAINT fk_prompt_comments_prompt_id 
      FOREIGN KEY (prompt_id) REFERENCES gemini_prompts(id) 
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- Create indexes if they don't exist for better performance
CREATE INDEX IF NOT EXISTS idx_prompt_likes_prompt_id ON prompt_likes(prompt_id);
CREATE INDEX IF NOT EXISTS idx_prompt_likes_user_id ON prompt_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_prompt_shares_prompt_id ON prompt_shares(prompt_id);
CREATE INDEX IF NOT EXISTS idx_prompt_shares_user_id ON prompt_shares(user_id);
CREATE INDEX IF NOT EXISTS idx_prompt_comments_prompt_id ON prompt_comments(prompt_id);
CREATE INDEX IF NOT EXISTS idx_prompt_comments_user_id ON prompt_comments(user_id);

-- Create composite indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_prompt_likes_user_prompt ON prompt_likes(user_id, prompt_id);
CREATE INDEX IF NOT EXISTS idx_prompt_shares_user_prompt ON prompt_shares(user_id, prompt_id);
CREATE INDEX IF NOT EXISTS idx_prompt_comments_user_prompt ON prompt_comments(user_id, prompt_id);

-- Create indexes on created_at for sorting by time
CREATE INDEX IF NOT EXISTS idx_prompt_likes_created_at ON prompt_likes(created_at);
CREATE INDEX IF NOT EXISTS idx_prompt_shares_created_at ON prompt_shares(created_at);
CREATE INDEX IF NOT EXISTS idx_prompt_comments_created_at ON prompt_comments(created_at);

-- Add unique constraints to prevent duplicate likes/shares from the same user
CREATE UNIQUE INDEX IF NOT EXISTS idx_prompt_likes_unique_user_prompt ON prompt_likes(user_id, prompt_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_prompt_shares_unique_user_prompt_platform ON prompt_shares(user_id, prompt_id, platform);

-- Add parent_id foreign key constraint for threaded comments
DO $$
BEGIN
  -- Add foreign key constraint for parent comments if the column exists
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'prompt_comments' 
    AND column_name = 'parent_id'
  ) THEN
    ALTER TABLE prompt_comments 
      ADD CONSTRAINT fk_prompt_comments_parent_id 
      FOREIGN KEY (parent_id) REFERENCES prompt_comments(id) 
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;