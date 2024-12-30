-- Add some initial featured products
INSERT INTO products (name, description, price, category, featured, image_url)
VALUES 
  ('Homemade Peach Jam', 'Sweet and tangy peach preserves made with fresh Georgia peaches', 8.99, 'jams', true, 'https://images.unsplash.com/photo-1597226012661-ee685a630e93?auto=format&fit=crop&q=80'),
  ('Southern BBQ Sauce', 'Rich and smoky barbecue sauce with a hint of sweetness', 7.99, 'sauces', true, 'https://images.unsplash.com/photo-1606923829579-0cb981a83e2e?auto=format&fit=crop&q=80'),
  ('Honey Butter', 'Creamy butter blended with local wildflower honey', 6.99, 'spreads', true, 'https://images.unsplash.com/photo-1612540943977-98ce54bfa47b?auto=format&fit=crop&q=80')
ON CONFLICT DO NOTHING;