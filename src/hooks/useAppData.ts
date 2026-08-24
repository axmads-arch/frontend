// src/hooks/useAppData.ts
// Ilova ochilganda kerak bo'ladigan boshlang'ich ma'lumotlarni yuklaydi.
// Endi tarmoq xatosini ham aniq ushlaydi va "qayta urinish" imkoniyatini beradi.

import { useState, useEffect, useCallback } from 'react';
import { fetchProducts, fetchCategories, fetchBanners, fetchSettings } from '../data/api';
import type { Product, Banner, Settings } from '../types';

interface UseAppDataResult {
  products: Product[];
  categories: string[];
  banners: Banner[];
  settings: Settings;
  loading: boolean;
  error: boolean;
  retry: () => void;
}

export function useAppData(): UseAppDataResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);

    Promise.all([fetchProducts(), fetchCategories(), fetchBanners(), fetchSettings()])
      .then(([prods, cats, bans, sets]) => {
        if (cancelled) return;
        setProducts(Array.isArray(prods) ? prods : []);
        setCategories(Array.isArray(cats) ? cats : []);
        setBanners(Array.isArray(bans) ? bans : []);
        setSettings(sets || {});
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [retryCount]);

  const retry = useCallback(() => setRetryCount(c => c + 1), []);

  return { products, categories, banners, settings, loading, error, retry };
}
