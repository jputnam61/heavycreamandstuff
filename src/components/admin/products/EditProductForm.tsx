import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { ImageUpload } from '../common/ImageUpload';
import type { Product } from '../../../types/product';

export function EditProductForm() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [product, setProduct] = useState<Product | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      loadProduct(id);
    }
  }, [id]);

  async function loadProduct(productId: string) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) throw error;
      if (data) {
        setProduct(data);
        setImageUrl(data.image_url || '');
      }
    } catch (error) {
      console.error('Error loading product:', error);
      setMessage({ type: 'error', text: 'Failed to load product' });
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) return;
    
    setLoading(true);
    setMessage(null);

    try {
      const formData = new FormData(e.currentTarget);
      const updates = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        price: parseFloat(formData.get('price') as string),
        category: formData.get('category') as string,
        image_url: imageUrl || null,
        featured: formData.get('featured') === 'on',
      };

      const { error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Product updated successfully!' });
      setTimeout(() => {
        navigate('/products');
      }, 1500);
    } catch (error) {
      console.error('Error updating product:', error);
      setMessage({ type: 'error', text: 'Failed to update product. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-pulse text-teal-600">Loading product...</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-serif text-teal-800 mb-6">Edit Product</h2>
      
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
            defaultValue={product.name}
            required
            className="w-full p-2 border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-gray-700 mb-2">Description</label>
          <textarea
            id="description"
            name="description"
            defaultValue={product.description || ''}
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
            defaultValue={product.price}
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
            defaultValue={product.category}
            required
            className="w-full p-2 border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500"
          >
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
            defaultChecked={product.featured}
            className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
          />
          <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
            Feature this product on the home page
          </label>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="px-4 py-2 text-gray-700 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Product'}
          </button>
        </div>
      </form>
    </div>
  );
}