/*
  # Add featured products functionality

  1. Changes
    - Add featured column to products table
    - Create index for better performance when querying featured products
*/

-- Add featured column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false;

-- Create index for featured products
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured) WHERE featured = true;