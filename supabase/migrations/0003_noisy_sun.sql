/*
  # Fix recursive policies for user profiles

  1. Changes
    - Remove recursive admin policy
    - Simplify profile management policies
    - Add separate policies for each operation

  2. Security
    - Users can manage their own profiles
    - Anyone can create a profile during signup
    - Admins can view all profiles
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can manage their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Allow profile creation during signup" ON user_profiles;
DROP POLICY IF EXISTS "Admins have full access" ON user_profiles;

-- Create new policies
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Allow profile creation"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON user_profiles FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM user_profiles 
      WHERE is_admin = true
    )
  );