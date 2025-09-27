-- Create blog_likes table
create table public.blog_likes (
  id uuid not null default gen_random_uuid (),
  blog_id text not null,
  user_id uuid not null,
  created_at timestamp with time zone null default timezone ('utc'::text, now()),
  constraint blog_likes_pkey primary key (id),
  constraint blog_likes_blog_id_user_id_key unique (blog_id, user_id)
) TABLESPACE pg_default;

create index IF not exists idx_blog_likes_blog_id on public.blog_likes using btree (blog_id) TABLESPACE pg_default;

create index IF not exists idx_blog_likes_user_id on public.blog_likes using btree (user_id) TABLESPACE pg_default; 