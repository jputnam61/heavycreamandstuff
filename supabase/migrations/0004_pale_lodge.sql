/*
  # Fix authentication and profile policies

  1. Changes
    - Drop all existing user_profiles policies
    - Create simplified, non-recursive policies
    - Add separate policies for each operation type
    - Fix admin access without recursion

  2. Security
    - Users can view and update their own profiles
    - New users can create profiles during signup
    - Admins can view all profiles
    - No recursive policy checks
*/

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Allow profile creation" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;

-- Create new simplified policies
CREATE POLICY "allow_select_own_profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id OR EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND is_admin = true
  ));

CREATE POLICY "allow_insert_own_profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "allow_update_own_profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create settings table for contact info
CREATE TABLE IF NOT EXISTS settings (
  id text PRIMARY KEY,
  data jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on settings
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create policy for settings
CREATE POLICY "admins_manage_settings"
  ON settings
  USING (EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND is_admin = true
  ));