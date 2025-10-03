-- Script to fix foreign key constraints for prompt interactions tables
-- This script fixes the foreign key references to point to gemini_prompts table instead of prompts table

-- Check current foreign key constraints
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_name IN ('prompt_likes', 'prompt_bookmarks', 'prompt_comments');

-- Drop existing foreign key constraints
ALTER TABLE prompt_likes DROP CONSTRAINT IF EXISTS prompt_likes_prompt_id_fkey;
ALTER TABLE prompt_bookmarks DROP CONSTRAINT IF EXISTS prompt_bookmarks_prompt_id_fkey;
ALTER TABLE prompt_comments DROP CONSTRAINT IF EXISTS prompt_comments_prompt_id_fkey;

-- Add correct foreign key constraints referencing gemini_prompts table
ALTER TABLE prompt_likes 
ADD CONSTRAINT prompt_likes_prompt_id_fkey 
FOREIGN KEY (prompt_id) REFERENCES gemini_prompts(id) ON DELETE CASCADE;

ALTER TABLE prompt_bookmarks 
ADD CONSTRAINT prompt_bookmarks_prompt_id_fkey 
FOREIGN KEY (prompt_id) REFERENCES gemini_prompts(id) ON DELETE CASCADE;

ALTER TABLE prompt_comments 
ADD CONSTRAINT prompt_comments_prompt_id_fkey 
FOREIGN KEY (prompt_id) REFERENCES gemini_prompts(id) ON DELETE CASCADE;

-- Verify the new constraints
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_name IN ('prompt_likes', 'prompt_bookmarks', 'prompt_comments');