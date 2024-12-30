import React from 'react';
import { Link, Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { UserProfile } from './UserProfile';
import { Favorites } from './Favorites';
import { PurchaseHistory } from './PurchaseHistory';
import { MyRecipes } from './MyRecipes';

export function CustomerDashboard() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-pulse text-teal-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-serif text-teal-800 mb-8">My Account</h1>
      
      <div className="grid md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <nav className="space-y-2">
            <Link
              to="/account/profile"
              className="block p-3 text-teal-600 hover:bg-teal-50 rounded-lg"
            >
              Profile
            </Link>
            <Link
              to="/account/favorites"
              className="block p-3 text-teal-600 hover:bg-teal-50 rounded-lg"
            >
              My Favorites
            </Link>
            <Link
              to="/account/purchases"
              className="block p-3 text-teal-600 hover:bg-teal-50 rounded-lg"
            >
              Purchase History
            </Link>
            <Link
              to="/account/recipes"
              className="block p-3 text-teal-600 hover:bg-teal-50 rounded-lg"
            >
              My Recipes
            </Link>
          </nav>
        </div>

        <div className="md:col-span-3">
          <Routes>
            <Route index element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="purchases" element={<PurchaseHistory />} />
            <Route path="recipes" element={<MyRecipes />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}