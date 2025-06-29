## Table: admin_users

create table public.admin_users (
  id uuid not null default extensions.uuid_generate_v4 (),
  user_id text not null,
  email text null,
  phone text null,
  created_at timestamp with time zone null default now(),
  constraint admin_users_pkey primary key (id),
  constraint admin_users_user_id_key unique (user_id)
) TABLESPACE pg_default;

## Table: advertise_requests

create table public.advertise_requests (
  id uuid not null default gen_random_uuid (),
  name text not null,
  email text not null,
  company text null,
  message text not null,
  created_at timestamp with time zone null default timezone ('utc'::text, now()),
  constraint advertise_requests_pkey primary key (id)
) TABLESPACE pg_default;

## Table: ai_agents

create table public.ai_agents (
  id uuid not null default gen_random_uuid (),
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
  id uuid not null default gen_random_uuid (),
  title text not null,
  description text null,
  video_link text null,
  constraint ai_automation_guides_pkey primary key (id)
) TABLESPACE pg_default;

## Table: ai_automation_tools

create table public.ai_automation_tools (
  id uuid not null default gen_random_uuid (),
  title text not null,
  description text null,
  image text null,
  link text null,
  category text null,
  constraint ai_automation_tools_pkey primary key (id)
) TABLESPACE pg_default;

## Table: ai_automation_use_cases

create table public.ai_automation_use_cases (
  id uuid not null default gen_random_uuid (),
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
  id uuid not null default gen_random_uuid (),
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
  id uuid not null default gen_random_uuid (),
  learning_path_id uuid null,
  title text not null,
  description text null,
  image text null,
  duration text null,
  level text null,
  link text null,
  constraint ai_learning_path_courses_pkey primary key (id),
  constraint ai_learning_path_courses_learning_path_id_fkey foreign KEY (learning_path_id) references ai_learning_paths (id) on delete CASCADE
) TABLESPACE pg_default;

## Table: ai_learning_paths

create table public.ai_learning_paths (
  id uuid not null default gen_random_uuid (),
  title text not null,
  description text null,
  image text null,
  constraint ai_learning_paths_pkey primary key (id)
) TABLESPACE pg_default;

## Table: ai_research_papers

create table public.ai_research_papers (
  id uuid not null default gen_random_uuid (),
  title text not null,
  authors text null,
  abstract text null,
  link text null,
  image text null,
  constraint ai_research_papers_pkey primary key (id)
) TABLESPACE pg_default;

## Table: ai_tutorials

create table public.ai_tutorials (
  id uuid not null default gen_random_uuid (),
  type text not null,
  title text not null,
  description text null,
  image text null,
  duration text null,
  level text null,
  link text null,
  constraint ai_tutorials_pkey primary key (id)
) TABLESPACE pg_default;

## Table: business_functions

create table public.business_functions (
  id uuid not null default gen_random_uuid (),
  icon text null,
  title text not null,
  description text null,
  adoption_percentage integer null,
  constraint business_functions_pkey primary key (id)
) TABLESPACE pg_default;

## Table: business_trending_courses

create table public.business_trending_courses (
  id uuid not null default gen_random_uuid (),
  business_function_id uuid null,
  title text not null,
  image text null,
  link text null,
  constraint business_trending_courses_pkey primary key (id),
  constraint business_trending_courses_business_function_id_fkey foreign KEY (business_function_id) references business_functions (id) on delete CASCADE
) TABLESPACE pg_default;

## Table: business_trending_tools

create table public.business_trending_tools (
  id uuid not null default gen_random_uuid (),
  business_function_id uuid null,
  name text not null,
  constraint business_trending_tools_pkey primary key (id),
  constraint business_trending_tools_business_function_id_fkey foreign KEY (business_function_id) references business_functions (id) on delete CASCADE
) TABLESPACE pg_default;

## Table: categories

create table public.categories (
  id uuid not null default extensions.uuid_generate_v4 (),
  name character varying(255) not null,
  description text null,
  slug character varying(255) not null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint categories_pkey primary key (id),
  constraint categories_name_key unique (name),
  constraint categories_slug_key unique (slug)
) TABLESPACE pg_default;

create trigger update_categories_updated_at BEFORE
update on categories for EACH row
execute FUNCTION update_updated_at_column ();

## Table: contact_us

create table public.contact_us (
  id uuid not null default gen_random_uuid (),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamp with time zone null default timezone ('utc'::text, now()),
  constraint contact_us_pkey primary key (id)
) TABLESPACE pg_default;

## Table: feature_requests

create table public.feature_requests (
  id uuid not null default gen_random_uuid (),
  name text not null,
  email text not null,
  feature text not null,
  details text null,
  created_at timestamp with time zone null default timezone ('utc'::text, now()),
  constraint feature_requests_pkey primary key (id)
) TABLESPACE pg_default;

## Table: reviews

