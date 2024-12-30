import React from 'react';

export function Hero() {
  return (
    <div className="relative h-[600px] bg-cover bg-center" style={{
      backgroundImage: `url('https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80')`
    }}>
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="text-white max-w-2xl">
          <h1 className="text-5xl font-serif mb-4">Soulful Inspiration in Every Dish</h1>
          <p className="text-xl mb-8">Join us in celebrating Southern comfort food, fellowship, and faith</p>
          <a href="/products" className="inline-block bg-teal-600 text-white px-8 py-3 rounded-lg hover:bg-teal-700 transition-colors">
            Shop Our Products
          </a>
        </div>
      </div>
    </div>
  );
}