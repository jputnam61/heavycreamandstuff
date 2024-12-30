import React, { useEffect, useState } from 'react';
import { ProductCard } from './ProductCard';
import { supabase } from '../../lib/supabase';
import type { Product, ProductFilters } from '../../types/product';

interface ProductGridProps {
  sortBy?: string;
  filters?: ProductFilters;
}

export function ProductGrid({ sortBy = 'newest', filters }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts(sortBy, filters);
  }, [sortBy, filters]);

  async function loadProducts(sort: string, currentFilters?: ProductFilters) {
    try {
      setLoading(true);
      setError(null);

      let query = supabase.from('products').select('*');

      // Apply category filters
      if (currentFilters?.categories.length) {
        query = query.in('category', currentFilters.categories);
      }

      // Apply price range filters
      if (currentFilters?.priceRanges.length) {
        const priceFilters = [];
        
        for (const range of currentFilters.priceRanges) {
          if (range === 'under-5') {
            priceFilters.push('price.lt.5');
          } else if (range === '5-10') {
            priceFilters.push('and(price.gte.5,price.lte.10)');
          } else if (range === 'over-10') {
            priceFilters.push('price.gt.10');
          }
        }

        if (priceFilters.length > 0) {
          query = query.or(priceFilters.join(','));
        }
      }

      // Apply sorting
      switch (sort) {
        case 'price-low':
          query = query.order('price', { ascending: true });
          break;
        case 'price-high':
          query = query.order('price', { ascending: false });
          break;
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;
      setProducts(data || []);
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  const handleProductDelete = (deletedProductId: string) => {
    setProducts(currentProducts => 
      currentProducts.filter(product => product.id !== deletedProductId)
    );
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => loadProducts(sortBy, filters)}
          className="text-teal-600 hover:text-teal-700 font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No products found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onDelete={() => handleProductDelete(product.id)}
        />
      ))}
    </div>
  );
}