-- Add threaded comments support to prompt_comments table
-- This migration adds parent_id column for replies and other necessary columns

-- Add parent_id column for threaded comments
ALTER TABLE prompt_comments 
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES prompt_comments(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create indexes for better performance on threaded queries
CREATE INDEX IF NOT EXISTS idx_prompt_comments_parent_id ON prompt_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_prompt_comments_prompt_id_parent_id ON prompt_comments(prompt_id, parent_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_prompt_comments_updated_at ON prompt_comments;
CREATE TRIGGER update_prompt_comments_updated_at
    BEFORE UPDATE ON prompt_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Update existing comments to have updated_at = created_at
UPDATE prompt_comments SET updated_at = created_at WHERE updated_at IS NULL;  