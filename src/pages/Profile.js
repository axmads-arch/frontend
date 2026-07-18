import React, { useState, useEffect } from 'react';

const Icons = {
  phone: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .18h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>,
  mapPin: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  clock: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  instagram: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>,
  send: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  logout: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  moon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>,
  sun: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg>,
  bell: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
  download: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  chevronRight: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  user: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  plus: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
};

function Toggle({ value }) {
  return (
    <div style={{ width: 42, height: 24, borderRadius: 12, background: value ? 'var(--green)' : 'var(--border)', position: 'relative', transition: '.3s', flexShrink: 0 }}>
      <div style={{ width: 18, height: 18, borderRadius: 9, background: 'white', position: 'absolute', top: 3, left: value ? 21 : 3, transition: '.3s', boxShadow: '0 1px 4px rgba(0,0,0,.2)' }} />
    </div>
  );
}

function MenuItem({ icon, title, sub, action, right, danger }) {
  return (
    <div className="profile-item" onClick={action}>
      <div className="profile-item-icon" style={danger ? { background: '#fef2f2', borderColor: '#fecaca' } : {}}>
        {React.cloneElement(icon, { style: { width: 18, height: 18, color: danger ? '#d93025' : 'var(--text2)' } })}
      </div>
      <div className="profile-item-text">
        <div className="profile-item-title" style={danger ? { color: '#d93025' } : {}}>{title}</div>
        {sub && <div className="profile-item-sub">{sub}</div>}
      </div>
      {right !== undefined ? right : <div className="profile-item-arrow">{Icons.chevronRight}</div>}
    </div>
  );
}

