import React, { useState } from 'react';

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-img"></div>
      <div className="skeleton-line"></div>
      <div className="skeleton-line short"></div>
      <div className="skeleton-line price"></div>
    </div>
  );
}

export default function Home({ products, banner, cart, addToCart, cartTotal, setPage, openProduct, API, loading }) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('hammasi');

  const categories = ['hammasi', ...new Set(products.map(p => p.category))];

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase()));
    const matchCat = activeCategory === 'hammasi' || p.category === activeCategory;
    return matchSearch && matchCat;
  });

  const cartSum = cart.reduce((s, c) => s + c.qty * c.price, 0);

  return (
    <div>
      <div className="header">
        <div className="header-top">
          <div className="logo">
            <div className="logo-img">🍰</div>
            <div>
              <div className="logo-name">Rahmat Chef</div>
              <div className="logo-sub">Sweet Pastry</div>
            </div>
          </div>
          <button className="cart-btn" onClick={() => setPage('cart')}>
            🛒 <span className="cart-count">{cartTotal}</span>
            {cartSum > 0 && <span className="cart-sum">{Number(cartSum).toLocaleString()} so'm</span>}
          </button>
        </div>
        <div className="search-wrap">
          <span>🔍</span>
          <input
            type="text"
            placeholder="Mahsulot qidiring..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="categories">
          {categories.map(cat => (
            <button
              key={cat}
              className={`cat-btn ${cat === activeCategory ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="main">
        <div className="banner">
          <div className="banner-text">
            <h2>{banner.title}</h2>
            <p>{banner.subtitle}</p>
          </div>
          <div className="banner-emoji">{banner.emoji}</div>
        </div>

        <div className="section-title">Mahsulotlar</div>

        {loading ? (
          <div className="products-grid">
            {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🍽️</div>
            <p>Mahsulot topilmadi</p>
          </div>
        ) : (
          <div className="products-grid">
            {filtered.map(p => (
              <div key={p.id} className="product-card" onClick={() => openProduct(p)}>
                <div className="product-img">
                  {p.image ? <img src={p.image} alt={p.name} /> : '🍰'}
                </div>
                <div className="product-info">
                  <div className="product-name">{p.name}</div>
                  <div className="product-desc">{p.description}</div>
                  <div className="product-footer">
                    <div className="product-price">{Number(p.price).toLocaleString()} so'm</div>
                    <button className="add-btn" onClick={e => { e.stopPropagation(); addToCart(p); }}>+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
