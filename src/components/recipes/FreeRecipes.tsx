import React, { useState, useEffect } from 'react';
import { RecipeCard } from './RecipeCard';
import { supabase } from '../../lib/supabase';
import type { Recipe } from '../../types/recipe';

export function FreeRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFreeRecipes();
  }, []);

  async function loadFreeRecipes() {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('is_premium', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecipes(data || []);
    } catch (error) {
      console.error('Error loading recipes:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  return (
    <section>
      <h2 className="text-3xl font-serif text-teal-800 mb-8">Free Recipes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </section>
  );
}