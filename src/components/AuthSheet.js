import React, { useState, useRef } from 'react';
import { sendOtp, verifyOtp, saveUser } from '../data/api';

export default function AuthSheet({ onClose, onSuccess }) {
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const otpRefs = [useRef(), useRef(), useRef(), useRef()];

  const handlePhone = async () => {
    const clean = phone.replace(/\D/g, '');
    if (clean.length < 9) { setError('To\'g\'ri raqam kiriting'); return; }
    setLoading(true); setError('');
    try {
      await sendOtp('+998' + clean);
      setStep('otp');
    } catch { setError('Xatolik yuz berdi'); }
    setLoading(false);
  };

  const handleOtp = async () => {
    const code = otp.join('');
    if (code.length < 4) { setError('Kodni to\'liq kiriting'); return; }
    setLoading(true); setError('');
    try {
      const result = await verifyOtp('+998' + phone.replace(/\D/g, ''), code);
      if (result.token) {
        const user = { phone: '+998' + phone.replace(/\D/g, ''), token: result.token };
        saveUser(user);
        localStorage.setItem('rc_token', result.token);
        onSuccess(user);
      } else {
        setError(result.error || 'Noto\'g\'ri kod');
      }
    } catch { setError('Xatolik yuz berdi'); }
    setLoading(false);
  };

  const handleOtpChange = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[i] = val.slice(-1);
    setOtp(newOtp);
    if (val && i < 3) otpRefs[i + 1].current?.focus();
    if (!val && i > 0) otpRefs[i - 1].current?.focus();
  };

  return (
    <div className="sheet-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="sheet">
        <div className="sheet-handle" />
        {step === 'phone' ? (
          <>
            <div className="sheet-title">Kirish</div>
            <div className="sheet-sub">Telefon raqamingizni kiriting</div>
            <div className="phone-input-wrap">
              <span className="phone-prefix">🇺🇿 +998</span>
              <input
                className="phone-input"
                type="tel"
                placeholder="90 123 45 67"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handlePhone()}
                autoFocus
                maxLength={12}
              />
            </div>
            {error && <div style={{ color: 'var(--red)', fontSize: 13, marginBottom: 10 }}>{error}</div>}
            <button className="sheet-btn" onClick={handlePhone} disabled={loading}>
              {loading ? 'Yuklanmoqda...' : 'Kod olish'}
            </button>
          </>
        ) : (
          <>
            <div className="sheet-title">SMS kod</div>
            <div className="sheet-sub">+998{phone} raqamiga yuborildi<br />(Test: 1234)</div>
            <div className="otp-inputs">
              {otp.map((v, i) => (
                <input
                  key={i}
                  ref={otpRefs[i]}
                  className="otp-input"
                  type="tel"
                  maxLength={1}
                  value={v}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Backspace' && !v && i > 0) otpRefs[i-1].current?.focus();
                    if (e.key === 'Enter') handleOtp();
                  }}
                  autoFocus={i === 0}
                />
              ))}
            </div>
            {error && <div style={{ color: 'var(--red)', fontSize: 13, marginBottom: 10, textAlign: 'center' }}>{error}</div>}
            <button className="sheet-btn" onClick={handleOtp} disabled={loading}>
              {loading ? 'Tekshirilmoqda...' : 'Tasdiqlash'}
            </button>
            <button onClick={() => setStep('phone')} style={{ width: '100%', background: 'none', border: 'none', color: 'var(--text2)', marginTop: 12, cursor: 'pointer', fontSize: 14 }}>
              ← Orqaga
            </button>
          </>
        )}
      </div>
    </div>
  );
}
