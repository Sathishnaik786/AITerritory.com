-- Add foreign key constraints to prompt interaction tables
-- This migration should run after both gemini_prompts and prompt interaction tables are created

DO $$
BEGIN
  -- Add foreign key constraint to prompt_likes table if it doesn't exist
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'prompt_likes') 
     AND EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'gemini_prompts')
     AND NOT EXISTS (SELECT FROM information_schema.table_constraints 
                     WHERE table_name = 'prompt_likes' 
                     AND constraint_name = 'fk_prompt_likes_prompt_id') THEN
    ALTER TABLE prompt_likes ADD CONSTRAINT fk_prompt_likes_prompt_id 
      FOREIGN KEY (prompt_id) REFERENCES gemini_prompts(id) ON DELETE CASCADE;
  END IF;
  
  -- Add foreign key constraint to prompt_shares table if it doesn't exist
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'prompt_shares') 
     AND EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'gemini_prompts')
     AND NOT EXISTS (SELECT FROM information_schema.table_constraints 
                     WHERE table_name = 'prompt_shares' 
                     AND constraint_name = 'fk_prompt_shares_prompt_id') THEN
    ALTER TABLE prompt_shares ADD CONSTRAINT fk_prompt_shares_prompt_id 
      FOREIGN KEY (prompt_id) REFERENCES gemini_prompts(id) ON DELETE CASCADE;
  END IF;
  
  -- Add foreign key constraint to prompt_comments table if it doesn't exist
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'prompt_comments') 
     AND EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'gemini_prompts')
     AND NOT EXISTS (SELECT FROM information_schema.table_constraints 
                     WHERE table_name = 'prompt_comments' 
                     AND constraint_name = 'fk_prompt_comments_prompt_id') THEN
    ALTER TABLE prompt_comments ADD CONSTRAINT fk_prompt_comments_prompt_id 
      FOREIGN KEY (prompt_id) REFERENCES gemini_prompts(id) ON DELETE CASCADE;
  END IF;
END $$;