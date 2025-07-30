# Database Fixes Required

## Issues Found in Your Current Schema

### 1. Missing `blog_likes` Table
You have `blog_bookmarks` but no `blog_likes` table. This is causing the 500 errors on likes endpoints.

### 2. Incorrect `blog_events` Schema
Your `blog_events` table has `user_id` as `uuid` but it should be `text` to match Clerk user IDs.

### 3. Missing RLS Policies
None of your tables have Row Level Security policies enabled, which is required for Supabase.

### 4. Missing Permissions
Tables don't have proper GRANT permissions for `anon` and `authenticated` roles.

## Required Fixes

### Step 1: Run `fix_missing_tables.sql`
This will:
- Create the missing `blog_likes` table
- Add RLS policies to all tables
- Add proper permissions
- Create the `calculate_comment_depth` function

### Step 2: Run `verify_and_fix_tables.sql`
This will:
- Fix the `blog_events` table schema
- Change `user_id` from `uuid` to `text`
- Add missing indexes
- Add proper RLS policies

## Your Current Tables Status

✅ **Correctly Created:**
- `blogs` - Main blogs table
- `blog_bookmarks` - Bookmark functionality
- `blog_comments` - Comments with threading support
- `blog_navigation` - Blog navigation

❌ **Missing/Faulty:**
- `blog_likes` - **MISSING** (causing 500 errors)
- `blog_events` - **WRONG SCHEMA** (causing 400 errors)

## Expected Results After Fixes

1. ✅ Blog likes API will work: `GET /api/interactions/blogs/:slug/likes/count`
2. ✅ Blog bookmarks API will work: `GET /api/interactions/blogs/:slug/bookmarks/count`
3. ✅ Blog comments API will work: `GET /api/blogs/:slug/comments/threaded`
4. ✅ Blog events tracking will work without 400 errors
5. ✅ All interaction features (like, bookmark, comment) will function properly

## Instructions

1. **Run the SQL scripts in your Supabase dashboard:**
   - Execute `fix_missing_tables.sql` first
   - Then execute `verify_and_fix_tables.sql`

2. **Restart your server:**
   ```bash
   cd server
   npm start
   ```

3. **Test the endpoints:**
   - Blog comments: `GET /api/blogs/future-of-ai-recent-updates/comments/threaded`
   - Blog likes: `GET /api/interactions/blogs/future-of-ai-recent-updates/likes/count`
   - Blog bookmarks: `GET /api/interactions/blogs/future-of-ai-recent-updates/bookmarks/count`

## Notes

- All tables use `blog_id` as `text` (blog slug) for consistency
- All tables use `user_id` as `text` to match Clerk user IDs
- RLS policies allow public read access and authenticated user insert/delete
- The `calculate_comment_depth` function is required for threaded comments 