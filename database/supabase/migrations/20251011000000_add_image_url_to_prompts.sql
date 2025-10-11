-- Add image_url column to prompts table
ALTER TABLE prompts ADD COLUMN IF NOT EXISTS image_url text;