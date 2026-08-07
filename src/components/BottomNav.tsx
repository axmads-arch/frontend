// src/components/BottomNav.tsx
// Avval App.js ichida inline yozilgan pastki navigatsiya — endi alohida, qayta ishlatiladigan komponent.

import React from 'react';
import { NAV } from '../constants/nav';
import type { TabKey } from '../types';

interface BottomNavProps {
  activeTab: TabKey;
  cartCount: number;
  onTabChange: (tab: TabKey) => void;
}

export default function BottomNav({ activeTab, cartCount, onTabChange }: BottomNavProps) {
  return (
    <nav className="bottom-nav">
      {NAV.map(item => {
        const active = activeTab === item.key;
        return (
          <button
            key={item.key}
            className={`nav-item ${active ? 'active' : ''}`}
            onClick={() => onTabChange(item.key)}
          >
            <div style={{ position: 'relative' }}>
              {cartCount > 0 && item.key === 'cart' && (
                <span className="nav-badge">{cartCount}</span>
              )}
              <span
                className="material-symbols-rounded"
                style={{
                  fontSize: 24,
                  fontVariationSettings: `'FILL' ${active ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 24`,
                  color: active ? 'var(--green)' : 'var(--text3)',
                }}
              >
                {item.icon}
              </span>
            </div>
            <span className="nav-label">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
