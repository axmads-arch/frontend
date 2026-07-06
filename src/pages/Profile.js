import React from 'react';

const Icons = {
  phone: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>,
  mapPin: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  instagram: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>,
  send: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  logout: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  moon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>,
  sun: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg>,
  heart: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  plus: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  chevronRight: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  user: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
};

export default function Profile({ user, onLogin, onLogout, settings, favorites, products, onAdd, fmt, darkMode, onToggleDark }) {

  const favProducts = favorites && products ? products.filter(p => favorites.includes(p.id)) : [];

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-header" style={{ textAlign: 'center' }}>
          <div className="profile-avatar" style={{ margin: '0 auto 14px' }}>
            {Icons.user}
          </div>
          <div className="profile-name">Mehmon</div>
          <div className="profile-phone">Tizimga kiring</div>
        </div>
        <div className="profile-login">
          <h3>Xush kelibsiz!</h3>
          <p>Buyurtma berish va tarixni ko'rish uchun telefon raqamingizni kiriting</p>
          <button className="login-btn" onClick={onLogin}>Kirish</button>
        </div>

        {favProducts.length > 0 && (
          <div style={{ padding: '0 20px 20px' }}>
            <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.3px', marginBottom: 12, color: 'var(--text)' }}>Sevimlilar</div>
            {favProducts.map(p => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                {p.image
                  ? <img src={p.image} alt={p.name} style={{ width: 52, height: 52, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} />
                  : <div style={{ width: 52, height: 52, borderRadius: 12, background: 'var(--cream2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>🍰</div>
                }
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{p.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 2 }}>{fmt(p.price)}</div>
                </div>
                <button onClick={() => onAdd(p)} style={{ background: 'var(--green)', color: 'white', border: 'none', borderRadius: 10, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  const initials = (user.name || user.phone || '?').slice(0, 2).toUpperCase();

  const menuItems = [
    {
      icon: Icons.moon,
      title: darkMode ? 'Kunduzgi rejim' : 'Tungi rejim',
      sub: darkMode ? 'Hozir: Qorong\'u' : 'Hozir: Yorug\'',
      action: onToggleDark,
      rightEl: <div style={{ width: 42, height: 24, borderRadius: 12, background: darkMode ? 'var(--green)' : 'var(--border)', position: 'relative', transition: '.3s' }}><div style={{ width: 18, height: 18, borderRadius: 9, background: 'white', position: 'absolute', top: 3, left: darkMode ? 21 : 3, transition: '.3s', boxShadow: '0 1px 4px rgba(0,0,0,.2)' }} /></div>
    },
    {
      icon: Icons.phone,
      title: 'Aloqa',
      sub: settings?.phone || '+998 93 272 2222',
      action: () => window.open(`tel:${(settings?.phone || '+998932722222').replace(/\s/g, '')}`)
    },
    {
      icon: Icons.mapPin,
      title: 'Bizning manzil',
      sub: settings?.address || "Ko'kcha darvoza 340a",
      action: () => window.open('https://maps.google.com/?q=41.3224858,69.2091613', '_blank')
    },
    {
      icon: Icons.instagram,
      title: 'Instagram',
      sub: '@rahmatchef.uz',
      action: () => window.open('https://www.instagram.com/rahmatchef.uz', '_blank')
    },
    {
      icon: Icons.send,
      title: 'Telegram',
      sub: 'Buyurtma va ma\'lumotlar',
      action: () => window.open('https://t.me/rahmatchef', '_blank')
    },
  ];

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">{initials}</div>
        <div className="profile-name">{user.name || 'Foydalanuvchi'}</div>
        <div className="profile-phone">{user.phone}</div>
      </div>

      {favProducts.length > 0 && (
        <div style={{ padding: '20px 20px 0', background: 'var(--white)', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: 12 }}>Sevimlilar</div>
          {favProducts.map(p => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderBottom: '1px solid var(--border)' }}>
              {p.image
                ? <img src={p.image} alt={p.name} style={{ width: 52, height: 52, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} />
                : <div style={{ width: 52, height: 52, borderRadius: 12, background: 'var(--cream2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>🍰</div>
              }
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 2 }}>{fmt(p.price)}</div>
              </div>
              <button onClick={() => onAdd(p)} style={{ background: 'var(--green)', color: 'white', border: 'none', borderRadius: 10, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
            </div>
          ))}
          <div style={{ height: 8 }} />
        </div>
      )}

      <div className="profile-menu">
        {menuItems.map((item, i) => (
          <div key={i} className="profile-item" onClick={item.action}>
            <div className="profile-item-icon">{item.icon}</div>
            <div className="profile-item-text">
              <div className="profile-item-title">{item.title}</div>
              <div className="profile-item-sub">{item.sub}</div>
            </div>
            {item.rightEl
              ? item.rightEl
              : <div className="profile-item-arrow">{Icons.chevronRight}</div>
            }
          </div>
        ))}

        <div className="profile-item" onClick={onLogout} style={{ marginTop: 8 }}>
          <div className="profile-item-icon" style={{ background: '#fef2f2', borderColor: '#fecaca' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#d93025" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </div>
          <div className="profile-item-text">
            <div className="profile-item-title" style={{ color: '#d93025' }}>Chiqish</div>
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text3)', fontSize: 12, fontWeight: 500 }}>
        © 2026 Rahmat Chef
      </div>
    </div>
  );
}
