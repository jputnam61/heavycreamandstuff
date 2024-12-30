import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { CartDrawer } from './CartDrawer';

export function CartButton() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { state } = useCart();

  return (
    <>
      <button
        onClick={() => setIsCartOpen(true)}
        className="relative"
      >
        <ShoppingCart className="h-6 w-6 text-teal-600" />
        {state.itemCount > 0 && (
          <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-rose-500 text-xs text-white flex items-center justify-center">
            {state.itemCount}
          </span>
        )}
      </button>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </>
  );
}