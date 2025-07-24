## Table: admin_users

create table public.admin_users (
  id uuid not null default uuid_generate_v4(),
  user_id text not null,
  email text null,
  phone text null,
  created_at timestamp with time zone null default now(),
  constraint admin_users_pkey primary key (id),
  constraint admin_users_user_id_key unique (user_id)
) TABLESPACE pg_default;

## Table: advertise_requests

create table public.advertise_requests (
  id uuid not null default gen_random_uuid(),
  name text not null,
  email text not null,
  company text null,
  message text not null,
  created_at timestamp with time zone null default timezone('utc'::text, now()),
  constraint advertise_requests_pkey primary key (id)
) TABLESPACE pg_default;

## Table: ai_agents

create table public.ai_agents (
  id uuid not null default gen_random_uuid(),
  type text not null,
  title text not null,
  description text null,
  image text null,
  link text null,
  category text null,
  stars text null,
  constraint ai_agents_pkey primary key (id)
) TABLESPACE pg_default;

## Table: ai_automation_guides

create table public.ai_automation_guides (
  id uuid not null default gen_random_uuid(),
  title text not null,
  description text null,
  video_link text null,
  constraint ai_automation_guides_pkey primary key (id)
) TABLESPACE pg_default;

## Table: ai_automation_tools

create table public.ai_automation_tools (
  id uuid not null default gen_random_uuid(),
  title text not null,
  description text null,
  image text null,
  link text null,
  category text null,
  constraint ai_automation_tools_pkey primary key (id)
) TABLESPACE pg_default;

## Table: ai_automation_use_cases

create table public.ai_automation_use_cases (
  id uuid not null default gen_random_uuid(),
  title text not null,
  description text null,
  image text null,
  link text null,
  duration text null,
  level text null,
  constraint ai_automation_use_cases_pkey primary key (id)
) TABLESPACE pg_default;

## Table: ai_innovations

create table public.ai_innovations (
  id uuid not null default gen_random_uuid(),
  type text not null,
  title text not null,
  description text null,
  image text null,
  link text null,
  category text null,
  constraint ai_innovations_pkey primary key (id)
) TABLESPACE pg_default;

## Table: ai_learning_path_courses

create table public.ai_learning_path_courses (
  id uuid not null default gen_random_uuid(),
  learning_path_id uuid null,
  title text not null,
  description text null,
  image text null,
  duration text null,
  level text null,
  link text null,
  constraint ai_learning_path_courses_pkey primary key (id)
) TABLESPACE pg_default;

## Table: ai_learning_paths

create table public.ai_learning_paths (
  id uuid not null default gen_random_uuid(),
  title text not null,
  description text null,
  image text null,
  constraint ai_learning_paths_pkey primary key (id)
) TABLESPACE pg_default;

## Table: ai_research_papers

create table public.ai_research_papers (
  id uuid not null default gen_random_uuid(),
  title text not null,
  authors text null,
  abstract text null,
  link text null,
  image text null,
  constraint ai_research_papers_pkey primary key (id)
) TABLESPACE pg_default;

## Table: ai_tutorials

create table public.ai_tutorials (
  id uuid not null default gen_random_uuid(),
  type text not null,
  title text not null,
  description text null,
  image text null,
  duration text null,
  level text null,
  link text null,
  constraint ai_tutorials_pkey primary key (id)
) TABLESPACE pg_default;

## Table: apple_carousel_cards

create table public.apple_carousel_cards (
  id uuid not null default gen_random_uuid(),
  category text not null,
  title text not null,
  image_url text not null,
  content text null,
  created_at timestamp with time zone null default timezone('utc'::text, now()),
  constraint apple_carousel_cards_pkey primary key (id)
) TABLESPACE pg_default;

## Table: blogs

create table public.blogs (
  id uuid not null default uuid_generate_v4(),
  title text not null,
  slug text not null,
  description text null,
  cover_image_url text null,
  content text null,
  author_name text null,
  tags text[] null,
  created_at timestamp with time zone null default now(),
  featured boolean null default false,
  category text not null,
  reading_time integer null,
  constraint blogs_pkey primary key (id)
) TABLESPACE pg_default;

## Table: business_functions

