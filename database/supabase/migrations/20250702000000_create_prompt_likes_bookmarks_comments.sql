-- Likes table
CREATE TABLE prompt_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id uuid REFERENCES prompts(id) ON DELETE CASCADE,
  user_id text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE (prompt_id, user_id)
);

-- Bookmarks table
CREATE TABLE prompt_bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id uuid REFERENCES prompts(id) ON DELETE CASCADE,
  user_id text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE (prompt_id, user_id)
);

-- Comments table
CREATE TABLE prompt_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt_id uuid REFERENCES prompts(id) ON DELETE CASCADE,
  user_id text NOT NULL,
  comment text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
); 