// src/hooks/useFavorites.ts
import { useState, useCallback } from 'react';
import { getFavorites, toggleFavorite } from '../data/api';

interface UseFavoritesResult {
  favorites: number[];
  isFavorite: (productId: number) => boolean;
  toggle: (productId: number) => boolean; // true = qo'shildi, false = olib tashlandi
}

export function useFavorites(): UseFavoritesResult {
  const [favorites, setFavorites] = useState<number[]>(getFavorites());

  const toggle = useCallback((productId: number): boolean => {
    const next = toggleFavorite(productId, favorites);
    setFavorites(next);
    return next.includes(productId);
  }, [favorites]);

  return {
    favorites,
    isFavorite: (id: number) => favorites.includes(id),
    toggle,
  };
}
