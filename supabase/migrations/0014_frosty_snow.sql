-- Create storage bucket for recipe images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'recipes',
  'recipes',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Create storage policies for recipes bucket
CREATE POLICY "authenticated_users_can_upload_recipes"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'recipes' AND
  (auth.role() = 'authenticated')
);

CREATE POLICY "public_can_view_recipes"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'recipes');

CREATE POLICY "authenticated_users_can_delete_recipes"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'recipes' AND
  (
    owner = auth.uid() OR
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  )
);