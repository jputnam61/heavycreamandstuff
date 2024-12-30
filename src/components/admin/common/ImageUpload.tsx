import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface ImageUploadProps {
  imageUrl: string;
  onImageUpload: (url: string) => void;
  className?: string;
  bucketName: string;
}

export function ImageUpload({ imageUrl, onImageUpload, className = '', bucketName }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setError(null);
      setUploading(true);

      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file');
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image must be less than 5MB');
      }

      // Create unique filename
      const timestamp = new Date().getTime();
      const fileExt = file.name.split('.').pop();
      const fileName = `${timestamp}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw new Error('Error uploading image. Please try again.');
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      onImageUpload(publicUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      setError(error instanceof Error ? error.message : 'Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    try {
      if (imageUrl) {
        // Extract filename from URL
        const fileName = imageUrl.split('/').pop();
        if (fileName) {
          await supabase.storage
            .from(bucketName)
            .remove([fileName]);
        }
      }
      onImageUpload('');
    } catch (error) {
      console.error('Error removing image:', error);
    }
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Recipe Image
      </label>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {imageUrl ? (
        <div className="relative">
          <img
            src={imageUrl}
            alt="Recipe preview"
            className="w-full h-64 object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      ) : (
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="image-upload"
                className="relative cursor-pointer rounded-md font-medium text-teal-600 hover:text-teal-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-teal-500"
              >
                <span>{uploading ? 'Uploading...' : 'Upload a file'}</span>
                <input
                  id="image-upload"
                  name="image-upload"
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  onChange={handleUpload}
                  disabled={uploading}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">
              PNG, JPG, GIF up to 5MB
            </p>
          </div>
        </div>
      )}
    </div>
  );
}