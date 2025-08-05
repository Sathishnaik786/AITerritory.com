-- Create the calculate_comment_depth function for the trigger
CREATE OR REPLACE FUNCTION calculate_comment_depth()
RETURNS TRIGGER AS $$
BEGIN
  -- If parent_id is NULL, depth is 0
  IF NEW.parent_id IS NULL THEN
    NEW.depth := 0;
  ELSE
    -- Get the depth of the parent comment and add 1
    SELECT depth + 1 INTO NEW.depth
    FROM blog_comments
    WHERE id = NEW.parent_id;
    
    -- If parent not found, default to 0
    IF NEW.depth IS NULL THEN
      NEW.depth := 0;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql; 