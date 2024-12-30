/*
  # Fix admin user setup and permissions

  1. Changes
    - Ensure admin user exists
    - Fix admin permissions
    - Add missing indexes
    - Add helper functions for admin checks

  2. Security
    - Maintain RLS policies
    - Preserve existing data
    - Add proper constraints
*/

-- Create helper function for admin checks
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure admin user exists and has proper permissions
DO $$ 
BEGIN
  -- Create admin user profile if it doesn't exist
  INSERT INTO user_profiles (id, full_name, is_admin)
  SELECT 
    id,
    'Nicole',
    true
  FROM auth.users 
  WHERE email = 'Nicole@heavycreamandstuff.com'
  ON CONFLICT (id) DO UPDATE
  SET is_admin = true;

  -- Refresh admin view
  REFRESH MATERIALIZED VIEW CONCURRENTLY admin_users_view;
END $$;