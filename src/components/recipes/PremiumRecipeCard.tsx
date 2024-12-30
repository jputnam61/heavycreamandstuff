import React from 'react';
import { Book, Download } from 'lucide-react';
import type { Recipe } from '../../types/recipe';
import { useAuth } from '../auth/AuthProvider';
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../../contexts/ToastContext';

interface PremiumRecipeCardProps {
  recipe: Recipe;
}

export function PremiumRecipeCard({ recipe }: PremiumRecipeCardProps) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handlePurchase = () => {
    try {
      addToCart({
        id: recipe.id,
        name: recipe.title,
        price: recipe.price || 0,
        description: recipe.description,
        category: 'recipe',
        image_url: recipe.image_url,
      });
      showToast('Recipe added to cart!', 'success');
    } catch (error) {
      console.error('Error adding recipe to cart:', error);
      showToast('Failed to add recipe to cart', 'error');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-teal-100">
      <div className="flex flex-col md:flex-row">
        {recipe.image_url && (
          <div className="md:w-1/3">
            <img
              src={recipe.image_url}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-6 md:w-2/3">
          <div className="flex items-center mb-4">
            <Book className="h-5 w-5 text-teal-600 mr-2" />
            <span className="text-sm font-medium text-teal-600">Digital Cookbook</span>
          </div>
          <h3 className="text-2xl font-serif text-teal-800 mb-2">{recipe.title}</h3>
          <p className="text-gray-600 mb-4">{recipe.description}</p>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center text-gray-500">
              <Download className="h-4 w-4 mr-1" />
              <span className="text-sm">Instant PDF Download</span>
            </div>
            <span className="text-2xl font-serif text-teal-800">
              ${recipe.price?.toFixed(2)}
            </span>
          </div>
          <button
            onClick={handlePurchase}
            className="w-full bg-teal-600 text-white py-3 px-6 rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}