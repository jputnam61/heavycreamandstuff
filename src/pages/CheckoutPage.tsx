import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { CheckoutForm } from '../components/checkout/CheckoutForm';
import { OrderSummary } from '../components/checkout/OrderSummary';
import { processOrder } from '../lib/checkout/api';
import type { CheckoutFormData } from '../types/checkout';

export function CheckoutPage() {
  const { state, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: CheckoutFormData) => {
    try {
      setLoading(true);
      setError(null);

      const orderData = {
        items: state.items,
        total: state.total,
        ...formData,
      };

      await processOrder(orderData);
      clearCart();
      navigate('/checkout/success');
    } catch (err) {
      console.error('Checkout error:', err);
      setError('An error occurred during checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-serif text-teal-800 mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Add some items to your cart before checking out.</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-serif text-teal-800 mb-8">Checkout</h1>

      {error && (
        <div className="mb-8 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <CheckoutForm onSubmit={handleSubmit} loading={loading} />
        <OrderSummary cart={state} />
      </div>
    </div>
  );
}