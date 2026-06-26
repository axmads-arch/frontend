import React, { useState } from 'react';
import { createOrder, API_URL } from '../data/api';

const CATS_ICONS = { 'Cheesecake': '🍰', 'Medovik': '🍯', 'Tort': '🎂', 'Kofe': '☕', 'Choy': '🍵', 'Ichimlik': '🥤' };

const PAYMENTS = [
  { id: 'cash', icon: '💵', label: 'Naqd' },
  { id: 'click', icon: '📱', label: 'Click' },
  { id: 'payme', icon: '💳', label: 'Payme' },
  { id: 'uzum', icon: '🟣', label: 'Uzum' },
  { id: 'card', icon: '🏦', label: 'Karta' },
];

export default function Cart({ products, cart, settings, user, onAdd, onRemove, onClearCart, onBack, onOrderSuccess, onAuthRequired, showToast, fmt }) {
  const [deliveryType, setDeliveryType] = useState('delivery');
  const [address, setAddress] = useState('');
  const [comment, setComment] = useState('');
  const [payment, setPayment] = useState('cash');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Promo
  const [promoCode, setPromoCode] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoApplied, setPromoApplied] = useState(null); // { code, discount, type, value }
  const [promoError, setPromoError] = useState('');

  const cartItems = cart.map(c => ({ ...c, product: products.find(p => p.id === c.id) })).filter(c => c.product);
  const subtotal = cartItems.reduce((s, i) => s + i.product.price * i.qty, 0);
  const deliveryPrice = deliveryType === 'delivery' ? (settings?.deliveryPrice || 10000) : 0;
  const discount = promoApplied ? promoApplied.discount : 0;
  const total = Math.max(0, subtotal + deliveryPrice - discount);

  const checkPromo = async () => {
    if (!promoCode.trim()) return;
    setPromoLoading(true);
    setPromoError('');
    setPromoApplied(null);
    try {
      const r = await fetch(`${API_URL}/promo/check`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: promoCode.trim().toUpperCase(), orderTotal: subtotal })
      });
      const d = await r.json();
      if (d.valid) {
        setPromoApplied({ code: promoCode.trim().toUpperCase(), discount: d.discount, ...d.promo });
        showToast(`🎁 Chegirma: -${fmt(d.discount)}`);
      } else {
        setPromoError(d.error || 'Promo kod noto\'g\'ri');
      }
    } catch (e) {
      setPromoError('Server bilan bog\'lanishda xatolik');
    }
    setPromoLoading(false);
  };

  const removePromo = () => {
    setPromoApplied(null);
    setPromoCode('');
    setPromoError('');
  };

  const placeOrder = async () => {
    if (!user) { onAuthRequired(); return; }
    if (deliveryType === 'delivery' && !address.trim()) { showToast('Manzilni kiriting!'); return; }

    setLoading(true);
    try {
      const result = await createOrder({
        customerPhone: user.phone,
        customerName: user.name || user.phone,
        deliveryType,
        paymentMethod: payment,
        address: deliveryType === 'delivery' ? address : '',
        comment,
        totalPrice: total,
        promoCode: promoApplied ? promoApplied.code : null,
        discount: discount,
        items: cart.map(i => ({ productId: i.id, quantity: i.qty, price: products.find(p=>p.id===i.id)?.price || 0 })),
      });
      if (result.id) {
        // Promo ishlatildi deb belgilaymiz
        if (promoApplied) {
          await fetch(`${API_URL}/promo/use`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: promoApplied.code })
          });
        }
        setSuccess(true);
      } else {
        showToast('Xatolik: ' + (result.error || 'Qayta urinib ko\'ring'));
      }
    } catch (e) {
      showToast('Server bilan bog\'lanishda xatolik');
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 72, marginBottom: 16 }}>🎉</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Buyurtma qabul qilindi!</h2>
          <p style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 8 }}>Tez orada operator siz bilan bog'lanadi</p>
          <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 28 }}>📞 {settings?.phone || '+998 93 272 2222'}</p>
          <button className="order-btn" style={{ maxWidth: 280, margin: '0 auto' }} onClick={onOrderSuccess}>
            Buyurtmalarni ko'rish
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="page">
        <div className="page-header">
          <button className="back-btn" onClick={onBack}>←</button>
          <span className="page-title">Savatcha</span>
        </div>
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h3>Savatcha bo'sh</h3>
          <p>Mahsulotlarni qo'shib boshlang</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="page-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <span className="page-title">Savatcha</span>
        <button onClick={onClearCart} style={{ background: 'none', border: 'none', color: 'var(--red)', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          Tozalash
        </button>
      </div>

      {/* CART ITEMS */}
      <div className="cart-items">
        {cartItems.map(item => (
          <div key={item.id} className="cart-item">
            {item.product.image ? (
              <img className="cart-item-img" src={item.product.image} alt={item.product.name} onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
            ) : null}
            <div className="cart-item-img-placeholder" style={{ display: item.product.image ? 'none' : 'flex' }}>
              {CATS_ICONS[item.product.category] || '🍰'}
            </div>
            <div className="cart-item-info">
              <div className="cart-item-name">{item.product.name}</div>
              <div className="cart-item-price">{fmt(item.product.price * item.qty)}</div>
            </div>
            <div className="cart-item-qty">
              <button className="qty-btn2" onClick={() => onRemove(item.id)}>−</button>
              <span className="qty-num2">{item.qty}</span>
              <button className="qty-btn2" onClick={() => onAdd(item.product)}>+</button>
            </div>
          </div>
        ))}
      </div>

      {/* CHECKOUT */}
      <div className="checkout-section">

        {/* Delivery type */}
        <div className="checkout-card">
          <div className="checkout-title">Yetkazish turi</div>
          <div className="delivery-toggle">
            <div className={`delivery-opt ${deliveryType === 'delivery' ? 'active' : ''}`} onClick={() => setDeliveryType('delivery')}>
              <div className="delivery-opt-icon">🚗</div>
              <div className="delivery-opt-label">Yetkazib berish</div>
              <div className="delivery-opt-sub">{fmt(settings?.deliveryPrice || 10000)}</div>
            </div>
            <div className={`delivery-opt ${deliveryType === 'pickup' ? 'active' : ''}`} onClick={() => setDeliveryType('pickup')}>
              <div className="delivery-opt-icon">🏃</div>
              <div className="delivery-opt-label">Olib ketish</div>
              <div className="delivery-opt-sub">Bepul</div>
            </div>
          </div>
        </div>

        {/* Address */}
        {deliveryType === 'delivery' && (
          <div className="checkout-card">
            <label className="field-label">📍 Yetkazib berish manzili</label>
            <input
              className="field-input"
              placeholder="Ko'cha, uy raqami, mo'ljal..."
              value={address}
              onChange={e => setAddress(e.target.value)}
            />
          </div>
        )}

        {/* Comment */}
        <div className="checkout-card">
          <label className="field-label">💬 Izoh (ixtiyoriy)</label>
          <textarea
            className="field-input"
            style={{ resize: 'none', minHeight: 72 }}
            placeholder="Masalan: qo'ng'iroq qilmang, qovoqsiz..."
            value={comment}
            onChange={e => setComment(e.target.value)}
          />
        </div>

        {/* PROMO KOD */}
        <div className="checkout-card">
          <div className="checkout-title">🎁 Promo kod</div>
          {promoApplied ? (
            <div style={{ display:'flex', alignItems:'center', gap:10, background:'var(--teal-light)', borderRadius:10, padding:'12px 14px' }}>
              <span style={{ fontSize:20 }}>🎉</span>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, color:'var(--teal)', fontSize:14 }}>{promoApplied.code}</div>
                <div style={{ fontSize:12, color:'var(--text2)' }}>Chegirma: -{fmt(promoApplied.discount)}</div>
              </div>
              <button onClick={removePromo} style={{ background:'none', border:'none', color:'var(--red)', fontSize:18, cursor:'pointer' }}>✕</button>
            </div>
          ) : (
            <div style={{ display:'flex', gap:8 }}>
              <input
                className="field-input"
                style={{ flex:1, textTransform:'uppercase' }}
                placeholder="PROMO10"
                value={promoCode}
                onChange={e => { setPromoCode(e.target.value.toUpperCase()); setPromoError(''); }}
                onKeyDown={e => e.key === 'Enter' && checkPromo()}
              />
              <button
                onClick={checkPromo}
                disabled={promoLoading || !promoCode.trim()}
                style={{ background:'var(--teal)', color:'#fff', border:'none', borderRadius:10, padding:'0 16px', fontSize:13, fontWeight:600, cursor:'pointer', whiteSpace:'nowrap', opacity: promoLoading ? 0.7 : 1 }}
              >{promoLoading ? '...' : 'Tekshir'}</button>
            </div>
          )}
          {promoError && <div style={{ color:'var(--red)', fontSize:12, marginTop:6, fontWeight:500 }}>⚠️ {promoError}</div>}
        </div>

        {/* Payment */}
        <div className="checkout-card">
          <div className="checkout-title">To'lov usuli</div>
          <div className="payment-grid">
            {PAYMENTS.map(p => (
              <div key={p.id} className={`pay-opt ${payment === p.id ? 'active' : ''}`} onClick={() => setPayment(p.id)}>
                <span className="pay-icon">{p.icon}</span>
                <span className="pay-label">{p.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Price summary */}
        <div className="checkout-card">
          <div className="checkout-title">Hisob</div>
          <div className="price-row">
            <span>Mahsulotlar ({cart.reduce((s,i)=>s+i.qty,0)} ta)</span>
            <span className="price-val">{fmt(subtotal)}</span>
          </div>
          {deliveryType === 'delivery' && (
            <div className="price-row">
              <span>Yetkazib berish</span>
              <span className="price-val">{fmt(deliveryPrice)}</span>
            </div>
          )}
          {promoApplied && (
            <div className="price-row">
              <span>🎁 Chegirma ({promoApplied.code})</span>
              <span style={{ color:'var(--red)', fontWeight:600 }}>-{fmt(discount)}</span>
            </div>
          )}
          <div className="price-row total">
            <span>Jami</span>
            <span className="price-val">{fmt(total)}</span>
          </div>
        </div>

        {!user && (
          <div style={{ background: 'var(--teal-light)', borderRadius: 12, padding: '12px 14px', marginBottom: 10, fontSize: 13, color: 'var(--teal)', fontWeight: 500 }}>
            ⚠️ Buyurtma berish uchun tizimga kiring
          </div>
        )}

        <button className="order-btn" onClick={placeOrder} disabled={loading}>
          {loading ? 'Yuklanmoqda...' : `Buyurtma berish — ${fmt(total)}`}
        </button>
      </div>
    </div>
  );
}
