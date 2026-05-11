import React, { useState, useEffect, useRef } from 'react';

export default function Cart({ cart, cartSum, addToCart, removeFromCart, setPage, setCart, API, deliveryType }) {
  const [step, setStep] = useState('cart');
  const [name, setName] = useState(localStorage.getItem('userName') || '');
  const [phone, setPhone] = useState(localStorage.getItem('userPhone') || '');
  const [address, setAddress] = useState(localStorage.getItem('userAddress') || '');
  const [orderType, setOrderType] = useState(deliveryType === 'pickup' ? 'pickup' : 'delivery');
  const [paymentType, setPaymentType] = useState('naqd');
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (showMap) loadMap();
  }, [showMap]);

  function loadMap() {
    if (mapInstanceRef.current) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => initMap();
    document.head.appendChild(script);
  }

  function initMap() {
    if (!mapRef.current || mapInstanceRef.current) return;
    const L = window.L;
    const map = L.map(mapRef.current).setView([41.2995, 69.2401], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    const marker = L.marker([41.2995, 69.2401], { draggable: true }).addTo(map);
    markerRef.current = marker;
    mapInstanceRef.current = map;
    map.on('click', async (e) => {
      marker.setLatLng(e.latlng);
      await getAddress(e.latlng.lat, e.latlng.lng);
    });
    marker.on('dragend', async () => {
      const pos = marker.getLatLng();
      await getAddress(pos.lat, pos.lng);
    });
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        const { latitude, longitude } = pos.coords;
        map.setView([latitude, longitude], 15);
        marker.setLatLng([latitude, longitude]);
        getAddress(latitude, longitude);
      });
    }
  }

  async function getAddress(lat, lng) {
    try {
      const res = await fetch('https://nominatim.openstreetmap.org/reverse?lat=' + lat + '&lon=' + lng + '&format=json');
      const data = await res.json();
      setAddress(data.display_name || (lat + ', ' + lng));
    } catch(e) {
      setAddress(lat.toFixed(5) + ', ' + lng.toFixed(5));
    }
  }

  async function submitOrder() {
    if (!name || !phone) return alert('Ism va telefon kiriting!');
    if (orderType === 'delivery' && !address) return alert('Manzil kiriting!');
    setLoading(true);
    try {
      const res = await fetch(API + '/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name,
          phone,
          address: orderType === 'pickup' ? "O'zi olib ketadi" : address,
          paymentType,
          orderType,
          items: cart.map(c => ({ productId: c.id, quantity: c.qty, price: c.price }))
        })
      });
      if (!res.ok) throw new Error('Xatolik');
      localStorage.setItem('userAddress', address);
      setCart([]);
      setStep('success');
      setTimeout(() => { setStep('cart'); setPage('home'); }, 3000);
    } catch(e) {
      alert('Xatolik: ' + e.message);
    } finally {
      setLoading(false);
    }
  }

  if (step === 'success') {
    return (
      <div className="success-overlay">
        <div className="success-box">
          <div className="success-icon">🎉</div>
          <div className="success-title">Buyurtma qabul qilindi!</div>
          <div className="success-text">Tez orada siz bilan bog'lanamiz</div>
        </div>
      </div>
    );
  }

  if (step === 'form') {
    return (
      <div>
        <div className="page-header">
          <button className="back-btn" onClick={() => setStep('cart')}>←</button>
          <h2>Buyurtma</h2>
        </div>
        <div className="page" style={{paddingBottom:'120px'}}>

          <div style={{background:'#fff',borderRadius:'16px',padding:'16px',marginBottom:'12px',boxShadow:'0 1px 4px rgba(0,0,0,0.06)'}}>
            <div style={{fontSize:'0.78rem',color:'#999',fontWeight:700,marginBottom:'10px'}}>YETKAZISH USULI</div>
            <div className="payment-options">
              <button
                className={'payment-btn' + (orderType === 'delivery' ? ' active' : '')}
                onClick={() => setOrderType('delivery')}
              >
                🚚 Yetkazib berish
              </button>
              <button
                className={'payment-btn' + (orderType === 'pickup' ? ' active' : '')}
                onClick={() => setOrderType('pickup')}
              >
                🏪 Olib ketish
              </button>
            </div>
          </div>

          {!localStorage.getItem('userName') && (
            <div style={{background:'#fff',borderRadius:'16px',padding:'16px',marginBottom:'12px',boxShadow:'0 1px 4px rgba(0,0,0,0.06)'}}>
              <div style={{fontSize:'0.78rem',color:'#999',fontWeight:700,marginBottom:'10px'}}>KONTAKT</div>
              <div className="form-group">
                <label className="form-label">Ismingiz</label>
                <input className="form-input" type="text" placeholder="Ism Familiya" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="form-group" style={{marginBottom:0}}>
                <label className="form-label">Telefon</label>
                <input className="form-input" type="tel" placeholder="+998 90 000 00 00" value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
            </div>
          )}

          {localStorage.getItem('userName') && (
            <div style={{background:'#e8f5f1',borderRadius:'16px',padding:'14px',marginBottom:'12px',display:'flex',alignItems:'center',gap:'10px'}}>
              <span style={{fontSize:'1.4rem'}}>👤</span>
              <div>
                <div style={{fontWeight:800,fontSize:'0.9rem'}}>{name}</div>
                <div style={{fontSize:'0.82rem',color:'#1a6b5a'}}>{phone}</div>
              </div>
            </div>
          )}

          {orderType === 'delivery' && (
            <div style={{background:'#fff',borderRadius:'16px',padding:'16px',marginBottom:'12px',boxShadow:'0 1px 4px rgba(0,0,0,0.06)'}}>
              <div style={{fontSize:'0.78rem',color:'#999',fontWeight:700,marginBottom:'10px'}}>MANZIL</div>
              <button
                onClick={() => setShowMap(!showMap)}
                style={{background:'#1a6b5a',color:'#fff',border:'none',padding:'10px 16px',borderRadius:'10px',fontWeight:700,cursor:'pointer',fontSize:'0.85rem',marginBottom:'10px',width:'100%'}}
              >
                🗺️ {showMap ? 'Xaritani yopish' : 'Xaritadan tanlash'}
              </button>
              {showMap && (
                <div style={{marginBottom:'10px'}}>
                  <div ref={mapRef} style={{height:'220px',borderRadius:'12px',overflow:'hidden',border:'1.5px solid #eee'}}></div>
                  <p style={{fontSize:'0.75rem',color:'#888',marginTop:'6px'}}>📍 Xaritada bosing yoki markerni suring</p>
                </div>
              )}
              <textarea
                className="form-textarea"
                placeholder="Manzilni kiriting..."
                value={address}
                onChange={e => setAddress(e.target.value)}
              />
            </div>
          )}

          {orderType === 'pickup' && (
            <div style={{background:'#e8f5f1',borderRadius:'16px',padding:'14px',marginBottom:'12px'}}>
              <div style={{fontWeight:800,fontSize:'0.88rem',color:'#1a6b5a',marginBottom:'4px'}}>🏪 Bizning manzil</div>
              <div style={{fontSize:'0.82rem',color:'#444'}}>Toshkent, Ko'kcha Darvoza ko'chasi, 338A</div>
              <div style={{fontSize:'0.78rem',color:'#888',marginTop:'4px'}}>⏰ 24/7 ishlaydi</div>
            </div>
          )}

          <div style={{background:'#fff',borderRadius:'16px',padding:'16px',marginBottom:'12px',boxShadow:'0 1px 4px rgba(0,0,0,0.06)'}}>
            <div style={{fontSize:'0.78rem',color:'#999',fontWeight:700,marginBottom:'10px'}}>TO'LOV USULI</div>
            <div className="payment-options">
              <button
                className={'payment-btn' + (paymentType === 'naqd' ? ' active' : '')}
                onClick={() => setPaymentType('naqd')}
              >
                💵 Naqd
              </button>
              <button
                className={'payment-btn' + (paymentType === 'karta' ? ' active' : '')}
                onClick={() => setPaymentType('karta')}
              >
                💳 Karta
              </button>
            </div>
          </div>

          <div style={{background:'#fff',borderRadius:'16px',padding:'16px',boxShadow:'0 1px 4px rgba(0,0,0,0.06)'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px',fontSize:'0.88rem',color:'#888'}}>
              <span>Mahsulotlar</span>
              <span>{Number(cartSum).toLocaleString()} so'm</span>
            </div>
            {orderType === 'delivery' && (
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px',fontSize:'0.88rem',color:'#888'}}>
                <span>Yetkazib berish</span>
                <span style={{color:'#1a6b5a',fontWeight:700}}>Bepul</span>
              </div>
            )}
            <div style={{display:'flex',justifyContent:'space-between',fontWeight:900,fontSize:'1rem',borderTop:'1px solid #eee',paddingTop:'10px'}}>
              <span>Jami</span>
              <span style={{color:'#1a6b5a'}}>{Number(cartSum).toLocaleString()} so'm</span>
            </div>
          </div>
        </div>

        <div className="cart-footer">
          <button className="btn-primary" onClick={submitOrder} disabled={loading}>
            {loading ? 'Yuborilmoqda...' : 'Buyurtma berish — ' + Number(cartSum).toLocaleString() + " so'm"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <button className="back-btn" onClick={() => setPage('home')}>←</button>
        <h2>Savat</h2>
        {cart.length > 0 && (
          <button
            onClick={() => setCart([])}
            style={{marginLeft:'auto',background:'#fee2e2',color:'#ef4444',border:'none',padding:'6px 12px',borderRadius:'8px',fontWeight:700,fontSize:'0.8rem',cursor:'pointer'}}
          >
            🗑️
          </button>
        )}
      </div>
      <div className="page" style={{paddingBottom:'140px'}}>
        {cart.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🛒</div>
            <p className="empty-text">Savat bo'sh</p>
            <button className="btn-primary" onClick={() => setPage('home')}>Menuni ko'rish</button>
          </div>
        ) : (
          cart.map(c => (
            <div key={c.id} className="cart-item">
              <div className="cart-item-img">
                {c.image ? <img src={c.image} alt={c.name} /> : '🍰'}
              </div>
              <div className="cart-item-info">
                <div className="cart-item-name">{c.name}</div>
                <div className="cart-item-price">{Number(c.price).toLocaleString()} so'm</div>
              </div>
              <div className="qty-controls">
                <button className="qty-btn" onClick={() => removeFromCart(c.id)}>−</button>
                <span className="qty-num">{c.qty}</span>
                <button className="qty-btn" onClick={() => addToCart(c)}>+</button>
              </div>
            </div>
          ))
        )}
      </div>
      {cart.length > 0 && (
        <div className="cart-footer">
          <div className="cart-total-row">
            <span className="cart-total-label">Jami summa</span>
            <span className="cart-total-sum">{Number(cartSum).toLocaleString()} so'm</span>
          </div>
          <button className="btn-primary" onClick={() => setStep('form')}>
            Buyurtma berish
          </button>
        </div>
      )}
    </div>
  );
}
