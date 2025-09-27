-- Create likes table
CREATE TABLE IF NOT EXISTS public.likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id uuid REFERENCES tools(id) ON DELETE CASCADE,
  user_id uuid, -- optional, for tracking users
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Create shares table
CREATE TABLE IF NOT EXISTS public.shares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id uuid REFERENCES tools(id) ON DELETE CASCADE,
  user_id uuid, -- optional, for tracking users
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_likes_tool_id ON public.likes(tool_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON public.likes(user_id);
CREATE INDEX IF NOT EXISTS idx_shares_tool_id ON public.shares(tool_id);
CREATE INDEX IF NOT EXISTS idx_shares_user_id ON public.shares(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shares ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to likes" ON public.likes
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to shares" ON public.shares
  FOR SELECT USING (true);

-- Create policies for authenticated users to insert
CREATE POLICY "Allow authenticated users to insert likes" ON public.likes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated users to insert shares" ON public.shares
  FOR INSERT WITH CHECK (true);

-- Create policies for users to delete their own likes
CREATE POLICY "Allow users to delete their own likes" ON public.likes
  FOR DELETE USING (true);

-- Grant necessary permissions
GRANT SELECT, INSERT, DELETE ON public.likes TO anon, authenticated;
GRANT SELECT, INSERT ON public.shares TO anon, authenticated; 