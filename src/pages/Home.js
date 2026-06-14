import React, { useState } from 'react';
import { LOGO_URL } from '../data/api';

const ICONS = { 'Cheesecake':'🍰','Medovik':'🍯','Tort':'🎂','Kofe':'☕','Choy':'🍵','Ichimlik':'🥤','Barchasi':'🍽️' };

export default function Home({ products, categories, banners, settings, loading, cart, onAdd, onRemove, onSearchOpen, cartCount, cartTotal, fmt }) {
  const [activeCat, setActiveCat] = useState('Barchasi');
  const allCats = ['Barchasi', ...categories];
  const filtered = activeCat === 'Barchasi' ? products : products.filter(p => p.category === activeCat);
  const getQty = (id) => { const i = cart.find(c => c.id === id); return i ? i.qty : 0; };

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

      <div className="banner-wrap">
        {banners.length > 0 ? (
          <div className="banner-slide"><img src={banners[0].image} alt="Banner" /></div>
        ) : (
          <div className="banner-slide">
            <div className="banner-default">
              <h2>🍰 Rahmat Chef</h2>
              <p>{settings.bannerText || 'Premium shirinliklar va ichimliklar'}</p>
            </div>
          </div>
        )}
      </div>

      <div className="cats-wrap">
        <div className="cats-scroll">
          {allCats.map(cat => (
            <button key={cat} className={`cat-btn ${activeCat===cat?'active':''}`} onClick={() => setActiveCat(cat)}>
              {ICONS[cat]||'🍽'} {cat}
            </button>
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
                <div key={p.id} className="product-card">
                  <div className="product-img-wrap">
                    {p.image && <img className="product-img" src={p.image} alt={p.name} onError={e=>{e.target.style.display='none';e.target.nextSibling.style.display='flex';}} />}
                    <div className="product-img-placeholder" style={{display:p.image?'none':'flex'}}>{ICONS[p.category]||'🍰'}</div>
                  </div>
                  <div className="product-body">
                    <div className="product-name">{p.name}</div>
                    <div className="product-cat">{p.category}</div>
                    <div className="product-footer">
                      <div className="product-price">{fmt(p.price)}</div>
                      {qty === 0 ? (
                        <button className="add-btn" onClick={() => onAdd(p)}>+</button>
                      ) : (
                        <div className="qty-control">
                          <button className="qty-btn" onClick={() => onRemove(p.id)}>−</button>
                          <span className="qty-num">{qty}</span>
                          <button className="qty-btn" onClick={() => onAdd(p)}>+</button>
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
