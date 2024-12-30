import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { addToFavorites, removeFromFavorites, checkIsFavorite } from '../../lib/favorites/api';

interface FavoriteButtonProps {
  productId: string;
  className?: string;
  onLoginRequired: () => void;
}

export function FavoriteButton({ productId, className = '', onLoginRequired }: FavoriteButtonProps) {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      checkIsFavorite(productId)
        .then(setIsFavorite)
        .catch(console.error);
    }
  }, [productId, user]);

  const handleClick = async () => {
    if (!user) {
      onLoginRequired();
      return;
    }
    
    try {
      setLoading(true);
      if (isFavorite) {
        await removeFromFavorites(productId);
        setIsFavorite(false);
      } else {
        await addToFavorites(productId);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`rounded-full bg-white p-2 shadow-md hover:bg-gray-100 disabled:opacity-50 ${className}`}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart
        className={`h-5 w-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-rose-500'}`}
      />
    </button>
  );
}