create table public.reviews (
  id uuid not null default extensions.uuid_generate_v4 (),
  tool_id uuid null,
  user_id uuid null,
  rating integer null,
  comment text null,
  is_verified boolean null default false,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  user_name character varying(255) null,
  constraint reviews_pkey primary key (id),
  constraint reviews_tool_id_fkey foreign KEY (tool_id) references tools (id) on delete CASCADE,
  constraint reviews_rating_check check (
    (
      (rating >= 1)
      and (rating <= 5)
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_reviews_tool_id on public.reviews using btree (tool_id) TABLESPACE pg_default;

create index IF not exists idx_reviews_rating on public.reviews using btree (rating) TABLESPACE pg_default;

create trigger update_reviews_updated_at BEFORE
update on reviews for EACH row
execute FUNCTION update_updated_at_column ();

## Table: sub_tools

create table public.sub_tools (
  id uuid not null default extensions.uuid_generate_v4 (),
  parent_tool_id uuid null,
  name character varying(255) not null,
  description text null,
  link character varying(500) null,
  created_at timestamp with time zone null default now(),
  constraint sub_tools_pkey primary key (id),
  constraint sub_tools_parent_tool_id_fkey foreign KEY (parent_tool_id) references tools (id) on delete CASCADE
) TABLESPACE pg_default;

## Table: submitted_tools

create table public.submitted_tools (
  id uuid not null default gen_random_uuid (),
  name text not null,
  email text not null,
  tool_name text not null,
  tool_url text not null,
  description text null,
  created_at timestamp with time zone null default timezone ('utc'::text, now()),
  constraint submitted_tools_pkey primary key (id)
) TABLESPACE pg_default;


## Table: tags

create table public.tags (
  id uuid not null default extensions.uuid_generate_v4 (),
  name character varying(100) not null,
  slug character varying(100) not null,
  created_at timestamp with time zone null default now(),
  constraint tags_pkey primary key (id),
  constraint tags_name_key unique (name),
  constraint tags_slug_key unique (slug)
) TABLESPACE pg_default;


## Table: tool_tags

create table public.tool_tags (
  id uuid not null default extensions.uuid_generate_v4 (),
  tool_id uuid null,
  tag_id uuid null,
  created_at timestamp with time zone null default now(),
  constraint tool_tags_pkey primary key (id),
  constraint tool_tags_tool_id_tag_id_key unique (tool_id, tag_id),
  constraint tool_tags_tag_id_fkey foreign KEY (tag_id) references tags (id) on delete CASCADE,
  constraint tool_tags_tool_id_fkey foreign KEY (tool_id) references tools (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_tool_tags_tool_id on public.tool_tags using btree (tool_id) TABLESPACE pg_default;

create index IF not exists idx_tool_tags_tag_id on public.tool_tags using btree (tag_id) TABLESPACE pg_default;


## Table: tools

create table public.tools (
  id uuid not null default extensions.uuid_generate_v4 (),
  name character varying(255) not null,
  description text not null,
  category_id uuid null,
  company character varying(255) null,
  link character varying(500) not null,
  image_url character varying(500) null,
  icon character varying(10) null,
  release_date date null,
  rating numeric(3, 2) null default 0.0,
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
  pricing_type public.pricing_type_enum null,
  constraint tools_pkey primary key (id),
  constraint tools_category_id_fkey foreign KEY (category_id) references categories (id) on delete set null
) TABLESPACE pg_default;

create index IF not exists idx_tools_category_id on public.tools using btree (category_id) TABLESPACE pg_default;

create index IF not exists idx_tools_is_featured on public.tools using btree (is_featured) TABLESPACE pg_default;

create index IF not exists idx_tools_is_trending on public.tools using btree (is_trending) TABLESPACE pg_default;

create index IF not exists idx_tools_rating on public.tools using btree (rating) TABLESPACE pg_default;

create index IF not exists idx_tools_created_at on public.tools using btree (created_at) TABLESPACE pg_default;

create index IF not exists idx_tools_search on public.tools using gin (
  to_tsvector(
    'english'::regconfig,
    (((name)::text || ' '::text) || description)
  )
) TABLESPACE pg_default;

create index IF not exists idx_tools_is_new on public.tools using btree (is_new) TABLESPACE pg_default;

create index IF not exists idx_tools_is_editors_choice on public.tools using btree (is_editors_choice) TABLESPACE pg_default;

create index IF not exists idx_tools_verified on public.tools using btree (verified) TABLESPACE pg_default;

create index IF not exists idx_tools_bookmark_count on public.tools using btree (bookmark_count desc) TABLESPACE pg_default;

create trigger update_tools_updated_at BEFORE
update on tools for EACH row
execute FUNCTION update_updated_at_column ();


## Table: user_bookmarks

create table public.user_bookmarks (
  id uuid not null default extensions.uuid_generate_v4 (),
  user_id uuid not null,
  tool_id uuid not null,
  created_at timestamp with time zone null default now(),
  constraint user_bookmarks_pkey primary key (id),
  constraint user_bookmarks_user_id_tool_id_key unique (user_id, tool_id),
  constraint user_bookmarks_tool_id_fkey foreign KEY (tool_id) references tools (id) on delete CASCADE,
  constraint user_bookmarks_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_user_bookmarks_user_id on public.user_bookmarks using btree (user_id) TABLESPACE pg_default;

create index IF not exists idx_user_bookmarks_tool_id on public.user_bookmarks using btree (tool_id) TABLESPACE pg_default;

create trigger on_bookmark_change
after INSERT
or DELETE on user_bookmarks for EACH row
execute FUNCTION update_bookmark_count ();


## Table: users

create table public.users (
  id uuid not null,
  full_name text null,
  email text null,
  phone text null,
  created_at timestamp with time zone null default timezone ('utc'::text, now()),
  constraint users_pkey primary key (id),
  constraint users_id_fkey foreign KEY (id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;

## Table: youtube_videos

create table public.youtube_videos (
  id bigint generated always as identity not null,
  video_id text not null,
  title text not null,
  description text null,
  thumbnail_url text null,
  video_type text not null,
  created_at timestamp with time zone null default now(),
  constraint youtube_videos_pkey primary key (id),
  constraint youtube_videos_video_id_key unique (video_id),
  constraint youtube_videos_video_type_check check (
    (
      video_type = any (array['video'::text, 'short'::text])
    )
  )
) TABLESPACE pg_default;

