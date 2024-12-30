import React from 'react';
import { Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Recipe } from '../../types/recipe';

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const formatTime = (minutes?: number) => {
    if (!minutes) return null;
    if (minutes < 60) return `${minutes} mins`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const totalTime = (recipe.prep_time_mins || 0) + (recipe.cook_time_mins || 0);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {recipe.image_url && (
        <img
          src={recipe.image_url}
          alt={recipe.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-6">
        <h3 className="text-xl font-serif text-teal-800 mb-2">{recipe.title}</h3>
        <p className="text-gray-600 mb-4">{recipe.description}</p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          {totalTime > 0 && (
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{formatTime(totalTime)}</span>
            </div>
          )}
          {recipe.servings && (
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              <span>Serves {recipe.servings}</span>
            </div>
          )}
        </div>
        <Link 
          to={`/recipes/${recipe.id}`}
          className="mt-4 block w-full bg-teal-600 text-white text-center py-2 px-4 rounded hover:bg-teal-700 transition-colors"
        >
          View Recipe
        </Link>
      </div>
    </div>
  );
}