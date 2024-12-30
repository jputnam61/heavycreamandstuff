import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Clock, Users, ChefHat } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Recipe } from '../../types/recipe';

export function RecipeView() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadRecipe(id);
    }
  }, [id]);

  async function loadRecipe(recipeId: string) {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', recipeId)
        .single();

      if (error) throw error;
      setRecipe(data);
    } catch (error) {
      console.error('Error loading recipe:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-teal-600">Loading recipe...</div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Recipe not found</div>
      </div>
    );
  }

  const totalTime = (recipe.prep_time_mins || 0) + (recipe.cook_time_mins || 0);

  return (
    <div className="min-h-screen bg-teal-50/30">
      {/* Hero Section */}
      <div className="relative h-96">
        {recipe.image_url ? (
          <img
            src={recipe.image_url}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-teal-100 flex items-center justify-center">
            <ChefHat className="h-16 w-16 text-teal-600" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-serif mb-4">{recipe.title}</h1>
            {recipe.description && (
              <p className="text-lg max-w-2xl mx-auto">{recipe.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Recipe Details */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Recipe Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            {recipe.prep_time_mins && (
              <div className="flex flex-col items-center p-4 border-b md:border-b-0 md:border-r border-gray-200">
                <Clock className="h-6 w-6 text-teal-600 mb-2" />
                <span className="text-sm text-gray-500">Prep Time</span>
                <span className="font-medium">{recipe.prep_time_mins} mins</span>
              </div>
            )}
            {recipe.cook_time_mins && (
              <div className="flex flex-col items-center p-4 border-b md:border-b-0 md:border-r border-gray-200">
                <Clock className="h-6 w-6 text-teal-600 mb-2" />
                <span className="text-sm text-gray-500">Cook Time</span>
                <span className="font-medium">{recipe.cook_time_mins} mins</span>
              </div>
            )}
            {recipe.servings && (
              <div className="flex flex-col items-center p-4">
                <Users className="h-6 w-6 text-teal-600 mb-2" />
                <span className="text-sm text-gray-500">Servings</span>
                <span className="font-medium">{recipe.servings}</span>
              </div>
            )}
          </div>
        </div>

        {/* Recipe Content */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="prose max-w-none">
            {recipe.content && (
              <div className="whitespace-pre-wrap font-serif leading-relaxed">
                {recipe.content}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}