import React from 'react';

const ICONS = { 'Cheesecake':'🍰','Medovik':'🍯','Tort':'🎂','Kofe':'☕','Choy':'🍵','Ichimlik':'🥤' };

export default function Profile({ user, onLogin, onLogout, settings, favorites, products, onAdd, fmt, darkMode, onToggleDark }) {
  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-header">
          <div className="profile-avatar">👤</div>
          <div className="profile-name">Mehmon</div>
          <div className="profile-phone">Tizimga kiring</div>
        </div>
        <div className="profile-login">
          <h3>Xush kelibsiz!</h3>
          <p>Buyurtma berish va tarixni ko'rish uchun telefon raqamingizni kiriting</p>
          <button className="login-btn" onClick={onLogin}>📱 Kirish</button>
        </div>

        {favorites && favorites.length > 0 && products && (
          <div className="profile-menu">
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 10, color: 'var(--text)' }}>❤️ Sevimlilar</div>
            {products.filter(p => favorites.includes(p.id)).map(p => (
              <div key={p.id} className="profile-item">
                <div className="profile-item-icon">{ICONS[p.category] || '🍰'}</div>
                <div className="profile-item-text">
                  <div className="profile-item-title">{p.name}</div>
                  <div className="profile-item-sub">{fmt(p.price)}</div>
                </div>
                <button onClick={() => onAdd(p)} style={{background:'var(--teal)',color:'#fff',border:'none',borderRadius:8,padding:'6px 12px',fontSize:13,fontWeight:600,cursor:'pointer'}}>
                  + Qo'shish
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  const initials = (user.name || user.phone || '?').slice(0, 2).toUpperCase();

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">{initials}</div>
        <div className="profile-name">{user.name || 'Foydalanuvchi'}</div>
        <div className="profile-phone">{user.phone}</div>
      </div>

      {favorites && favorites.length > 0 && products && (
        <div className="profile-menu" style={{ paddingBottom: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 10, color: 'var(--text)' }}>❤️ Sevimlilar</div>
          {products.filter(p => favorites.includes(p.id)).map(p => (
            <div key={p.id} className="profile-item">
              <div className="profile-item-icon">{ICONS[p.category] || '🍰'}</div>
              <div className="profile-item-text">
                <div className="profile-item-title">{p.name}</div>
                <div className="profile-item-sub">{fmt(p.price)}</div>
              </div>
              <button onClick={() => onAdd(p)} style={{background:'var(--teal)',color:'#fff',border:'none',borderRadius:8,padding:'6px 12px',fontSize:13,fontWeight:600,cursor:'pointer'}}>
                + Qo'shish
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="profile-menu">
        {/* Dark mode toggle */}
        <div className="profile-item" onClick={onToggleDark}>
          <div className="profile-item-icon">{darkMode ? '☀️' : '🌙'}</div>
          <div className="profile-item-text">
            <div className="profile-item-title">{darkMode ? 'Kunduzgi rejim' : 'Tungi rejim'}</div>
            <div className="profile-item-sub">{darkMode ? 'Hozir: Dark mode' : 'Hozir: Light mode'}</div>
          </div>
          <span className="profile-item-arrow">›</span>
        </div>

        <div className="profile-item">
          <div className="profile-item-icon">📞</div>
          <div className="profile-item-text">
            <div className="profile-item-title">Aloqa</div>
            <div className="profile-item-sub">{settings?.phone || '+998 93 272 2222'}</div>
          </div>
          <a href={`tel:${(settings?.phone || '+998932722222').replace(/\s/g, '')}`}
             style={{ color: 'var(--teal)', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
            Qo'ng'iroq
          </a>
        </div>

        <div className="profile-item">
          <div className="profile-item-icon">📍</div>
          <div className="profile-item-text">
            <div className="profile-item-title">Bizning manzil</div>
            <div className="profile-item-sub">{settings?.address || "Ko'kcha darvoza 340a"}</div>
          </div>
          <a href="https://maps.google.com/?q=41.3224858,69.2091613" target="_blank" rel="noreferrer"
             style={{ color: 'var(--teal)', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
            Xarita
          </a>
        </div>

        <div className="profile-item" onClick={() => window.open('https://www.instagram.com/rahmatchef.uz', '_blank')}>
          <div className="profile-item-icon">📷</div>
          <div className="profile-item-text">
            <div className="profile-item-title">Instagram</div>
            <div className="profile-item-sub">@rahmatchef.uz</div>
          </div>
          <span className="profile-item-arrow">›</span>
        </div>

        <div className="profile-item" onClick={() => window.open('https://t.me/rahmatchef', '_blank')}>
          <div className="profile-item-icon">💬</div>
          <div className="profile-item-text">
            <div className="profile-item-title">Telegram bot</div>
            <div className="profile-item-sub">Buyurtma va ma'lumotlar</div>
          </div>
          <span className="profile-item-arrow">›</span>
        </div>

        <div className="profile-item" onClick={onLogout} style={{ marginTop: 8 }}>
          <div className="profile-item-icon" style={{ background: '#fee2e2' }}>🚪</div>
          <div className="profile-item-text">
            <div className="profile-item-title" style={{ color: 'var(--red)' }}>Chiqish</div>
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text3)', fontSize: 12 }}>
        © 2026 Rahmat Chef. Barcha huquqlar himoyalangan.
      </div>
    </div>
  );
}
