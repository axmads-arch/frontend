import React, { useState, useRef } from 'react';
import { sendOtp, verifyOtp, saveUser } from '../data/api';

const BOT_URL = 'https://t.me/rahmatchef_bot';

export default function AuthSheet({ onClose, onSuccess }) {
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const otpRefs = [useRef(), useRef(), useRef(), useRef()];

  const handlePhone = async () => {
    const clean = phone.replace(/\D/g, '');
    if (!name.trim()) { setError('Ismingizni kiriting'); return; }
    if (clean.length < 9) { setError("To'g'ri raqam kiriting"); return; }
    setLoading(true); setError('');
    try {
      const result = await sendOtp('+998' + clean);
      if (result.method === 'bot_required') setStep('bot_required');
      else setStep('otp');
    } catch { setError('Xatolik yuz berdi'); }
    setLoading(false);
  };

  const handleOtp = async () => {
    const code = otp.join('');
    if (code.length < 4) { setError("Kodni to'liq kiriting"); return; }
    setLoading(true); setError('');
    try {
      const result = await verifyOtp('+998' + phone.replace(/\D/g, ''), code);
      if (result.token) {
        const user = { phone: '+998' + phone.replace(/\D/g, ''), name: name.trim(), token: result.token };
        saveUser(user);
        localStorage.setItem('rc_token', result.token);
        onSuccess(user);
      } else setError(result.error || "Noto'g'ri kod");
    } catch { setError('Xatolik yuz berdi'); }
    setLoading(false);
  };

  const handleOtpChange = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    const n = [...otp]; n[i] = val.slice(-1); setOtp(n);
    if (val && i < 3) otpRefs[i+1].current?.focus();
    if (!val && i > 0) otpRefs[i-1].current?.focus();
  };

  const handleBotDone = async () => {
    setLoading(true); setError('');
    try {
      const r = await sendOtp('+998' + phone.replace(/\D/g, ''));
      if (r.method === 'telegram') setStep('otp');
      else setError("Telegram botda telefon raqamingizni yuboring");
    } catch { setError('Xatolik'); }
    setLoading(false);
  };

  const inpStyle = { width: '100%', padding: '13px 14px', border: '1.5px solid var(--border)', borderRadius: 14, fontSize: 15, outline: 'none', fontFamily: 'inherit', background: 'var(--cream)', color: 'var(--text)', fontWeight: 500 };
  const lbl = { display: 'block', fontSize: 11, fontWeight: 700, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 6 };

  return (
    <div className="sheet-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="sheet">
        <div className="sheet-handle" />

        {step === 'phone' && (<>
          <div className="sheet-title">Kirish</div>
          <div className="sheet-sub">Ma'lumotlaringizni kiriting</div>
          <div style={{ marginBottom: 12 }}>
            <label style={lbl}>Ismingiz</label>
            <input style={inpStyle} type="text" placeholder="Ismingiz" value={name} onChange={e => setName(e.target.value)}
              onFocus={e => e.target.style.borderColor='var(--green)'} onBlur={e => e.target.style.borderColor='var(--border)'} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={lbl}>Telefon raqam</label>
            <div className="phone-input-wrap">
              <span className="phone-prefix">🇺🇿 +998</span>
              <input className="phone-input" type="tel" placeholder="90 123 45 67" value={phone}
                onChange={e => setPhone(e.target.value)} onKeyDown={e => e.key==='Enter' && handlePhone()} maxLength={12} />
            </div>
          </div>
          {error && <div style={{ color:'var(--red)', fontSize:13, marginBottom:10 }}>{error}</div>}
          <button className="sheet-btn" onClick={handlePhone} disabled={loading}>
            {loading ? 'Yuklanmoqda...' : 'Kod olish →'}
          </button>
        </>)}

        {step === 'bot_required' && (<>
          <div className="sheet-title">Telegram kerak</div>
          <div className="sheet-sub">Kod olish uchun botga telefon raqamingizni yuboring</div>
          {[
            'Quyidagi tugmani bosing — Telegram ochiladi',
            "Botda /start ni bosing",
            `Telefon raqamingizni yuboring: +998${phone.replace(/\D/g,'')}`,
            'Yuborildi deganda "Tayyor" tugmasini bosing',
          ].map((t,i) => (
            <div key={i} style={{ display:'flex', gap:12, marginBottom:12, alignItems:'flex-start' }}>
              <div style={{ width:28, height:28, borderRadius:8, background:'var(--green)', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:800, flexShrink:0 }}>{i+1}</div>
              <div style={{ fontSize:14, paddingTop:4, lineHeight:1.4 }}>{t}</div>
            </div>
          ))}
          <a href={BOT_URL} target="_blank" rel="noreferrer"
            style={{ display:'block', background:'#229ED9', color:'white', borderRadius:14, padding:14, fontSize:15, fontWeight:700, textDecoration:'none', textAlign:'center', marginBottom:10 }}>
            Telegram botni ochish →
          </a>
          {error && <div style={{ color:'var(--red)', fontSize:13, marginBottom:8 }}>{error}</div>}
          <button className="sheet-btn" onClick={handleBotDone} disabled={loading} style={{ marginBottom:10 }}>
            {loading ? 'Tekshirilmoqda...' : '✓ Telefon yubordim, kod ol'}
          </button>
          <button onClick={() => setStep('phone')} style={{ width:'100%', background:'none', border:'none', color:'var(--text2)', cursor:'pointer', fontSize:14, fontFamily:'inherit' }}>← Orqaga</button>
        </>)}

        {step === 'otp' && (<>
          <div className="sheet-title">Telegram kodi</div>
          <div className="sheet-sub">Telegram botdan kelgan 4 raqamli kodni kiriting</div>
          <div style={{ textAlign:'center', marginBottom:20 }}>
            <div style={{ width:56, height:56, borderRadius:16, background:'#229ED9', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 8px', fontSize:28 }}>✈️</div>
            <div style={{ fontSize:12, color:'var(--text3)' }}>+998{phone.replace(/\D/g,'')}</div>
          </div>
          <div className="otp-inputs">
            {otp.map((v,i) => (
              <input key={i} ref={otpRefs[i]} className="otp-input" type="tel" maxLength={1} value={v}
                onChange={e => handleOtpChange(i, e.target.value)}
                onKeyDown={e => { if(e.key==='Backspace'&&!v&&i>0)otpRefs[i-1].current?.focus(); if(e.key==='Enter')handleOtp(); }}
                autoFocus={i===0} />
            ))}
          </div>
          {error && <div style={{ color:'var(--red)', fontSize:13, marginBottom:10, textAlign:'center' }}>{error}</div>}
          <button className="sheet-btn" onClick={handleOtp} disabled={loading} style={{ marginBottom:10 }}>
            {loading ? 'Tekshirilmoqda...' : 'Tasdiqlash'}
          </button>
          <button onClick={() => { setStep('phone'); setOtp(['','','','']); setError(''); }}
            style={{ width:'100%', background:'none', border:'none', color:'var(--text2)', cursor:'pointer', fontSize:14, fontFamily:'inherit' }}>← Orqaga</button>
        </>)}
      </div>
    </div>
  );
}
