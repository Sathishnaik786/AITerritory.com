-- Add missing fields to testimonials table
ALTER TABLE testimonials 
ADD COLUMN IF NOT EXISTS rating integer DEFAULT 5,
ADD COLUMN IF NOT EXISTS company_name text;

-- Add check constraint for rating
ALTER TABLE testimonials 
ADD CONSTRAINT IF NOT EXISTS testimonials_rating_check 
CHECK (rating >= 1 AND rating <= 5); 