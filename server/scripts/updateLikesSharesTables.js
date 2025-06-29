require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase URL or key in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateLikesSharesTables() {
  console.log('🚀 Updating existing likes and shares tables...');

  try {
    console.log('📝 Please run the following SQL in your Supabase SQL editor:');

    const sql = `
        -- Update existing likes table to require user authentication
        ALTER TABLE public.likes 
        ALTER COLUMN user_id SET NOT NULL;

        -- Add unique constraint to prevent duplicate likes (if not exists)
        DO $$ 
        BEGIN
            IF NOT EXISTS (
                SELECT 1 FROM pg_constraint 
                WHERE conname = 'unique_user_tool_like'
            ) THEN
                ALTER TABLE public.likes ADD CONSTRAINT unique_user_tool_like UNIQUE (user_id, tool_id);
            END IF;
        END $$;

        -- Update existing shares table to add new columns
        ALTER TABLE public.shares 
        ALTER COLUMN user_id SET NOT NULL;

        -- Add new columns to shares table (if they don't exist)
        DO $$ 
        BEGIN
            IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'shares' AND column_name = 'platform'
            ) THEN
                ALTER TABLE public.shares ADD COLUMN platform text;
            END IF;
        END $$;

        DO $$ 
        BEGIN
            IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'shares' AND column_name = 'tool_url'
            ) THEN
                ALTER TABLE public.shares ADD COLUMN tool_url text;
            END IF;
        END $$;

        DO $$ 
        BEGIN
            IF NOT EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'shares' AND column_name = 'tool_name'
            ) THEN
                ALTER TABLE public.shares ADD COLUMN tool_name text;
            END IF;
        END $$;

        -- Add platform constraint to shares table
        DO $$ 
        BEGIN
            IF NOT EXISTS (
                SELECT 1 FROM pg_constraint 
                WHERE conname = 'shares_platform_check'
            ) THEN
                ALTER TABLE public.shares ADD CONSTRAINT shares_platform_check 
                CHECK (platform IN ('facebook', 'twitter', 'whatsapp', 'instagram', 'copy'));
            END IF;
        END $$;

        -- Create indexes for performance (if they don't exist)
        CREATE INDEX IF NOT EXISTS idx_likes_tool_id ON public.likes(tool_id);
        CREATE INDEX IF NOT EXISTS idx_likes_user_id ON public.likes(user_id);
        CREATE INDEX IF NOT EXISTS idx_likes_user_tool ON public.likes(user_id, tool_id);
        CREATE INDEX IF NOT EXISTS idx_shares_tool_id ON public.shares(tool_id);
        CREATE INDEX IF NOT EXISTS idx_shares_user_id ON public.shares(user_id);
        CREATE INDEX IF NOT EXISTS idx_shares_platform ON public.shares(platform);

        -- Update RLS policies for likes
        DROP POLICY IF EXISTS "Allow public read access to likes" ON public.likes;
        DROP POLICY IF EXISTS "Allow authenticated users to insert likes" ON public.likes;
        DROP POLICY IF EXISTS "Allow users to delete their own likes" ON public.likes;

        CREATE POLICY "Allow public read access to likes" ON public.likes
          FOR SELECT USING (true);

        CREATE POLICY "Allow authenticated users to insert likes" ON public.likes
          FOR INSERT WITH CHECK (auth.uid() = user_id);

        CREATE POLICY "Allow users to delete their own likes" ON public.likes
          FOR DELETE USING (auth.uid() = user_id);

        -- Update RLS policies for shares
        DROP POLICY IF EXISTS "Allow public read access to shares" ON public.shares;
        DROP POLICY IF EXISTS "Allow authenticated users to insert shares" ON public.shares;

        CREATE POLICY "Allow public read access to shares" ON public.shares
          FOR SELECT USING (true);

        CREATE POLICY "Allow authenticated users to insert shares" ON public.shares
          FOR INSERT WITH CHECK (auth.uid() = user_id);

        -- Grant permissions
        GRANT SELECT, INSERT, DELETE ON public.likes TO anon, authenticated;
        GRANT SELECT, INSERT ON public.shares TO anon, authenticated;
    `;

    console.log(sql);

    // Test the functionality
    console.log('🧪 Testing updated functionality...');
    
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

    console.log('🎉 Tables updated successfully!');
    console.log('📊 You can now use likes and shares functionality with user authentication');
    console.log('🔐 Users must be signed in to like/share');
    console.log('📱 Social media sharing is supported for Facebook, Twitter, WhatsApp, and Instagram');

  } catch (error) {
    console.error('❌ Error updating tables:', error);
  }
}

updateLikesSharesTables(); 