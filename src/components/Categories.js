import React, { useState, useEffect } from 'react';
import { fetchCategories } from '../data/products';

export default function Categories({ cat, onSelect }) {
  const [cats, setCats] = useState([]);

  useEffect(() => {
    fetchCategories().then(categories => {
      setCats(categories);
    });
  }, []);

  return (
    <div className="cats-bar">
      <div className="cats-scroll">
        {/* Barchasi tugmasi */}
        <button
          className={`cat-btn${cat === 'all' ? ' active' : ''}`}
          onClick={() => onSelect('all')}
        >
          <div className="cat-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
            </svg>
          </div>
          <span className="cat-label">Barchasi</span>
        </button>

        {/* Backenddan kelgan kategoriyalar */}
        {cats.map(c => (
          <button
            key={c}
            className={`cat-btn${cat === c ? ' active' : ''}`}
            onClick={() => onSelect(c)}
          >
            <div className="cat-icon" style={{ fontSize: 11 }}>
              {c.substring(0, 2).toUpperCase()}
            </div>
            <span className="cat-label">{c}</span>
          </button>
        ))}

        {/* Filter tugmasi */}
        <button
          className="cat-btn"
          onClick={() => onSelect('filter')}
        >
          <div className="cat-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="4" y1="6" x2="20" y2="6"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
              <line x1="11" y1="18" x2="13" y2="18"/>
            </svg>
          </div>
          <span className="cat-label">Filter</span>
        </button>
      </div>
    </div>
  );
}
