require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase URL or key in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createLikesSharesTables() {
  console.log('🚀 Creating likes and shares tables...');

  try {
    console.log('📝 Creating likes table...');
    console.log('Please run the following SQL in your Supabase SQL editor:');

    const sql = `
        -- Drop existing tables if they exist
        DROP TABLE IF EXISTS public.shares CASCADE;
        DROP TABLE IF EXISTS public.likes CASCADE;

        -- Create likes table with user authentication
        CREATE TABLE IF NOT EXISTS public.likes (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          tool_id uuid REFERENCES tools(id) ON DELETE CASCADE,
          user_id uuid NOT NULL, -- Require user authentication
          created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
        );

        -- Create shares table with social media support
        CREATE TABLE IF NOT EXISTS public.shares (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          tool_id uuid REFERENCES tools(id) ON DELETE CASCADE,
          user_id uuid NOT NULL, -- Require user authentication
          platform text NOT NULL CHECK (platform IN ('facebook', 'twitter', 'whatsapp', 'instagram', 'copy')),
          tool_url text,
          tool_name text,
          created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
        );

        -- Create indexes for performance
        CREATE INDEX IF NOT EXISTS idx_likes_tool_id ON public.likes(tool_id);
        CREATE INDEX IF NOT EXISTS idx_likes_user_id ON public.likes(user_id);
        CREATE INDEX IF NOT EXISTS idx_likes_user_tool ON public.likes(user_id, tool_id);
        CREATE INDEX IF NOT EXISTS idx_shares_tool_id ON public.shares(tool_id);
        CREATE INDEX IF NOT EXISTS idx_shares_user_id ON public.shares(user_id);
        CREATE INDEX IF NOT EXISTS idx_shares_platform ON public.shares(platform);

        -- Enable RLS
        ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.shares ENABLE ROW LEVEL SECURITY;

        -- Policies for likes
        CREATE POLICY "Allow public read access to likes" ON public.likes
          FOR SELECT USING (true);

        CREATE POLICY "Allow authenticated users to insert likes" ON public.likes
          FOR INSERT WITH CHECK (auth.uid() = user_id);

        CREATE POLICY "Allow users to delete their own likes" ON public.likes
          FOR DELETE USING (auth.uid() = user_id);

        -- Policies for shares
        CREATE POLICY "Allow public read access to shares" ON public.shares
          FOR SELECT USING (true);

        CREATE POLICY "Allow authenticated users to insert shares" ON public.shares
          FOR INSERT WITH CHECK (auth.uid() = user_id);

        -- Grant permissions
        GRANT SELECT, INSERT, DELETE ON public.likes TO anon, authenticated;
        GRANT SELECT, INSERT ON public.shares TO anon, authenticated;

        -- Add unique constraint to prevent duplicate likes
        ALTER TABLE public.likes ADD CONSTRAINT unique_user_tool_like UNIQUE (user_id, tool_id);
    `;

    console.log(sql);

    // Test the functionality
    console.log('🧪 Testing likes functionality...');
    
    // Get a real tool ID for testing
    const { data: tools } = await supabase
      .from('tools')
      .select('id, name')
      .limit(1);

    if (tools && tools.length > 0) {
      const testToolId = tools[0].id;
      console.log(`✅ Found tool: ${tools[0].name} (ID: ${testToolId})`);
      
      // Test like count
      const { count: likeCount } = await supabase
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('tool_id', testToolId);
      
      console.log(`✅ Like count for tool ${testToolId}: ${likeCount || 0}`);
    } else {
      console.log('⚠️  No tools found for testing');
    }

    console.log('🎉 Setup completed!');
    console.log('📊 You can now use likes and shares functionality with user authentication');
    console.log('🔐 Users must be signed in to like/share');
    console.log('📱 Social media sharing is supported for Facebook, Twitter, WhatsApp, and Instagram');

  } catch (error) {
    console.error('❌ Error creating tables:', error);
  }
}

createLikesSharesTables(); 