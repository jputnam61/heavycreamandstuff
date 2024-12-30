import React from 'react';
import type { CartState } from '../../contexts/CartContext';

interface OrderSummaryProps {
  cart: CartState;
}

export function OrderSummary({ cart }: OrderSummaryProps) {
  const shippingCost = 5.99;
  const tax = cart.total * 0.08; // 8% tax rate
  const total = cart.total + shippingCost + tax;

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h2 className="text-xl font-medium mb-4">Order Summary</h2>
      
      <div className="space-y-4">
        {/* Items */}
        <div className="border-b pb-4">
          {cart.items.map((item) => (
            <div key={item.id} className="flex justify-between py-2">
              <div className="flex items-center">
                <span className="text-sm text-gray-600">
                  {item.quantity}x {item.name}
                </span>
              </div>
              <span className="text-sm font-medium">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Calculations */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Subtotal</span>
            <span className="text-sm font-medium">${cart.total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Shipping</span>
            <span className="text-sm font-medium">${shippingCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Tax (8%)</span>
            <span className="text-sm font-medium">${tax.toFixed(2)}</span>
          </div>
        </div>

        {/* Total */}
        <div className="border-t pt-4">
          <div className="flex justify-between">
            <span className="text-base font-medium">Total</span>
            <span className="text-base font-medium">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}