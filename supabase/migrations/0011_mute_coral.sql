-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload images
CREATE POLICY "Allow authenticated users to upload images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'products' AND
  auth.role() = 'authenticated'
);

-- Allow public access to view images
CREATE POLICY "Allow public to view images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'products');

-- Allow users to delete their own uploads
CREATE POLICY "Allow users to delete their own uploads"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'products' AND
  auth.uid() = owner
);