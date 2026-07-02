import React, { useState, useEffect, useRef } from 'react';
import { createOrder, API_URL } from '../data/api';

const CATS_ICONS = { 'Cheesecake': '🍰', 'Medovik': '🍯', 'Tort': '🎂', 'Kofe': '☕', 'Choy': '🍵', 'Ichimlik': '🥤' };

const PAYMENTS = [
  { id: 'cash', icon: '💵', label: 'Naqd' },
  { id: 'click', icon: '📱', label: 'Click' },
  { id: 'payme', icon: '💳', label: 'Payme' },
  { id: 'uzum', icon: '🟣', label: 'Uzum' },
  { id: 'card', icon: '🏦', label: 'Karta' },
];

function getTimeSlots() {
  const slots = [];
  const now = new Date();
  const nowPlus2 = new Date(now.getTime() + 2 * 60 * 60 * 1000);

  // Bugun
  for (let h = 9; h <= 22; h++) {
    for (let m of [0, 30]) {
      const slot = new Date();
      slot.setHours(h, m, 0, 0);
      if (slot > nowPlus2) {
        slots.push({
          date: slot,
          label: `Bugun ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`,
          key: `today-${h}-${m}`
        });
      }
    }
  }

  // Ertaga
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  for (let h = 9; h <= 22; h++) {
    for (let m of [0, 30]) {
      const slot = new Date(tomorrow);
      slot.setHours(h, m, 0, 0);
      slots.push({
        date: slot,
        label: `Ertaga ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`,
        key: `tomorrow-${h}-${m}`
      });
    }
  }
  return slots;
}

