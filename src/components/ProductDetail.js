import React, { useState, useEffect } from 'react';
import { API_URL } from '../data/api';

const Icons = {
  close: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  heart: <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  heartFill: <svg viewBox="0 0 24 24" fill="#ff4757" stroke="#ff4757" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  plus: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  minus: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  star: (filled) => <svg viewBox="0 0 24 24" fill={filled ? '#f59f00' : 'none'} stroke={filled ? '#f59f00' : '#d1cdc7'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
};

function StarRating({ value, onChange, size = 28 }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1,2,3,4,5].map(i => (
        <div
          key={i}
          style={{ width: size, height: size, cursor: onChange ? 'pointer' : 'default', transition: 'transform .15s' }}
          onMouseEnter={() => onChange && setHover(i)}
          onMouseLeave={() => onChange && setHover(0)}
          onClick={() => onChange && onChange(i)}
        >
          {Icons.star(i <= (hover || value))}
        </div>
      ))}
    </div>
  );
}

export default function ProductDetail({ product, cart, onAdd, onRemove, onClose, isFav, onToggleFav, fmt, user }) {
  const cartItem = cart.find(i => i.id === product.id);
  const qty = cartItem ? cartItem.qty : 0;
  const [ratings, setRatings] = useState([]);
  const [avg, setAvg] = useState(0);
  const [rCount, setRCount] = useState(0);
  const [myStars, setMyStars] = useState(0);
  const [myComment, setMyComment] = useState('');
  const [rLoading, setRLoading] = useState(false);
  const [rError, setRError] = useState('');
  const [rSuccess, setRSuccess] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/rating/${product.id}`)
      .then(r => r.json())
      .then(d => { setRatings(d.ratings || []); setAvg(d.avg || 0); setRCount(d.count || 0); })
      .catch(() => {});
  }, [product.id, rSuccess]);

  const submitRating = async () => {
    if (!user) { setRError('Baho berish uchun tizimga kiring'); return; }
    if (!myStars) { setRError('Yulduz tanlang'); return; }
    setRLoading(true); setRError('');
    try {
      const r = await fetch(`${API_URL}/rating`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, customerPhone: user.phone, stars: myStars, comment: myComment }),
      });
      const d = await r.json();
      if (d.error) setRError(d.error);
      else { setRSuccess(true); setMyStars(0); setMyComment(''); }
    } catch { setRError('Xatolik yuz berdi'); }
    setRLoading(false);
  };

  return (
    <div className="detail-overlay">
      <div className="detail-backdrop" onClick={onClose} />
      <div className="detail-sheet">
        <div style={{ position: 'relative' }}>
          {product.image
            ? <img className="detail-img" src={product.image} alt={product.name} onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
            : null}
          <div className="detail-img-placeholder" style={{ display: product.image ? 'none' : 'flex' }}>🍰</div>
          <button className="detail-close" onClick={onClose}>{Icons.close}</button>
          <button className="detail-fav-btn" onClick={onToggleFav}>{isFav ? Icons.heartFill : Icons.heart}</button>
        </div>

        <div className="detail-content">
          <div className="detail-handle" />
          <div className="detail-cat">{product.category}</div>
          <div className="detail-name">{product.name}</div>

          {rCount > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <StarRating value={Math.round(avg)} size={16} />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#f59f00' }}>{avg}</span>
              <span style={{ fontSize: 12, color: 'var(--text3)' }}>({rCount} ta baho)</span>
            </div>
          )}

          {product.description && <div className="detail-desc">{product.description}</div>}
          <div className="detail-price">{fmt(product.price)}</div>

          {product.stock !== null && product.stock !== undefined && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              fontSize: 12, fontWeight: 700, marginBottom: 18,
              color: product.stock === 0 ? 'var(--red)' : product.stock <= 5 ? '#d97706' : 'var(--green)',
              background: product.stock === 0 ? '#fef2f2' : product.stock <= 5 ? '#fffbeb' : 'var(--green-soft)',
              padding: '5px 11px', borderRadius: 8,
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>
              {product.stock === 0 ? 'Tugagan' : `${product.stock} ta qoldi`}
            </div>
          )}

          <div className="detail-actions" style={{ marginBottom: 24 }}>
            {qty > 0 ? (
              <>
                <div className="detail-qty">
                  <button className="detail-qty-btn" onClick={() => onRemove(product.id)}>{Icons.minus}</button>
                  <span className="detail-qty-num">{qty}</span>
                  <button className="detail-qty-btn" onClick={() => onAdd(product)} disabled={product.stock !== null && product.stock !== undefined && qty >= product.stock}>{Icons.plus}</button>
                </div>
                <button className="detail-add-btn" onClick={onClose}>Savatchaga ✓</button>
              </>
            ) : (
              <button className="detail-add-btn" style={{ opacity: product.stock === 0 ? 0.5 : 1 }} onClick={() => onAdd(product)} disabled={product.stock === 0}>
                {product.stock === 0 ? 'Tugagan' : 'Savatchaga qo\'shish'}
              </button>
            )}
          </div>

          {/* BAHO */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
            <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.3px', marginBottom: 14 }}>Baho berish</div>
            {rSuccess ? (
              <div style={{ background: 'var(--green-soft)', borderRadius: 12, padding: '14px 16px', textAlign: 'center', color: 'var(--green)', fontWeight: 700 }}>
                ✓ Bahoyingiz qabul qilindi!
              </div>
            ) : (
              <>
                <StarRating value={myStars} onChange={setMyStars} size={30} />
                <textarea
                  style={{ width: '100%', padding: '11px 13px', border: '1.5px solid var(--border)', borderRadius: 12, fontSize: 14, fontFamily: 'inherit', outline: 'none', resize: 'none', minHeight: 76, background: 'var(--cream)', color: 'var(--text)', marginTop: 12, marginBottom: 8 }}
                  placeholder="Izoh (ixtiyoriy)..."
                  value={myComment}
                  onChange={e => setMyComment(e.target.value)}
                />
                {rError && <div style={{ color: 'var(--red)', fontSize: 12, marginBottom: 8, fontWeight: 600 }}>{rError}</div>}
                <button
                  onClick={submitRating}
                  disabled={rLoading || !myStars}
                  style={{ width: '100%', background: myStars ? 'var(--green)' : 'var(--border)', color: myStars ? 'white' : 'var(--text3)', border: 'none', borderRadius: 12, padding: 13, fontSize: 14, fontWeight: 700, cursor: myStars ? 'pointer' : 'not-allowed', fontFamily: 'inherit' }}
                >{rLoading ? 'Yuklanmoqda...' : 'Baho berish'}</button>
              </>
            )}
          </div>

          {ratings.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 12, letterSpacing: '-0.2px' }}>Izohlar</div>
              {ratings.slice(0, 5).map(r => (
                <div key={r.id} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                    <StarRating value={r.stars} size={13} />
                    <span style={{ fontSize: 11, color: 'var(--text3)' }}>{new Date(r.createdAt).toLocaleDateString('uz-UZ')}</span>
                  </div>
                  {r.comment && <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.5 }}>{r.comment}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
