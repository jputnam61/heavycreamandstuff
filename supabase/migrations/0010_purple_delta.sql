/*
  # Add test admin user

  1. Changes
    - Add new admin user to user_profiles
    - Refresh admin users view
*/

DO $$ 
BEGIN
  -- Create admin user profile if it doesn't exist
  INSERT INTO user_profiles (id, full_name, is_admin)
  SELECT 
    id,
    'Test Admin',
    true
  FROM auth.users 
  WHERE email = 'admin@test.com'
  ON CONFLICT (id) DO UPDATE
  SET is_admin = true;

  -- Refresh admin view
  REFRESH MATERIALIZED VIEW CONCURRENTLY admin_users_view;
END $$;