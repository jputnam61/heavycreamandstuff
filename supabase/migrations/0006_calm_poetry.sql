/*
  # Fix user profile policies and improve profile creation

  1. Changes
    - Drop existing policies and triggers
    - Create new non-recursive policies
    - Add function to check admin status without recursion
    - Add indexes for better performance

  2. Security
    - Maintain RLS
    - Ensure proper access control
    - Prevent recursion issues
*/

-- Drop existing policies and triggers
DROP TRIGGER IF EXISTS sync_admin_status ON user_profiles;
DROP FUNCTION IF EXISTS sync_admin_users();
DROP POLICY IF EXISTS "select_own_profile" ON user_profiles;
DROP POLICY IF EXISTS "insert_own_profile" ON user_profiles;
DROP POLICY IF EXISTS "update_own_profile" ON user_profiles;

-- Create admin check function
CREATE OR REPLACE FUNCTION is_admin(user_uuid uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = user_uuid AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create new policies
CREATE POLICY "allow_select_profile"
  ON user_profiles FOR SELECT
  USING (
    id = auth.uid() OR 
    is_admin(auth.uid())
  );

CREATE POLICY "allow_insert_profile"
  ON user_profiles FOR INSERT
  WITH CHECK (
    id = auth.uid()
  );

CREATE POLICY "allow_update_profile"
  ON user_profiles FOR UPDATE
  USING (
    id = auth.uid()
  );

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_id ON user_profiles(id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_admin ON user_profiles(id) WHERE is_admin = true;