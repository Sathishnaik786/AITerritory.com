-- Add transaction_id to tool_submissions for PayPal payments
ALTER TABLE tool_submissions ADD COLUMN IF NOT EXISTS transaction_id text; 