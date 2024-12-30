import React, { useState } from 'react';
import { ProductGrid } from '../components/products/ProductGrid';
import { ProductFilters } from '../components/products/ProductFilters';
import { ProductSort } from '../components/products/ProductSort';
import type { ProductFilters as Filters } from '../types/product';

export function ProductsPage() {
  const [sortBy, setSortBy] = useState('newest');
  const [filters, setFilters] = useState<Filters>({
    categories: [],
    priceRanges: [],
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif text-teal-800">Our Products</h1>
        <ProductSort onSort={setSortBy} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <ProductFilters onFiltersChange={setFilters} />
        </aside>
        
        <main className="lg:col-span-3">
          <ProductGrid sortBy={sortBy} filters={filters} />
        </main>
      </div>
    </div>
  );
}