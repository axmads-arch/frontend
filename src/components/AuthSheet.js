import React, { useState } from 'react';
import { API_URL, saveUser } from '../data/api';

export default function AuthSheet({ onClose, onSuccess }) {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    const clean = phone.replace(/\D/g, '');
    if (!name.trim()) { setError('Ismingizni kiriting'); return; }
    if (clean.length < 9) { setError("To'g'ri raqam kiriting"); return; }
    setLoading(true); setError('');
    try {
      const r = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: '+998' + clean, name: name.trim() }),
      });
      const d = await r.json();
      if (d.token) {
        const user = { phone: '+998' + clean, name: name.trim(), token: d.token };
        saveUser(user);
        localStorage.setItem('rc_token', d.token);
        onSuccess(user);
      } else {
        setError(d.error || 'Xatolik yuz berdi');
      }
    } catch { setError('Server bilan bog\'lanishda xatolik'); }
    setLoading(false);
  };

  const inpStyle = {
    width: '100%', padding: '13px 14px',
    border: '1.5px solid var(--border)', borderRadius: 14,
    fontSize: 15, outline: 'none', fontFamily: 'inherit',
    background: 'var(--cream)', color: 'var(--text)', fontWeight: 500,
  };

  return (
    <div className="sheet-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="sheet">
        <div className="sheet-handle" />
        <div className="sheet-title">Kirish</div>
        <div className="sheet-sub">Buyurtma berish uchun ma'lumotlaringizni kiriting</div>

        {/* ISM */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 6 }}>
            Ismingiz
          </label>
          <input
            style={inpStyle}
            type="text"
            placeholder="Ismingiz"
            value={name}
            onChange={e => setName(e.target.value)}
            onFocus={e => e.target.style.borderColor = 'var(--green)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
        </div>

        {/* TELEFON */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 6 }}>
            Telefon raqam
          </label>
          <div className="phone-input-wrap">
            <span className="phone-prefix">🇺🇿 +998</span>
            <input
              className="phone-input"
              type="tel"
              placeholder="90 123 45 67"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              maxLength={12}
            />
          </div>
        </div>

        {error && (
          <div style={{ color: 'var(--red)', fontSize: 13, marginBottom: 12, fontWeight: 500 }}>
            {error}
          </div>
        )}

        <button className="sheet-btn" onClick={handleLogin} disabled={loading}>
          {loading ? 'Yuklanmoqda...' : 'Kirish →'}
        </button>

        <div style={{ textAlign: 'center', marginTop: 14, fontSize: 12, color: 'var(--text3)', lineHeight: 1.5 }}>
          Kirish orqali siz bizning shartlarimizga rozilik bildirasiz
        </div>
      </div>
    </div>
  );
}
