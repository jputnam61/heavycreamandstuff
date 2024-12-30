/*
  # Initial Schema Setup

  1. New Tables
    - Products, recipes, user profiles
    - Favorites, purchases, and user recipes
    
  2. Security
    - Enable RLS on all tables
    - Add policies for admin and customer access
*/

-- Create tables
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price decimal NOT NULL,
  image_url text,
  category text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  content text,
  image_url text,
  pdf_url text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users,
  full_name text,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles NOT NULL,
  product_id uuid REFERENCES products NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

CREATE TABLE purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles NOT NULL,
  total_amount decimal NOT NULL,
  status text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE purchase_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_id uuid REFERENCES purchases NOT NULL,
  product_id uuid REFERENCES products NOT NULL,
  quantity integer NOT NULL,
  price decimal NOT NULL
);

CREATE TABLE user_recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles NOT NULL,
  recipe_id uuid REFERENCES recipes NOT NULL,
  purchased_at timestamptz DEFAULT now(),
  UNIQUE(user_id, recipe_id)
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_recipes ENABLE ROW LEVEL SECURITY;

-- Policies for products
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Products are insertable by admins"
  ON products FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.id = auth.uid()
    AND is_admin = true
  ));

CREATE POLICY "Products are updatable by admins"
  ON products FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.id = auth.uid()
    AND is_admin = true
  ));

-- Policies for recipes
CREATE POLICY "Recipes are viewable by everyone"
  ON recipes FOR SELECT
  USING (true);

CREATE POLICY "Recipes are insertable by admins"
  ON recipes FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.id = auth.uid()
    AND is_admin = true
  ));

CREATE POLICY "Recipes are updatable by admins"
  ON recipes FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.id = auth.uid()
    AND is_admin = true
  ));

-- Policies for user_profiles
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Policies for favorites
CREATE POLICY "Users can view their own favorites"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites"
  ON favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
  ON favorites FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for purchases and items
CREATE POLICY "Users can view their own purchases"
  ON purchases FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own purchases"
  ON purchases FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own purchase items"
  ON purchase_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM purchases
    WHERE purchases.id = purchase_items.purchase_id
    AND purchases.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert their own purchase items"
  ON purchase_items FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM purchases
    WHERE purchases.id = purchase_id
    AND purchases.user_id = auth.uid()
  ));

-- Policies for user_recipes
CREATE POLICY "Users can view their purchased recipes"
  ON user_recipes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their purchased recipes"
  ON user_recipes FOR INSERT
  WITH CHECK (auth.uid() = user_id);