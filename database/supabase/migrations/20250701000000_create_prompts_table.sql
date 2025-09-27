-- Create prompts table for Prompts feature
CREATE TABLE prompts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  author text,
  created_at timestamp with time zone DEFAULT now()
); 