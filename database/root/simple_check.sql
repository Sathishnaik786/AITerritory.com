-- Simple check for existing tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('blog_likes', 'blog_bookmarks', 'blog_comments', 'blog_events')
ORDER BY table_name;

-- Check if blog_likes table exists and has data
SELECT 
    'blog_likes' as table_name,
    COUNT(*) as row_count
FROM blog_likes
UNION ALL
SELECT 
    'blog_bookmarks' as table_name,
    COUNT(*) as row_count
FROM blog_bookmarks
UNION ALL
SELECT 
    'blog_comments' as table_name,
    COUNT(*) as row_count
FROM blog_comments
UNION ALL
SELECT 
    'blog_events' as table_name,
    COUNT(*) as row_count
FROM blog_events;

-- Check blog_events table structure
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'blog_events'
ORDER BY ordinal_position; 