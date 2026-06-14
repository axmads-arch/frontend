import React, { useState } from 'react';

const CATS_ICONS = { 'Cheesecake': '🍰', 'Medovik': '🍯', 'Tort': '🎂', 'Kofe': '☕', 'Choy': '🍵', 'Ichimlik': '🥤' };

export default function SearchPage({ products, cart, onAdd, onRemove, onClose, fmt }) {
  const [query, setQuery] = useState('');

  const results = query.trim()
    ? products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const getQty = (id) => { const i = cart.find(c => c.id === id); return i ? i.qty : 0; };

  return (
    <div className="search-overlay">
      <div className="search-header">
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            placeholder="Mahsulot qidirish..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
          />
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--teal)', fontSize: 15, fontWeight: 600, cursor: 'pointer', white_space: 'nowrap' }}>
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
              <div key={p.id} className="product-card">
                <div className="product-img-wrap">
                  {p.image ? (
                    <img className="product-img" src={p.image} alt={p.name} onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
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
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h3>Qidirish</h3>
          <p>Mahsulot nomi yoki kategoriyasini yozing</p>
        </div>
      )}
    </div>
  );
}
