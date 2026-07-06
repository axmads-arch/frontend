import React, { useState, useEffect, useRef } from 'react';
import { LOGO_URL } from '../data/api';

// SVG ICONS
const Icons = {
  search: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  moon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>,
  sun: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  chat: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  mapPin: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  truck: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
  chevronDown: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  plus: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  minus: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  heart: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  heartFill: <svg viewBox="0 0 24 24" fill="#d93025" stroke="#d93025" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
};

export default function Home({ products, categories, banners, settings, loading, cart, onAdd, onRemove, onSearchOpen, onProductClick, onChatOpen, cartCount, cartTotal, fmt, favorites, onToggleFavorite, darkMode, onToggleDark }) {
  const [activeCat, setActiveCat] = useState('Barchasi');
  const [bannerIdx, setBannerIdx] = useState(0);
  const timerRef = useRef(null);

  const allCats = ['Barchasi', ...categories];
  const filtered = activeCat === 'Barchasi' ? products : products.filter(p => p.category === activeCat);
  const getQty = id => { const i = cart.find(c => c.id === id); return i ? i.qty : 0; };
  const isFav = id => favorites && favorites.includes(id);

  useEffect(() => {
    if (banners.length <= 1) return;
    timerRef.current = setInterval(() => setBannerIdx(i => (i + 1) % banners.length), 4000);
    return () => clearInterval(timerRef.current);
  }, [banners]);

  const ProductCard = ({ p }) => {
    const qty = getQty(p.id);
    return (
      <div className="product-card" onClick={() => onProductClick(p)}>
        <div className="product-img-wrap">
          {p.image
            ? <img className="product-img" src={p.image} alt={p.name} onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
            : null}
          <div className="product-img-placeholder" style={{ display: p.image ? 'none' : 'flex' }}>🍰</div>
          <button className="fav-btn" onClick={e => { e.stopPropagation(); onToggleFavorite(p.id); }}>
            {isFav(p.id) ? Icons.heartFill : Icons.heart}
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
                {Icons.plus}
              </button>
            ) : (
              <div className="qty-control" onClick={e => e.stopPropagation()}>
                <button className="qty-btn" onClick={() => onRemove(p.id)}>{Icons.minus}</button>
                <span className="qty-num">{qty}</span>
                <button className="qty-btn" onClick={() => onAdd(p)}>{Icons.plus}</button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="page">
      {/* HEADER */}
      <header className="header">
        <img className="header-logo" src={LOGO_URL} alt="Logo" onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
        <div className="header-logo-placeholder" style={{ display: 'none' }}>R</div>
        <div className="header-info">
          <div className="header-name">Rahmat Chef</div>
          <div className="header-sub">Sweet Pastry</div>
        </div>
        <div className="header-actions">
          <button className="icon-btn" onClick={onChatOpen}>{Icons.chat}</button>
          <button className="icon-btn" onClick={onToggleDark}>{darkMode ? Icons.sun : Icons.moon}</button>
          <button className="icon-btn" onClick={onSearchOpen}>{Icons.search}</button>
        </div>
      </header>

      {/* DELIVERY BAR */}
      <div className="delivery-bar">
        <div className="delivery-bar-left">
          <div className="delivery-label">Yetkazib berish</div>
          <div className="delivery-addr">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            Toshkent shahri
          </div>
        </div>
        <button className="delivery-type-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
          Yetkazib berish
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
      </div>

      {/* BANNER */}
      <div className="banner-wrap">
        <div className="banner-carousel">
          <div className="banner-slides" style={{ transform: `translateX(-${bannerIdx * 100}%)` }}>
            {banners.length > 0 ? banners.map((b, i) => (
              <div key={i} className="banner-slide">
                <img src={b.image} alt={b.title || 'Banner'} />
              </div>
            )) : (
              <div className="banner-slide">
                <div className="banner-default">
                  <h2>{settings.siteName || 'Rahmat Chef'}</h2>
                  <p>{settings.bannerText || 'Premium shirinliklar va ichimliklar'}</p>
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

      {/* SEVIMLILAR */}
      {favorites && favorites.length > 0 && (
        <div className="section">
          <div className="section-title">Sevimlilar</div>
          <div className="product-grid">
            {products.filter(p => favorites.includes(p.id)).map(p => <ProductCard key={p.id} p={p} />)}
          </div>
        </div>
      )}

      {/* KATEGORIYALAR */}
      <div className="cats-wrap">
        <div className="cats-scroll">
          {allCats.map(cat => (
            <button key={cat} className={`cat-btn ${activeCat === cat ? 'active' : ''}`} onClick={() => setActiveCat(cat)}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* MAHSULOTLAR */}
      <div className="section">
        <div className="section-title">
          {activeCat === 'Barchasi' ? 'Barcha mahsulotlar' : activeCat}
        </div>
        {loading ? (
          <div className="product-grid">
            {[1,2,3,4,5,6].map(i => (
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
            <div className="empty-state-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
            </div>
            <h3>Mahsulotlar yo'q</h3>
            <p>Bu kategoriyada hozircha mahsulot mavjud emas</p>
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
