// src/hooks/useCart.ts
// Savatcha bilan bog'liq BARCHA mantiq shu yerda — App.tsx endi buni bilishi shart emas,
// faqat "addToCart(product)" kabi tayyor funksiyalarni chaqiradi.

import { useState, useCallback } from 'react';
import { getCart, saveCart, totalItems, totalPrice } from '../data/api';
import type { CartItem, Product } from '../types';

interface UseCartResult {
  cart: CartItem[];
  cartCount: number;
  cartTotal: (products: Product[]) => number;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
}

export function useCart(onAdd?: () => void): UseCartResult {
  const [cart, setCart] = useState<CartItem[]>(getCart());

  const updateCart = useCallback((newCart: CartItem[]) => {
    setCart(newCart);
    saveCart(newCart);
  }, []);

  const addToCart = useCallback((product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      const next = existing
        ? prev.map(i => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i))
        : [...prev, { id: product.id, qty: 1 }];
      saveCart(next);
      return next;
    });
    onAdd?.();
  }, [onAdd]);

  const removeFromCart = useCallback((productId: number) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === productId);
      if (!existing) return prev;
      const next = existing.qty === 1
        ? prev.filter(i => i.id !== productId)
        : prev.map(i => (i.id === productId ? { ...i, qty: i.qty - 1 } : i));
      saveCart(next);
      return next;
    });
  }, []);

  const clearCart = useCallback(() => updateCart([]), [updateCart]);

  return {
    cart,
    cartCount: totalItems(cart),
    cartTotal: (products: Product[]) => totalPrice(cart, products),
    addToCart,
    removeFromCart,
    clearCart,
  };
}
