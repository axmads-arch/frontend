import React from 'react';

const BADGE = {
  PENDING:    { cls: 'badge-new',  label: 'Yangi'       },
  PREPARING:  { cls: 'badge-prep', label: 'Tayyorlanmoqda' },
  READY:      { cls: 'badge-way',  label: 'Tayyor'      },
  DELIVERING: { cls: 'badge-way',  label: 'Yo\'lda'     },
  DELIVERED:  { cls: 'badge-done', label: 'Yetkazildi'  },
  CANCELLED:  { cls: 'badge-new',  label: 'Bekor qilindi'},
};

export default function OrdersPage({ orders, user, onLogin, fmt }) {
  if (!user) {
    return (
      <div className="page">
        <div className="page-header">
          <div style={{ width: 36 }} />
          <span className="page-title">Buyurtmalar</span>
          <div style={{ width: 36 }} />
        </div>
        <div className="empty-state" style={{ paddingTop: 80 }}>
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
          <h3>Buyurtmalarni ko'rish uchun kiring</h3>
          <p>Telefon raqamingiz bilan kiring</p>
          <button className="empty-btn" onClick={onLogin}>Kirish</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div style={{ width: 36 }} />
        <span className="page-title">Buyurtmalar</span>
        <div style={{ width: 36 }} />
      </div>

      {orders.length === 0 ? (
        <div className="empty-state" style={{ paddingTop: 80 }}>
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
          <h3>Buyurtmalar yo'q</h3>
          <p>Siz hali buyurtma bermadingiz</p>
        </div>
      ) : (
        <div style={{ paddingBottom: 20 }}>
          {orders.map((o, i) => {
            const b = BADGE[o.status] || BADGE.PENDING;
            const itemsList = o.items?.map(item =>
              `${item.product?.name || 'Mahsulot'} x${item.quantity}`
            ).join(', ');
            return (
              <div key={i} className="order-card">
                <div className="order-head">
                  <span className="order-id">#{o.id}</span>
                  <span className={`order-badge ${b.cls}`}>{b.label}</span>
                </div>
                <div className="order-items">{itemsList}</div>
                <div className="order-total">{fmt(o.total)}</div>
                <div className="order-date">
                  {new Date(o.createdAt).toLocaleString('ru')}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
