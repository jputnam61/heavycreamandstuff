import React, { useState, useEffect } from 'react';
import { PremiumRecipeCard } from './PremiumRecipeCard';
import { supabase } from '../../lib/supabase';
import type { Recipe } from '../../types/recipe';

export function PremiumRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPremiumRecipes();
  }, []);

  async function loadPremiumRecipes() {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('is_premium', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecipes(data || []);
    } catch (error) {
      console.error('Error loading premium recipes:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  return (
    <section>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-serif text-teal-800 mb-4">Premium Digital Cookbooks</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Unlock our complete collection of premium recipes, cooking tips, and Southern kitchen secrets.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {recipes.map((recipe) => (
          <PremiumRecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </section>
  );
}