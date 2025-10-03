-- Create prompt interaction tables with indexes and policies
-- This migration consolidates table creation and indexing for better reliability

-- Check if gemini_prompts table exists
DO $$
BEGIN
  -- Create prompt_likes table
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'prompt_likes') THEN
    create table prompt_likes (
      id uuid default gen_random_uuid() primary key,
      prompt_id uuid,
      user_id text not null,
      created_at timestamp with time zone default now() not null
    );
    
    -- Add foreign key constraint only if gemini_prompts table exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'gemini_prompts') THEN
      ALTER TABLE prompt_likes ADD CONSTRAINT fk_prompt_likes_prompt_id 
        FOREIGN KEY (prompt_id) REFERENCES gemini_prompts(id) ON DELETE CASCADE;
    END IF;
    
    -- Add indexes for better performance
    create index if not exists idx_prompt_likes_prompt_id on prompt_likes(prompt_id);
    create index if not exists idx_prompt_likes_user_id on prompt_likes(user_id);
    
    -- Enable RLS
    alter table prompt_likes enable row level security;
    
    -- Create policies
    create policy "Anyone can view prompt likes" on prompt_likes
      for select using (true);
    
    create policy "Authenticated users can insert prompt likes" on prompt_likes
      for insert with check (auth.role() = 'authenticated');
    
    create policy "Users can delete their own prompt likes" on prompt_likes
      for delete using (auth.uid()::text = user_id);
  END IF;
  
  -- Create prompt_shares table
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'prompt_shares') THEN
    create table prompt_shares (
      id uuid default gen_random_uuid() primary key,
      prompt_id uuid,
      user_id text not null,
      platform text,
      created_at timestamp with time zone default now() not null
    );
    
    -- Add foreign key constraint only if gemini_prompts table exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'gemini_prompts') THEN
      ALTER TABLE prompt_shares ADD CONSTRAINT fk_prompt_shares_prompt_id 
        FOREIGN KEY (prompt_id) REFERENCES gemini_prompts(id) ON DELETE CASCADE;
    END IF;
    
    -- Add indexes for better performance
    create index if not exists idx_prompt_shares_prompt_id on prompt_shares(prompt_id);
    create index if not exists idx_prompt_shares_user_id on prompt_shares(user_id);
    
    -- Enable RLS
    alter table prompt_shares enable row level security;
    
    -- Create policies
    create policy "Anyone can view prompt shares" on prompt_shares
      for select using (true);
    
    create policy "Authenticated users can insert prompt shares" on prompt_shares
      for insert with check (auth.role() = 'authenticated');
  END IF;
  
  -- Create prompt_comments table
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'prompt_comments') THEN
    create table prompt_comments (
      id uuid default gen_random_uuid() primary key,
      prompt_id uuid,
      user_id text not null,
      comment text not null,
      created_at timestamp with time zone default now() not null
    );
    
    -- Add foreign key constraint only if gemini_prompts table exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'gemini_prompts') THEN
      ALTER TABLE prompt_comments ADD CONSTRAINT fk_prompt_comments_prompt_id 
        FOREIGN KEY (prompt_id) REFERENCES gemini_prompts(id) ON DELETE CASCADE;
    END IF;
    
    -- Add indexes for better performance
    create index if not exists idx_prompt_comments_prompt_id on prompt_comments(prompt_id);
    create index if not exists idx_prompt_comments_user_id on prompt_comments(user_id);
    
    -- Enable RLS
    alter table prompt_comments enable row level security;
    
    -- Create policies
    create policy "Anyone can view prompt comments" on prompt_comments
      for select using (true);
    
    create policy "Authenticated users can insert prompt comments" on prompt_comments
      for insert with check (auth.role() = 'authenticated');
    
    create policy "Users can delete their own prompt comments" on prompt_comments
      for delete using (auth.uid()::text = user_id);
  END IF;
  
  -- Add additional indexes for better performance
  -- Create composite indexes for better query performance
  create index if not exists idx_prompt_likes_user_prompt on prompt_likes(user_id, prompt_id);
  create index if not exists idx_prompt_shares_user_prompt on prompt_shares(user_id, prompt_id);
  create index if not exists idx_prompt_comments_user_prompt on prompt_comments(user_id, prompt_id);
  
  -- Create indexes on created_at for sorting by time
  create index if not exists idx_prompt_likes_created_at on prompt_likes(created_at);
  create index if not exists idx_prompt_shares_created_at on prompt_shares(created_at);
  create index if not exists idx_prompt_comments_created_at on prompt_comments(created_at);
  
  -- Add unique constraints to prevent duplicate likes/shares from the same user
  -- This ensures a user can only like a prompt once
  create unique index if not exists idx_prompt_likes_unique_user_prompt on prompt_likes(user_id, prompt_id);
  
  -- For shares, we might want to allow multiple shares by the same user on different platforms
  -- So we'll create a unique constraint on user_id, prompt_id, and platform
  create unique index if not exists idx_prompt_shares_unique_user_prompt_platform on prompt_shares(user_id, prompt_id, platform);
END $$;