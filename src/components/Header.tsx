import React from 'react';
import { Heart, Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { LoginButton } from './auth/LoginButton';
import { CartButton } from './cart/CartButton';
import { useAuth } from './auth/AuthProvider';

export function Header() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleFavoritesClick = () => {
    if (!user) return;
    navigate(isAdmin ? '/admin/favorites' : '/account/favorites');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Menu className="h-6 w-6 text-teal-600 md:hidden" />
            <Link to="/" className="ml-4 md:ml-0">
              <h1 className="text-3xl font-serif text-teal-700">Heavy Cream & Stuff</h1>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-teal-600 hover:text-teal-800 font-medium">Home</Link>
            <Link to="/recipes" className="text-teal-600 hover:text-teal-800 font-medium">Recipes</Link>
            <Link to="/products" className="text-teal-600 hover:text-teal-800 font-medium">Shop</Link>
            <Link to="/about" className="text-teal-600 hover:text-teal-800 font-medium">About</Link>
          </nav>

          <div className="flex items-center space-x-6">
            {user && (
              <button
                onClick={handleFavoritesClick}
                className="text-rose-500 hover:text-rose-600 transition-colors"
                aria-label="View favorites"
              >
                <Heart className="h-6 w-6" />
              </button>
            )}
            <CartButton />
            <LoginButton />
          </div>
        </div>
      </div>
    </header>
  );
}