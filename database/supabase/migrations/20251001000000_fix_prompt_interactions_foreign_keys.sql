-- Fix prompt interactions tables to reference gemini_prompts instead of prompts

-- Drop existing constraints
ALTER TABLE prompt_likes DROP CONSTRAINT IF EXISTS prompt_likes_prompt_id_fkey;
ALTER TABLE prompt_bookmarks DROP CONSTRAINT IF EXISTS prompt_bookmarks_prompt_id_fkey;
ALTER TABLE prompt_comments DROP CONSTRAINT IF EXISTS prompt_comments_prompt_id_fkey;

-- Add new constraints referencing gemini_prompts
ALTER TABLE prompt_likes 
ADD CONSTRAINT prompt_likes_prompt_id_fkey 
FOREIGN KEY (prompt_id) REFERENCES gemini_prompts(id) ON DELETE CASCADE;

ALTER TABLE prompt_bookmarks 
ADD CONSTRAINT prompt_bookmarks_prompt_id_fkey 
FOREIGN KEY (prompt_id) REFERENCES gemini_prompts(id) ON DELETE CASCADE;

ALTER TABLE prompt_comments 
ADD CONSTRAINT prompt_comments_prompt_id_fkey 
FOREIGN KEY (prompt_id) REFERENCES gemini_prompts(id) ON DELETE CASCADE;