create table public.business_functions (
  id uuid not null default gen_random_uuid(),
  icon text null,
  title text not null,
  description text null,
  adoption_percentage integer null,
  constraint business_functions_pkey primary key (id)
) TABLESPACE pg_default;

## Table: business_trending_courses

create table public.business_trending_courses (
  id uuid not null default gen_random_uuid(),
  business_function_id uuid null,
  title text not null,
  image text null,
  link text null,
  constraint business_trending_courses_pkey primary key (id)
) TABLESPACE pg_default;

## Table: business_trending_tools

create table public.business_trending_tools (
  id uuid not null default gen_random_uuid(),
  business_function_id uuid null,
  name text not null,
  constraint business_trending_tools_pkey primary key (id)
) TABLESPACE pg_default;

## Table: categories

create table public.categories (
  id uuid not null default uuid_generate_v4(),
  name character varying(255) not null,
  description text null,
  slug character varying(255) not null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint categories_pkey primary key (id)
) TABLESPACE pg_default;

## Table: contact_us

create table public.contact_us (
  id uuid not null default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamp with time zone null default timezone('utc'::text, now()),
  constraint contact_us_pkey primary key (id)
) TABLESPACE pg_default;

## Table: feature_requests

create table public.feature_requests (
  id uuid not null default gen_random_uuid(),
  name text not null,
  email text not null,
  feature text not null,
  details text null,
  created_at timestamp with time zone null default timezone('utc'::text, now()),
  constraint feature_requests_pkey primary key (id)
) TABLESPACE pg_default;

## Table: feedback

create table public.feedback (
  id uuid not null default gen_random_uuid(),
  type text not null,
  message text not null,
  email text null,
  created_at timestamp with time zone not null default now(),
  constraint feedback_pkey primary key (id)
) TABLESPACE pg_default;

## Table: likes

create table public.likes (
  id uuid not null default gen_random_uuid(),
  tool_id uuid null,
  user_id text not null,
  created_at timestamp with time zone null default timezone('utc'::text, now()),
  constraint likes_pkey primary key (id)
) TABLESPACE pg_default;

## Table: newsletter_subscribers

create table public.newsletter_subscribers (
  id uuid not null default gen_random_uuid(),
  email text not null,
  created_at timestamp with time zone null default timezone('utc'::text, now()),
  constraint newsletter_subscribers_pkey primary key (id)
) TABLESPACE pg_default;

## Table: prompt_bookmarks

create table public.prompt_bookmarks (
  id uuid not null default gen_random_uuid(),
  prompt_id uuid null,
  user_id text not null,
  created_at timestamp with time zone null default now(),
  constraint prompt_bookmarks_pkey primary key (id)
) TABLESPACE pg_default;

## Table: prompt_comments

create table public.prompt_comments (
  id uuid not null default gen_random_uuid(),
  prompt_id uuid null,
  user_id text not null,
  comment text not null,
  created_at timestamp with time zone null default now(),
  constraint prompt_comments_pkey primary key (id)
) TABLESPACE pg_default;

## Table: prompt_likes

create table public.prompt_likes (
  id uuid not null default gen_random_uuid(),
  prompt_id uuid null,
  user_id text not null,
  created_at timestamp with time zone null default now(),
  constraint prompt_likes_pkey primary key (id)
) TABLESPACE pg_default;

## Table: prompts

create table public.prompts (
  id uuid not null default gen_random_uuid(),
  title text not null,
  description text not null,
  category text not null,
  author text null,
  created_at timestamp with time zone null default now(),
  constraint prompts_pkey primary key (id)
) TABLESPACE pg_default;

## Table: reviews

create table public.reviews (
  id uuid not null default uuid_generate_v4(),
  tool_id uuid null,
  user_id text null,
  rating integer null,
  comment text null,
  is_verified boolean null default false,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  user_name character varying(255) null,
  constraint reviews_pkey primary key (id)
) TABLESPACE pg_default;

## Table: shares

create table public.shares (
  id uuid not null default gen_random_uuid(),
  tool_id uuid null,
  user_id text not null,
  created_at timestamp with time zone null default timezone('utc'::text, now()),
  platform text null,
  tool_url text null,
  tool_name text null,
  constraint shares_pkey primary key (id)
) TABLESPACE pg_default;

