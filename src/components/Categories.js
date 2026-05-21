import React from 'react';
import { CATS } from '../data/products';

export default function Categories({ cat, onSelect }) {
  return (
    <div className="cats-bar">
      <div className="cats-scroll">
        {CATS.map(c => (
          <button
            key={c.id}
            className={`cat-btn${(!c.isFilter && cat === c.id) ? ' active' : ''}`}
            onClick={() => onSelect(c.id)}
          >
            <div className="cat-icon">
              {c.isFilter
                ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="4" y1="6" x2="20" y2="6"/>
                    <line x1="8" y1="12" x2="16" y2="12"/>
                    <line x1="11" y1="18" x2="13" y2="18"/>
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
