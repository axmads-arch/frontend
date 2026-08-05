import React, { useState, useEffect, useRef } from 'react';
import { createOrder, API_URL } from '../data/api';

const CATS_ICONS = { 'Cheesecake': '🍰', 'Medovik': '🍯', 'Tort': '🎂', 'Kofe': '☕', 'Choy': '🍵', 'Ichimlik': '🥤' };

// Material Symbol
const Ms = ({ icon, size = 20, fill = 1, color = 'currentColor' }) => (
  <span style={{
    fontFamily: 'Material Symbols Rounded',
    fontVariationSettings: `'FILL' ${fill}, 'wght' 400, 'GRAD' 0, 'opsz' ${size}`,
    fontSize: size, lineHeight: 1, display: 'inline-block', userSelect: 'none', color,
  }}>{icon}</span>
);

// Click brend logotipi (rasmiy uslub — doira + ichki nuqta)
const ClickLogo = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
    <circle cx="20" cy="20" r="19" fill="none" stroke="#1877F2" strokeWidth="3.6" />
    <circle cx="14" cy="20" r="7" fill="#1877F2" />
  </svg>
);

// Payme brend logotipi (rasmiy wordmark uslubi)
const PaymeLogo = ({ size = 36 }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1, fontFamily: 'Arial, sans-serif' }}>
    <span style={{ fontSize: size * 0.42, fontWeight: 900, color: '#1a1a2e', letterSpacing: '-0.5px' }}>Pay</span>
    <span style={{
      fontSize: size * 0.34, fontWeight: 800, color: '#fff', background: '#00CDBC',
      borderRadius: 5, padding: '0px 5px', marginTop: 2, letterSpacing: '-0.3px',
    }}>me</span>
  </div>
);

