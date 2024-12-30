import React from 'react';
import { RecipeHero } from './RecipeHero';
import { FreeRecipes } from './FreeRecipes';
import { PremiumRecipes } from './PremiumRecipes';

export function RecipePage() {
  return (
    <div className="min-h-screen">
      <RecipeHero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <FreeRecipes />
        <div className="my-16 border-t border-gray-200"></div>
        <PremiumRecipes />
      </div>
    </div>
  );
}