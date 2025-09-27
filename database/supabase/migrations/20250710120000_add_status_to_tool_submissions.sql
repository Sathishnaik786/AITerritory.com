-- Add status column for moderation
ALTER TABLE tool_submissions ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending'; 