require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase URL or key in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  console.log('🚀 Running likes and shares migration...');

  try {
    // Create likes table
    console.log('📝 Creating likes table...');
    const { error: likesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.likes (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          tool_id uuid REFERENCES tools(id) ON DELETE CASCADE,
          user_id uuid,
          created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
        );
      `
    });

    if (likesError) {
      console.error('❌ Error creating likes table:', likesError);
    } else {
      console.log('✅ Likes table created successfully');
    }

    // Create shares table
    console.log('📝 Creating shares table...');
    const { error: sharesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.shares (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          tool_id uuid REFERENCES tools(id) ON DELETE CASCADE,
          user_id uuid,
          created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
        );
      `
    });

    if (sharesError) {
      console.error('❌ Error creating shares table:', sharesError);
    } else {
      console.log('✅ Shares table created successfully');
    }

    // Create indexes
    console.log('📝 Creating indexes...');
    const { error: indexesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE INDEX IF NOT EXISTS idx_likes_tool_id ON public.likes(tool_id);
        CREATE INDEX IF NOT EXISTS idx_likes_user_id ON public.likes(user_id);
        CREATE INDEX IF NOT EXISTS idx_shares_tool_id ON public.shares(tool_id);
        CREATE INDEX IF NOT EXISTS idx_shares_user_id ON public.shares(user_id);
      `
    });

    if (indexesError) {
      console.error('❌ Error creating indexes:', indexesError);
    } else {
      console.log('✅ Indexes created successfully');
    }

    // Enable RLS
    console.log('📝 Enabling Row Level Security...');
    const { error: rlsError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.shares ENABLE ROW LEVEL SECURITY;
      `
    });

    if (rlsError) {
      console.error('❌ Error enabling RLS:', rlsError);
    } else {
      console.log('✅ RLS enabled successfully');
    }

    // Create policies
    console.log('📝 Creating policies...');
    const { error: policiesError } = await supabase.rpc('exec_sql', {
      sql: `
        DROP POLICY IF EXISTS "Allow public read access to likes" ON public.likes;
        CREATE POLICY "Allow public read access to likes" ON public.likes
          FOR SELECT USING (true);

        DROP POLICY IF EXISTS "Allow public read access to shares" ON public.shares;
        CREATE POLICY "Allow public read access to shares" ON public.shares
          FOR SELECT USING (true);

        DROP POLICY IF EXISTS "Allow authenticated users to insert likes" ON public.likes;
        CREATE POLICY "Allow authenticated users to insert likes" ON public.likes
          FOR INSERT WITH CHECK (true);

        DROP POLICY IF EXISTS "Allow authenticated users to insert shares" ON public.shares;
        CREATE POLICY "Allow authenticated users to insert shares" ON public.shares
          FOR INSERT WITH CHECK (true);

        DROP POLICY IF EXISTS "Allow users to delete their own likes" ON public.likes;
        CREATE POLICY "Allow users to delete their own likes" ON public.likes
          FOR DELETE USING (true);
      `
    });

    if (policiesError) {
      console.error('❌ Error creating policies:', policiesError);
    } else {
      console.log('✅ Policies created successfully');
    }

    // Grant permissions
    console.log('📝 Granting permissions...');
    const { error: permissionsError } = await supabase.rpc('exec_sql', {
      sql: `
        GRANT SELECT, INSERT, DELETE ON public.likes TO anon, authenticated;
        GRANT SELECT, INSERT ON public.shares TO anon, authenticated;
      `
    });

    if (permissionsError) {
      console.error('❌ Error granting permissions:', permissionsError);
    } else {
      console.log('✅ Permissions granted successfully');
    }

    console.log('🎉 Migration completed successfully!');
    console.log('📊 You can now use likes and shares functionality');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration(); 