-- Test script to verify blog_comments table structure
-- Run this in your Supabase SQL editor

-- 1. Check if the table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'blog_comments'
);

-- 2. Check the table structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'blog_comments'
ORDER BY ordinal_position;

-- 3. Check if there are any existing comments
SELECT COUNT(*) as comment_count FROM blog_comments;

-- 4. Check if the calculate_comment_depth function exists
SELECT EXISTS (
  SELECT FROM information_schema.routines 
  WHERE routine_schema = 'public' 
  AND routine_name = 'calculate_comment_depth'
);

-- 5. Test inserting a comment (replace with actual blog_id and user_id)
-- INSERT INTO blog_comments (blog_id, user_id, content) 
-- VALUES ('your-blog-uuid-here', 'your-clerk-user-id-here', 'Test comment')
-- RETURNING *; 