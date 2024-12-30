import React from 'react';
import { X, ShoppingCart, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { state, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="flex items-center">
              <ShoppingCart className="h-6 w-6 text-teal-600" />
              <h2 className="ml-2 text-lg font-medium">Shopping Cart</h2>
            </div>
            <button onClick={onClose}>
              <X className="h-6 w-6 text-gray-400 hover:text-gray-500" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {state.items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-gray-500">
                <ShoppingCart className="h-12 w-12 mb-4" />
                <p>Your cart is empty</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {state.items.map((item) => (
                  <li key={item.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      {item.image_url && (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="h-16 w-16 rounded-md object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="text-sm font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                        <div className="mt-2 flex items-center">
                          <select
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                            className="rounded border-gray-300 text-sm"
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                              <option key={num} value={num}>
                                {num}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="ml-4 text-gray-400 hover:text-gray-500"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          <div className="border-t bg-gray-50 p-4">
            <div className="flex justify-between text-base font-medium text-gray-900">
              <p>Subtotal</p>
              <p>${state.total.toFixed(2)}</p>
            </div>
            <p className="mt-0.5 text-sm text-gray-500">
              Shipping and taxes calculated at checkout.
            </p>
            <button
              onClick={handleCheckout}
              disabled={state.items.length === 0}
              className="mt-4 w-full bg-teal-600 py-2 px-4 text-white rounded hover:bg-teal-700 transition-colors disabled:opacity-50"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}