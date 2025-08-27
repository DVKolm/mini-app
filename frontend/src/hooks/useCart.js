import { useState, useEffect, useCallback, useMemo } from 'react';

const CART_STORAGE_KEY = 'farmShopCart';

export function useCart() {
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCartFromStorage = () => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error loading cart from storage:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCartFromStorage();
  }, []);

  const addToCart = (product, quantity = 1) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(item => item.id === product.id);
      
      let newCart;
      if (existingItem) {
        newCart = currentCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newCart = [...currentCart, { ...product, quantity }];
      }
      
      // Принудительно сохраняем в localStorage
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
      } catch (error) {
        console.error('Error saving cart to storage:', error);
      }
      
      return newCart;
    });
  };

  const removeFromCart = (productId) => {
    setCart(currentCart => {
      const newCart = currentCart.filter(item => item.id !== productId);
      
      // Принудительно сохраняем в localStorage
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
      } catch (error) {
        console.error('Error saving cart to storage:', error);
      }
      
      return newCart;
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(currentCart => {
      const newCart = currentCart.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      );
      
      // Принудительно сохраняем в localStorage
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
      } catch (error) {
        console.error('Error saving cart to storage:', error);
      }
      
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    // Принудительно очищаем localStorage
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([]));
    } catch (error) {
      console.error('Error clearing cart storage:', error);
    }
  };

  // Мемоизированные значения для реактивности
  const cartTotal = useMemo(() => {
    const total = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    console.log('[useCart] cartTotal updated:', total, 'cart:', cart);
    return total;
  }, [cart]);

  const cartItemsCount = useMemo(() => {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    console.log('[useCart] cartItemsCount updated:', count, 'cart:', cart);
    return count;
  }, [cart]);

  // Оставляем функции для обратной совместимости
  const getCartTotal = () => cartTotal;
  const getCartItemsCount = () => cartItemsCount;

  const getItemQuantity = (productId) => {
    const item = cart.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  const isInCart = (productId) => {
    return cart.some(item => item.id === productId);
  };

  return {
    cart,
    isLoading,
    cartTotal,
    cartItemsCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    getItemQuantity,
    isInCart
  };
}