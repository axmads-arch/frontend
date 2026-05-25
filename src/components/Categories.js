import React from 'react';
import { CATS } from '../data/products';

export default function Categories({ cat, onSelect }) {
  return (
    <div className="cats-bar">
      <div className="cats-scroll">
        {CATS.map(c => (
          <button
            key={c.id}
            className={`cat-btn${cat === c.id ? ' active' : ''}`}
            onClick={() => onSelect(c.id)}
          >
            <div className="cat-icon">
              {c.id === 'all'
                ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                    <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
                  </svg>
                : c.icon
              }
            </div>
            <span className="cat-label">{c.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
