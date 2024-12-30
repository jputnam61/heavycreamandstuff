import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
];

interface ProductSortProps {
  onSort: (value: string) => void;
}

export function ProductSort({ onSort }: ProductSortProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(sortOptions[0]);

  return (
    <div className="relative">
      <button
        className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900"
        onClick={() => setIsOpen(!isOpen)}
      >
        Sort by: {selected.label}
        <ChevronDown
          className="ml-2 h-5 w-5 flex-none text-gray-400"
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                className={`block px-4 py-2 text-sm w-full text-left ${
                  option.value === selected.value
                    ? 'font-medium text-gray-900'
                    : 'text-gray-500'
                }`}
                onClick={() => {
                  setSelected(option);
                  onSort(option.value);
                  setIsOpen(false);
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}