## Table: sub_tools

create table public.sub_tools (
  id uuid not null default uuid_generate_v4(),
  parent_tool_id uuid null,
  name character varying(255) not null,
  description text null,
  link character varying(500) null,
  created_at timestamp with time zone null default now(),
  constraint sub_tools_pkey primary key (id)
) TABLESPACE pg_default;

## Table: submitted_tools

create table public.submitted_tools (
  id uuid not null default gen_random_uuid(),
  name text not null,
  email text not null,
  tool_name text not null,
  tool_url text not null,
  description text null,
  created_at timestamp with time zone null default timezone('utc'::text, now()),
  constraint submitted_tools_pkey primary key (id)
) TABLESPACE pg_default;

## Table: tags

create table public.tags (
  id uuid not null default uuid_generate_v4(),
  name character varying(100) not null,
  slug character varying(100) not null,
  created_at timestamp with time zone null default now(),
  constraint tags_pkey primary key (id)
) TABLESPACE pg_default;

## Table: testimonials

create table public.testimonials (
  id uuid not null default gen_random_uuid(),
  user_id uuid null,
  user_name text not null,
  user_role text null,
  user_avatar text null,
  content text not null,
  approved boolean not null default false,
  created_at timestamp with time zone null default timezone('utc'::text, now()),
  rating integer null default 5,
  company_name text null,
  constraint testimonials_pkey primary key (id)
) TABLESPACE pg_default;

## Table: tool_comments

create table public.tool_comments (
  id uuid not null default uuid_generate_v4(),
  tool_id uuid null,
  user_id text null,
  comment text not null,
  created_at timestamp without time zone null default now(),
  constraint tool_comments_pkey primary key (id)
) TABLESPACE pg_default;

## Table: tool_submissions

create table public.tool_submissions (
  id uuid not null default gen_random_uuid(),
  email text not null,
  tool_name text not null,
  tool_url text not null,
  youtube_url text null,
  created_at timestamp with time zone null default timezone('utc'::text, now()),
  updated_at timestamp with time zone null default timezone('utc'::text, now()),
  status text not null default 'pending',
  constraint tool_submissions_pkey primary key (id)
) TABLESPACE pg_default;

## Table: tool_tags

create table public.tool_tags (
  id uuid not null default uuid_generate_v4(),
  tool_id uuid null,
  tag_id uuid null,
  created_at timestamp with time zone null default now(),
  constraint tool_tags_pkey primary key (id)
) TABLESPACE pg_default;

## Table: tools

create table public.tools (
  id uuid not null default uuid_generate_v4(),
  name character varying(255) not null,
  description text not null,
  category_id uuid null,
  company character varying(255) null,
  link character varying(500) not null,
  image_url character varying(500) null,
  icon character varying(10) null,
  release_date date null,
  rating numeric null default 0.0,
  review_count integer null default 0,
  is_featured boolean null default false,
  is_trending boolean null default false,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  is_new boolean null default false,
  is_editors_choice boolean null default false,
  verified boolean null default false,
  bookmark_count integer not null default 0,
  status boolean null,
  pricing_type text null,
  tags text[] null,
  screenshots text[] null,
  constraint tools_pkey primary key (id)
) TABLESPACE pg_default;

## Table: user_bookmarks

create table public.user_bookmarks (
  id uuid not null default uuid_generate_v4(),
  user_id text not null,
  tool_id uuid not null,
  created_at timestamp with time zone null default now(),
  constraint user_bookmarks_pkey primary key (id)
) TABLESPACE pg_default;

## Table: users

create table public.users (
  id uuid not null,
  full_name text null,
  email text null,
  phone text null,
  created_at timestamp with time zone null default timezone('utc'::text, now()),
  constraint users_pkey primary key (id)
) TABLESPACE pg_default;

## Table: youtube_videos

create table public.youtube_videos (
  id bigint not null,
  video_id text not null,
  title text not null,
  description text null,
  thumbnail_url text null,
  video_type text not null,
  created_at timestamp with time zone null default now(),
  constraint youtube_videos_pkey primary key (id)
) TABLESPACE pg_default;

