import React, { useState, useEffect, useRef } from 'react';
import { createOrder, API_URL } from '../data/api';

const CATS_ICONS = { 'Cheesecake': '🍰', 'Medovik': '🍯', 'Tort': '🎂', 'Kofe': '☕', 'Choy': '🍵', 'Ichimlik': '🥤' };

// To'lov usullari — Uzum o'chirildi, SVG iconlar
const PAYMENTS = [
  {
    id: 'cash', label: 'Naqd',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>
  },
  {
    id: 'click', label: 'Click',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
  },
  {
    id: 'payme', label: 'Payme',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
  },
  {
    id: 'card', label: 'Karta',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><line x1="6" y1="15" x2="10" y2="15"/></svg>
  },
];

function getTimeSlots() {
  const slots = [];
  const now = new Date();
  const nowPlus2 = new Date(now.getTime() + 2 * 60 * 60 * 1000);
  for (let h = 9; h <= 22; h++) {
    for (let m of [0, 30]) {
      const slot = new Date(); slot.setHours(h, m, 0, 0);
      if (slot > nowPlus2) slots.push({ date: slot, label: `Bugun ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`, key: `t-${h}-${m}` });
    }
  }
  const tmr = new Date(); tmr.setDate(tmr.getDate() + 1);
  for (let h = 9; h <= 22; h++) {
    for (let m of [0, 30]) {
      const slot = new Date(tmr); slot.setHours(h, m, 0, 0);
      slots.push({ date: slot, label: `Ertaga ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`, key: `e-${h}-${m}` });
    }
  }
  return slots;
}

