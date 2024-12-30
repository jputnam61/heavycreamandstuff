-- Drop existing policies
DROP POLICY IF EXISTS "Allow authenticated users to upload images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public to view images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete their uploads" ON storage.objects;

-- Create new storage policies with proper checks
CREATE POLICY "authenticated_users_can_upload"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'products' AND
  (auth.role() = 'authenticated')
);

CREATE POLICY "public_can_view"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'products');

CREATE POLICY "authenticated_users_can_delete"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'products' AND
  (
    owner = auth.uid() OR
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  )
);

-- Update bucket configuration
UPDATE storage.buckets
SET public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']::text[]
WHERE id = 'products';