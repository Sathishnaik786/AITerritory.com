-- Add missing fields to testimonials table
ALTER TABLE testimonials 
ADD COLUMN IF NOT EXISTS rating integer DEFAULT 5,
ADD COLUMN IF NOT EXISTS company_name text;

-- Add check constraint for rating (simpler version)
-- First check if constraint exists, if not add it
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'testimonials_rating_check'
    ) THEN
        ALTER TABLE testimonials 
        ADD CONSTRAINT testimonials_rating_check 
        CHECK (rating >= 1 AND rating <= 5);
    END IF;
END $$; 