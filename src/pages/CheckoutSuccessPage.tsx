import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export function CheckoutSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-serif text-teal-800 mb-4">Order Confirmed!</h1>
        <p className="text-gray-600 mb-8">
          Thank you for your order. We'll send you a confirmation email shortly.
        </p>
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