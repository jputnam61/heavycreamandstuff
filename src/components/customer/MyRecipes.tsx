import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface Recipe {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  pdf_url: string | null;
  purchased_at: string;
}

export function MyRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecipes();
  }, []);

  async function loadRecipes() {
    try {
      const { data, error } = await supabase
        .from('user_recipes')
        .select(`
          purchased_at,
          recipe:recipes (
            id,
            title,
            description,
            image_url,
            pdf_url
          )
        `)
        .order('purchased_at', { ascending: false });

      if (error) throw error;
      setRecipes(data?.map(item => ({
        ...item.recipe,
        purchased_at: item.purchased_at
      })) || []);
    } catch (error) {
      console.error('Error loading recipes:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div>Loading recipes...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif text-teal-800">My Recipes</h2>
      
      {recipes.length === 0 ? (
        <p className="text-gray-600">You haven't purchased any recipes yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="bg-white rounded-lg shadow overflow-hidden">
              {recipe.image_url && (
                <img
                  src={recipe.image_url}
                  alt={recipe.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="font-medium text-lg mb-2">{recipe.title}</h3>
                {recipe.description && (
                  <p className="text-gray-600 text-sm mb-4">{recipe.description}</p>
                )}
                {recipe.pdf_url && (
                  <a
                    href={recipe.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition-colors"
                  >
                    Download Recipe
                  </a>
                )}
                <p className="text-sm text-gray-500 mt-2">
                  Purchased: {new Date(recipe.purchased_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}