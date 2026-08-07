// src/hooks/useAppData.ts
// Ilova ochilganda kerak bo'ladigan boshlang'ich ma'lumotlarni (mahsulotlar, kategoriyalar,
// bannerlar, sozlamalar) bitta joydan yuklaydi. App.tsx bu tafsilotlarni bilishi shart emas.

import { useState, useEffect } from 'react';
import { fetchProducts, fetchCategories, fetchBanners, fetchSettings } from '../data/api';
import type { Product, Banner, Settings } from '../types';

interface UseAppDataResult {
  products: Product[];
  categories: string[];
  banners: Banner[];
  settings: Settings;
  loading: boolean;
}

export function useAppData(): UseAppDataResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    Promise.all([fetchProducts(), fetchCategories(), fetchBanners(), fetchSettings()])
      .then(([prods, cats, bans, sets]) => {
        if (cancelled) return;
        setProducts(Array.isArray(prods) ? prods : []);
        setCategories(Array.isArray(cats) ? cats : []);
        setBanners(Array.isArray(bans) ? bans : []);
        setSettings(sets || {});
      })
      .catch(() => { /* Tarmoq xatoligi — bo'sh ro'yxatlar bilan davom etadi */ })
      .finally(() => { if (!cancelled) setLoading(false); });

    // Component unmount bo'lsa, kechikkan javob state'ni yangilamasligi uchun
    return () => { cancelled = true; };
  }, []);

  return { products, categories, banners, settings, loading };
}
