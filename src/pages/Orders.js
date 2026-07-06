import React, { useState, useEffect } from 'react';
import { fetchMyOrders } from '../data/api';

const STATUS = {
  new: { label: 'Yangi', cls: 'st-new' },
  preparing: { label: 'Tayyorlanmoqda', cls: 'st-preparing' },
  ready: { label: 'Tayyor', cls: 'st-ready' },
  delivering: { label: 'Yetkazilmoqda', cls: 'st-delivering' },
  delivered: { label: 'Yetkazildi', cls: 'st-delivered' },
  cancelled: { label: 'Bekor', cls: 'st-cancelled' },
};
const PAY = { cash: 'Naqd', click: 'Click', payme: 'Payme', uzum: 'Uzum', card: 'Karta' };
const DEL = { delivery: 'Yetkazib berish', pickup: 'Olib ketish' };

export default function Orders({ user, onAuthRequired, fmt }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    fetchMyOrders(user.phone).then(data => {
      setOrders(Array.isArray(data) ? data : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div className="page">
        <div className="page-header" style={{ background: 'var(--white)', borderBottom: '1px solid var(--border)', padding: '14px 20px' }}>
          <span className="page-title">Buyurtmalar</span>
        </div>
        <div className="empty-state" style={{ marginTop: 40 }}>
          <div className="empty-state-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          </div>
          <h3>Buyurtmalar tarixi</h3>
          <p>Ko'rish uchun tizimga kiring</p>
          <button className="login-btn" style={{ marginTop: 24 }} onClick={onAuthRequired}>Kirish</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header" style={{ background: 'var(--white)', borderBottom: '1px solid var(--border)', padding: '14px 20px', position: 'sticky', top: 0, zIndex: 40 }}>
        <span className="page-title">Buyurtmalar</span>
      </div>

      {loading ? (
        <div style={{ padding: '20px' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>
              <div className="skeleton" style={{ height: 14, width: '40%', marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 12, width: '70%', marginBottom: 6 }} />
              <div className="skeleton" style={{ height: 12, width: '30%' }} />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="empty-state" style={{ marginTop: 40 }}>
          <div className="empty-state-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
          </div>
          <h3>Buyurtmalar yo'q</h3>
          <p>Hali buyurtma bermagansiz</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(o => {
            const st = STATUS[o.status] || { label: o.status, cls: 'st-new' };
            const date = new Date(o.createdAt).toLocaleString('uz-UZ', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
            const itemsText = o.items?.map(i => `${i.product?.name || 'Mahsulot'} ×${i.quantity}`).join(', ') || '';
            return (
              <div key={o.id} className="order-card">
                <div className="order-card-head">
                  <div>
                    <div className="order-num">#{o.id}</div>
                    <div className="order-date">{date}</div>
                  </div>
                  <span className={`status-pill ${st.cls}`}>{st.label}</span>
                </div>
                <div className="order-items-text">{itemsText}</div>
                <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 10, fontWeight: 500 }}>
                  {DEL[o.deliveryType] || o.deliveryType} · {PAY[o.paymentMethod] || o.paymentMethod}
                  {o.address ? ` · ${o.address}` : ''}
                  {o.scheduledTime ? ` · ⏰ ${new Date(o.scheduledTime).toLocaleString('uz-UZ', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}` : ''}
                </div>
                <div className="order-total-row">
                  <span style={{ fontSize: 13, color: 'var(--text2)', fontWeight: 500 }}>Jami summa</span>
                  <span className="order-total-price">{fmt(o.totalPrice)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
