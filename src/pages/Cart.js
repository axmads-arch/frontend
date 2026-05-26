import React, { useState } from 'react';

const NoImg = () => (
  <div style={{
    width:'100%', height:'100%',
    display:'flex', alignItems:'center',
    justifyContent:'center', background:'#f4f4f4'
  }}>
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  </div>
);

const PAYMENTS = [
  { id:'cash',  label:'Naqd',       icon:'💵' },
  { id:'click', label:'Click',      icon:'📱' },
  { id:'payme', label:'Payme',      icon:'💳' },
  { id:'uzum',  label:'Uzum Bank',  icon:'🏦' },
  { id:'card',  label:'Karta',      icon:'💴' },
];

export default function CartPage({
  cart, products, cartTotal,
  onAdd, onRem, onClear, onBack,
  onCheckout, ordering, user, onLogin, fmt
}) {
  const [address,      setAddress]      = useState('');
  const [payment,      setPayment]      = useState('cash');
  const [deliveryType, setDeliveryType] = useState('delivery');
  const [comment,      setComment]      = useState('');

  const items = Object.entries(cart).filter(([,qty]) => qty > 0);

  const handleOrder = () => {
    if (!user) { onLogin(); return; }
    if (deliveryType === 'delivery' && !address.trim()) {
      alert('Yetkazib berish manzilini kiriting');
      return;
    }
    onCheckout({ address, payment, deliveryType, comment });
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
        <div className="empty-state" style={{ paddingTop:80 }}>
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
          <div style={{ paddingBottom:320 }}>

            {/* Mahsulotlar */}
            {items.map(([id, qty]) => {
              const p = products.find(p => p.id === Number(id));
              if (!p) return null;
              return (
                <div key={id} className="cart-item">
                  <div className="ci-img">
                    {p.image
                      ? <img src={p.image} alt={p.name}
                          style={{ width:'100%', height:'100%', objectFit:'cover' }}
                          onError={e => { e.target.style.display='none'; }}
                        />
                      : <NoImg />
                    }
                  </div>
                  <div className="ci-info">
                    <div className="ci-name">{p.name}</div>
                    <div className="ci-price">{fmt(p.price * qty)}</div>
                    <div style={{ fontSize:11, color:'var(--muted)' }}>
                      {fmt(p.price)} × {qty}
                    </div>
                  </div>
                  <div className="ci-ctrl">
                    <button className="ci-btn" onClick={() => onRem(p.id)}>−</button>
                    <span className="ci-num">{qty}</span>
                    <button className="ci-btn" onClick={() => onAdd(p.id)}>+</button>
                  </div>
                </div>
              );
            })}

            {/* Yetkazish turi */}
            <div style={{ padding:'16px 16px 0' }}>
              <div style={{ fontSize:13, fontWeight:700, color:'var(--muted)', marginBottom:10, textTransform:'uppercase', letterSpacing:'.5px' }}>
                Yetkazish turi
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                {[
                  { id:'delivery', label:'🚗 Yetkazib berish' },
                  { id:'pickup',   label:'🏃 Olib ketish'     },
                ].map(d => (
                  <button
                    key={d.id}
                    onClick={() => setDeliveryType(d.id)}
                    style={{
                      padding:'13px 10px',
                      borderRadius:'var(--radius)',
                      border: deliveryType === d.id
                        ? '2px solid var(--teal)'
                        : '1.5px solid var(--border)',
                      background: deliveryType === d.id
                        ? 'var(--teal-lt)'
                        : 'var(--white)',
                      color: deliveryType === d.id
                        ? 'var(--teal)'
                        : 'var(--sub)',
                      fontSize:13, fontWeight:700,
                      cursor:'pointer',
                      fontFamily:'Inter,sans-serif',
                      transition:'all .2s',
                    }}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Manzil */}
            {deliveryType === 'delivery' && (
              <div style={{ padding:'12px 16px 0' }}>
                <div style={{ fontSize:13, fontWeight:700, color:'var(--muted)', marginBottom:8, textTransform:'uppercase', letterSpacing:'.5px' }}>
                  Yetkazib berish manzili
                </div>
                <input
                  style={{
                    width:'100%', padding:'13px 14px',
                    border:'1.5px solid var(--border)',
                    borderRadius:'var(--radius)',
                    fontSize:14, outline:'none',
                    fontFamily:'Inter,sans-serif',
                    color:'var(--text)',
                    transition:'border .2s',
                  }}
                  placeholder="Ko'cha, uy raqami, kvartira..."
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  onFocus={e => e.target.style.borderColor='var(--teal)'}
                  onBlur={e => e.target.style.borderColor='var(--border)'}
                />
              </div>
            )}

            {/* Izoh */}
            <div style={{ padding:'12px 16px 0' }}>
              <div style={{ fontSize:13, fontWeight:700, color:'var(--muted)', marginBottom:8, textTransform:'uppercase', letterSpacing:'.5px' }}>
                Izoh (ixtiyoriy)
              </div>
              <textarea
                style={{
                  width:'100%', padding:'13px 14px',
                  border:'1.5px solid var(--border)',
                  borderRadius:'var(--radius)',
                  fontSize:14, outline:'none',
                  fontFamily:'Inter,sans-serif',
                  color:'var(--text)',
                  resize:'none', height:80,
                  transition:'border .2s',
                }}
                placeholder="Masalan: piyozsiz, achchiqroq..."
                value={comment}
                onChange={e => setComment(e.target.value)}
                onFocus={e => e.target.style.borderColor='var(--teal)'}
                onBlur={e => e.target.style.borderColor='var(--border)'}
              />
            </div>

            {/* To'lov */}
            <div style={{ padding:'12px 16px 0' }}>
              <div style={{ fontSize:13, fontWeight:700, color:'var(--muted)', marginBottom:8, textTransform:'uppercase', letterSpacing:'.5px' }}>
                To'lov usuli
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                {PAYMENTS.map(pay => (
                  <button
                    key={pay.id}
                    onClick={() => setPayment(pay.id)}
                    style={{
                      padding:'12px',
                      borderRadius:'var(--radius)',
                      border: payment === pay.id
                        ? '2px solid var(--teal)'
                        : '1.5px solid var(--border)',
                      background: payment === pay.id
                        ? 'var(--teal-lt)'
                        : 'var(--white)',
                      color: payment === pay.id
                        ? 'var(--teal)'
                        : 'var(--sub)',
                      fontSize:13, fontWeight:600,
                      cursor:'pointer',
                      display:'flex',
                      alignItems:'center',
                      gap:6,
                      fontFamily:'Inter,sans-serif',
                      transition:'all .2s',
                    }}
                  >
                    <span>{pay.icon}</span> {pay.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Footer */}
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
              {ordering ? 'Yuborilmoqda...' : 'Buyurtma berish'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
