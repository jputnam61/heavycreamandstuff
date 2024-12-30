-- Create storage bucket for product images if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'products',
  'products',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Ensure RLS is enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated users to upload images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public to view images" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their own uploads" ON storage.objects;

-- Create comprehensive storage policies
CREATE POLICY "Allow authenticated users to upload images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'products' AND
  (CASE WHEN auth.role() = 'authenticated' THEN true ELSE false END)
);

CREATE POLICY "Allow public to view images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'products');

CREATE POLICY "Allow authenticated users to delete their uploads"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'products' AND
  (auth.uid() = owner OR EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND is_admin = true
  ))
);