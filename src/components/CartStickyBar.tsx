// src/components/CartStickyBar.tsx
// Bosh sahifada savatcha bo'sh bo'lmaganda pastda ko'rinadigan tez tugma.

import React from 'react';

interface CartStickyBarProps {
  cartCount: number;
  cartTotal: number;
  fmt: (n: number) => string;
  onClick: () => void;
}

export default function CartStickyBar({ cartCount, cartTotal, fmt, onClick }: CartStickyBarProps) {
  return (
    <button className="cart-sticky" onClick={onClick}>
      <div className="cart-sticky-left">
        <div className="cart-count-badge">{cartCount}</div>
        <span className="cart-sticky-text">Savatcha</span>
      </div>
      <span className="cart-sticky-price">{fmt(cartTotal)}</span>
    </button>
  );
}
