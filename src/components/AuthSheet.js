import React, { useState, useRef } from 'react';

const GoogleSVG = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function AuthSheet({ onClose, onVerify }) {
  const [step,  setStep]  = useState('phone');
  const [phone, setPhone] = useState('');
  const [otp,   setOtp]   = useState(['','','','']);
  const [error, setError] = useState('');
  const otpRefs = [useRef(), useRef(), useRef(), useRef()];

  const handlePhone = () => {
    if (phone.replace(/\D/g,'').length < 9) {
      setError('Введите корректный номер телефона');
      return;
    }
    setError('');
    setStep('otp');
    setTimeout(() => otpRefs[0].current?.focus(), 100);
  };

  const handleOtpChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 3) otpRefs[i+1].current?.focus();
  };

  const handleOtpKey = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      otpRefs[i-1].current?.focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join('');
    if (code.length < 4) { setError('Введите 4-значный код'); return; }
    setError('');
    onVerify('Ahmad', '+998 ' + phone);
  };

  return (
    <div className="overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="sheet">
        <div className="sheet-handle" />

        {step === 'phone' ? (
          <>
            <div className="auth-close-row">
              <button className="sheet-close" onClick={onClose}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div className="auth-title">Войти</div>
            <div className="auth-field-label">Номер телефона</div>
            <div className="phone-wrap">
              <span className="phone-prefix">+998</span>
              <input
                className="phone-input"
                type="tel"
                placeholder="__ ___ __ __"
                value={phone}
                maxLength={12}
                onChange={e => { setPhone(e.target.value); setError(''); }}
                onKeyDown={e => { if (e.key === 'Enter') handlePhone(); }}
                autoFocus
              />
            </div>
            {error && <p style={{color:'#e53935',fontSize:'12px',marginBottom:'10px'}}>{error}</p>}
            <div className="auth-terms">
              Авторизуясь на сайте, вы соглашаетесь с{' '}
              <a href="#terms">Условиями использования</a>
            </div>
            <button className="auth-main-btn" onClick={handlePhone}>Продолжить</button>
            <div className="auth-divider">или</div>
            <button className="google-btn"><GoogleSVG /> Google orqali kirish</button>
          </>
        ) : (
          <>
            <div className="auth-close-row">
              <button className="sheet-close" onClick={() => { setStep('phone'); setOtp(['','','','']); setError(''); }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M19 12H5M12 5l-7 7 7 7"/>
                </svg>
              </button>
            </div>
            <div className="auth-title">Код из SMS</div>
            <p className="otp-subtitle">Код отправлен на +998 {phone}</p>
            <div className="otp-row">
              {otp.map((v, i) => (
                <input
                  key={i}
                  ref={otpRefs[i]}
                  className="otp-box"
                  type="tel"
                  maxLength={1}
                  value={v}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  onKeyDown={e => handleOtpKey(i, e)}
                />
              ))}
            </div>
            {error && <p style={{color:'#e53935',fontSize:'12px',marginBottom:'10px'}}>{error}</p>}
            <button className="auth-main-btn" onClick={handleVerify}>Подтвердить</button>
          </>
        )}
      </div>
    </div>
  );
}
