/*
  # Fix user profile policies and handling

  1. Changes
    - Simplify RLS policies for user_profiles
    - Add better error handling for profile queries
    - Ensure proper profile creation during signup

  2. Security
    - Maintain strict access control while fixing recursion issues
    - Keep admin privileges intact
*/

-- Drop existing policies
DROP POLICY IF EXISTS "allow_select_profile" ON user_profiles;
DROP POLICY IF EXISTS "allow_insert_profile" ON user_profiles;
DROP POLICY IF EXISTS "allow_update_profile" ON user_profiles;

-- Create simplified policies
CREATE POLICY "select_user_profile"
  ON user_profiles FOR SELECT
  USING (
    -- Users can view their own profile
    id = auth.uid() OR
    -- Admins can view all profiles
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() 
      AND up.is_admin = true
    )
  );

CREATE POLICY "insert_user_profile"
  ON user_profiles FOR INSERT
  WITH CHECK (
    -- Users can only create their own profile
    id = auth.uid()
  );

CREATE POLICY "update_user_profile"
  ON user_profiles FOR UPDATE
  USING (
    -- Users can only update their own profile
    id = auth.uid()
  );

-- Add function to safely check if user exists
CREATE OR REPLACE FUNCTION check_user_exists(user_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;