// Ishonchli SVG ikonkalar (shriftga bog'liq emas)
const IconTruck = ({ size = 24, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M2 7h11v9H2z" fill={color} />
    <path d="M13 10h4.5l3 3.5V16H13z" fill={color} />
    <circle cx="6" cy="18" r="1.8" fill="none" stroke={color} strokeWidth="1.8" />
    <circle cx="16.5" cy="18" r="1.8" fill="none" stroke={color} strokeWidth="1.8" />
  </svg>
);
const IconStore = ({ size = 24, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M3 9l1.5-5h15L21 9" stroke={color} strokeWidth="1.8" strokeLinejoin="round" fill="none" />
    <path d="M3 9a3 3 0 006 0 3 3 0 006 0 3 3 0 006 0" stroke={color} strokeWidth="1.8" fill="none" />
    <path d="M4 9v10h16V9" stroke={color} strokeWidth="1.8" fill="none" />
    <path d="M9.5 19v-5h5v5" stroke={color} strokeWidth="1.8" fill="none" />
  </svg>
);
const IconBolt = ({ size = 24, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" fill={color} />
  </svg>
);
const IconClock = ({ size = 24, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8" fill="none" />
    <path d="M12 7v5l3.5 2" stroke={color} strokeWidth="1.8" strokeLinecap="round" fill="none" />
  </svg>
);

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

function MapPicker({ onConfirm, selectedPos }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [pos, setPos] = useState(selectedPos || null);
  const [searchQ, setSearchQ] = useState('');
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (mapInstanceRef.current) return;
    const initMap = () => {
      if (!window.ymaps || !mapRef.current) return;
      window.ymaps.ready(() => {
        const map = new window.ymaps.Map(mapRef.current, { center: [41.3224858, 69.2091613], zoom: 13, controls: ['zoomControl'] });
        mapInstanceRef.current = map;
        map.events.add('click', async (e) => {
          const coords = e.get('coords');
          const lat = coords[0], lng = coords[1];
          if (markerRef.current) markerRef.current.remove();
          const placemark = new window.ymaps.Placemark([lat, lng], {}, { preset: 'islands#redDotIcon' });
          map.geoObjects.add(placemark);
          markerRef.current = placemark;
          setPos({ lat, lng });
          try {
            const r = await window.ymaps.geocode([lat, lng], { results: 1 });
            const firstObj = r.geoObjects.get(0);
            setSearchQ(firstObj ? firstObj.getAddressLine() : `${lat.toFixed(5)}, ${lng.toFixed(5)}`);
          } catch {}
        });
      });
    };
    if (window.ymaps) { initMap(); return; }
    const script = document.createElement('script');
    script.src = 'https://api-maps.yandex.ru/2.1/?lang=uz_UZ&load=package.full';
    script.onload = initMap;
    document.head.appendChild(script);
    return () => { if (mapInstanceRef.current) { mapInstanceRef.current.destroy(); mapInstanceRef.current = null; } };
  }, []);

  const search = async () => {
    if (!searchQ.trim() || !mapInstanceRef.current || !window.ymaps) return;
    setSearching(true);
    try {
      const res = await window.ymaps.geocode(searchQ, { results: 1 });
      const obj = res.geoObjects.get(0);
      if (obj) {
        const coords = obj.geometry.getCoordinates();
        const [lat, lng] = coords;
        mapInstanceRef.current.setCenter(coords, 16);
        if (markerRef.current) markerRef.current.remove();
        const placemark = new window.ymaps.Placemark(coords, {}, { preset: 'islands#redDotIcon' });
        mapInstanceRef.current.geoObjects.add(placemark);
        markerRef.current = placemark;
        setPos({ lat, lng });
        setSearchQ(obj.getAddressLine());
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
        <button onClick={search} disabled={searching}
          style={{ background: 'var(--green)', color: 'white', border: 'none', borderRadius: 12, padding: '0 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}>
          {searching ? '...' : 'Qidir'}
        </button>
      </div>
      <div ref={mapRef} style={{ width: '100%', height: 220, borderRadius: 14, overflow: 'hidden', border: '1.5px solid var(--border)' }} />
      <div style={{ fontSize: 11, color: 'var(--text3)', margin: '6px 0 8px', fontWeight: 500 }}>Xaritada bosib aniq manzilni belgilang</div>
      {pos && (
        <button onClick={() => onConfirm(pos, searchQ)}
          style={{ width: '100%', background: 'var(--green)', color: 'white', border: 'none', borderRadius: 12, padding: 13, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
          ✓ Manzilni tasdiqlash
        </button>
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
  const [payment, setPayment] = useState('click');
  const [checkImage, setCheckImage] = useState(null);
  const [checkUploading, setCheckUploading] = useState(false);
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
      else setPromoError(d.error || "Promo kod noto'g'ri");
    } catch { setPromoError('Xatolik'); }
    setPromoLoading(false);
  };

  const handleMapConfirm = (p, a) => { setLat(p.lat); setLng(p.lng); setAddress(a || `${p.lat.toFixed(5)}, ${p.lng.toFixed(5)}`); showToast('📍 Manzil belgilandi'); };

  const uploadCheck = async (file) => {
    setCheckUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const r = await fetch('https://api.imgbb.com/1/upload?key=b59b77453337b7d29c865ed75ad39305', { method: 'POST', body: formData });
      const d = await r.json();
      if (d.data?.url) { setCheckImage(d.data.url); showToast('✅ Chek yuklandi!'); }
      else showToast('Xatolik: rasm yuklanmadi');
    } catch { showToast('Rasm yuklashda xatolik'); }
    setCheckUploading(false);
  };

  const placeOrder = async () => {
    if (!user) { onAuthRequired(); return; }
    if (deliveryType === 'delivery' && !address.trim()) { showToast('Manzilni belgilang!'); return; }
    if (scheduleType === 'scheduled' && !selectedSlot) { showToast('Vaqtni tanlang!'); return; }
    if (!checkImage) { showToast("To'lov chekini yuklang!"); return; }
    setLoading(true);
    try {
      const result = await createOrder({
        customerPhone: user.phone, customerName: user.name || user.phone,
        deliveryType, paymentMethod: payment,
        address: deliveryType === 'delivery' ? address : '',
        comment: `${comment ? comment + '\n' : ''}Chek: ${checkImage}`,
        totalPrice: total, latitude: lat, longitude: lng,
        promoCode: promoApplied ? promoApplied.code : null, discount,
        scheduledTime: scheduleType === 'scheduled' && selectedSlot ? selectedSlot.date.toISOString() : null,
        items: cart.map(i => ({ productId: i.id, quantity: i.qty, price: products.find(p => p.id === i.id)?.price || 0 })),
      });
      if (result.id) {
        if (promoApplied) await fetch(`${API_URL}/promo/use`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: promoApplied.code }) });
        setSuccess(true);
      } else showToast('Xatolik: ' + (result.error || "Qayta urinib ko'ring"));
    } catch { showToast("Server bilan bog'lanishda xatolik"); }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 72, marginBottom: 20 }}>🎉</div>
          <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 10 }}>Buyurtma qabul qilindi!</h2>
          <p style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 8 }}>{scheduleType === 'scheduled' && selectedSlot ? `⏰ ${selectedSlot.label}` : "Tez orada operator bog'lanadi"}</p>
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
          <button className="back-btn" onClick={onBack}><Ms icon="arrow_back_ios" size={20} fill={0} /></button>
          <span className="page-title">Savatcha</span>
        </div>
        <div className="empty-cart">
          <div className="empty-cart-icon"><Ms icon="shopping_bag" size={56} fill={0} color="var(--text3)" /></div>
          <h3>Savatcha bo'sh</h3>
          <p>Mahsulotlarni qo'shib boshlang</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="page-header">
        <button className="back-btn" onClick={onBack}><Ms icon="arrow_back_ios" size={20} fill={0} /></button>
        <span className="page-title">Savatcha</span>
        <button onClick={onClearCart} style={{ background: 'none', border: 'none', color: 'var(--red)', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Tozalash</button>
      </div>

      {/* MAHSULOTLAR */}
      <div className="cart-items">
        {cartItems.map(item => (
          <div key={item.id} className="cart-item">
            {item.product.image ? <img className="cart-item-img" src={item.product.image} alt={item.product.name} onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} /> : null}
            <div className="cart-item-img-placeholder" style={{ display: item.product.image ? 'none' : 'flex' }}>{CATS_ICONS[item.product.category] || '🍰'}</div>
            <div className="cart-item-info">
              <div className="cart-item-name">{item.product.name}</div>
              <div className="cart-item-price">{fmt(item.product.price * item.qty)}</div>
            </div>
            <div className="cart-item-qty">
              <button className="qty-btn2" onClick={() => onRemove(item.id)}><Ms icon="remove" size={18} fill={1} /></button>
              <span className="qty-num2">{item.qty}</span>
              <button className="qty-btn2" onClick={() => onAdd(item.product)}><Ms icon="add" size={18} fill={1} /></button>
            </div>
          </div>
        ))}
      </div>

      <div className="checkout-section">

        {/* YETKAZISH TURI */}
        <div className="checkout-card">
          <div className="checkout-title">Yetkazish turi</div>
          <div className="delivery-toggle">
            <div className={`delivery-opt ${deliveryType === 'delivery' ? 'active' : ''}`} onClick={() => setDeliveryType('delivery')}
              style={{ border: `2px solid ${deliveryType === 'delivery' ? 'var(--green)' : 'var(--border)'}`, background: deliveryType === 'delivery' ? 'rgba(0,98,65,0.05)' : 'var(--bg)', borderRadius: 16, transition: 'all .15s' }}>
              <div style={{ width: 44, height: 44, borderRadius: 13, margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: deliveryType === 'delivery' ? 'var(--green)' : 'var(--bg2)', boxShadow: deliveryType === 'delivery' ? '0 4px 10px rgba(0,98,65,0.25)' : 'none' }}>
                <IconTruck size={24} color={deliveryType === 'delivery' ? '#fff' : 'var(--text2)'} />
              </div>
              <div className="delivery-opt-label">Yetkazib berish</div>
              <div className="delivery-opt-sub">{fmt(settings?.deliveryPrice || 10000)}</div>
            </div>
            <div className={`delivery-opt ${deliveryType === 'pickup' ? 'active' : ''}`} onClick={() => setDeliveryType('pickup')}
              style={{ border: `2px solid ${deliveryType === 'pickup' ? 'var(--green)' : 'var(--border)'}`, background: deliveryType === 'pickup' ? 'rgba(0,98,65,0.05)' : 'var(--bg)', borderRadius: 16, transition: 'all .15s' }}>
              <div style={{ width: 44, height: 44, borderRadius: 13, margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: deliveryType === 'pickup' ? 'var(--green)' : 'var(--bg2)', boxShadow: deliveryType === 'pickup' ? '0 4px 10px rgba(0,98,65,0.25)' : 'none' }}>
                <IconStore size={24} color={deliveryType === 'pickup' ? '#fff' : 'var(--text2)'} />
              </div>
              <div className="delivery-opt-label">Olib ketish</div>
              <div className="delivery-opt-sub">Bepul</div>
            </div>
          </div>
        </div>

        {/* MANZIL + XARITA */}
        {deliveryType === 'delivery' && (
          <div className="checkout-card">
            <div className="checkout-title">Yetkazib berish manzili</div>
            <input className="field-input" style={{ marginBottom: 12 }} placeholder="Ko'cha, uy raqami, mo'ljal..." value={address} onChange={e => setAddress(e.target.value)} />
            <MapPicker onConfirm={handleMapConfirm} selectedPos={lat ? { lat, lng } : null} />
            {lat && lng && (
              <div style={{ marginTop: 8, fontSize: 12, color: 'var(--green)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Ms icon="check_circle" size={14} fill={1} color="var(--green)" />
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
            <div className={`delivery-opt ${scheduleType === 'now' ? 'active' : ''}`} onClick={() => { setScheduleType('now'); setSelectedSlot(null); }}
              style={{ border: `2px solid ${scheduleType === 'now' ? 'var(--green)' : 'var(--border)'}`, background: scheduleType === 'now' ? 'rgba(0,98,65,0.05)' : 'var(--bg)', borderRadius: 16, transition: 'all .15s' }}>
              <div style={{ width: 44, height: 44, borderRadius: 13, margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: scheduleType === 'now' ? 'var(--green)' : 'var(--bg2)', boxShadow: scheduleType === 'now' ? '0 4px 10px rgba(0,98,65,0.25)' : 'none' }}>
                <IconBolt size={24} color={scheduleType === 'now' ? '#fff' : 'var(--text2)'} />
              </div>
              <div className="delivery-opt-label">Iloji boricha tez</div>
              <div className="delivery-opt-sub">~40-60 daqiqa</div>
            </div>
            <div className={`delivery-opt ${scheduleType === 'scheduled' ? 'active' : ''}`} onClick={() => setScheduleType('scheduled')}
              style={{ border: `2px solid ${scheduleType === 'scheduled' ? 'var(--green)' : 'var(--border)'}`, background: scheduleType === 'scheduled' ? 'rgba(0,98,65,0.05)' : 'var(--bg)', borderRadius: 16, transition: 'all .15s' }}>
              <div style={{ width: 44, height: 44, borderRadius: 13, margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: scheduleType === 'scheduled' ? 'var(--green)' : 'var(--bg2)', boxShadow: scheduleType === 'scheduled' ? '0 4px 10px rgba(0,98,65,0.25)' : 'none' }}>
                <IconClock size={24} color={scheduleType === 'scheduled' ? '#fff' : 'var(--text2)'} />
              </div>
              <div className="delivery-opt-label">Vaqt belgilash</div>
              <div className="delivery-opt-sub">Kerakli vaqtga</div>
            </div>
          </div>
          {scheduleType === 'scheduled' && (
            <>
              <div className="time-slots">
                {timeSlots.map(slot => (
                  <button key={slot.key} className={`time-slot ${selectedSlot?.key === slot.key ? 'active' : ''}`} onClick={() => setSelectedSlot(slot)}>{slot.label}</button>
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
              <Ms icon="redeem" size={20} fill={1} color="var(--green)" />
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
            <div
              className={`pay-opt ${payment === 'payme' ? 'active' : ''}`}
              onClick={() => setPayment('payme')}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '16px 14px',
                border: `2px solid ${payment === 'payme' ? 'var(--text)' : 'var(--border)'}`,
                background: 'var(--bg2)', borderRadius: 14, cursor: 'pointer', transition: 'all .15s',
              }}
            >
              <PaymeLogo size={30} />
            </div>
            <div
              className={`pay-opt ${payment === 'click' ? 'active' : ''}`}
              onClick={() => setPayment('click')}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '16px 14px',
                border: `2px solid ${payment === 'click' ? 'var(--text)' : 'var(--border)'}`,
                background: 'var(--bg2)', borderRadius: 14, cursor: 'pointer', transition: 'all .15s',
              }}
            >
              <ClickLogo size={30} />
              <span className="pay-label" style={{ fontWeight: 700, fontSize: 16, color: 'var(--text)' }}>Click</span>
            </div>
          </div>

          <div
            className={`pay-opt ${payment === 'card' ? 'active' : ''}`}
            onClick={() => setPayment('card')}
            style={{
              flexDirection: 'column', alignItems: 'flex-start', padding: '14px', gap: 10,
              border: `2px solid ${payment === 'card' ? 'var(--green)' : 'var(--border)'}`, borderRadius: 16,
              background: payment === 'card' ? 'rgba(0,98,65,0.04)' : 'var(--bg)', cursor: 'pointer', transition: 'all .15s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%' }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: payment === 'card' ? 'var(--green)' : 'var(--bg2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Ms icon="credit_card" size={22} fill={1} color={payment === 'card' ? 'white' : 'var(--text2)'} />
              </div>
              <span className="pay-label" style={{ fontSize: 14, fontWeight: 700 }}>Karta orqali o'tkazma</span>
              {payment === 'card' && (
                <div style={{ marginLeft: 'auto', width: 18, height: 18, borderRadius: '50%', background: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Ms icon="check" size={12} fill={1} color="white" />
                </div>
              )}
            </div>
            <div style={{ width: '100%', background: payment === 'card' ? 'rgba(0,98,65,0.07)' : 'var(--bg2)', borderRadius: 12, padding: '12px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: '1px', color: 'var(--text)' }}>9860 3401 0366 2565</span>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    navigator.clipboard.writeText('9860340103662565');
                    const el = e.currentTarget;
                    el.textContent = '✓';
                    setTimeout(() => el.textContent = '', 1500);
                  }}
                  style={{ background: 'var(--green)', color: 'white', border: 'none', borderRadius: 8, width: 36, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, fontSize: 13, fontWeight: 700 }}
                >
                  <Ms icon="content_copy" size={16} fill={1} color="white" />
                </button>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text2)', fontWeight: 600 }}>Yusupov Kozim</div>
            </div>
          </div>

          <button
            onClick={() => {
              if (payment === 'click') window.open(`https://indoor.click.uz/pay?id=071752&t=${total}`, '_blank');
              else if (payment === 'payme') window.open(`https://transfer.paycom.uz/67ff430e8d2fe4b0d3c10d73?a=${total * 100}`, '_blank');
            }}
            style={{ width: '100%', marginTop: 10, background: 'var(--green)', color: 'white', border: 'none', borderRadius: 12, padding: 13, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: payment === 'card' ? 'none' : 'block' }}
          >
            {payment === 'click' ? 'Click orqali to\'lash' : 'Payme orqali to\'lash'} — {fmt(total)}
          </button>
        </div>

        {/* CHEK YUKLASH */}
        <div className="checkout-card">
          <div className="checkout-title">To'lov chekini yuklang</div>
          <div style={{ fontSize: 12, color: 'var(--text2)', marginBottom: 12, lineHeight: 1.5 }}>To'lov qilgandan so'ng chek screenshotini yuklang</div>
          {checkImage ? (
            <div style={{ position: 'relative' }}>
              <img src={checkImage} alt="Chek" style={{ width: '100%', borderRadius: 12, border: '2px solid var(--green)', maxHeight: 240, objectFit: 'cover' }} />
              <div style={{ marginTop: 8, fontSize: 12, color: 'var(--green)', fontWeight: 700, textAlign: 'center' }}>✅ Chek yuklandi</div>
              <button onClick={() => setCheckImage(null)} style={{ position: 'absolute', top: 8, right: 8, background: 'var(--red)', color: 'white', border: 'none', borderRadius: 8, width: 28, height: 28, cursor: 'pointer', fontSize: 14, fontWeight: 700 }}>✕</button>
            </div>
          ) : (
            <label style={{ display: 'block', cursor: 'pointer' }}>
              <div style={{ border: '2px dashed var(--border)', borderRadius: 14, padding: '24px 16px', textAlign: 'center', background: 'var(--cream)' }}>
                <Ms icon="photo_camera" size={36} fill={1} color="var(--text3)" style={{ marginBottom: 8, display: 'block' }} />
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{checkUploading ? 'Yuklanmoqda...' : 'Chek rasmini yuklash'}</div>
                <div style={{ fontSize: 12, color: 'var(--text3)' }}>Galereya yoki kamera</div>
              </div>
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { if (e.target.files[0]) uploadCheck(e.target.files[0]); }} />
            </label>
          )}
        </div>

        {/* HISOB */}
        <div className="checkout-card">
          <div className="checkout-title">Hisob</div>
          <div className="price-row"><span>Mahsulotlar ({cart.reduce((s, i) => s + i.qty, 0)} ta)</span><span className="price-val">{fmt(subtotal)}</span></div>
          {deliveryType === 'delivery' && <div className="price-row"><span>Yetkazib berish</span><span className="price-val">{fmt(deliveryPrice)}</span></div>}
          {promoApplied && <div className="price-row"><span>🎁 {promoApplied.code}</span><span style={{ color: 'var(--red)', fontWeight: 700 }}>-{fmt(discount)}</span></div>}
          <div className="price-row total"><span>Jami</span><span className="price-val">{fmt(total)}</span></div>
        </div>

        {!user && (
          <div style={{ background: 'var(--green-soft)', borderRadius: 14, padding: '12px 16px', marginBottom: 10, fontSize: 13, color: 'var(--green)', fontWeight: 600 }}>
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
