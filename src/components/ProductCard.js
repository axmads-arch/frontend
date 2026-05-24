import React, { useState } from 'react';

const NoImg = () => (
  <div className="card-no-img">
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  </div>
);

export default function ProductCard({ product, qty, onAdd, onRem, fmt }) {
  const [imgOk, setImgOk] = useState(true);
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="card">
      <div className="card-img">
        {imgOk && product.img
          ? <img
              src={product.img}
              alt={product.name}
              loading="lazy"
              className={loaded ? 'loaded' : 'loading'}
              onLoad={() => setLoaded(true)}
              onError={() => setImgOk(false)}
            />
          : <NoImg />
        }
      </div>
      <div className="card-body">
        <div className="card-price">{fmt(product.price)}</div>
        <div className="card-name">{product.name}</div>
      </div>
      {qty === 0
        ? <button className="card-add" onClick={() => onAdd(product.id)}>+</button>
        : <div className="card-counter">
            <button className="cc-btn" onClick={() => onRem(product.id)}>−</button>
            <span className="cc-num">{qty}</span>
            <button className="cc-btn" onClick={() => onAdd(product.id)}>+</button>
          </div>
      }
    </div>
  );
}