// Xarita komponenti — doim ko'rinib turadi
function MapPicker({ onConfirm, selectedPos }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [pos, setPos] = useState(selectedPos || null);
  const [addr, setAddr] = useState('');
  const [searchQ, setSearchQ] = useState('');
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (mapInstanceRef.current) return;
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
      document.head.appendChild(link);
    }
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
    script.onload = () => {
      const L = window.L;
      const map = L.map(mapRef.current, { center: [41.3224858, 69.2091613], zoom: 13, zoomControl: true });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap', maxZoom: 19 }).addTo(map);
      const icon = L.divIcon({ html: '<div style="font-size:28px;margin-top:-28px;margin-left:-14px">📍</div>', className: '', iconSize: [28, 28] });

      map.on('click', async (e) => {
        const { lat, lng } = e.latlng;
        if (markerRef.current) markerRef.current.remove();
        markerRef.current = L.marker([lat, lng], { icon }).addTo(map);
        setPos({ lat, lng });
        try {
          const r = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
          const d = await r.json();
          const a = d.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
          setAddr(a);
          setSearchQ(a.split(',').slice(0, 3).join(', '));
        } catch {}
      });
      mapInstanceRef.current = map;
    };
    document.head.appendChild(script);
    return () => { if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; } };
  }, []);

  const search = async () => {
    if (!searchQ.trim() || !mapInstanceRef.current) return;
    setSearching(true);
    try {
      const r = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQ)}&format=json&limit=1`);
      const d = await r.json();
      if (d.length > 0) {
        const { lat, lon, display_name } = d[0];
        const L = window.L;
        const map = mapInstanceRef.current;
        map.setView([lat, lon], 16);
        if (markerRef.current) markerRef.current.remove();
        const icon = L.divIcon({ html: '<div style="font-size:28px;margin-top:-28px;margin-left:-14px">📍</div>', className: '', iconSize: [28, 28] });
        markerRef.current = L.marker([lat, lon], { icon }).addTo(map);
        setPos({ lat: parseFloat(lat), lng: parseFloat(lon) });
        setAddr(display_name);
        setSearchQ(display_name.split(',').slice(0, 3).join(', '));
      }
    } catch {}
    setSearching(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <input
          style={{ flex: 1, padding: '11px 13px', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 13, outline: 'none', fontFamily: 'inherit', background: 'var(--cream)', color: 'var(--text)' }}
          placeholder="Manzil qidirish..."
          value={searchQ}
          onChange={e => setSearchQ(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && search()}
        />
        <button
          onClick={search}
          disabled={searching}
          style={{ background: 'var(--green)', color: 'white', border: 'none', borderRadius: 12, padding: '0 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}
        >{searching ? '...' : 'Qidir'}</button>
      </div>
      {/* Xarita doim ko'rinib turadi */}
      <div ref={mapRef} style={{ width: '100%', height: 220, borderRadius: 14, overflow: 'hidden', border: '1.5px solid var(--border)' }} />
      <div style={{ fontSize: 11, color: 'var(--text3)', margin: '6px 0 8px', fontWeight: 500 }}>
        Xaritada bosib aniq manzilni belgilang
      </div>
      {pos && (
        <button
          onClick={() => onConfirm(pos, searchQ || addr)}
          style={{ width: '100%', background: 'var(--green)', color: 'white', border: 'none', borderRadius: 12, padding: 13, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
        >✓ Manzilni tasdiqlash</button>
      )}
    </div>
  );
}

export default function Cart({ products, cart, settings, user, onAdd, onRemove, onClearCart, onBack, onOrderSuccess, onAuthRequired, showToast, fmt }) {
  const [deliveryType, setDeliveryType] = useState('delivery');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [comment, setComment] = useState('');
  const [payment, setPayment] = useState('cash');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [scheduleType, setScheduleType] = useState('now');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [timeSlots] = useState(getTimeSlots);
  const [promoCode, setPromoCode] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoApplied, setPromoApplied] = useState(null);
  const [promoError, setPromoError] = useState('');

  const cartItems = cart.map(c => ({ ...c, product: products.find(p => p.id === c.id) })).filter(c => c.product);
  const subtotal = cartItems.reduce((s, i) => s + i.product.price * i.qty, 0);
  const deliveryPrice = deliveryType === 'delivery' ? (settings?.deliveryPrice || 10000) : 0;
  const discount = promoApplied ? promoApplied.discount : 0;
  const total = Math.max(0, subtotal + deliveryPrice - discount);

  const checkPromo = async () => {
    if (!promoCode.trim()) return;
    setPromoLoading(true); setPromoError(''); setPromoApplied(null);
    try {
      const r = await fetch(`${API_URL}/promo/check`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: promoCode.trim().toUpperCase(), orderTotal: subtotal }) });
      const d = await r.json();
      if (d.valid) { setPromoApplied({ code: promoCode.trim().toUpperCase(), discount: d.discount, ...d.promo }); showToast(`🎁 Chegirma: -${fmt(d.discount)}`); }
      else setPromoError(d.error || 'Promo kod noto\'g\'ri');
    } catch { setPromoError('Xatolik'); }
    setPromoLoading(false);
  };

  const handleMapConfirm = (p, a) => { setLat(p.lat); setLng(p.lng); setAddress(a); showToast('📍 Manzil belgilandi'); };

  const placeOrder = async () => {
    if (!user) { onAuthRequired(); return; }
    if (deliveryType === 'delivery' && !address.trim()) { showToast('Manzilni belgilang!'); return; }
    if (scheduleType === 'scheduled' && !selectedSlot) { showToast('Vaqtni tanlang!'); return; }
    setLoading(true);
    try {
      const result = await createOrder({
        customerPhone: user.phone, customerName: user.name || user.phone,
        deliveryType, paymentMethod: payment,
        address: deliveryType === 'delivery' ? address : '',
        comment, totalPrice: total, latitude: lat, longitude: lng,
        promoCode: promoApplied ? promoApplied.code : null, discount,
        scheduledTime: scheduleType === 'scheduled' && selectedSlot ? selectedSlot.date.toISOString() : null,
        items: cart.map(i => ({ productId: i.id, quantity: i.qty, price: products.find(p => p.id === i.id)?.price || 0 })),
      });
      if (result.id) {
        if (promoApplied) await fetch(`${API_URL}/promo/use`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: promoApplied.code }) });
        setSuccess(true);
      } else showToast('Xatolik: ' + (result.error || 'Qayta urinib ko\'ring'));
    } catch { showToast('Server bilan bog\'lanishda xatolik'); }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 80, marginBottom: 20 }}>🎉</div>
          <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 10, letterSpacing: '-0.5px' }}>Buyurtma qabul qilindi!</h2>
          <p style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 8, lineHeight: 1.6 }}>
            {scheduleType === 'scheduled' && selectedSlot ? `⏰ ${selectedSlot.label}` : 'Tez orada operator bog\'lanadi'}
          </p>
          <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 32 }}>📞 {settings?.phone || '+998 93 272 2222'}</p>
          <button className="order-btn" style={{ maxWidth: 260, margin: '0 auto' }} onClick={onOrderSuccess}>Buyurtmalarni ko'rish →</button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="page">
        <div className="page-header">
          <button className="back-btn" onClick={onBack}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <span className="page-title">Savatcha</span>
        </div>
        <div className="empty-cart">
          <div className="empty-cart-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
          </div>
          <h3>Savatcha bo'sh</h3>
          <p>Mahsulotlarni qo'shib boshlang</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="page-header">
        <button className="back-btn" onClick={onBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <span className="page-title">Savatcha</span>
        <button onClick={onClearCart} style={{ background: 'none', border: 'none', color: 'var(--red)', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Tozalash</button>
      </div>

      {/* MAHSULOTLAR */}
      <div className="cart-items">
        {cartItems.map(item => (
          <div key={item.id} className="cart-item">
            {item.product.image
              ? <img className="cart-item-img" src={item.product.image} alt={item.product.name} onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
              : null}
            <div className="cart-item-img-placeholder" style={{ display: item.product.image ? 'none' : 'flex' }}>
              {CATS_ICONS[item.product.category] || '🍰'}
            </div>
            <div className="cart-item-info">
              <div className="cart-item-name">{item.product.name}</div>
              <div className="cart-item-price">{fmt(item.product.price * item.qty)}</div>
            </div>
            <div className="cart-item-qty">
              <button className="qty-btn2" onClick={() => onRemove(item.id)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
              <span className="qty-num2">{item.qty}</span>
              <button className="qty-btn2" onClick={() => onAdd(item.product)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="checkout-section">

        {/* YETKAZISH TURI */}
        <div className="checkout-card">
          <div className="checkout-title">Yetkazish turi</div>
          <div className="delivery-toggle">
            <div className={`delivery-opt ${deliveryType === 'delivery' ? 'active' : ''}`} onClick={() => setDeliveryType('delivery')}>
              <div className="delivery-opt-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
              </div>
              <div className="delivery-opt-label">Yetkazib berish</div>
              <div className="delivery-opt-sub">{fmt(settings?.deliveryPrice || 10000)}</div>
            </div>
            <div className={`delivery-opt ${deliveryType === 'pickup' ? 'active' : ''}`} onClick={() => setDeliveryType('pickup')}>
              <div className="delivery-opt-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/><polyline points="13 2 13 9 20 9"/></svg>
              </div>
              <div className="delivery-opt-label">Olib ketish</div>
              <div className="delivery-opt-sub">Bepul</div>
            </div>
          </div>
        </div>

        {/* MANZIL + XARITA — doim ko'rinadi */}
        {deliveryType === 'delivery' && (
          <div className="checkout-card">
            <div className="checkout-title">Yetkazib berish manzili</div>
            <input
              className="field-input"
              style={{ marginBottom: 12 }}
              placeholder="Ko'cha, uy raqami, mo'ljal..."
              value={address}
              onChange={e => setAddress(e.target.value)}
            />
            {/* XARITA DOIM KO'RINIB TURADI */}
            <MapPicker onConfirm={handleMapConfirm} selectedPos={lat ? { lat, lng } : null} />
            {lat && lng && (
              <div style={{ marginTop: 8, fontSize: 12, color: 'var(--green)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--green)" stroke="none"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                Xaritadan manzil belgilandi
                <button onClick={() => { setLat(null); setLng(null); }} style={{ background: 'none', border: 'none', color: 'var(--red)', cursor: 'pointer', fontSize: 12, marginLeft: 4 }}>✕</button>
              </div>
            )}
          </div>
        )}

        {/* VAQT */}
        <div className="checkout-card">
          <div className="checkout-title">Yetkazish vaqti</div>
          <div className="delivery-toggle">
            <div className={`delivery-opt ${scheduleType === 'now' ? 'active' : ''}`} onClick={() => { setScheduleType('now'); setSelectedSlot(null); }}>
              <div className="delivery-opt-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              </div>
              <div className="delivery-opt-label">Iloji boricha tez</div>
              <div className="delivery-opt-sub">~40-60 daqiqa</div>
            </div>
            <div className={`delivery-opt ${scheduleType === 'scheduled' ? 'active' : ''}`} onClick={() => setScheduleType('scheduled')}>
              <div className="delivery-opt-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <div className="delivery-opt-label">Vaqt belgilash</div>
              <div className="delivery-opt-sub">Kerakli vaqtga</div>
            </div>
          </div>
          {scheduleType === 'scheduled' && (
            <>
              <div className="time-slots">
                {timeSlots.map(slot => (
                  <button key={slot.key} className={`time-slot ${selectedSlot?.key === slot.key ? 'active' : ''}`} onClick={() => setSelectedSlot(slot)}>
                    {slot.label}
                  </button>
                ))}
              </div>
              {selectedSlot && <div style={{ marginTop: 8, fontSize: 12, color: 'var(--green)', fontWeight: 700 }}>✓ {selectedSlot.label}</div>}
            </>
          )}
        </div>

        {/* IZOH */}
        <div className="checkout-card">
          <label className="field-label">Izoh (ixtiyoriy)</label>
          <textarea className="field-input" style={{ resize: 'none', minHeight: 72 }} placeholder="Masalan: qo'ng'iroq qilmang..." value={comment} onChange={e => setComment(e.target.value)} />
        </div>

        {/* PROMO */}
        <div className="checkout-card">
          <div className="checkout-title">Promo kod</div>
          {promoApplied ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--green-soft)', borderRadius: 12, padding: '12px 14px', border: '1.5px solid var(--green)' }}>
              <span style={{ fontSize: 18 }}>🎁</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, color: 'var(--green)', fontSize: 14 }}>{promoApplied.code}</div>
                <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>-{fmt(promoApplied.discount)} chegirma</div>
              </div>
              <button onClick={() => { setPromoApplied(null); setPromoCode(''); }} style={{ background: 'none', border: 'none', color: 'var(--red)', fontSize: 18, cursor: 'pointer' }}>✕</button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="field-input" style={{ flex: 1, textTransform: 'uppercase', letterSpacing: '1px' }} placeholder="PROMO10" value={promoCode} onChange={e => { setPromoCode(e.target.value.toUpperCase()); setPromoError(''); }} onKeyDown={e => e.key === 'Enter' && checkPromo()} />
              <button onClick={checkPromo} disabled={promoLoading || !promoCode.trim()} style={{ background: 'var(--green)', color: 'white', border: 'none', borderRadius: 12, padding: '0 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer', opacity: promoLoading ? 0.7 : 1 }}>
                {promoLoading ? '...' : 'Tekshir'}
              </button>
            </div>
          )}
          {promoError && <div style={{ color: 'var(--red)', fontSize: 12, marginTop: 6, fontWeight: 600 }}>⚠️ {promoError}</div>}
        </div>

        {/* TO'LOV */}
        <div className="checkout-card">
          <div className="checkout-title">To'lov usuli</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
            {PAYMENTS.map(p => (
              <div
                key={p.id}
                className={`pay-opt ${payment === p.id ? 'active' : ''}`}
                onClick={() => setPayment(p.id)}
              >
                <div className="pay-opt-icon">{p.icon}</div>
                <span className="pay-label">{p.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* HISOB */}
        <div className="checkout-card">
          <div className="checkout-title">Hisob</div>
          <div className="price-row">
            <span>Mahsulotlar ({cart.reduce((s, i) => s + i.qty, 0)} ta)</span>
            <span className="price-val">{fmt(subtotal)}</span>
          </div>
          {deliveryType === 'delivery' && (
            <div className="price-row"><span>Yetkazib berish</span><span className="price-val">{fmt(deliveryPrice)}</span></div>
          )}
          {promoApplied && (
            <div className="price-row"><span>🎁 {promoApplied.code}</span><span style={{ color: 'var(--red)', fontWeight: 700 }}>-{fmt(discount)}</span></div>
          )}
          <div className="price-row total"><span>Jami</span><span className="price-val">{fmt(total)}</span></div>
        </div>

        {!user && (
          <div style={{ background: 'var(--green-soft)', borderRadius: 14, padding: '12px 16px', marginBottom: 10, fontSize: 13, color: 'var(--green)', fontWeight: 600, border: '1px solid rgba(26,92,58,0.15)' }}>
            ⚠️ Buyurtma berish uchun tizimga kiring
          </div>
        )}

        <button className="order-btn" onClick={placeOrder} disabled={loading}>
          {loading ? '⏳ Yuklanmoqda...' : `Buyurtma berish — ${fmt(total)}`}
        </button>
      </div>
    </div>
  );
}
