// src/pages/Home.tsx
import React, { useState, useEffect, useRef } from 'react';
import { LOGO_URL } from '../data/api';
import { Ms, IconChat, IconMoon, IconSun, IconSearch, IconHeart, IconPlus, IconMinus } from '../components/icons';
import type { Product, CartItem, Banner, Settings } from '../types';

const CATS_ICONS: Record<string, string> = {
  Cheesecake: '🍰', Medovik: '🍯', Tort: '🎂', Kofe: '☕', Choy: '🍵', Ichimlik: '🥤',
};

interface HomeProps {
  products: Product[];
  categories: string[];
  banners: Banner[];
  settings: Settings;
  loading: boolean;
  cart: CartItem[];
  onAdd: (product: Product) => void;
  onRemove: (productId: number) => void;
  onSearchOpen: () => void;
  onProductClick: (product: Product) => void;
  onChatOpen: () => void;
  fmt: (n: number) => string;
  favorites: number[];
  onToggleFavorite: (productId: number) => void;
  darkMode: boolean;
  onToggleDark: () => void;
}

export default function Home({
  products, categories, banners, settings, loading, cart,
  onAdd, onRemove, onSearchOpen, onProductClick, onChatOpen,
  fmt, favorites, onToggleFavorite, darkMode, onToggleDark,
}: HomeProps) {
  const [activeCat, setActiveCat] = useState('Barchasi');
  const [bannerIdx, setBannerIdx] = useState(0);
  const [deliveryChoice, setDeliveryChoice] = useState<'delivery' | 'pickup'>(
    () => (localStorage.getItem('rc_delivery_type') as 'delivery' | 'pickup') || 'delivery'
  );
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const allCats = ['Barchasi', ...categories];
  const filtered = activeCat === 'Barchasi' ? products : products.filter(p => p.category === activeCat);
  const getQty = (id: number) => cart.find(c => c.id === id)?.qty ?? 0;
  const isFav = (id: number) => favorites.includes(id);

  useEffect(() => {
    if (banners.length <= 1) return;
    timerRef.current = setInterval(() => setBannerIdx(i => (i + 1) % banners.length), 4000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [banners]);

  const selectDeliveryType = (type: 'delivery' | 'pickup') => {
    localStorage.setItem('rc_delivery_type', type);
    setDeliveryChoice(type);
  };

  const ProductCard = ({ p }: { p: Product }) => {
    const qty = getQty(p.id);
    return (
      <div className="product-card" onClick={() => onProductClick(p)}>
        <div className="product-img-wrap">
          {p.image ? (
            <img
              className="product-img"
              src={p.image}
              alt={p.name}
              loading="lazy"
              decoding="async"
              onError={e => {
                const target = e.currentTarget;
                target.style.display = 'none';
                const sibling = target.nextElementSibling as HTMLElement | null;
                if (sibling) sibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className="product-img-placeholder" style={{ display: p.image ? 'none' : 'flex' }}>🍰</div>
          <button className="fav-btn" onClick={e => { e.stopPropagation(); onToggleFavorite(p.id); }}>
            <IconHeart size={18} filled={isFav(p.id)} color={isFav(p.id) ? '#e5484d' : 'rgba(0,0,0,0.45)'} />
          </button>
          {p.stock !== null && p.stock !== undefined && p.stock <= 5 && p.stock > 0 && (
            <div className="stock-badge">{p.stock} ta qoldi</div>
          )}
        </div>
        <div className="product-body">
          <div className="product-cat">{p.category}</div>
          <div className="product-name">{p.name}</div>
          <div className="product-footer">
            <div className="product-price">{fmt(p.price)}</div>
            {qty === 0 ? (
              <button className="add-btn" onClick={e => { e.stopPropagation(); onAdd(p); }}>
                <IconPlus size={19} color="white" />
              </button>
            ) : (
              <div className="qty-control" onClick={e => e.stopPropagation()}>
                <button className="qty-btn" onClick={() => onRemove(p.id)}><IconMinus size={16} /></button>
                <span className="qty-num">{qty}</span>
                <button className="qty-btn" onClick={() => onAdd(p)}><IconPlus size={16} color="var(--green)" /></button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="page">
      <header className="header">
        <img
          className="header-logo" src={LOGO_URL} alt="Logo" decoding="async" fetchPriority="high"
          onError={e => {
            const target = e.currentTarget;
            target.style.display = 'none';
            const sibling = target.nextElementSibling as HTMLElement | null;
            if (sibling) sibling.style.display = 'flex';
          }}
        />
        <div className="header-logo-placeholder" style={{ display: 'none' }}>R</div>
        <div className="header-info">
          <div className="header-name">Rahmat Chef</div>
          <div className="header-sub">Sweet Pastry</div>
        </div>
        <div className="header-actions">
          <button className="icon-btn" onClick={onChatOpen}><IconChat size={21} /></button>
          <button className="icon-btn" onClick={onToggleDark}>{darkMode ? <IconSun size={21} /> : <IconMoon size={21} />}</button>
          <button className="icon-btn" onClick={onSearchOpen}><IconSearch size={21} /></button>
        </div>
      </header>

      <div className="delivery-bar">
        <div className="delivery-bar-left">
          <div className="delivery-label">Yetkazib berish</div>
          <div className="delivery-addr">Toshkent shahri</div>
        </div>
      </div>

      <div className="banner-wrap">
        <div className="banner-carousel">
          <div className="banner-slides" style={{ transform: `translateX(-${bannerIdx * 100}%)` }}>
            {banners.length > 0 ? banners.map((b, i) => (
              <div key={b.id ?? i} className="banner-slide">
                <img src={b.image} alt={b.title || 'Banner'} loading={i === 0 ? 'eager' : 'lazy'} decoding="async" />
              </div>
            )) : (
              <div className="banner-slide">
                <div className="banner-default">
                  <h2>{settings.siteName || 'Rahmat Chef'}</h2>
                  <p>{settings.bannerText || 'Premium shirinliklar'}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        {banners.length > 1 && (
          <div className="banner-dots">
            {banners.map((_, i) => (
              <div key={i} className={`banner-dot ${i === bannerIdx ? 'active' : ''}`} onClick={() => setBannerIdx(i)} />
            ))}
          </div>
        )}
      </div>

      {/* BUYURTMA USULINI TANLANG — ixcham, professional kartochkalar */}
      <div className="section" style={{ paddingTop: 20 }}>
        <div className="section-title" style={{ fontSize: 18, marginBottom: 11 }}>Buyurtma usulini tanlang</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, maxWidth: 320 }}>
          <div
            onClick={() => selectDeliveryType('delivery')}
            style={{
              background: deliveryChoice === 'delivery' ? 'var(--green)' : 'var(--white)',
              border: deliveryChoice === 'delivery' ? 'none' : '1.5px solid var(--border)',
              borderRadius: 14, padding: '12px 14px', cursor: 'pointer', transition: 'all .15s',
              boxShadow: deliveryChoice === 'delivery' ? '0 4px 12px rgba(0,98,65,0.25)' : 'none',
            }}
          >
            <div style={{ color: deliveryChoice === 'delivery' ? '#fff' : 'var(--text)', fontWeight: 800, fontSize: 13 }}>Yetkazib berish</div>
            <div style={{ color: deliveryChoice === 'delivery' ? 'rgba(255,255,255,0.75)' : 'var(--text3)', fontSize: 11, fontWeight: 600, marginTop: 1 }}>
              {fmt(settings?.deliveryPrice || 10000)}
            </div>
          </div>
          <div
            onClick={() => selectDeliveryType('pickup')}
            style={{
              background: deliveryChoice === 'pickup' ? 'var(--green)' : 'var(--white)',
              border: deliveryChoice === 'pickup' ? 'none' : '1.5px solid var(--border)',
              borderRadius: 14, padding: '12px 14px', cursor: 'pointer', transition: 'all .15s',
              boxShadow: deliveryChoice === 'pickup' ? '0 4px 12px rgba(0,98,65,0.25)' : 'none',
            }}
          >
            <div style={{ color: deliveryChoice === 'pickup' ? '#fff' : 'var(--text)', fontWeight: 800, fontSize: 13 }}>Olib ketish</div>
            <div style={{ color: deliveryChoice === 'pickup' ? 'rgba(255,255,255,0.75)' : 'var(--text3)', fontSize: 11, fontWeight: 600, marginTop: 1 }}>Bepul</div>
          </div>
        </div>
      </div>

      {favorites.length > 0 && (
        <div className="section">
          <div className="section-title">Sevimlilar</div>
          <div className="product-grid">
            {products.filter(p => favorites.includes(p.id)).map(p => <ProductCard key={p.id} p={p} />)}
          </div>
        </div>
      )}

      <div className="cats-wrap">
        <div className="cats-scroll">
          {allCats.map(cat => (
            <button key={cat} className={`cat-btn ${activeCat === cat ? 'active' : ''}`} onClick={() => setActiveCat(cat)}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="section-title">{activeCat === 'Barchasi' ? 'Barcha mahsulotlar' : activeCat}</div>
        {loading ? (
          <div className="product-grid">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="skel-card">
                <div className="skeleton skel-img" />
                <div className="skel-body">
                  <div className="skeleton skel-line" style={{ width: '40%', height: 9, marginBottom: 5 }} />
                  <div className="skeleton skel-line" />
                  <div className="skeleton skel-line short" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <Ms icon="search_off" size={48} fill={0} color="var(--text3)" />
            <h3>Mahsulotlar yo'q</h3>
          </div>
        ) : (
          <div className="product-grid">
            {filtered.map(p => <ProductCard key={p.id} p={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
