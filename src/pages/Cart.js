import React from 'react';
import { PRODUCTS } from '../data/products';

const NoImg = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
  </svg>
);

export default function CartPage({ cart, cartTotal, onAdd, onRem, onClear, onBack, onCheckout, fmt }) {
  const items = Object.entries(cart).filter(([,qty]) => qty > 0);

  return (
    <div className="page">
      <div className="page-header">
        <button className="page-back" onClick={onBack}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
        </button>
        <span className="page-title">Корзина</span>
        <button className="page-action" onClick={onClear}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14H6L5 6"/>
            <path d="M10 11v6M14 11v6M9 6V4h6v2"/>
          </svg>
        </button>
      </div>

      {items.length === 0 ? (
        <div className="empty-state" style={{ paddingTop: 80 }}>
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1.5">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <h3>Корзина пуста</h3>
          <p>Добавьте блюда из меню</p>
          <button className="empty-btn" onClick={onBack}>В меню</button>
        </div>
      ) : (
        <>
          <div style={{ paddingBottom: 150 }}>
            {items.map(([id, qty]) => {
              const p = PRODUCTS.find(p => p.id === Number(id));
              if (!p) return null;
              return (
                <div key={id} className="cart-item">
                  <div className="ci-img">
                    {p.img
                      ? <img src={p.img} alt={p.name} onError={e => { e.target.style.display='none'; }}/>
                      : <NoImg />
                    }
                  </div>
                  <div className="ci-info">
                    <div className="ci-name">{p.name}</div>
                    <div className="ci-price">{fmt(p.price)}</div>
                    <span className="ci-comment">Оставить комментарий</span>
                  </div>
                  <div className="ci-ctrl">
                    <button className="ci-btn" onClick={() => onRem(p.id)}>−</button>
                    <span className="ci-num">{qty}</span>
                    <button className="ci-btn" onClick={() => onAdd(p.id)}>+</button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="cart-footer">
            <div className="cf-info">
              <span className="cf-label">Сумма заказа</span>
              <span className="cf-sum">{fmt(cartTotal)}</span>
            </div>
            <button className="cf-btn" onClick={onCheckout}>Далее</button>
          </div>
        </>
      )}
    </div>
  );
}
