-- Check if youtube_videos table exists before creating it
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'youtube_videos') THEN
    CREATE TABLE youtube_videos (
      id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      video_id TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      description TEXT,
      thumbnail_url TEXT,
      video_type TEXT NOT NULL CHECK (video_type IN ('video', 'short')),
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  END IF;
END $$;

-- Insert videos only if they don't already exist
DO $$
BEGIN
  -- Video 1
  IF NOT EXISTS (SELECT 1 FROM youtube_videos WHERE video_id = 'dQw4w9WgXcQ') THEN
    INSERT INTO youtube_videos (video_id, title, description, thumbnail_url, video_type) 
    VALUES ('dQw4w9WgXcQ', 'Top 5 AI Tools You Aren''t Using (But Should Be!)', 'Discover the best AI tools that can boost your productivity.', 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', 'video');
  END IF;

  -- Video 2
  IF NOT EXISTS (SELECT 1 FROM youtube_videos WHERE video_id = 'L_jWHffIx5E') THEN
    INSERT INTO youtube_videos (video_id, title, description, thumbnail_url, video_type) 
    VALUES ('L_jWHffIx5E', 'How to Automate Your Life with AI', 'A comprehensive guide on using AI for automation.', 'https://img.youtube.com/vi/L_jWHffIx5E/maxresdefault.jpg', 'video');
  END IF;

  -- Video 3
  IF NOT EXISTS (SELECT 1 FROM youtube_videos WHERE video_id = '3tmd-ClpJxA') THEN
    INSERT INTO youtube_videos (video_id, title, description, thumbnail_url, video_type) 
    VALUES ('3tmd-ClpJxA', 'The Future of AI in Business', 'Exploring the impact of artificial intelligence on the business world.', 'https://img.youtube.com/vi/3tmd-ClpJxA/maxresdefault.jpg', 'video');
  END IF;

  -- Video 4
  IF NOT EXISTS (SELECT 1 FROM youtube_videos WHERE video_id = 'SZj6rAYkYOg') THEN
    INSERT INTO youtube_videos (video_id, title, description, thumbnail_url, video_type) 
    VALUES ('SZj6rAYkYOg', 'AI Art Generation: Midjourney vs Stable Diffusion', 'A comparison between two popular AI art generators.', 'https://img.youtube.com/vi/SZj6rAYkYOg/maxresdefault.jpg', 'video');
  END IF;

  -- Short 1
  IF NOT EXISTS (SELECT 1 FROM youtube_videos WHERE video_id = 'jNQXAC9IVRw') THEN
    INSERT INTO youtube_videos (video_id, title, description, thumbnail_url, video_type) 
    VALUES ('jNQXAC9IVRw', '60-Second AI Tip: Prompt Engineering', 'A quick tip on how to improve your AI prompts.', 'https://img.youtube.com/vi/jNQXAC9IVRw/maxresdefault.jpg', 'short');
  END IF;

  -- Short 2
  IF NOT EXISTS (SELECT 1 FROM youtube_videos WHERE video_id = 'v-n1vK_8w2o') THEN
    INSERT INTO youtube_videos (video_id, title, description, thumbnail_url, video_type) 
    VALUES ('v-n1vK_8w2o', 'Can AI Write Better Than Humans?', 'An investigation into the capabilities of AI writing tools.', 'https://img.youtube.com/vi/v-n1vK_8w2o/maxresdefault.jpg', 'short');
  END IF;

  -- Short 3
  IF NOT EXISTS (SELECT 1 FROM youtube_videos WHERE video_id = 'i-H_t3e_uS4') THEN
    INSERT INTO youtube_videos (video_id, title, description, thumbnail_url, video_type) 
    VALUES ('i-H_t3e_uS4', 'This AI Tool is a Game Changer', 'A look at a revolutionary new AI tool.', 'https://img.youtube.com/vi/i-H_t3e_uS4/maxresdefault.jpg', 'short');
  END IF;

  -- Short 4
  IF NOT EXISTS (SELECT 1 FROM youtube_videos WHERE video_id = 'p7YXXieghto') THEN
    INSERT INTO youtube_videos (video_id, title, description, thumbnail_url, video_type) 
    VALUES ('p7YXXieghto', 'AI Meme of the Day', 'A fun look at AI-generated memes.', 'https://img.youtube.com/vi/p7YXXieghto/maxresdefault.jpg', 'short');
  END IF;
END $$;