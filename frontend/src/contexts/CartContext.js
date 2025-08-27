import React, { createContext, useContext } from 'react';
import { useCart } from '../hooks/useCart';

const CartContext = createContext();

export function CartProvider({ children }) {
  const cartValue = useCart();
  
  return (
    <CartContext.Provider value={cartValue}>
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within CartProvider');
  }
  return context;
}