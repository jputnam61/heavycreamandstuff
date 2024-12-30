/*
  # Final fix for authentication policies

  1. Changes
    - Drop all existing user_profiles policies
    - Create non-recursive policies using auth.uid() directly
    - Separate policies for admin access
    - Add admin check table to avoid recursion

  2. Security
    - Users can view and update their own profiles
    - New users can create profiles during signup
    - Admins can view all profiles
    - No recursive policy checks
*/

-- Create admin check table
CREATE TABLE IF NOT EXISTS admin_users (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Insert initial admin user
INSERT INTO admin_users (user_id)
SELECT id FROM user_profiles WHERE is_admin = true
ON CONFLICT DO NOTHING;

-- Drop all existing policies
DROP POLICY IF EXISTS "allow_select_own_profile" ON user_profiles;
DROP POLICY IF EXISTS "allow_insert_own_profile" ON user_profiles;
DROP POLICY IF EXISTS "allow_update_own_profile" ON user_profiles;

-- Create new non-recursive policies
CREATE POLICY "select_own_profile"
  ON user_profiles FOR SELECT
  USING (
    auth.uid() = id OR 
    auth.uid() IN (SELECT user_id FROM admin_users)
  );

CREATE POLICY "insert_own_profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "update_own_profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create trigger to maintain admin_users table
CREATE OR REPLACE FUNCTION sync_admin_users()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_admin THEN
    INSERT INTO admin_users (user_id) VALUES (NEW.id)
    ON CONFLICT DO NOTHING;
  ELSE
    DELETE FROM admin_users WHERE user_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sync_admin_status
AFTER INSERT OR UPDATE OF is_admin ON user_profiles
FOR EACH ROW
EXECUTE FUNCTION sync_admin_users();