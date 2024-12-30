import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { ImageUpload } from '../common/ImageUpload';
import type { ProductFormData } from '../../../types/product';

export function AddProductForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const formData = new FormData(e.currentTarget);
      const product: ProductFormData = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        price: parseFloat(formData.get('price') as string),
        category: formData.get('category') as string,
        image_url: imageUrl || null,
        featured: formData.get('featured') === 'on',
      };

      const { error } = await supabase.from('products').insert(product);
      if (error) throw error;

      setMessage({ type: 'success', text: 'Product added successfully!' });
      setTimeout(() => {
        navigate('/products');
      }, 1500);
    } catch (error) {
      console.error('Error adding product:', error);
      setMessage({ type: 'error', text: 'Failed to add product. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-serif text-teal-800 mb-6">Add New Product</h2>
      
      {message && (
        <div className={`p-4 mb-4 rounded ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-gray-700 mb-2">Product Name</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full p-2 border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-gray-700 mb-2">Description</label>
          <textarea
            id="description"
            name="description"
            rows={3}
            className="w-full p-2 border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500"
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-gray-700 mb-2">Price ($)</label>
          <input
            type="number"
            id="price"
            name="price"
            step="0.01"
            required
            className="w-full p-2 border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-gray-700 mb-2">Category</label>
          <select
            id="category"
            name="category"
            required
            className="w-full p-2 border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500"
          >
            <option value="">Select a category</option>
            <option value="jams">Jams & Preserves</option>
            <option value="sauces">Sauces</option>
            <option value="spreads">Spreads & Butters</option>
          </select>
        </div>

        <ImageUpload
          imageUrl={imageUrl}
          onImageUpload={setImageUrl}
          bucketName="products"
        />

        <div className="flex items-center">
          <input
            type="checkbox"
            id="featured"
            name="featured"
            className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
          />
          <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
            Feature this product on the home page
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Adding Product...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
}