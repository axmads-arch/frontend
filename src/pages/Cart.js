import React, { useState } from 'react';

const NoImg = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
  </svg>
);

export default function CartPage({
  cart, products, cartTotal,
  onAdd, onRem, onClear, onBack,
  onCheckout, ordering, user, onLogin, fmt
}) {
  const [address, setAddress] = useState('');
  const [payment, setPayment] = useState('cash');

  const items = Object.entries(cart).filter(([,qty]) => qty > 0);

  const PAYMENTS = [
    { id:'cash',  label:'Naqd pul',   icon:'💵' },
    { id:'click', label:'Click',      icon:'📱' },
    { id:'payme', label:'Payme',      icon:'💳' },
    { id:'uzum',  label:'Uzum Bank',  icon:'🏦' },
  ];

  const handleOrder = () => {
    if (!user) { onLogin(); return; }
    if (!address.trim()) { alert('Manzilni kiriting'); return; }
    onCheckout({ address, payment });
  };

  return (
    <div className="page">
      <div className="page-header">
        <button className="page-back" onClick={onBack}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
        </button>
        <span className="page-title">Savatcha</span>
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
          <h3>Savatcha bo'sh</h3>
          <p>Menyudan taomlar qo'shing</p>
          <button className="empty-btn" onClick={onBack}>Menyuga</button>
        </div>
      ) : (
        <>
          <div style={{ paddingBottom: 280 }}>
            {items.map(([id, qty]) => {
              const p = products.find(p => p.id === Number(id));
              if (!p) return null;
              return (
                <div key={id} className="cart-item">
                  <div className="ci-img">
                    {p.image
                      ? <img src={p.image} alt={p.name} onError={e => { e.target.style.display='none'; }}/>
                      : <NoImg />
                    }
                  </div>
                  <div className="ci-info">
                    <div className="ci-name">{p.name}</div>
                    <div className="ci-price">{fmt(p.price)}</div>
                    <span className="ci-comment">Izoh qoldirish</span>
                  </div>
                  <div className="ci-ctrl">
                    <button className="ci-btn" onClick={() => onRem(p.id)}>−</button>
                    <span className="ci-num">{qty}</span>
                    <button className="ci-btn" onClick={() => onAdd(p.id)}>+</button>
                  </div>
                </div>
              );
            })}

            {/* Address */}
            <div style={{ padding:'16px 16px 0' }}>
              <div style={{ fontSize:13, fontWeight:600, color:'var(--muted)', marginBottom:8 }}>
                Yetkazib berish manzili
              </div>
              <input
                style={{
                  width:'100%', padding:'13px 14px',
                  border:'1.5px solid var(--border)',
                  borderRadius:'var(--radius)', fontSize:14,
                  outline:'none', fontFamily:'Inter,sans-serif',
                  color:'var(--text)',
                }}
                placeholder="Ko'cha, uy raqami..."
                value={address}
                onChange={e => setAddress(e.target.value)}
              />
            </div>

            {/* Payment */}
            <div style={{ padding:'16px 16px 0' }}>
              <div style={{ fontSize:13, fontWeight:600, color:'var(--muted)', marginBottom:8 }}>
                To'lov usuli
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                {PAYMENTS.map(pay => (
                  <button
                    key={pay.id}
                    onClick={() => setPayment(pay.id)}
                    style={{
                      padding:'12px', borderRadius:'var(--radius)',
                      border: payment === pay.id
                        ? '2px solid var(--teal)'
                        : '1.5px solid var(--border)',
                      background: payment === pay.id ? 'var(--teal-lt)' : 'var(--white)',
                      color: payment === pay.id ? 'var(--teal)' : 'var(--sub)',
                      fontSize:13, fontWeight:600,
                      cursor:'pointer', display:'flex',
                      alignItems:'center', gap:6,
                      fontFamily:'Inter,sans-serif',
                    }}
                  >
                    <span>{pay.icon}</span> {pay.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="cart-footer">
            <div className="cf-info">
              <span className="cf-label">Jami summa</span>
              <span className="cf-sum">{fmt(cartTotal)}</span>
            </div>
            <button
              className="cf-btn"
              onClick={handleOrder}
              disabled={ordering}
              style={{ opacity: ordering ? 0.7 : 1 }}
            >
              {ordering ? 'Yuborilmoqda...' : "Buyurtma berish"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
