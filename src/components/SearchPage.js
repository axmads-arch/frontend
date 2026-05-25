import React, { useState, useRef, useEffect } from 'react';
import ProductCard from './ProductCard';

export default function SearchPage({ products, cart, onAdd, onRem, onClose, fmt, getFiltered }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef();

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const results = getFiltered(query);

  return (
    <div className="search-page">
      <div className="search-header">
        <button className="search-back" onClick={onClose}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
        </button>
        <div className="search-input-wrap">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            ref={inputRef}
            className="search-input"
            type="text"
            placeholder="Tezkor qidiruv"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{ background:'none', border:'none', cursor:'pointer', color:'#aaa', lineHeight:1 }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="search-results">
        {!query.trim() ? (
          <div className="search-empty">Taom nomini kiriting</div>
        ) : results.length === 0 ? (
          <div className="search-empty">«{query}» bo'yicha hech narsa topilmadi</div>
        ) : (
          results.map(p => (
            <ProductCard
              key={p.id}
              product={p}
              qty={cart[p.id] || 0}
              onAdd={onAdd}
              onRem={onRem}
              fmt={fmt}
            />
          ))
        )}
      </div>
    </div>
  );
}
