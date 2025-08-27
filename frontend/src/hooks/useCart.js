import { useState, useEffect, useCallback, useMemo } from 'react';

const CART_STORAGE_KEY = 'farmShopCart';

export function useCart() {
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCartFromStorage = () => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      console.log('[CART DEBUG] Loading from storage:', savedCart);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        console.log('[CART DEBUG] Parsed cart:', parsedCart);
        setCart(parsedCart);
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

  // Синхронизируем localStorage при каждом изменении cart
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        console.log('[useCart] Auto-sync to localStorage:', cart);
      } catch (error) {
        console.error('Error auto-syncing cart to storage:', error);
      }
    }
  }, [cart, isLoading]);

  const addToCart = useCallback((product, quantity = 1) => {
    console.log('[CART DEBUG] Adding to cart:', { product, quantity });
    setCart(currentCart => {
      console.log('[CART DEBUG] Current cart before add:', currentCart);
      const existingItem = currentCart.find(item => item.id === product.id);
      
      let newCart;
      if (existingItem) {
        newCart = currentCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        console.log('[CART DEBUG] Updated existing item:', newCart);
      } else {
        newCart = [...currentCart, { ...product, quantity }];
        console.log('[CART DEBUG] Added new item:', newCart);
      }
      
      return newCart;
    });
  }, []);

  const removeFromCart = (productId) => {
    setCart(currentCart => {
      const newCart = currentCart.filter(item => item.id !== productId);
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
      
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
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