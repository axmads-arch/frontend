import React, { useState, useEffect, useRef } from 'react';
import { LOGO_URL } from '../data/api';

const ICONS = { 'Cheesecake':'🍰','Medovik':'🍯','Tort':'🎂','Kofe':'☕','Choy':'🍵','Ichimlik':'🥤','Barchasi':'🍽️' };

export default function Home({ products, categories, banners, settings, loading, cart, onAdd, onRemove, onSearchOpen, onProductClick, cartCount, cartTotal, fmt, favorites, onToggleFavorite, darkMode, onToggleDark }) {
  const [activeCat, setActiveCat] = useState('Barchasi');
  const [bannerIdx, setBannerIdx] = useState(0);
  const bannerTimer = useRef(null);

  const allCats = ['Barchasi', ...categories];
  const filtered = activeCat === 'Barchasi' ? products : products.filter(p => p.category === activeCat);
  const getQty = (id) => { const i = cart.find(c => c.id === id); return i ? i.qty : 0; };
  const isFav = (id) => favorites && favorites.includes(id);

  // Banner carousel auto-scroll
  useEffect(() => {
    if (banners.length <= 1) return;
    bannerTimer.current = setInterval(() => {
      setBannerIdx(i => (i + 1) % banners.length);
    }, 3500);
    return () => clearInterval(bannerTimer.current);
  }, [banners]);

  return (
    <div className="page">
      <header className="header">
        <img className="header-logo" src={LOGO_URL} alt="Logo" onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
        <div className="header-logo-placeholder" style={{display:'none'}}>R</div>
        <div className="header-info">
          <div className="header-name">Rahmat Chef</div>
          <div className="header-sub">Sweet Pastry</div>
        </div>
        <div className="header-actions">
          <button className="icon-btn" onClick={onToggleDark} title="Dark mode">
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button className="icon-btn" onClick={onSearchOpen}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </button>
        </div>
      </header>

      <div className="delivery-bar">
        <div className="delivery-bar-left">
          <div className="delivery-label">Yetkazib berish</div>
          <div className="delivery-addr">📍 Toshkent shahri</div>
        </div>
        <div className="delivery-type-btn">🚗 Yetkazib berish ▾</div>
      </div>

      {/* BANNER CAROUSEL */}
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
                  <h2>🍰 Rahmat Chef</h2>
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
        <div className="section" style={{ paddingTop: 14 }}>
          <div className="section-title">❤️ Sevimlilar</div>
          <div className="product-grid">
            {products.filter(p => favorites.includes(p.id)).map(p => {
              const qty = getQty(p.id);
              return (
                <div key={p.id} className="product-card" onClick={() => onProductClick(p)}>
                  <div className="product-img-wrap">
                    {p.image && <img className="product-img" src={p.image} alt={p.name} onError={e=>{e.target.style.display='none';e.target.nextSibling.style.display='flex';}} />}
                    <div className="product-img-placeholder" style={{display:p.image?'none':'flex'}}>{ICONS[p.category]||'🍰'}</div>
                    <button onClick={e=>{e.stopPropagation();onToggleFavorite(p.id);}} style={{position:'absolute',top:8,right:8,background:'rgba(255,255,255,0.9)',border:'none',borderRadius:'50%',width:28,height:28,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',fontSize:14}}>❤️</button>
                  </div>
                  <div className="product-body">
                    <div className="product-name">{p.name}</div>
                    <div className="product-cat">{p.category}</div>
                    <div className="product-footer">
                      <div className="product-price">{fmt(p.price)}</div>
                      {qty === 0 ? (
                        <button className="add-btn" onClick={e=>{e.stopPropagation();onAdd(p);}}>+</button>
                      ) : (
                        <div className="qty-control">
                          <button className="qty-btn" onClick={e=>{e.stopPropagation();onRemove(p.id);}}>−</button>
                          <span className="qty-num">{qty}</span>
                          <button className="qty-btn" onClick={e=>{e.stopPropagation();onAdd(p);}}>+</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* KATEGORIYALAR */}
      <div className="cats-wrap">
        <div className="cats-scroll">
          {allCats.map(cat => (
            <button key={cat} className={`cat-btn ${activeCat===cat?'active':''}`} onClick={() => setActiveCat(cat)}>
              {ICONS[cat]||'🍽'} {cat}
            </button>
          ))}
        </div>
      </div>

      {/* MAHSULOTLAR */}
      <div className="section">
        <div className="section-title">{activeCat === 'Barchasi' ? 'Barcha mahsulotlar' : activeCat}</div>
        {loading ? (
          <div className="product-grid">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="skel-card">
                <div className="skeleton skel-img" />
                <div className="skel-body"><div className="skeleton skel-line" /><div className="skeleton skel-line short" /></div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">😕</div><h3>Mahsulotlar yo'q</h3></div>
        ) : (
          <div className="product-grid">
            {filtered.map(p => {
              const qty = getQty(p.id);
              return (
                <div key={p.id} className="product-card" onClick={() => onProductClick(p)}>
                  <div className="product-img-wrap">
                    {p.image && <img className="product-img" src={p.image} alt={p.name} onError={e=>{e.target.style.display='none';e.target.nextSibling.style.display='flex';}} />}
                    <div className="product-img-placeholder" style={{display:p.image?'none':'flex'}}>{ICONS[p.category]||'🍰'}</div>
                    <button onClick={e=>{e.stopPropagation();onToggleFavorite(p.id);}} style={{position:'absolute',top:8,right:8,background:'rgba(255,255,255,0.9)',border:'none',borderRadius:'50%',width:28,height:28,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',fontSize:14}}>
                      {isFav(p.id)?'❤️':'🤍'}
                    </button>
                    {p.stock !== null && p.stock !== undefined && p.stock <= 5 && p.stock > 0 && (
                      <div style={{position:'absolute',bottom:8,left:8,background:'rgba(255,107,0,0.9)',color:'white',fontSize:10,fontWeight:700,padding:'3px 7px',borderRadius:6}}>
                        {p.stock} ta qoldi
                      </div>
                    )}
                  </div>
                  <div className="product-body">
                    <div className="product-name">{p.name}</div>
                    <div className="product-cat">{p.category}</div>
                    <div className="product-footer">
                      <div className="product-price">{fmt(p.price)}</div>
                      {qty === 0 ? (
                        <button className="add-btn" onClick={e=>{e.stopPropagation();onAdd(p);}}>+</button>
                      ) : (
                        <div className="qty-control">
                          <button className="qty-btn" onClick={e=>{e.stopPropagation();onRemove(p.id);}}>−</button>
                          <span className="qty-num">{qty}</span>
                          <button className="qty-btn" onClick={e=>{e.stopPropagation();onAdd(p);}}>+</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
