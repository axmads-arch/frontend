// src/pages/Profile.tsx
import React, { useState, useEffect } from 'react';
import type { Product, Settings, User } from '../types';

const Ms: React.FC<{ icon: string; size?: number; fill?: 0 | 1; color?: string; style?: React.CSSProperties }> =
  ({ icon, size = 20, fill = 1, color = 'currentColor', style = {} }) => (
    <span style={{
      fontFamily: 'Material Symbols Rounded',
      fontVariationSettings: `'FILL' ${fill}, 'wght' 400, 'GRAD' 0, 'opsz' ${size}`,
      fontSize: size, lineHeight: 1, display: 'inline-block',
      userSelect: 'none', color, ...style,
    }}>{icon}</span>
  );

function Toggle({ value }: { value: boolean }) {
  return (
    <div style={{ width: 42, height: 24, borderRadius: 12, background: value ? 'var(--green)' : 'var(--border)', position: 'relative', transition: '.3s', flexShrink: 0 }}>
      <div style={{ width: 18, height: 18, borderRadius: 9, background: 'white', position: 'absolute', top: 3, left: value ? 21 : 3, transition: '.3s', boxShadow: '0 1px 4px rgba(0,0,0,.2)' }} />
    </div>
  );
}

interface MenuItemProps {
  icon: string;
  title: string;
  sub?: string;
  action?: () => void;
  right?: React.ReactNode;
  danger?: boolean;
}
function MenuItem({ icon, title, sub, action, right, danger }: MenuItemProps) {
  return (
    <div className="profile-item" onClick={action}>
      <div className="profile-item-icon" style={danger ? { background: '#fef2f2', borderColor: '#fecaca' } : {}}>
        <Ms icon={icon} size={18} fill={1} color={danger ? '#d93025' : 'var(--text2)'} />
      </div>
      <div className="profile-item-text">
        <div className="profile-item-title" style={danger ? { color: '#d93025' } : {}}>{title}</div>
        {sub && <div className="profile-item-sub">{sub}</div>}
      </div>
      {right !== undefined ? right : <div className="profile-item-arrow"><Ms icon="chevron_right" size={18} fill={0} color="var(--text3)" /></div>}
    </div>
  );
}

interface ProfileProps {
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
  settings: Settings;
  favorites: number[];
  products: Product[];
  onAdd: (product: Product) => void;
  fmt: (n: number) => string;
  darkMode: boolean;
  onToggleDark: () => void;
}

// beforeinstallprompt hodisasi rasmiy TS tiplariga ega emas — shu sabab bu yerda e'lon qilamiz
interface BeforeInstallPromptEvent extends Event {
  prompt: () => void;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function Profile({ user, onLogin, onLogout, settings, favorites, products, onAdd, fmt, darkMode, onToggleDark }: ProfileProps) {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [notifPerm, setNotifPerm] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );

  useEffect(() => {
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    setIsIOS(ios);
    if ((window.navigator as any).standalone) setIsInstalled(true);
    const handler = (e: Event) => { e.preventDefault(); setInstallPrompt(e as BeforeInstallPromptEvent); };
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
    if (result === 'granted') new Notification('Rahmat Chef', { body: 'Bildirishnomalar yoqildi!' });
  };

  const favProducts = favorites && products ? products.filter(p => favorites.includes(p.id)) : [];
  const initials = user ? (user.name || user.phone || '?').slice(0, 2).toUpperCase() : '?';

  const IOSGuide = () => (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300, display: 'flex', alignItems: 'flex-end' }} onClick={() => setShowIOSGuide(false)}>
      <div style={{ background: 'var(--white)', borderRadius: '24px 24px 0 0', padding: '24px 20px 44px', width: '100%' }} onClick={e => e.stopPropagation()}>
        <div style={{ width: 36, height: 4, background: 'var(--border)', borderRadius: 2, margin: '0 auto 20px' }} />
        <div style={{ fontSize: 20, fontWeight: 900, marginBottom: 20 }}>Ilovani o'rnatish</div>
        {['Pastdagi share tugmasini bosing', '"Add to Home Screen" ni tanlang', '"Add" tugmasini bosing'].map((t, i) => (
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
          <div className="profile-avatar" style={{ margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Ms icon="person" size={32} fill={1} color="var(--green)" />
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
              <Ms icon="download" size={18} fill={1} color="var(--green)" /> Ilovani o'rnatish
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
              {p.image ? (
                <img src={p.image} alt={p.name} style={{ width: 50, height: 50, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} />
              ) : (
                <div style={{ width: 50, height: 50, borderRadius: 12, background: 'var(--cream2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>🍰</div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 2 }}>{fmt(p.price)}</div>
              </div>
              <button onClick={() => onAdd(p)} style={{ background: 'var(--green)', border: 'none', borderRadius: 10, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                <Ms icon="add" size={18} fill={1} color="white" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="profile-menu">
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.7px', padding: '16px 0 8px' }}>Ilova</div>

        {!isInstalled && (installPrompt || isIOS) && (
          <MenuItem
            icon="download" title="Ilovani o'rnatish" sub="Telefon ekraniga qo'shish" action={handleInstall}
            right={<div style={{ background: 'var(--green)', color: 'white', borderRadius: 8, padding: '4px 10px', fontSize: 12, fontWeight: 700 }}>O'rnatish</div>}
          />
        )}

        <MenuItem icon="notifications" title="Bildirishnomalar" sub={notifPerm === 'granted' ? 'Yoqilgan' : "O'chirilgan"} action={handleNotif} right={<Toggle value={notifPerm === 'granted'} />} />
        <MenuItem icon={darkMode ? 'light_mode' : 'dark_mode'} title={darkMode ? 'Kunduzgi rejim' : 'Tungi rejim'} sub={darkMode ? "Qorong'u" : "Yorug'"} action={onToggleDark} right={<Toggle value={darkMode} />} />

        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.7px', padding: '16px 0 8px' }}>Kafe</div>

        <MenuItem icon="schedule" title="Ish vaqti" sub="Har kuni, doim ochiq"
          right={<div style={{ fontSize: 12, fontWeight: 800, color: 'var(--green)', background: 'var(--green-soft)', padding: '4px 10px', borderRadius: 8 }}>24/7</div>} />
        <MenuItem icon="location_on" title="Manzil" sub="Ko'kcha darvoza 340a, Toshkent" action={() => window.open('https://maps.google.com/?q=41.3224858,69.2091613', '_blank')} />
        <MenuItem icon="call" title="Aloqa" sub={settings?.phone || '+998 93 272 2222'} action={() => window.open(`tel:${(settings?.phone || '+998932722222').replace(/\s/g, '')}`)} />
        <MenuItem icon="photo_camera" title="Instagram" sub="@rahmatchef.uz" action={() => window.open('https://www.instagram.com/rahmatchef.uz', '_blank')} />
        <MenuItem icon="send" title="Telegram kanal" sub="@rahmatchef" action={() => window.open('https://t.me/rahmatchef', '_blank')} />
        <MenuItem icon="smart_toy" title="Telegram bot" sub="@Rahmatchef_delivery_bot" action={() => window.open('https://t.me/Rahmatchef_delivery_bot', '_blank')} />

        <div style={{ height: 8 }} />
        <MenuItem icon="logout" title="Chiqish" action={onLogout} danger right={null} />
      </div>

      <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text3)', fontSize: 12 }}>© 2026 Rahmat Chef · v2.0</div>
    </div>
  );
}
