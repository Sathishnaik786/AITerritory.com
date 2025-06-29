-- Contact Us Table
CREATE TABLE IF NOT EXISTS contact_us (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc', now())
);

-- Advertise Requests Table
CREATE TABLE IF NOT EXISTS advertise_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text,
  message text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc', now())
);

-- Submitted Tools Table
CREATE TABLE IF NOT EXISTS submitted_tools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  tool_name text NOT NULL,
  tool_url text NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT timezone('utc', now())
);

-- Feature Requests Table
CREATE TABLE IF NOT EXISTS feature_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  feature text NOT NULL,
  details text,
  created_at timestamp with time zone DEFAULT timezone('utc', now())
); 