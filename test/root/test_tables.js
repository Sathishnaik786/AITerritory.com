const { supabase } = require('./server/lib/supabase');

async function testTables() {
  try {
    console.log('Testing blog_likes table...');
    const { data: likesData, error: likesError } = await supabase
      .from('blog_likes')
      .select('count')
      .limit(1);
    
    if (likesError) {
      console.log('blog_likes table error:', likesError.message);
      if (likesError.message.includes('does not exist')) {
        console.log('Creating blog_likes table...');
        await createBlogLikesTable();
      }
    } else {
      console.log('blog_likes table exists');
    }

    console.log('Testing blog_bookmarks table...');
    const { data: bookmarksData, error: bookmarksError } = await supabase
      .from('blog_bookmarks')
      .select('count')
      .limit(1);
    
    if (bookmarksError) {
      console.log('blog_bookmarks table error:', bookmarksError.message);
      if (bookmarksError.message.includes('does not exist')) {
        console.log('Creating blog_bookmarks table...');
        await createBlogBookmarksTable();
      }
    } else {
      console.log('blog_bookmarks table exists');
    }

    console.log('Testing blog_comments table...');
    const { data: commentsData, error: commentsError } = await supabase
      .from('blog_comments')
      .select('count')
      .limit(1);
    
    if (commentsError) {
      console.log('blog_comments table error:', commentsError.message);
      if (commentsError.message.includes('does not exist')) {
        console.log('Creating blog_comments table...');
        await createBlogCommentsTable();
      }
    } else {
      console.log('blog_comments table exists');
    }

  } catch (error) {
    console.error('Error testing tables:', error);
  }
}

async function createBlogLikesTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS public.blog_likes (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      blog_id text NOT NULL,
      user_id text NOT NULL,
      created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
      UNIQUE (blog_id, user_id)
    );
    
    CREATE INDEX IF NOT EXISTS idx_blog_likes_blog_id ON public.blog_likes(blog_id);
    CREATE INDEX IF NOT EXISTS idx_blog_likes_user_id ON public.blog_likes(user_id);
    
    ALTER TABLE public.blog_likes ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "Allow public read access to blog_likes" ON public.blog_likes FOR SELECT USING (true);
    CREATE POLICY "Allow authenticated users to insert blog_likes" ON public.blog_likes FOR INSERT WITH CHECK (true);
    CREATE POLICY "Allow users to delete their own blog_likes" ON public.blog_likes FOR DELETE USING (true);
    
    GRANT SELECT, INSERT, DELETE ON public.blog_likes TO anon, authenticated;
  `;
  
  try {
    const { error } = await supabase.rpc('exec_sql', { sql });
    if (error) {
      console.error('Error creating blog_likes table:', error);
    } else {
      console.log('blog_likes table created successfully');
    }
  } catch (error) {
    console.error('Error creating blog_likes table:', error);
  }
}

async function createBlogBookmarksTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS public.blog_bookmarks (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      blog_id text NOT NULL,
      user_id text NOT NULL,
      created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
      UNIQUE (blog_id, user_id)
    );
    
    CREATE INDEX IF NOT EXISTS idx_blog_bookmarks_blog_id ON public.blog_bookmarks(blog_id);
    CREATE INDEX IF NOT EXISTS idx_blog_bookmarks_user_id ON public.blog_bookmarks(user_id);
    
    ALTER TABLE public.blog_bookmarks ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "Allow public read access to blog_bookmarks" ON public.blog_bookmarks FOR SELECT USING (true);
    CREATE POLICY "Allow authenticated users to insert blog_bookmarks" ON public.blog_bookmarks FOR INSERT WITH CHECK (true);
    CREATE POLICY "Allow users to delete their own blog_bookmarks" ON public.blog_bookmarks FOR DELETE USING (true);
    
    GRANT SELECT, INSERT, DELETE ON public.blog_bookmarks TO anon, authenticated;
  `;
  
  try {
    const { error } = await supabase.rpc('exec_sql', { sql });
    if (error) {
      console.error('Error creating blog_bookmarks table:', error);
    } else {
      console.log('blog_bookmarks table created successfully');
    }
  } catch (error) {
    console.error('Error creating blog_bookmarks table:', error);
  }
}

async function createBlogCommentsTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS public.blog_comments (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      blog_id text NOT NULL,
      user_id text NOT NULL,
      content text NOT NULL,
      parent_id uuid REFERENCES public.blog_comments(id) ON DELETE CASCADE,
      depth integer DEFAULT 0,
      created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
    );
    
    CREATE INDEX IF NOT EXISTS idx_blog_comments_blog_id ON public.blog_comments(blog_id);
    CREATE INDEX IF NOT EXISTS idx_blog_comments_user_id ON public.blog_comments(user_id);
    CREATE INDEX IF NOT EXISTS idx_blog_comments_parent_id ON public.blog_comments(parent_id);
    CREATE INDEX IF NOT EXISTS idx_blog_comments_depth ON public.blog_comments(depth);
    
    ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "Allow public read access to blog_comments" ON public.blog_comments FOR SELECT USING (true);
    CREATE POLICY "Allow authenticated users to insert blog_comments" ON public.blog_comments FOR INSERT WITH CHECK (true);
    CREATE POLICY "Allow users to delete their own blog_comments" ON public.blog_comments FOR DELETE USING (true);
    
    GRANT SELECT, INSERT, DELETE ON public.blog_comments TO anon, authenticated;
  `;
  
  try {
    const { error } = await supabase.rpc('exec_sql', { sql });
    if (error) {
      console.error('Error creating blog_comments table:', error);
    } else {
      console.log('blog_comments table created successfully');
    }
  } catch (error) {
    console.error('Error creating blog_comments table:', error);
  }
}

testTables(); 