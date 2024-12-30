import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { ProductFilters as Filters } from '../../types/product';

const filters = [
  {
    id: 'category',
    name: 'Category',
    options: [
      { value: 'jams', label: 'Jams & Preserves' },
      { value: 'sauces', label: 'Sauces' },
      { value: 'spreads', label: 'Spreads & Butters' },
    ],
  },
  {
    id: 'price',
    name: 'Price',
    options: [
      { value: 'under-5', label: 'Under $5' },
      { value: '5-10', label: '$5 to $10' },
      { value: 'over-10', label: 'Over $10' },
    ],
  },
];

interface ProductFiltersProps {
  onFiltersChange: (filters: Filters) => void;
}

export function ProductFilters({ onFiltersChange }: ProductFiltersProps) {
  const [openSections, setOpenSections] = useState<string[]>(['category', 'price']);
  const [selectedFilters, setSelectedFilters] = useState<Filters>({
    categories: [],
    priceRanges: [],
  });

  useEffect(() => {
    onFiltersChange(selectedFilters);
  }, [selectedFilters, onFiltersChange]);

  const toggleSection = (id: string) => {
    setOpenSections(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleFilterChange = (filterId: string, value: string, checked: boolean) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };
      
      if (filterId === 'category') {
        newFilters.categories = checked
          ? [...prev.categories, value]
          : prev.categories.filter(cat => cat !== value);
      } else if (filterId === 'price') {
        newFilters.priceRanges = checked
          ? [...prev.priceRanges, value]
          : prev.priceRanges.filter(range => range !== value);
      }

      return newFilters;
    });
  };

  return (
    <div className="space-y-6">
      {filters.map((filter) => (
        <div key={filter.id} className="border-b border-gray-200 pb-6">
          <button
            className="flex w-full items-center justify-between text-gray-400 hover:text-gray-500"
            onClick={() => toggleSection(filter.id)}
          >
            <span className="text-sm font-medium text-gray-900">{filter.name}</span>
            {openSections.includes(filter.id) ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>

          {openSections.includes(filter.id) && (
            <div className="pt-6 space-y-4">
              {filter.options.map((option) => (
                <div key={option.value} className="flex items-center">
                  <input
                    type="checkbox"
                    id={option.value}
                    checked={
                      filter.id === 'category'
                        ? selectedFilters.categories.includes(option.value)
                        : selectedFilters.priceRanges.includes(option.value)
                    }
                    onChange={(e) => handleFilterChange(filter.id, option.value, e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                  />
                  <label htmlFor={option.value} className="ml-3 text-sm text-gray-600">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}