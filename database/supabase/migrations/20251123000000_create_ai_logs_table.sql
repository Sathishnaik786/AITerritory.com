-- Create ai_logs table for AI Assistant functionality
CREATE TABLE IF NOT EXISTS ai_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NULL,
    session_id UUID NULL,
    message TEXT,
    response TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_ai_logs_session_id ON ai_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_logs_created_at ON ai_logs(created_at);

-- Add comments for documentation
COMMENT ON TABLE ai_logs IS 'Logs for AI Assistant interactions';
COMMENT ON COLUMN ai_logs.id IS 'Unique identifier for each log entry';
COMMENT ON COLUMN ai_logs.user_id IS 'User identifier (nullable)';
COMMENT ON COLUMN ai_logs.session_id IS 'Session identifier (nullable)';
COMMENT ON COLUMN ai_logs.message IS 'User message sent to AI Assistant';
COMMENT ON COLUMN ai_logs.response IS 'AI Assistant response';
COMMENT ON COLUMN ai_logs.created_at IS 'Timestamp when the log entry was created';