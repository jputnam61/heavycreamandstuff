-- Add category column to recipes table
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS category text;

-- Add is_premium column if it doesn't exist
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS is_premium boolean DEFAULT false;

-- Add price column if it doesn't exist
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS price decimal;

-- Create index on category for better query performance
CREATE INDEX IF NOT EXISTS idx_recipes_category ON recipes(category);

-- Create index on is_premium for better query performance
CREATE INDEX IF NOT EXISTS idx_recipes_is_premium ON recipes(is_premium);

-- Add constraint to ensure price is set when recipe is premium
ALTER TABLE recipes ADD CONSTRAINT check_premium_price 
  CHECK (
    (is_premium = false AND price IS NULL) OR 
    (is_premium = true AND price > 0)
  );

-- Update RLS policies for recipes
DROP POLICY IF EXISTS "Recipes are viewable by everyone" ON recipes;
DROP POLICY IF EXISTS "Recipes are insertable by admins" ON recipes;
DROP POLICY IF EXISTS "Recipes are updatable by admins" ON recipes;

CREATE POLICY "anyone_can_view_recipes"
  ON recipes FOR SELECT
  USING (true);

CREATE POLICY "admins_can_insert_recipes"
  ON recipes FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.id = auth.uid()
    AND is_admin = true
  ));

CREATE POLICY "admins_can_update_recipes"
  ON recipes FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.id = auth.uid()
    AND is_admin = true
  ));