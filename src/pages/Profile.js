import React, { useState } from 'react';

export default function Profile({ setPage, API }) {
  const [phone, setPhone] = useState(localStorage.getItem('userPhone') || '');
  const [name, setName] = useState(localStorage.getItem('userName') || '');
  const [saved, setSaved] = useState(!!localStorage.getItem('userPhone'));
  const [editing, setEditing] = useState(false);

  function saveProfile() {
    if (!phone || !name) return alert('Ism va telefon kiriting!');
    localStorage.setItem('userPhone', phone);
    localStorage.setItem('userName', name);
    setSaved(true);
    setEditing(false);
  }

  function logout() {
    localStorage.removeItem('userPhone');
    localStorage.removeItem('userName');
    localStorage.removeItem('userAddress');
    setPhone('');
    setName('');
    setSaved(false);
    setEditing(false);
  }

  return (
    <div>
      <div className="page-header">
        <h2>Profil</h2>
      </div>

      {saved && !editing ? (
        <div>
          <div className="profile-header">
            <div className="profile-avatar">👤</div>
            <div>
              <div className="profile-name">{name}</div>
              <div className="profile-phone">{phone}</div>
            </div>
            <div className="profile-actions">
              <button className="icon-btn" onClick={() => setEditing(true)}>✏️</button>
              <button className="icon-btn" onClick={logout}>🚪</button>
            </div>
          </div>

          <div className="page">
            <div className="profile-menu">
              <div className="profile-menu-item" onClick={() => setPage('orders')}>
                <span className="profile-menu-icon">📋</span>
                <span className="profile-menu-text">Buyurtmalarim</span>
                <span className="profile-menu-arrow">›</span>
              </div>
              <div className="profile-menu-item" onClick={() => window.open('tel:+998932722222')}>
                <span className="profile-menu-icon">📞</span>
                <span className="profile-menu-text">Kontaktlar</span>
                <span className="profile-menu-arrow">›</span>
              </div>
              <div className="profile-menu-item" onClick={() => window.open('https://yandex.uz/maps/org/30742793394/')}>
                <span className="profile-menu-icon">📍</span>
                <span className="profile-menu-text">Filiallar</span>
                <span className="profile-menu-arrow">›</span>
              </div>
              <div className="profile-menu-item">
                <span className="profile-menu-icon">ℹ️</span>
                <span className="profile-menu-text">Biz haqimizda</span>
                <span className="profile-menu-arrow">›</span>
              </div>
            </div>

            <div style={{background:'#fff',borderRadius:'16px',padding:'16px',boxShadow:'0 1px 4px rgba(0,0,0,0.06)',marginBottom:'16px'}}>
              <div style={{fontWeight:800,fontSize:'0.9rem',marginBottom:'10px'}}>🏪 Rahmat Chef</div>
              <div style={{fontSize:'0.82rem',color:'#666',lineHeight:1.6}}>
                📍 Toshkent, Ko'kcha Darvoza ko'chasi, 338A<br/>
                📞 +998 93 272 22 22<br/>
                ⏰ 24/7 ishlaydi
              </div>
            </div>

            <div className="powered-by">Powered by Rahmat Chef</div>
          </div>
        </div>
      ) : (
        <div className="page">
          <div style={{textAlign:'center',padding:'30px 0 20px'}}>
            <div style={{fontSize:'4rem',marginBottom:'12px'}}>👤</div>
            <div style={{fontWeight:700,fontSize:'1rem',color:'#888'}}>
              {editing ? 'Tahrirlash' : 'Kirish'}
            </div>
          </div>

          <div style={{background:'#fff',borderRadius:'16px',padding:'16px',boxShadow:'0 1px 4px rgba(0,0,0,0.06)',marginBottom:'16px'}}>
            <div className="form-group">
              <label className="form-label">Ismingiz</label>
              <input
                className="form-input"
                type="text"
                placeholder="Ism Familiya"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div className="form-group" style={{marginBottom:0}}>
              <label className="form-label">Telefon raqam</label>
              <input
                className="form-input"
                type="tel"
                placeholder="+998 90 000 00 00"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            </div>
          </div>

          <button className="btn-primary" onClick={saveProfile}>
            Saqlash
          </button>

          {editing && (
            <button
              onClick={() => setEditing(false)}
              style={{width:'100%',marginTop:'10px',padding:'14px',borderRadius:'16px',border:'1.5px solid #eee',background:'#fff',fontFamily:'Nunito,sans-serif',fontWeight:700,fontSize:'0.95rem',cursor:'pointer',color:'#666'}}
            >
              Bekor qilish
            </button>
          )}
        </div>
      )}
    </div>
  );
}
