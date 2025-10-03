# Database Migrations for Prompt Interactions

## Overview

This directory contains the database migrations for the prompt interaction features (likes, comments, shares) for Gemini prompts.

## Migration Files

### 20250925000000_create_prompt_interactions.sql
Initial migration that creates the prompt interaction tables:
- `prompt_likes` - Tracks user likes for prompts
- `prompt_shares` - Tracks prompt shares by users
- `prompt_comments` - Stores user comments on prompts

### 20250925000001_remove_category_constraint.sql
Removes the category constraint from the gemini_prompts table to allow for dynamic categories.

### 20250925000002_add_prompt_interactions_indexes.sql
**DEPRECATED**: This migration has been superseded by `20250925000003_create_prompt_interactions_with_indexes.sql`.

### 20250925000003_create_prompt_interactions_with_indexes.sql
**RECOMMENDED**: This is the consolidated migration that creates all prompt interaction tables with their indexes and policies in a single, reliable migration.

## Deployment Instructions

To deploy these migrations to your Supabase database:

1. Make sure the `gemini_prompts` table exists (created by `20250712000000_create_gemini_prompts_table.sql`)
2. Run the migrations in order:
   ```sql
   -- Run in Supabase SQL editor
   \ir migrations/20250925000000_create_prompt_interactions.sql
   \ir migrations/20250925000001_remove_category_constraint.sql
   \ir migrations/20250925000003_create_prompt_interactions_with_indexes.sql
   ```

## Troubleshooting

### "relation does not exist" errors

If you encounter errors like "relation 'prompt_shares' does not exist", it means the migration that creates the tables hasn't been run yet. Run the migrations in order as described above.

### Foreign key constraint errors

If you get foreign key constraint errors, make sure the `gemini_prompts` table exists and has the correct schema. The prompt interaction tables reference `gemini_prompts(id)`.

## Schema Details

### prompt_likes
```sql
create table prompt_likes (
  id uuid default gen_random_uuid() primary key,
  prompt_id uuid references gemini_prompts(id) on delete cascade,
  user_id text not null,
  created_at timestamp with time zone default now() not null
);
```

### prompt_shares
```sql
create table prompt_shares (
  id uuid default gen_random_uuid() primary key,
  prompt_id uuid references gemini_prompts(id) on delete cascade,
  user_id text not null,
  platform text,
  created_at timestamp with time zone default now() not null
);
```

### prompt_comments
```sql
create table prompt_comments (
  id uuid default gen_random_uuid() primary key,
  prompt_id uuid references gemini_prompts(id) on delete cascade,
  user_id text not null,
  comment text not null,
  created_at timestamp with time zone default now() not null
);
```