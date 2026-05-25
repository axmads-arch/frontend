import React from 'react';
import ProductCard from '../components/ProductCard';

const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton-img" />
    <div className="skeleton-body">
      <div className="skeleton-line" />
      <div className="skeleton-line short" />
    </div>
  </div>
);

export default function HomePage({
  products, loading, catLabel, cart, onAdd, onRem,
  addrBanner, onCloseBanner,
  cartCount, cartTotal, onOpenCart, fmt,
}) {
  return (
    <>
      <div className="main">
        {addrBanner && (
          <div className="addr-banner">
            <h3>Yetkazib berish manzilini kiriting</h3>
            <p>Kuryer siz bilan bog'lanishi uchun</p>
            <div className="addr-btns">
              <button className="btn-later" onClick={onCloseBanner}>Keyinroq</button>
              <button className="btn-enter-addr">Manzil kiriting</button>
            </div>
          </div>
        )}

        <div className="section-title" style={{ marginTop: addrBanner ? 16 : 0 }}>
          {catLabel}
        </div>

        {loading ? (
          <div className="products-grid">
            {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1.5">
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-8 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
            </svg>
            <h3>Taomlar topilmadi</h3>
            <p>Bu bo'limda hozircha taomlar yo'q</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                qty={cart[p.id] || 0}
                onAdd={onAdd}
                onRem={onRem}
                fmt={fmt}
              />
            ))}
          </div>
        )}
      </div>

      {cartCount > 0 && (
        <button className="floating-cart" onClick={onOpenCart}>
          <div className="fc-left">
            <span className="fc-badge">{cartCount}</span>
            <span className="fc-text">Savatchani ochish</span>
          </div>
          <span className="fc-sum">{fmt(cartTotal)}</span>
        </button>
      )}
    </>
  );
}
