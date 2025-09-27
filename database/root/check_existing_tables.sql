-- Check existing tables and policies
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('blog_likes', 'blog_bookmarks', 'blog_comments', 'blog_events')
ORDER BY tablename;

-- Check existing policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('blog_likes', 'blog_bookmarks', 'blog_comments', 'blog_events')
ORDER BY tablename, policyname;

-- Check if calculate_comment_depth function exists
SELECT 
    proname,
    prosrc
FROM pg_proc 
WHERE proname = 'calculate_comment_depth'; 