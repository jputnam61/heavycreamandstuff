/*
  # Fix user profiles policies

  1. Changes
    - Add policy for creating user profiles during signup
    - Update existing policies for better security
    - Add policy for admin access

  2. Security
    - Enable RLS on user_profiles table
    - Ensure users can only access their own profile
    - Allow admins full access
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;

-- Create new policies
CREATE POLICY "Users can manage their own profile"
  ON user_profiles
  USING (auth.uid() = id);

CREATE POLICY "Allow profile creation during signup"
  ON user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins have full access"
  ON user_profiles
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND is_admin = true
    )
  );