export default function Profile({ user, onLogin, onLogout, settings, favorites, products, onAdd, fmt, darkMode, onToggleDark }) {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [notifPerm, setNotifPerm] = useState(typeof Notification !== 'undefined' ? Notification.permission : 'default');

  useEffect(() => {
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    setIsIOS(ios);
    if (window.navigator.standalone) setIsInstalled(true);

    const handler = e => { e.preventDefault(); setInstallPrompt(e); };
    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => setIsInstalled(true));
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (isIOS) { setShowIOSGuide(true); return; }
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') setIsInstalled(true);
    setInstallPrompt(null);
  };

  const handleNotif = async () => {
    if (!('Notification' in window)) return;
    if (notifPerm === 'granted') return;
    const result = await Notification.requestPermission();
    setNotifPerm(result);
    if (result === 'granted') new Notification('Rahmat Chef 🍰', { body: 'Bildirishnomalar yoqildi!' });
  };

  const favProducts = favorites && products ? products.filter(p => favorites.includes(p.id)) : [];
  const initials = user ? (user.name || user.phone || '?').slice(0, 2).toUpperCase() : '?';

  const IOSGuide = () => (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} onClick={() => setShowIOSGuide(false)}>
      <div style={{ background: 'var(--white)', borderRadius: '24px 24px 0 0', padding: '24px 20px 44px', width: '100%', maxWidth: 480 }} onClick={e => e.stopPropagation()}>
        <div style={{ width: 36, height: 4, background: 'var(--border)', borderRadius: 2, margin: '0 auto 20px' }} />
        <div style={{ fontSize: 20, fontWeight: 900, marginBottom: 20 }}>📱 Ilovani o'rnatish</div>
        {[
          'Pastdagi 📤 tugmasini bosing',
          '"Add to Home Screen" ni tanlang',
          '"Add" tugmasini bosing',
        ].map((t, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 14, alignItems: 'center' }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--green)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, flexShrink: 0 }}>{i + 1}</div>
            <div style={{ fontSize: 14 }}>{t}</div>
          </div>
        ))}
        <button onClick={() => setShowIOSGuide(false)} style={{ width: '100%', background: 'var(--green)', color: 'white', border: 'none', borderRadius: 14, padding: 14, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', marginTop: 8 }}>Tushundim</button>
      </div>
    </div>
  );

  if (!user) {
    return (
      <div className="profile-page">
        {showIOSGuide && <IOSGuide />}
        <div className="profile-header" style={{ textAlign: 'center' }}>
          <div className="profile-avatar" style={{ margin: '0 auto 14px' }}>
            {React.cloneElement(Icons.user, { style: { width: 28, height: 28, color: 'var(--green)' } })}
          </div>
          <div className="profile-name">Mehmon</div>
          <div className="profile-phone">Tizimga kiring</div>
        </div>
        <div className="profile-login">
          <h3>Xush kelibsiz!</h3>
          <p>Buyurtma berish uchun kiring</p>
          <button className="login-btn" onClick={onLogin} style={{ marginBottom: 16 }}>Kirish</button>
          {!isInstalled && (installPrompt || isIOS) && (
            <button onClick={handleInstall} style={{ background: 'var(--green-soft)', color: 'var(--green)', border: '1.5px solid var(--green)', borderRadius: 14, padding: '12px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 8, margin: '0 auto' }}>
              {React.cloneElement(Icons.download, { style: { width: 16, height: 16 } })}
              Ilovani o'rnatish
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {showIOSGuide && <IOSGuide />}

      <div className="profile-header">
        <div className="profile-avatar">{initials}</div>
        <div className="profile-name">{user.name || 'Foydalanuvchi'}</div>
        <div className="profile-phone">{user.phone}</div>
      </div>

      {favProducts.length > 0 && (
        <div style={{ background: 'var(--white)', borderBottom: '1px solid var(--border)', padding: '16px 20px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.7px', marginBottom: 12 }}>Sevimlilar</div>
          {favProducts.map(p => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              {p.image
                ? <img src={p.image} alt={p.name} style={{ width: 50, height: 50, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} />
                : <div style={{ width: 50, height: 50, borderRadius: 12, background: 'var(--cream2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>🍰</div>
              }
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 2 }}>{fmt(p.price)}</div>
              </div>
              <button onClick={() => onAdd(p)} style={{ background: 'var(--green)', color: 'white', border: 'none', borderRadius: 10, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                {React.cloneElement(Icons.plus, { style: { width: 16, height: 16 } })}
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="profile-menu">
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.7px', padding: '16px 0 8px' }}>Ilova</div>

        {!isInstalled && (installPrompt || isIOS) && (
          <MenuItem icon={Icons.download} title="Ilovani o'rnatish" sub="Telefon ekraniga qo'shish" action={handleInstall}
            right={<div style={{ background: 'var(--green)', color: 'white', borderRadius: 8, padding: '4px 10px', fontSize: 12, fontWeight: 700 }}>O'rnatish</div>} />
        )}

        <MenuItem icon={Icons.bell} title="Bildirishnomalar" sub={notifPerm === 'granted' ? 'Yoqilgan' : "O'chirilgan"} action={handleNotif}
          right={<Toggle value={notifPerm === 'granted'} />} />

        <MenuItem icon={darkMode ? Icons.sun : Icons.moon} title={darkMode ? 'Kunduzgi rejim' : 'Tungi rejim'}
          sub={darkMode ? "Qorong'u" : "Yorug'"} action={onToggleDark} right={<Toggle value={darkMode} />} />

        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.7px', padding: '16px 0 8px' }}>Kafe</div>

        <MenuItem icon={Icons.clock} title="Ish vaqti" sub="Har kuni, doim ochiq"
          right={<div style={{ fontSize: 12, fontWeight: 800, color: 'var(--green)', background: 'var(--green-soft)', padding: '4px 10px', borderRadius: 8, border: '1px solid rgba(26,92,58,0.15)' }}>24/7</div>} />

        <MenuItem icon={Icons.mapPin} title="Manzil" sub="Ko'kcha darvoza 340a, Toshkent"
          action={() => window.open('https://maps.google.com/?q=41.3224858,69.2091613', '_blank')} />

        <MenuItem icon={Icons.phone} title="Aloqa" sub={settings?.phone || '+998 93 272 2222'}
          action={() => window.open(`tel:${(settings?.phone || '+998932722222').replace(/\s/g, '')}`)} />

        <MenuItem icon={Icons.instagram} title="Instagram" sub="@rahmatchef.uz"
          action={() => window.open('https://www.instagram.com/rahmatchef.uz', '_blank')} />

        <MenuItem icon={Icons.send} title="Telegram kanal" sub="@rahmatchef"
          action={() => window.open('https://t.me/rahmatchef', '_blank')} />
        <MenuItem icon={Icons.send} title="Telegram bot" sub="@Rahmatchef_delivery_bot"
          action={() => window.open('https://t.me/Rahmatchef_delivery_bot', '_blank')} />

        <div style={{ height: 8 }} />
        <MenuItem icon={Icons.logout} title="Chiqish" action={onLogout} danger right={null} />
      </div>

      <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text3)', fontSize: 12 }}>
        © 2026 Rahmat Chef · v2.0
      </div>
    </div>
  );
}
