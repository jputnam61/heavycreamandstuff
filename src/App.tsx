import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthProvider';
import { CartProvider } from './contexts/CartContext';
import { ToastProvider } from './contexts/ToastContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { FeaturedProducts } from './components/FeaturedProducts';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CustomerDashboard } from './components/customer/CustomerDashboard';
import { ProductsPage } from './pages/ProductsPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { CheckoutSuccessPage } from './pages/CheckoutSuccessPage';
import { RecipePage } from './components/recipes/RecipePage';
import { RecipeView } from './components/recipes/RecipeView';

export function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <Routes>
                <Route path="/" element={
                  <main className="flex-grow">
                    <Hero />
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                      <div className="text-center mb-16">
                        <h2 className="text-3xl font-serif text-teal-800 mb-4">Welcome to Our Kitchen</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                          At Heavy Cream & Stuff, we believe in the power of good food to bring people together. 
                          Our Southern-inspired products are made with love, faith, and the finest ingredients.
                        </p>
                      </div>
                    </div>
                    <FeaturedProducts />
                  </main>
                } />
                
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/recipes" element={<RecipePage />} />
                <Route path="/recipes/:id" element={<RecipeView />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
                
                <Route path="/admin/*" element={
                  <ProtectedRoute requireAdmin>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="/account/*" element={
                  <ProtectedRoute>
                    <CustomerDashboard />
                  </ProtectedRoute>
                } />
              </Routes>
              <Footer />
            </div>
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}