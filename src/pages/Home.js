import React from 'react';
import ProductCard from '../components/ProductCard';

export default function HomePage({
  products, catLabel, cart, onAdd, onRem,
  addrBanner, onCloseBanner,
  cartCount, cartTotal, onOpenCart, fmt,
}) {
  return (
    <>
      <div className="main">
        {addrBanner && (
          <div className="addr-banner">
            <h3>Введите адрес доставки</h3>
            <p>По которому курьер сможет вас найти</p>
            <div className="addr-btns">
              <button className="btn-later" onClick={onCloseBanner}>Позже</button>
              <button className="btn-enter-addr">Введите адрес</button>
            </div>
          </div>
        )}

        <div className="section-title" style={{ marginTop: addrBanner ? 16 : 0 }}>
          {catLabel}
        </div>

        {products.length === 0 ? (
          <div className="no-results">Нет блюд в этой категории</div>
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
            <span className="fc-text">Открыть корзину</span>
          </div>
          <span className="fc-sum">{fmt(cartTotal)}</span>
        </button>
      )}
    </>
  );
}
