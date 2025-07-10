-- Tool Submissions Table for new Submit Tool flow
CREATE TABLE IF NOT EXISTS tool_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  tool_name text NOT NULL,
  tool_url text NOT NULL,
  youtube_url text,
  plan text NOT NULL,
  payment_status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT timezone('utc', now()),
  updated_at timestamp with time zone DEFAULT timezone('utc', now())
); 