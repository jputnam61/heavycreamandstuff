import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { ProductCard } from '../products/ProductCard';
import { useAuth } from '../auth/AuthProvider';
import type { Product } from '../../types/product';

interface FavoriteProduct extends Product {
  favorite_id: string;
}

export function Favorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadFavorites();
    }
  }, [user]);

  async function loadFavorites() {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('favorites')
        .select(`
          id,
          product:products (*)
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedFavorites = data?.map(item => ({
        ...item.product,
        favorite_id: item.id
      })) || [];

      setFavorites(formattedFavorites);
    } catch (err) {
      console.error('Error loading favorites:', err);
      setError('Failed to load favorites. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const handleRemoveFavorite = async (productId: string) => {
    try {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user?.id)
        .eq('product_id', productId);

      setFavorites(current => 
        current.filter(favorite => favorite.id !== productId)
      );
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please log in to view your favorites.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-100 h-64 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={loadFavorites}
          className="text-teal-600 hover:text-teal-700 font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-serif text-teal-800">My Favorites</h2>
      
      {favorites.length === 0 ? (
        <p className="text-gray-600">You haven't added any favorites yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {favorites.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onDelete={() => handleRemoveFavorite(product.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}