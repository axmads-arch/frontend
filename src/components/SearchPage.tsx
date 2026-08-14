// src/components/SearchPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { IconSearch, IconPlus, IconMinus } from './icons';
import type { Product, CartItem } from '../types';

const CATS_ICONS: Record<string, string> = {
  Cheesecake: '🍰', Medovik: '🍯', Tort: '🎂', Kofe: '☕', Choy: '🍵', Ichimlik: '🥤',
};

interface SearchPageProps {
  products: Product[];
  cart: CartItem[];
  onAdd: (product: Product) => void;
  onRemove: (productId: number) => void;
  onClose: () => void;
  fmt: (n: number) => string;
  onProductClick?: (product: Product) => void;
}

export default function SearchPage({ products, cart, onAdd, onRemove, onClose, fmt, onProductClick }: SearchPageProps) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Har harf yozilganda darhol filtrlash o'rniga, 150ms kutib turadi —
  // sekin telefonlarda yozish paytida "qotib qolish" hissini kamaytiradi
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 150);
    return () => clearTimeout(t);
  }, [query]);

  const results = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return [];
    return products.filter(p =>
      p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
  }, [debouncedQuery, products]);

  const getQty = (id: number) => cart.find(c => c.id === id)?.qty ?? 0;

  return (
    <div className="search-overlay">
      <div className="search-header">
        <div className="search-input-wrap">
          <span className="search-icon"><IconSearch size={17} color="var(--text3)" /></span>
          <input
            className="search-input"
            placeholder="Mahsulot qidirish..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
          />
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--green)', fontSize: 15, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
          Bekor
        </button>
      </div>

      {query && results.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">😕</div>
          <h3>Topilmadi</h3>
          <p>"{query}" bo'yicha natija yo'q</p>
        </div>
      ) : results.length > 0 ? (
        <div className="product-grid" style={{ padding: '0 4px' }}>
          {results.map(p => {
            const qty = getQty(p.id);
            return (
              <div key={p.id} className="product-card" onClick={() => onProductClick && onProductClick(p)}>
                <div className="product-img-wrap">
                  {p.image ? (
                    <img
                      className="product-img" src={p.image} alt={p.name} loading="lazy" decoding="async"
                      onError={e => {
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        const sibling = target.nextElementSibling as HTMLElement | null;
                        if (sibling) sibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="product-img-placeholder" style={{ display: p.image ? 'none' : 'flex' }}>
                    {CATS_ICONS[p.category] || '🍰'}
                  </div>
                </div>
                <div className="product-body">
                  <div className="product-name">{p.name}</div>
                  <div className="product-cat">{p.category}</div>
                  <div className="product-footer">
                    <div className="product-price">{fmt(p.price)}</div>
                    {qty === 0 ? (
                      <button className="add-btn" onClick={e => { e.stopPropagation(); onAdd(p); }}>
                        <IconPlus size={17} color="white" />
                      </button>
                    ) : (
                      <div className="qty-control" onClick={e => e.stopPropagation()}>
                        <button className="qty-btn" onClick={() => onRemove(p.id)}><IconMinus size={15} /></button>
                        <span className="qty-num">{qty}</span>
                        <button className="qty-btn" onClick={() => onAdd(p)}><IconPlus size={15} color="var(--green)" /></button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon"><IconSearch size={40} color="var(--text3)" /></div>
          <h3>Qidirish</h3>
          <p>Mahsulot nomi yoki kategoriyasini yozing</p>
        </div>
      )}
    </div>
  );
}