// Leaflet map component
function MapPicker({ onConfirm }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [selectedPos, setSelectedPos] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (mapInstanceRef.current) return;

    // Leaflet CSS
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
      document.head.appendChild(link);
    }

    // Leaflet JS
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
    script.onload = () => {
      const L = window.L;
      const map = L.map(mapRef.current, {
        center: [41.3224858, 69.2091613],
        zoom: 13,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
        maxZoom: 19,
      }).addTo(map);

      const icon = L.divIcon({
        html: '<div style="font-size:28px;margin-top:-28px;margin-left:-14px">📍</div>',
        className: '',
        iconSize: [28, 28],
      });

      map.on('click', async (e) => {
        const { lat, lng } = e.latlng;
        if (markerRef.current) markerRef.current.remove();
        markerRef.current = L.marker([lat, lng], { icon }).addTo(map);
        setSelectedPos({ lat, lng });

        // Reverse geocoding
        try {
          const r = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
          const d = await r.json();
          const addr = d.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
          setSearchQuery(addr);
          markerRef.current.bindPopup(addr.split(',').slice(0,3).join(',')).openPopup();
        } catch {}
      });

      mapInstanceRef.current = map;
    };
    document.head.appendChild(script);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const searchAddress = async () => {
    if (!searchQuery.trim() || !mapInstanceRef.current) return;
    setSearching(true);
    try {
      const r = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`);
      const d = await r.json();
      if (d.length > 0) {
        const { lat, lon, display_name } = d[0];
        const L = window.L;
        const map = mapInstanceRef.current;
        map.setView([lat, lon], 16);
        if (markerRef.current) markerRef.current.remove();
        const icon = L.divIcon({ html: '<div style="font-size:28px;margin-top:-28px;margin-left:-14px">📍</div>', className: '', iconSize: [28,28] });
        markerRef.current = L.marker([lat, lon], { icon }).addTo(map);
        markerRef.current.bindPopup(display_name.split(',').slice(0,3).join(',')).openPopup();
        setSelectedPos({ lat: parseFloat(lat), lng: parseFloat(lon) });
        setSearchQuery(display_name.split(',').slice(0,3).join(', '));
      }
    } catch {}
    setSearching(false);
  };

  return (
    <div>
      <div style={{ display:'flex', gap:8, marginBottom:8 }}>
        <input
          className="map-search"
          style={{ flex:1, margin:0 }}
          placeholder="📍 Manzil qidirish..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && searchAddress()}
        />
        <button
          onClick={searchAddress}
          disabled={searching}
          style={{ background:'var(--teal)', color:'#fff', border:'none', borderRadius:12, padding:'0 16px', fontSize:13, fontWeight:700, cursor:'pointer' }}
        >{searching ? '...' : 'Qidir'}</button>
      </div>
      <div ref={mapRef} className="map-container" />
      <div style={{ fontSize:11, color:'var(--text3)', margin:'6px 0', fontWeight:500 }}>
        Xaritada bosib aniq manzilni belgilang
      </div>
      <button
        className="map-confirm-btn"
        disabled={!selectedPos}
        style={{ opacity: selectedPos ? 1 : 0.5 }}
        onClick={() => selectedPos && onConfirm(selectedPos, searchQuery)}
      >
        ✅ Manzilni tasdiqlash
      </button>
    </div>
  );
}

export default function Cart({ products, cart, settings, user, onAdd, onRemove, onClearCart, onBack, onOrderSuccess, onAuthRequired, showToast, fmt }) {
  const [deliveryType, setDeliveryType] = useState('delivery');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [showMap, setShowMap] = useState(false);
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
    } catch { setPromoError('Xatolik yuz berdi'); }
    setPromoLoading(false);
  };

  const removePromo = () => { setPromoApplied(null); setPromoCode(''); setPromoError(''); };

  const handleMapConfirm = (pos, addr) => {
    setLat(pos.lat);
    setLng(pos.lng);
    setAddress(addr);
    setShowMap(false);
    showToast('📍 Manzil belgilandi');
  };

  const placeOrder = async () => {
    if (!user) { onAuthRequired(); return; }
    if (deliveryType === 'delivery' && !address.trim()) { showToast('Manzilni kiriting!'); return; }
    if (scheduleType === 'scheduled' && !selectedSlot) { showToast('Yetkazish vaqtini tanlang!'); return; }

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
        latitude: lat,
        longitude: lng,
        promoCode: promoApplied ? promoApplied.code : null,
        discount,
        scheduledTime: scheduleType === 'scheduled' && selectedSlot ? selectedSlot.date.toISOString() : null,
        items: cart.map(i => ({ productId: i.id, quantity: i.qty, price: products.find(p=>p.id===i.id)?.price || 0 })),
      });
      if (result.id) {
        if (promoApplied) {
          await fetch(`${API_URL}/promo/use`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ code: promoApplied.code }) });
        }
        setSuccess(true);
      } else {
        showToast('Xatolik: ' + (result.error || 'Qayta urinib ko\'ring'));
      }
    } catch { showToast('Server bilan bog\'lanishda xatolik'); }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="page" style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 20px', minHeight:'100vh' }}>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:80, marginBottom:20 }}>🎉</div>
          <h2 style={{ fontSize:24, fontWeight:900, marginBottom:10, letterSpacing:'-0.5px' }}>Buyurtma qabul qilindi!</h2>
          <p style={{ fontSize:14, color:'var(--text2)', marginBottom:8, lineHeight:1.6 }}>
            {scheduleType === 'scheduled' && selectedSlot ? `⏰ Yetkazish vaqti: ${selectedSlot.label}` : 'Tez orada operator siz bilan bog\'lanadi'}
          </p>
          <p style={{ fontSize:13, color:'var(--text3)', marginBottom:32 }}>📞 {settings?.phone || '+998 93 272 2222'}</p>
          <button className="order-btn" style={{ maxWidth:260, margin:'0 auto' }} onClick={onOrderSuccess}>
            Buyurtmalarni ko'rish →
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
        <button onClick={onClearCart} style={{ background:'none', border:'none', color:'var(--red)', fontSize:13, fontWeight:700, cursor:'pointer' }}>Tozalash</button>
      </div>

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

      <div className="checkout-section">

        {/* Yetkazish turi */}
        <div className="checkout-card">
          <div className="checkout-title">Yetkazish turi</div>
          <div className="delivery-toggle">
            <div className={`delivery-opt ${deliveryType==='delivery'?'active':''}`} onClick={() => setDeliveryType('delivery')}>
              <div className="delivery-opt-icon">🚗</div>
              <div className="delivery-opt-label">Yetkazib berish</div>
              <div className="delivery-opt-sub">{fmt(settings?.deliveryPrice || 10000)}</div>
            </div>
            <div className={`delivery-opt ${deliveryType==='pickup'?'active':''}`} onClick={() => setDeliveryType('pickup')}>
              <div className="delivery-opt-icon">🏃</div>
              <div className="delivery-opt-label">Olib ketish</div>
              <div className="delivery-opt-sub">Bepul</div>
            </div>
          </div>
        </div>

        {/* Manzil + Xarita */}
        {deliveryType === 'delivery' && (
          <div className="checkout-card">
            <label className="field-label">📍 Yetkazib berish manzili</label>
            <div style={{ display:'flex', gap:8, marginBottom: showMap ? 12 : 0 }}>
              <input
                className="field-input"
                style={{ flex:1 }}
                placeholder="Ko'cha, uy raqami, mo'ljal..."
                value={address}
                onChange={e => setAddress(e.target.value)}
              />
              <button
                onClick={() => setShowMap(!showMap)}
                style={{
                  background: showMap ? 'var(--teal)' : 'var(--teal-light)',
                  color: showMap ? '#fff' : 'var(--teal)',
                  border:'none', borderRadius:12, padding:'0 14px',
                  fontSize:18, cursor:'pointer', flexShrink:0
                }}
              >🗺</button>
            </div>
            {showMap && <MapPicker onConfirm={handleMapConfirm} />}
            {lat && lng && !showMap && (
              <div style={{ marginTop:8, fontSize:12, color:'var(--teal)', fontWeight:600, display:'flex', alignItems:'center', gap:4 }}>
                ✅ Xaritadan belgilangan
                <button onClick={() => { setLat(null); setLng(null); }} style={{ background:'none', border:'none', color:'var(--red)', cursor:'pointer', fontSize:12, fontWeight:600 }}>✕</button>
              </div>
            )}
          </div>
        )}

        {/* Vaqt belgilash */}
        <div className="checkout-card">
          <div className="checkout-title">Yetkazish vaqti</div>
          <div className="delivery-toggle">
            <div className={`delivery-opt ${scheduleType==='now'?'active':''}`} onClick={() => { setScheduleType('now'); setSelectedSlot(null); }}>
              <div className="delivery-opt-icon">⚡</div>
              <div className="delivery-opt-label">Iloji boricha tez</div>
              <div className="delivery-opt-sub">~40-60 daqiqa</div>
            </div>
            <div className={`delivery-opt ${scheduleType==='scheduled'?'active':''}`} onClick={() => setScheduleType('scheduled')}>
              <div className="delivery-opt-icon">🕐</div>
              <div className="delivery-opt-label">Vaqt belgilash</div>
              <div className="delivery-opt-sub">Kerakli vaqtga</div>
            </div>
          </div>
          {scheduleType === 'scheduled' && (
            <>
              {timeSlots.length === 0 ? (
                <div style={{ marginTop:12, fontSize:13, color:'var(--text3)', fontWeight:500 }}>
                  Bugun uchun vaqt qolmadi. Ertaga uchun tanlang.
                </div>
              ) : null}
              <div className="time-slots">
                {timeSlots.map(slot => (
                  <button
                    key={slot.key}
                    className={`time-slot ${selectedSlot?.key === slot.key ? 'active' : ''}`}
                    onClick={() => setSelectedSlot(slot)}
                  >{slot.label}</button>
                ))}
              </div>
              {selectedSlot && (
                <div style={{ marginTop:10, fontSize:13, color:'var(--teal)', fontWeight:700 }}>
                  ✅ Tanlandi: {selectedSlot.label}
                </div>
              )}
            </>
          )}
        </div>

        {/* Izoh */}
        <div className="checkout-card">
          <label className="field-label">Izoh (ixtiyoriy)</label>
          <textarea
            className="field-input"
            style={{ resize:'none', minHeight:72 }}
            placeholder="Masalan: qo'ng'iroq qilmang, qovoqsiz..."
            value={comment}
            onChange={e => setComment(e.target.value)}
          />
        </div>

        {/* Promo */}
        <div className="checkout-card">
          <div className="checkout-title">Promo kod</div>
          {promoApplied ? (
            <div style={{ display:'flex', alignItems:'center', gap:10, background:'var(--teal-light)', borderRadius:12, padding:'12px 14px' }}>
              <span style={{ fontSize:20 }}>🎁</span>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:800, color:'var(--teal)', fontSize:14 }}>{promoApplied.code}</div>
                <div style={{ fontSize:12, color:'var(--text2)', marginTop:2 }}>Chegirma: -{fmt(promoApplied.discount)}</div>
              </div>
              <button onClick={removePromo} style={{ background:'none', border:'none', color:'var(--red)', fontSize:18, cursor:'pointer' }}>✕</button>
            </div>
          ) : (
            <div style={{ display:'flex', gap:8 }}>
              <input
                className="field-input"
                style={{ flex:1, textTransform:'uppercase', letterSpacing:'1px' }}
                placeholder="PROMO10"
                value={promoCode}
                onChange={e => { setPromoCode(e.target.value.toUpperCase()); setPromoError(''); }}
                onKeyDown={e => e.key === 'Enter' && checkPromo()}
              />
              <button
                onClick={checkPromo}
                disabled={promoLoading || !promoCode.trim()}
                style={{ background:'var(--teal)', color:'#fff', border:'none', borderRadius:12, padding:'0 16px', fontSize:13, fontWeight:700, cursor:'pointer', whiteSpace:'nowrap', opacity: promoLoading ? 0.7 : 1 }}
              >{promoLoading ? '...' : 'Tekshir'}</button>
            </div>
          )}
          {promoError && <div style={{ color:'var(--red)', fontSize:12, marginTop:6, fontWeight:600 }}>⚠️ {promoError}</div>}
        </div>

        {/* To'lov */}
        <div className="checkout-card">
          <div className="checkout-title">To'lov usuli</div>
          <div className="payment-grid">
            {PAYMENTS.map(p => (
              <div key={p.id} className={`pay-opt ${payment===p.id?'active':''}`} onClick={() => setPayment(p.id)}>
                <span className="pay-icon">{p.icon}</span>
                <span className="pay-label">{p.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hisob */}
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
              <span>🎁 {promoApplied.code}</span>
              <span style={{ color:'var(--red)', fontWeight:700 }}>-{fmt(discount)}</span>
            </div>
          )}
          <div className="price-row total">
            <span>Jami</span>
            <span className="price-val">{fmt(total)}</span>
          </div>
        </div>

        {!user && (
          <div style={{ background:'var(--teal-light)', borderRadius:14, padding:'12px 16px', marginBottom:10, fontSize:13, color:'var(--teal)', fontWeight:600 }}>
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
