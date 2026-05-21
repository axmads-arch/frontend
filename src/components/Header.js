import React, { useState } from 'react';
import { LOGO_URL } from '../data/products';

export default function Header({ delivery, onDeliveryChange, onSearch }) {
  const [ddOpen, setDdOpen] = useState(false);

  const pick = val => { onDeliveryChange(val); setDdOpen(false); };

  return (
    <div className="header">
      <div className="hdr-top">
        <div className="brand">
          <div className="brand-logo">
            <img src={LOGO_URL} alt="Rahmat Chef" onError={e => { e.target.style.display = 'none'; }} />
          </div>
          <div className="brand-info">
            <span className="brand-name">Rahmat Chef</span>
            <span className="brand-sub">sweet pastry</span>
          </div>
        </div>
        <div className="hdr-icons">
          <button className="hdr-btn" onClick={onSearch}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
          <button className="hdr-btn">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="dlv-row">
        <div className="dlv-left">
          <span className="dlv-label">Доставка</span>
          <span className="dlv-addr" onClick={() => setDdOpen(v => !v)}>
            Определение адреса...
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </span>
        </div>

        <button className="dlv-toggle" onClick={() => setDdOpen(v => !v)}>
          {delivery}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d={ddOpen ? 'm6 15 6-6 6 6' : 'm6 9 6 6 6-6'}/>
          </svg>
        </button>

        {ddOpen && (
          <>
            <div style={{ position:'fixed', inset:0, zIndex:98 }} onClick={() => setDdOpen(false)} />
            <div className="dlv-dropdown">
              {['Доставка', 'Самовывоз'].map(v => (
                <div key={v} className="dd-item" onClick={() => pick(v)}>
                  {v}
                  {delivery === v && (
                    <div className="dd-check">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                        <path d="M20 6 9 17l-5-5"/>
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
