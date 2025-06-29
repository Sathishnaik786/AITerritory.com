CREATE TABLE youtube_videos (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    video_id TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    video_type TEXT NOT NULL CHECK (video_type IN ('video', 'short')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO youtube_videos (video_id, title, description, thumbnail_url, video_type) VALUES
('dQw4w9WgXcQ', 'Top 5 AI Tools You Aren''t Using (But Should Be!)', 'Discover the best AI tools that can boost your productivity.', 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', 'video'),
('L_jWHffIx5E', 'How to Automate Your Life with AI', 'A comprehensive guide on using AI for automation.', 'https://img.youtube.com/vi/L_jWHffIx5E/maxresdefault.jpg', 'video'),
('3tmd-ClpJxA', 'The Future of AI in Business', 'Exploring the impact of artificial intelligence on the business world.', 'https://img.youtube.com/vi/3tmd-ClpJxA/maxresdefault.jpg', 'video'),
('SZj6rAYkYOg', 'AI Art Generation: Midjourney vs Stable Diffusion', 'A comparison between two popular AI art generators.', 'https://img.youtube.com/vi/SZj6rAYkYOg/maxresdefault.jpg', 'video'),
('jNQXAC9IVRw', '60-Second AI Tip: Prompt Engineering', 'A quick tip on how to improve your AI prompts.', 'https://img.youtube.com/vi/jNQXAC9IVRw/maxresdefault.jpg', 'short'),
('v-n1vK_8w2o', 'Can AI Write Better Than Humans?', 'An investigation into the capabilities of AI writing tools.', 'https://img.youtube.com/vi/v-n1vK_8w2o/maxresdefault.jpg', 'short'),
('i-H_t3e_uS4', 'This AI Tool is a Game Changer', 'A look at a revolutionary new AI tool.', 'https://img.youtube.com/vi/i-H_t3e_uS4/maxresdefault.jpg', 'short'),
('p7YXXieghto', 'AI Meme of the Day', 'A fun look at AI-generated memes.', 'https://img.youtube.com/vi/p7YXXieghto/maxresdefault.jpg', 'short'); 