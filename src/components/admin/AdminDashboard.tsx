import React from 'react';
import { Link, Route, Routes, Navigate } from 'react-router-dom';
import { ProductForm } from './ProductForm';
import { RecipeForm } from './RecipeForm';
import { ContactInfo } from './ContactInfo';
import { AddProductForm } from './products/AddProductForm';
import { EditProductForm } from './products/EditProductForm';
import { AdminFavorites } from './favorites/AdminFavorites';

export function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-serif text-teal-800 mb-8">Admin Dashboard</h1>
      
      <div className="grid md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <nav className="space-y-2">
            <Link
              to="/admin/products/add"
              className="block p-3 text-teal-600 hover:bg-teal-50 rounded-lg"
            >
              Add New Product
            </Link>
            <Link
              to="/admin/recipes"
              className="block p-3 text-teal-600 hover:bg-teal-50 rounded-lg"
            >
              Add New Recipe
            </Link>
            <Link
              to="/admin/favorites"
              className="block p-3 text-teal-600 hover:bg-teal-50 rounded-lg"
            >
              View Favorites
            </Link>
            <Link
              to="/admin/contact"
              className="block p-3 text-teal-600 hover:bg-teal-50 rounded-lg"
            >
              Edit Contact Info
            </Link>
          </nav>
        </div>

        <div className="md:col-span-3">
          <Routes>
            <Route index element={<Navigate to="products/add" replace />} />
            <Route path="products/add" element={<AddProductForm />} />
            <Route path="products/edit/:id" element={<EditProductForm />} />
            <Route path="recipes" element={<RecipeForm />} />
            <Route path="favorites" element={<AdminFavorites />} />
            <Route path="contact" element={<ContactInfo />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}