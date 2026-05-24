import React from 'react';
import { MENU_ITEMS } from '../data/products';

export default function ProfilePage({ user, onLogin, onLogout }) {
  if (!user) {
    return (
      <div className="page">
        <div className="page-header">
          <div style={{ width: 36 }} />
          <span className="page-title">Профиль</span>
          <div style={{ width: 36 }} />
        </div>
        <div className="empty-state" style={{ paddingTop: 80 }}>
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="1.5">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <h3>Вы не вошли</h3>
          <p>Войдите, чтобы видеть профиль и историю заказов</p>
          <button className="empty-btn" onClick={onLogin}>Войти</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="profile-top">
        <div className="profile-header">
          <div>
            <div className="profile-name">{user.name}</div>
            <div className="profile-phone">{user.phone}</div>
          </div>
          <div className="profile-actions">
            <button className="profile-icon-btn" title="Редактировать">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button className="profile-icon-btn" title="Выйти" onClick={onLogout}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="menu-separator" />

      {MENU_ITEMS.map((item, i) => (
        <div key={i} className="menu-item">
          <span className="menu-item-icon">{item.icon}</span>
          <span className="menu-item-label">{item.label}</span>
          <svg className="menu-item-arrow" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </div>
      ))}

      <div className="powered-by">Powered by <b>Delever</b></div>
    </div>
  );
}
