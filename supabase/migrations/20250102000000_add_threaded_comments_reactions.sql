-- Migration: Add threaded comments and reactions support
-- This migration adds new columns to existing tables and creates new tables for enhanced commenting

-- Add new columns to existing blog_comments table (non-breaking)
ALTER TABLE blog_comments 
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES blog_comments(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS depth INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS reaction_counts JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS is_moderated BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS moderation_reason TEXT,
ADD COLUMN IF NOT EXISTS flagged_count INTEGER DEFAULT 0;

-- Create index for better performance on threaded queries
CREATE INDEX IF NOT EXISTS idx_blog_comments_parent_id ON blog_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_depth ON blog_comments(depth);
CREATE INDEX IF NOT EXISTS idx_blog_comments_blog_id_parent_id ON blog_comments(blog_id, parent_id);

-- Create table for comment reactions
CREATE TABLE IF NOT EXISTS comment_reactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    comment_id UUID NOT NULL REFERENCES blog_comments(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL, -- Clerk user ID
    reaction_type TEXT NOT NULL CHECK (reaction_type IN ('👍', '❤️', '😂', '😮', '😢', '😡')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(comment_id, user_id, reaction_type)
);

-- Create indexes for comment_reactions
CREATE INDEX IF NOT EXISTS idx_comment_reactions_comment_id ON comment_reactions(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_reactions_user_id ON comment_reactions(user_id);
CREATE INDEX IF NOT EXISTS idx_comment_reactions_type ON comment_reactions(reaction_type);

-- Create table for comment reports/flags
CREATE TABLE IF NOT EXISTS comment_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    comment_id UUID NOT NULL REFERENCES blog_comments(id) ON DELETE CASCADE,
    reporter_user_id TEXT NOT NULL, -- Clerk user ID
    report_reason TEXT NOT NULL CHECK (report_reason IN ('spam', 'inappropriate', 'harassment', 'other')),
    report_details TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
    moderator_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(comment_id, reporter_user_id)
);

-- Create indexes for comment_reports
CREATE INDEX IF NOT EXISTS idx_comment_reports_comment_id ON comment_reports(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_reports_status ON comment_reports(status);
CREATE INDEX IF NOT EXISTS idx_comment_reports_reporter ON comment_reports(reporter_user_id);

-- Create table for next/previous article navigation
CREATE TABLE IF NOT EXISTS blog_navigation (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    blog_id UUID NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
    next_blog_id UUID REFERENCES blogs(id) ON DELETE SET NULL,
    prev_blog_id UUID REFERENCES blogs(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(blog_id)
);

-- Create indexes for blog_navigation
CREATE INDEX IF NOT EXISTS idx_blog_navigation_blog_id ON blog_navigation(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_navigation_next ON blog_navigation(next_blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_navigation_prev ON blog_navigation(prev_blog_id);

-- Create function to update reaction counts
CREATE OR REPLACE FUNCTION update_comment_reaction_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE blog_comments 
        SET reaction_counts = (
            SELECT jsonb_object_agg(reaction_type, count)
            FROM (
                SELECT reaction_type, COUNT(*) as count
                FROM comment_reactions
                WHERE comment_id = NEW.comment_id
                GROUP BY reaction_type
            ) t
        )
        WHERE id = NEW.comment_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE blog_comments 
        SET reaction_counts = (
            SELECT jsonb_object_agg(reaction_type, count)
            FROM (
                SELECT reaction_type, COUNT(*) as count
                FROM comment_reactions
                WHERE comment_id = OLD.comment_id
                GROUP BY reaction_type
            ) t
        )
        WHERE id = OLD.comment_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for reaction counts
DROP TRIGGER IF EXISTS trigger_update_reaction_counts ON comment_reactions;
CREATE TRIGGER trigger_update_reaction_counts
    AFTER INSERT OR DELETE ON comment_reactions
    FOR EACH ROW
    EXECUTE FUNCTION update_comment_reaction_counts();

-- Create function to update flagged count
CREATE OR REPLACE FUNCTION update_comment_flagged_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE blog_comments 
        SET flagged_count = (
            SELECT COUNT(*)
            FROM comment_reports
            WHERE comment_id = NEW.comment_id AND status = 'pending'
        )
        WHERE id = NEW.comment_id;
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        UPDATE blog_comments 
        SET flagged_count = (
            SELECT COUNT(*)
            FROM comment_reports
            WHERE comment_id = NEW.comment_id AND status = 'pending'
        )
        WHERE id = NEW.comment_id;
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for flagged count
DROP TRIGGER IF EXISTS trigger_update_flagged_count ON comment_reports;
CREATE TRIGGER trigger_update_flagged_count
    AFTER INSERT OR UPDATE ON comment_reports
    FOR EACH ROW
    EXECUTE FUNCTION update_comment_flagged_count();

-- Create function to calculate comment depth
CREATE OR REPLACE FUNCTION calculate_comment_depth()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.parent_id IS NOT NULL THEN
        SELECT depth + 1 INTO NEW.depth
        FROM blog_comments
        WHERE id = NEW.parent_id;
    ELSE
        NEW.depth := 0;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for depth calculation
DROP TRIGGER IF EXISTS trigger_calculate_depth ON blog_comments;
CREATE TRIGGER trigger_calculate_depth
    BEFORE INSERT ON blog_comments
    FOR EACH ROW
    EXECUTE FUNCTION calculate_comment_depth();

-- Add RLS policies for new tables
ALTER TABLE comment_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_navigation ENABLE ROW LEVEL SECURITY;

-- Policies for comment_reactions
CREATE POLICY "Users can view all reactions" ON comment_reactions
    FOR SELECT USING (true);

CREATE POLICY "Users can add their own reactions" ON comment_reactions
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own reactions" ON comment_reactions
    FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own reactions" ON comment_reactions
    FOR DELETE USING (auth.uid()::text = user_id);

-- Policies for comment_reports
CREATE POLICY "Users can view their own reports" ON comment_reports
    FOR SELECT USING (auth.uid()::text = reporter_user_id);

CREATE POLICY "Users can add reports" ON comment_reports
    FOR INSERT WITH CHECK (auth.uid()::text = reporter_user_id);

-- Policies for blog_navigation
CREATE POLICY "Anyone can view blog navigation" ON blog_navigation
    FOR SELECT USING (true);

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON comment_reactions TO authenticated;
GRANT SELECT, INSERT ON comment_reports TO authenticated;
GRANT SELECT ON blog_navigation TO authenticated; 