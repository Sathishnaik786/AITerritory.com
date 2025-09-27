-- Create prompt_likes table
create table if not exists prompt_likes (
  id uuid default gen_random_uuid() primary key,
  prompt_id uuid references gemini_prompts(id) on delete cascade,
  user_id text not null,
  created_at timestamp with time zone default now() not null
);

-- Create prompt_shares table
create table if not exists prompt_shares (
  id uuid default gen_random_uuid() primary key,
  prompt_id uuid references gemini_prompts(id) on delete cascade,
  user_id text not null,
  platform text,
  created_at timestamp with time zone default now() not null
);

-- Create prompt_comments table
create table if not exists prompt_comments (
  id uuid default gen_random_uuid() primary key,
  prompt_id uuid references gemini_prompts(id) on delete cascade,
  user_id text not null,
  comment text not null,
  created_at timestamp with time zone default now() not null
);

-- Add indexes for better performance
create index if not exists idx_prompt_likes_prompt_id on prompt_likes(prompt_id);
create index if not exists idx_prompt_likes_user_id on prompt_likes(user_id);
create index if not exists idx_prompt_shares_prompt_id on prompt_shares(prompt_id);
create index if not exists idx_prompt_shares_user_id on prompt_shares(user_id);
create index if not exists idx_prompt_comments_prompt_id on prompt_comments(prompt_id);
create index if not exists idx_prompt_comments_user_id on prompt_comments(user_id);

-- Enable RLS
alter table prompt_likes enable row level security;
alter table prompt_shares enable row level security;
alter table prompt_comments enable row level security;

-- Create policies
create policy "Anyone can view prompt likes" on prompt_likes
  for select using (true);

create policy "Authenticated users can insert prompt likes" on prompt_likes
  for insert with check (auth.role() = 'authenticated');

create policy "Users can delete their own prompt likes" on prompt_likes
  for delete using (auth.uid()::text = user_id);

create policy "Anyone can view prompt shares" on prompt_shares
  for select using (true);

create policy "Authenticated users can insert prompt shares" on prompt_shares
  for insert with check (auth.role() = 'authenticated');

create policy "Anyone can view prompt comments" on prompt_comments
  for select using (true);

create policy "Authenticated users can insert prompt comments" on prompt_comments
  for insert with check (auth.role() = 'authenticated');

create policy "Users can delete their own prompt comments" on prompt_comments
  for delete using (auth.uid()::text = user_id);