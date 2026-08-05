import React, { useState, useEffect, useRef } from 'react';
import { LOGO_URL } from '../data/api';

// Material Symbol komponenti (matn/kam muhim ikonkalar uchun)
const Ms = ({ icon, size = 22, fill = 1, color = 'currentColor', style = {} }) => (
  <span style={{
    fontFamily: 'Material Symbols Rounded',
    fontVariationSettings: `'FILL' ${fill}, 'wght' 400, 'GRAD' 0, 'opsz' ${size}`,
    fontSize: size, lineHeight: 1, display: 'inline-block',
    userSelect: 'none', color, ...style
  }}>{icon}</span>
);

// Ishonchli SVG ikonkalar (shriftga bog'liq emas — hech qachon bo'sh chiqmaydi)
const IconChat = ({ size = 22, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M4 4h16v12H8l-4 4V4z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" fill="none" />
  </svg>
);
const IconMoon = ({ size = 22, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M20 14.5A8.5 8.5 0 119.5 4 6.8 6.8 0 0020 14.5z" fill={color} />
  </svg>
);
const IconSun = ({ size = 22, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="4.5" fill={color} />
    <g stroke={color} strokeWidth="1.8" strokeLinecap="round">
      <path d="M12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8L6 18M18 6l1.8-1.8" />
    </g>
  </svg>
);
const IconSearch = ({ size = 22, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="7" stroke={color} strokeWidth="1.8" fill="none" />
    <path d="M20 20l-4.3-4.3" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);
const IconHeart = ({ size = 18, filled = false, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 20s-7-4.35-9.5-8.8C.8 7.6 2.5 4 6.2 4 8.4 4 10 5.2 12 7.3 14 5.2 15.6 4 17.8 4c3.7 0 5.4 3.6 3.7 7.2C19 15.65 12 20 12 20z"
      fill={filled ? color : 'none'} stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
  </svg>
);
const IconPlus = ({ size = 20, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 5v14M5 12h14" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
  </svg>
);
const IconMinus = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M5 12h14" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
  </svg>
);
const IconTruck = ({ size = 22, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M2 7h11v9H2z" fill={color} />
    <path d="M13 10h4.5l3 3.5V16H13z" fill={color} />
    <circle cx="6" cy="18" r="1.8" fill="none" stroke={color} strokeWidth="1.8" />
    <circle cx="16.5" cy="18" r="1.8" fill="none" stroke={color} strokeWidth="1.8" />
  </svg>
);
const IconBag = ({ size = 22, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M6 8h12l1 12H5L6 8z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" fill="none" />
    <path d="M9 8V6a3 3 0 016 0v2" stroke={color} strokeWidth="1.8" fill="none" />
  </svg>
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
                <button className="qty-btn" onClick={() => onRemove(p.id)}>
                  <IconMinus size={16} />
                </button>
                <span className="qty-num">{qty}</span>
                <button className="qty-btn" onClick={() => onAdd(p)}>
                  <IconPlus size={16} color="var(--green)" />
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
            <IconChat size={21} />
          </button>
          <button className="icon-btn" onClick={onToggleDark}>
            {darkMode ? <IconSun size={21} /> : <IconMoon size={21} />}
          </button>
          <button className="icon-btn" onClick={onSearchOpen}>
            <IconSearch size={21} />
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

      {/* BUYURTMA USULINI TANLANG — Safia uslubidagi 2x2 tezkor kartochkalar */}
      <div className="section" style={{ paddingTop: 20 }}>
        <div className="section-title" style={{ fontSize: 18, marginBottom: 11 }}>Buyurtma usulini tanlang</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div style={{ background: 'linear-gradient(150deg,var(--green) 0%,var(--green2) 100%)', borderRadius: 20, padding: '18px 16px', boxShadow: '0 8px 20px rgba(0,98,65,0.22)' }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 26 }}>
              <IconTruck size={20} color="#fff" />
            </div>
            <div style={{ color: '#fff', fontWeight: 900, fontSize: 15, letterSpacing: '-0.3px' }}>Yetkazib berish</div>
            <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, fontWeight: 600, marginTop: 2 }}>{fmt(settings?.deliveryPrice || 10000)}</div>
          </div>
          <div style={{ background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 20, padding: '18px 16px', boxShadow: 'var(--shadow)' }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: 'var(--green-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 26 }}>
              <IconBag size={19} color="var(--green)" />
            </div>
            <div style={{ color: 'var(--text)', fontWeight: 900, fontSize: 15, letterSpacing: '-0.3px' }}>Olib ketish</div>
            <div style={{ color: 'var(--text3)', fontSize: 12, fontWeight: 600, marginTop: 2 }}>Bepul</div>
          </div>
        </div>
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
