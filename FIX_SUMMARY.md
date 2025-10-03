# Fix Summary for Prompt Comments Foreign Key Issue

## Problem Identified
The prompt interactions tables (`prompt_likes`, `prompt_bookmarks`, `prompt_comments`) were defined with foreign key constraints referencing the `prompts` table, but the actual prompts are stored in the `gemini_prompts` table. This caused foreign key constraint violations when trying to insert comments.

## Fixes Applied

### 1. Updated Initial Migration File
Updated `database/supabase/migrations/20250702000000_create_prompt_likes_bookmarks_comments.sql` to reference `gemini_prompts` table instead of `prompts` table:

```sql
-- Likes table
CREATE TABLE prompt_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id uuid REFERENCES gemini_prompts(id) ON DELETE CASCADE,
  user_id text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE (prompt_id, user_id)
);

-- Bookmarks table
CREATE TABLE prompt_bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id uuid REFERENCES gemini_prompts(id) ON DELETE CASCADE,
  user_id text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE (prompt_id, user_id)
);

-- Comments table
CREATE TABLE prompt_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id uuid REFERENCES gemini_prompts(id) ON DELETE CASCADE,
  user_id text NOT NULL,
  comment text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);
```

### 2. Created Additional Migration for Existing Databases
Created `database/supabase/migrations/20251003000001_fix_prompt_interactions_foreign_keys.sql` to fix foreign key constraints on existing databases:

```sql
-- Fix foreign key constraints for prompt interactions tables
-- This migration fixes the foreign key references to point to gemini_prompts table instead of prompts table

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
```

### 3. Verified Controller References
Confirmed that the controller files already correctly reference the `gemini_prompts` table for existence checks.

## How to Apply the Fixes

### Option 1: Using Supabase CLI (Recommended)
If you have Supabase CLI properly configured:

```bash
cd c:\Users\sathi\OneDrive\Desktop\AITerritory.com
npx supabase db push
```

### Option 2: Manual Database Update
If you cannot use the Supabase CLI, you can manually apply the SQL changes:

1. Connect to your Supabase database using a database client (e.g., pgAdmin, psql, or the Supabase SQL editor)

2. Run the following SQL commands:

```sql
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
```

## Verification
After applying the fixes, you should be able to:
1. Successfully add comments to prompts
2. See real-time updates in the comment section
3. No more foreign key constraint errors in the server logs

## Additional Notes
- The CORS warnings in the logs are separate from the foreign key issue and may require additional configuration
- Make sure your database connection settings are correctly configured in your environment files