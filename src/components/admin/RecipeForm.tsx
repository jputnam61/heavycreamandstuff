import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '../../lib/supabase';
import { ImageUpload } from './common/ImageUpload';

interface RecipeFormData {
  title: string;
  description: string;
  content: string;
  is_premium: boolean;
  price?: number;
  category: string;
  prep_time_mins?: number;
  cook_time_mins?: number;
  servings?: number;
}

export function RecipeForm() {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RecipeFormData>();

  const isPremium = watch('is_premium');

  const onSubmit = async (data: RecipeFormData) => {
    try {
      setLoading(true);
      setMessage(null);

      const recipe = {
        ...data,
        image_url: imageUrl || null,
        price: data.is_premium ? Number(data.price) : null,
        prep_time_mins: data.prep_time_mins || null,
        cook_time_mins: data.cook_time_mins || null,
        servings: data.servings || null,
      };

      const { error } = await supabase.from('recipes').insert(recipe);
      if (error) throw error;

      setMessage({ type: 'success', text: 'Recipe added successfully!' });
      setImageUrl('');
      
    } catch (error) {
      console.error('Error adding recipe:', error);
      setMessage({ type: 'error', text: 'Failed to add recipe. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-serif text-teal-800 mb-6">Add New Recipe</h2>

      {message && (
        <div className={`p-4 mb-4 rounded ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-gray-700 mb-2">Recipe Title</label>
          <input
            {...register('title', { required: 'Title is required' })}
            className="w-full p-2 border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="category" className="block text-gray-700 mb-2">Category</label>
          <select
            {...register('category', { required: 'Category is required' })}
            className="w-full p-2 border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500"
          >
            <option value="">Select a category</option>
            <option value="main-dishes">Main Dishes</option>
            <option value="sides">Side Dishes</option>
            <option value="desserts">Desserts</option>
            <option value="beverages">Beverages</option>
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="prep_time_mins" className="block text-gray-700 mb-2">Prep Time (mins)</label>
            <input
              type="number"
              {...register('prep_time_mins', { min: 0 })}
              className="w-full p-2 border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          <div>
            <label htmlFor="cook_time_mins" className="block text-gray-700 mb-2">Cook Time (mins)</label>
            <input
              type="number"
              {...register('cook_time_mins', { min: 0 })}
              className="w-full p-2 border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          <div>
            <label htmlFor="servings" className="block text-gray-700 mb-2">Servings</label>
            <input
              type="number"
              {...register('servings', { min: 1 })}
              className="w-full p-2 border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-gray-700 mb-2">Description</label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full p-2 border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-gray-700 mb-2">Recipe Content</label>
          <textarea
            {...register('content')}
            rows={6}
            className="w-full p-2 border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500"
          />
        </div>

        <ImageUpload
          imageUrl={imageUrl}
          onImageUpload={setImageUrl}
          bucketName="recipes"
        />

        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            {...register('is_premium')}
            className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-gray-700">
            This is a premium recipe
          </label>
        </div>

        {isPremium && (
          <div>
            <label htmlFor="price" className="block text-gray-700 mb-2">Price ($)</label>
            <input
              type="number"
              step="0.01"
              {...register('price', {
                required: isPremium ? 'Price is required for premium recipes' : false,
                min: { value: 0.01, message: 'Price must be greater than 0' }
              })}
              className="w-full p-2 border border-gray-300 rounded focus:ring-teal-500 focus:border-teal-500"
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Adding Recipe...' : 'Add Recipe'}
        </button>
      </form>
    </div>
  );
}