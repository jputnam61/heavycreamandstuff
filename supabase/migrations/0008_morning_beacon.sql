/*
  # Fix user profile policies recursion

  1. Changes
    - Remove recursive admin checks
    - Simplify policies to prevent circular dependencies
    - Add admin role check function
    - Update indexes for better performance

  2. Security
    - Maintain secure access control
    - Preserve admin privileges
    - Keep row-level security enabled
*/

-- Drop existing policies
DROP POLICY IF EXISTS "select_user_profile" ON user_profiles;
DROP POLICY IF EXISTS "insert_user_profile" ON user_profiles;
DROP POLICY IF EXISTS "update_user_profile" ON user_profiles;

-- Create admin check materialized view for better performance
CREATE MATERIALIZED VIEW IF NOT EXISTS admin_users_view AS
SELECT id FROM user_profiles WHERE is_admin = true;

-- Create index on materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_admin_users_view ON admin_users_view(id);

-- Create refresh function
CREATE OR REPLACE FUNCTION refresh_admin_users_view()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY admin_users_view;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to refresh view
CREATE TRIGGER refresh_admin_users_view
AFTER INSERT OR UPDATE OR DELETE ON user_profiles
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_admin_users_view();

-- Create new simplified policies
CREATE POLICY "allow_select_profile"
  ON user_profiles FOR SELECT
  USING (
    id = auth.uid() OR 
    auth.uid() IN (SELECT id FROM admin_users_view)
  );

CREATE POLICY "allow_insert_profile"
  ON user_profiles FOR INSERT
  WITH CHECK (id = auth.uid());

CREATE POLICY "allow_update_profile"
  ON user_profiles FOR UPDATE
  USING (id = auth.uid());

-- Refresh the view initially
REFRESH MATERIALIZED VIEW CONCURRENTLY admin_users_view;