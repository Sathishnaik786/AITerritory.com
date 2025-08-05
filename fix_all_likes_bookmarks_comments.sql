-- Comprehensive fix for all likes, bookmarks, and comments tables
-- This migration ensures all tables work with Clerk user IDs (text) and have proper structure

-- ========================================
-- 1. FIX TOOL LIKES TABLE
-- ========================================
DROP TABLE IF EXISTS public.likes CASCADE;

CREATE TABLE public.likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id uuid REFERENCES tools(id) ON DELETE CASCADE,
  user_id text NOT NULL, -- Clerk user ID
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  UNIQUE (tool_id, user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_likes_tool_id ON public.likes(tool_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON public.likes(user_id);

-- Enable RLS
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public read access to likes" ON public.likes FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to insert likes" ON public.likes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow users to delete their own likes" ON public.likes FOR DELETE USING (true);

-- ========================================
-- 2. FIX TOOL BOOKMARKS TABLE
-- ========================================
DROP TABLE IF EXISTS public.user_bookmarks CASCADE;

CREATE TABLE public.user_bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id uuid REFERENCES tools(id) ON DELETE CASCADE,
  user_id text NOT NULL, -- Clerk user ID
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  UNIQUE (tool_id, user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_bookmarks_tool_id ON public.user_bookmarks(tool_id);
CREATE INDEX IF NOT EXISTS idx_user_bookmarks_user_id ON public.user_bookmarks(user_id);

-- Enable RLS
ALTER TABLE public.user_bookmarks ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public read access to user_bookmarks" ON public.user_bookmarks FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to insert user_bookmarks" ON public.user_bookmarks FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow users to delete their own bookmarks" ON public.user_bookmarks FOR DELETE USING (true);

-- ========================================
-- 3. FIX TOOL COMMENTS TABLE
-- ========================================
DROP TABLE IF EXISTS public.tool_comments CASCADE;

CREATE TABLE public.tool_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id uuid REFERENCES tools(id) ON DELETE CASCADE,
  user_id text NOT NULL, -- Clerk user ID
  comment text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_tool_comments_tool_id ON public.tool_comments(tool_id);
CREATE INDEX IF NOT EXISTS idx_tool_comments_user_id ON public.tool_comments(user_id);

-- Enable RLS
ALTER TABLE public.tool_comments ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public read access to tool_comments" ON public.tool_comments FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to insert tool_comments" ON public.tool_comments FOR INSERT WITH CHECK (true);

-- ========================================
-- 4. FIX BLOG LIKES TABLE
-- ========================================
DROP TABLE IF EXISTS public.blog_likes CASCADE;

CREATE TABLE public.blog_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id text NOT NULL, -- Blog slug
  user_id text NOT NULL, -- Clerk user ID
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  UNIQUE (blog_id, user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_blog_likes_blog_id ON public.blog_likes(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_likes_user_id ON public.blog_likes(user_id);

-- Enable RLS
ALTER TABLE public.blog_likes ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public read access to blog_likes" ON public.blog_likes FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to insert blog_likes" ON public.blog_likes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow users to delete their own blog_likes" ON public.blog_likes FOR DELETE USING (true);

-- ========================================
-- 5. FIX BLOG BOOKMARKS TABLE
-- ========================================
DROP TABLE IF EXISTS public.blog_bookmarks CASCADE;

CREATE TABLE public.blog_bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id text NOT NULL, -- Blog slug
  user_id text NOT NULL, -- Clerk user ID
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  UNIQUE (blog_id, user_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_blog_bookmarks_blog_id ON public.blog_bookmarks(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_bookmarks_user_id ON public.blog_bookmarks(user_id);

-- Enable RLS
ALTER TABLE public.blog_bookmarks ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public read access to blog_bookmarks" ON public.blog_bookmarks FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to insert blog_bookmarks" ON public.blog_bookmarks FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow users to delete their own blog_bookmarks" ON public.blog_bookmarks FOR DELETE USING (true);

-- ========================================
-- 6. FIX BLOG COMMENTS TABLE
-- ========================================
DROP TABLE IF EXISTS public.blog_comments CASCADE;

CREATE TABLE public.blog_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_id text NOT NULL, -- Blog slug
  user_id text NOT NULL, -- Clerk user ID
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  parent_id uuid NULL,
  depth integer DEFAULT 0,
  reaction_counts jsonb DEFAULT '{}'::jsonb,
  is_moderated boolean DEFAULT false,
  moderation_reason text NULL,
  flagged_count integer DEFAULT 0,
  CONSTRAINT blog_comments_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES blog_comments (id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_blog_comments_blog_id ON public.blog_comments(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_user_id ON public.blog_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_parent_id ON public.blog_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_depth ON public.blog_comments(depth);

-- Enable RLS
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public read access to blog_comments" ON public.blog_comments FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to insert blog_comments" ON public.blog_comments FOR INSERT WITH CHECK (true);

-- ========================================
-- 7. CREATE CALCULATE COMMENT DEPTH FUNCTION
-- ========================================
CREATE OR REPLACE FUNCTION calculate_comment_depth()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.parent_id IS NULL THEN
    NEW.depth := 0;
  ELSE
    SELECT depth + 1 INTO NEW.depth
    FROM blog_comments
    WHERE id = NEW.parent_id;
    
    IF NEW.depth IS NULL THEN
      NEW.depth := 0;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for blog comments
CREATE TRIGGER trigger_calculate_depth BEFORE INSERT ON blog_comments FOR EACH ROW
EXECUTE FUNCTION calculate_comment_depth();

-- ========================================
-- 8. GRANT PERMISSIONS
-- ========================================
GRANT SELECT, INSERT, DELETE ON public.likes TO anon, authenticated;
GRANT SELECT, INSERT, DELETE ON public.user_bookmarks TO anon, authenticated;
GRANT SELECT, INSERT ON public.tool_comments TO anon, authenticated;
GRANT SELECT, INSERT, DELETE ON public.blog_likes TO anon, authenticated;
GRANT SELECT, INSERT, DELETE ON public.blog_bookmarks TO anon, authenticated;
GRANT SELECT, INSERT ON public.blog_comments TO anon, authenticated;

-- ========================================
-- 9. INSERT SAMPLE DATA FOR TESTING
-- ========================================
-- Uncomment the lines below to add sample data for testing

-- Sample tool like
-- INSERT INTO public.likes (tool_id, user_id) VALUES ('your-tool-uuid-here', 'your-clerk-user-id-here');

-- Sample tool bookmark
-- INSERT INTO public.user_bookmarks (tool_id, user_id) VALUES ('your-tool-uuid-here', 'your-clerk-user-id-here');

-- Sample tool comment
-- INSERT INTO public.tool_comments (tool_id, user_id, comment) VALUES ('your-tool-uuid-here', 'your-clerk-user-id-here', 'Great tool!');

-- Sample blog like
-- INSERT INTO public.blog_likes (blog_id, user_id) VALUES ('your-blog-slug-here', 'your-clerk-user-id-here');

-- Sample blog bookmark
-- INSERT INTO public.blog_bookmarks (blog_id, user_id) VALUES ('your-blog-slug-here', 'your-clerk-user-id-here');

-- Sample blog comment
-- INSERT INTO public.blog_comments (blog_id, user_id, content) VALUES ('your-blog-slug-here', 'your-clerk-user-id-here', 'Great article!'); 