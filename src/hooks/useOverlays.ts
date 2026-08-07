// src/hooks/useOverlays.ts
// App.js'da 4 ta alohida useState (authOpen, searchOpen, chatOpen, selectedProduct) bor edi.
// Bularning barchasi "qaysi overlay ochiq" degan bitta savolga javob beradi — shu sabab
// mantiqiy ravishda bitta hook'ga jamladik.

import { useState, useCallback } from 'react';
import type { Product } from '../types';

interface UseOverlaysResult {
  authOpen: boolean;
  searchOpen: boolean;
  chatOpen: boolean;
  selectedProduct: Product | null;
  openAuth: () => void;
  closeAuth: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  openChat: () => void;
  closeChat: () => void;
  openProduct: (product: Product) => void;
  closeProduct: () => void;
}

export function useOverlays(): UseOverlaysResult {
  const [authOpen, setAuthOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return {
    authOpen,
    searchOpen,
    chatOpen,
    selectedProduct,
    openAuth: useCallback(() => setAuthOpen(true), []),
    closeAuth: useCallback(() => setAuthOpen(false), []),
    openSearch: useCallback(() => setSearchOpen(true), []),
    closeSearch: useCallback(() => setSearchOpen(false), []),
    openChat: useCallback(() => setChatOpen(true), []),
    closeChat: useCallback(() => setChatOpen(false), []),
    openProduct: useCallback((p: Product) => setSelectedProduct(p), []),
    closeProduct: useCallback(() => setSelectedProduct(null), []),
  };
}
