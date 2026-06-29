import React, { useState } from 'react';


const ICONS = { 'Cheesecake':'🍰','Medovik':'🍯','Tort':'🎂','Kofe':'☕','Choy':'🍵','Ichimlik':'🥤' };

export default function ProductDetail({ product, cart, onAdd, onRemove, onClose, isFav, onToggleFav, fmt }) {
  const cartItem = cart.find(i => i.id === product.id);
  const qty = cartItem ? cartItem.qty : 0;

  const handleAdd = () => { onAdd(product); };
  const handleRemove = () => { onRemove(product.id); };

  return (
    <div className="detail-overlay">
      <div className="detail-backdrop" onClick={onClose} />
      <div className="detail-sheet">
        {/* Rasm */}
        <div style={{ position: 'relative' }}>
          {product.image ? (
            <img className="detail-img" src={product.image} alt={product.name} onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
          ) : null}
          <div className="detail-img-placeholder" style={{ display: product.image ? 'none' : 'flex' }}>
            {ICONS[product.category] || '🍰'}
          </div>
          <button className="detail-close" onClick={onClose}>✕</button>
          <button className="detail-fav" onClick={onToggleFav}>{isFav ? '❤️' : '🤍'}</button>
        </div>

        {/* Kontent */}
        <div className="detail-content">
          <div className="detail-handle" />
          <div className="detail-category">{product.category}</div>
          <div className="detail-name">{product.name}</div>
          {product.description && (
            <div className="detail-desc">{product.description}</div>
          )}
          <div className="detail-price">{fmt(product.price)}</div>

          {/* Stok */}
          {product.stock !== null && product.stock !== undefined && (
            <div style={{
              fontSize: 12, fontWeight: 600, marginBottom: 16,
              color: product.stock === 0 ? 'var(--red)' : product.stock <= 5 ? 'var(--orange)' : 'var(--teal)',
              background: product.stock === 0 ? '#fee2e2' : product.stock <= 5 ? '#fff3cd' : 'var(--teal-light)',
              padding: '6px 12px', borderRadius: 8, display: 'inline-block'
            }}>
              📦 {product.stock === 0 ? 'Tugagan' : `${product.stock} ta qoldi`}
            </div>
          )}

          {/* Miqdor va qo'shish */}
          <div className="detail-actions">
            {qty > 0 ? (
              <>
                <div className="detail-qty">
                  <button className="detail-qty-btn" onClick={handleRemove}>−</button>
                  <span className="detail-qty-num">{qty}</span>
                  <button className="detail-qty-btn" onClick={handleAdd} disabled={product.stock !== null && product.stock !== undefined && qty >= product.stock}>+</button>
                </div>
                <button className="detail-add-btn" onClick={onClose}>
                  Savatchaga ✓
                </button>
              </>
            ) : (
              <button
                className="detail-add-btn"
                onClick={handleAdd}
                disabled={product.stock === 0}
                style={{ opacity: product.stock === 0 ? 0.5 : 1 }}
              >
                {product.stock === 0 ? 'Tugagan' : 'Savatchaga qo\'shish'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
