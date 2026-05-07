import React, { useState, useEffect } from 'react';

export default function Orders({ setPage, API }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const phone = localStorage.getItem('userPhone');

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    if (!phone) { setLoading(false); return; }
    try {
      const res = await fetch(`${API}/api/orders/my/${phone}`);
      const data = await res.json();
      if (Array.isArray(data)) setOrders(data);
    } catch(e) {}
    setLoading(false);
  }

  const statusColor = {
    yangi: '#d97706',
    tayyorlanmoqda: '#2563eb',
    tayyor: '#059669',
    yetkazilmoqda: '#7c3aed',
    yetkazildi: '#059669'
  };

  if (!phone) {
    return (
      <div>
        <div className="page-header">
          <h2>📋 Buyurtmalar</h2>
        </div>
        <div className="empty-state">
          <div className="icon">📋</div>
          <p>Buyurtmalarni ko'rish uchun profilga kiring</p>
          <button className="order-btn" style={{marginTop:'20px'}} onClick={() => setPage('profile')}>
            👤 Profilga o'tish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h2>📋 Buyurtmalar</h2>
      </div>
      <div className="page">
        {loading ? (
          <div className="empty-state"><p>Yuklanmoqda...</p></div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📋</div>
            <p>Buyurtmalar yo'q</p>
          </div>
        ) : (
          orders.map(o => (
            <div key={o.id} style={{background:'#fff',borderRadius:'16px',padding:'16px',marginBottom:'12px',boxShadow:'0 2px 8px rgba(0,0,0,0.06)'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px'}}>
                <span style={{fontWeight:800}}>Buyurtma #{o.id}</span>
                <span style={{background:'#f0faf6',color:statusColor[o.status]||'#888',padding:'4px 10px',borderRadius:'20px',fontSize:'0.78rem',fontWeight:700}}>
                  {o.status}
                </span>
              </div>
              <div style={{fontSize:'0.82rem',color:'#888',marginBottom:'4px'}}>
                📍 {o.address}
              </div>
              <div style={{fontWeight:900,color:'#1a6b5a',fontSize:'0.95rem'}}>
                {Number(o.total).toLocaleString()} so'm
              </div>
              <div style={{fontSize:'0.75rem',color:'#bbb',marginTop:'4px'}}>
                {new Date(o.createdAt).toLocaleDateString('uz-UZ')}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
