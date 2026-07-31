import React, { useState, useEffect, useRef } from 'react';
import { LOGO_URL } from '../data/api';

// Material Symbol komponenti
const Ms = ({ icon, size = 22, fill = 1, color = 'currentColor', style = {} }) => (
  <span style={{
    fontFamily: 'Material Symbols Rounded',
    fontVariationSettings: `'FILL' ${fill}, 'wght' 400, 'GRAD' 0, 'opsz' ${size}`,
    fontSize: size, lineHeight: 1, display: 'inline-block',
    userSelect: 'none', color, ...style
  }}>{icon}</span>
);

export default function Home({ products, categories, banners, settings, loading, cart, onAdd, onRemove, onSearchOpen, onProductClick, onChatOpen, fmt, favorites, onToggleFavorite, darkMode, onToggleDark }) {
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
          {p.image ? <img className="product-img" src={p.image} alt={p.name} onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} /> : null}
          <div className="product-img-placeholder" style={{ display: p.image ? 'none' : 'flex' }}>🍰</div>
          <button className="fav-btn" onClick={e => { e.stopPropagation(); onToggleFavorite(p.id); }}>
            <Ms icon="favorite" size={18} fill={isFav(p.id) ? 1 : 0} color={isFav(p.id) ? '#e53935' : 'rgba(0,0,0,0.4)'} />
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
                <Ms icon="add" size={20} fill={1} color="white" />
              </button>
            ) : (
              <div className="qty-control" onClick={e => e.stopPropagation()}>
                <button className="qty-btn" onClick={() => onRemove(p.id)}>
                  <Ms icon="remove" size={18} fill={1} />
                </button>
                <span className="qty-num">{qty}</span>
                <button className="qty-btn" onClick={() => onAdd(p)}>
                  <Ms icon="add" size={18} fill={1} />
                </button>
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
        <img className="header-logo" src={LOGO_URL} alt="Logo" onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
        <div className="header-logo-placeholder" style={{ display: 'none' }}>R</div>
        <div className="header-info">
          <div className="header-name">Rahmat Chef</div>
          <div className="header-sub">Sweet Pastry</div>
        </div>
        <div className="header-actions">
          <button className="icon-btn" onClick={onChatOpen}>
            <Ms icon="chat_bubble" size={22} fill={0} />
          </button>
          <button className="icon-btn" onClick={onToggleDark}>
            <Ms icon={darkMode ? 'light_mode' : 'dark_mode'} size={22} fill={1} />
          </button>
          <button className="icon-btn" onClick={onSearchOpen}>
            <Ms icon="search" size={22} fill={0} />
          </button>
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
              <div key={i} className="banner-slide"><img src={b.image} alt={b.title || 'Banner'} /></div>
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
            {banners.map((_, i) => <div key={i} className={`banner-dot ${i === bannerIdx ? 'active' : ''}`} onClick={() => setBannerIdx(i)} />)}
          </div>
        )}
      </div>

      {favorites && favorites.length > 0 && (
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
            <button key={cat} className={`cat-btn ${activeCat === cat ? 'active' : ''}`} onClick={() => setActiveCat(cat)}>{cat}</button>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="section-title">{activeCat === 'Barchasi' ? 'Barcha mahsulotlar' : activeCat}</div>
        {loading ? (
          <div className="product-grid">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="skel-card">
                <div className="skeleton skel-img" />
                <div className="skel-body">
                  <div className="skeleton skel-line" style={{ width:'40%', height:9, marginBottom:5 }} />
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
