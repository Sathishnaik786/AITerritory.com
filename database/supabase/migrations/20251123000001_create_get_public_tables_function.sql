-- Create function to get public table names
CREATE OR REPLACE FUNCTION get_public_tables()
RETURNS TABLE(name TEXT)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT table_name::TEXT
  FROM information_schema.tables
  WHERE table_schema = 'public'
  ORDER BY table_name;
END;
$$;

-- Grant execute permission to anon and authenticated roles
GRANT EXECUTE ON FUNCTION get_public_tables() TO anon, authenticated;