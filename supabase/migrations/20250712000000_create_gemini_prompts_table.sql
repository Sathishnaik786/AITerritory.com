-- Create gemini_prompts table
create table if not exists gemini_prompts (
  id uuid default gen_random_uuid() primary key,
  image_url text,
  prompt text not null,
  category text not null check (category in ('all', 'men', 'women', 'couple')),
  created_at timestamp with time zone default now() not null
);

-- Enable RLS
alter table gemini_prompts enable row level security;

-- Create policies
create policy "Anyone can view gemini prompts" on gemini_prompts
  for select using (true);

create policy "Authenticated users can insert gemini prompts" on gemini_prompts
  for insert with check (auth.role() = 'authenticated');

-- Create storage bucket for images if it doesn't exist
insert into storage.buckets (id, name, public)
  values ('images', 'images', true)
  on conflict (id) do nothing;

-- Create storage policy for images
create policy "Anyone can view images" on storage.objects
  for select using (bucket_id = 'images');

create policy "Authenticated users can upload images" on storage.objects
  for insert with check (
    bucket_id = 'images' and
    auth.role() = 'authenticated'
  );