import React, { useState, useEffect } from 'react';
import { API_URL } from '../data/api';

const ICONS = { 'Cheesecake':'🍰','Medovik':'🍯','Tort':'🎂','Kofe':'☕','Choy':'🍵','Ichimlik':'🥤' };

function Stars({ value, onChange, size = 24 }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1,2,3,4,5].map(i => (
        <span
          key={i}
          style={{ fontSize: size, cursor: onChange ? 'pointer' : 'default', color: i <= (hover || value) ? '#f59f00' : '#e0e0e0' }}
          onMouseEnter={() => onChange && setHover(i)}
          onMouseLeave={() => onChange && setHover(0)}
          onClick={() => onChange && onChange(i)}
        >★</span>
      ))}
    </div>
  );
}

export default function ProductDetail({ product, cart, onAdd, onRemove, onClose, isFav, onToggleFav, fmt, user }) {
  const cartItem = cart.find(i => i.id === product.id);
  const qty = cartItem ? cartItem.qty : 0;
  const [ratings, setRatings] = useState([]);
  const [avg, setAvg] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [myStars, setMyStars] = useState(0);
  const [myComment, setMyComment] = useState('');
  const [ratingLoading, setRatingLoading] = useState(false);
  const [ratingError, setRatingError] = useState('');
  const [ratingSuccess, setRatingSuccess] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/rating/${product.id}`)
      .then(r => r.json())
      .then(d => {
        setRatings(d.ratings || []);
        setAvg(d.avg || 0);
        setRatingCount(d.count || 0);
      }).catch(() => {});
  }, [product.id, ratingSuccess]);

  const submitRating = async () => {
    if (!user) { setRatingError('Baho berish uchun tizimga kiring'); return; }
    if (!myStars) { setRatingError('Yulduz tanlang'); return; }
    setRatingLoading(true);
    setRatingError('');
    try {
      const r = await fetch(`${API_URL}/rating`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, customerPhone: user.phone, stars: myStars, comment: myComment }),
      });
      const d = await r.json();
      if (d.error) { setRatingError(d.error); }
      else { setRatingSuccess(true); setMyStars(0); setMyComment(''); }
    } catch (e) { setRatingError('Xatolik yuz berdi'); }
    setRatingLoading(false);
  };

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

          {/* Reyting ko'rsatish */}
          {ratingCount > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <Stars value={Math.round(avg)} size={18} />
              <span style={{ fontSize: 14, fontWeight: 700, color: '#f59f00' }}>{avg}</span>
              <span style={{ fontSize: 12, color: 'var(--text3)' }}>({ratingCount} ta baho)</span>
            </div>
          )}

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

          {/* Savatchaga qo'shish */}
          <div className="detail-actions" style={{ marginBottom: 24 }}>
            {qty > 0 ? (
              <>
                <div className="detail-qty">
                  <button className="detail-qty-btn" onClick={() => onRemove(product.id)}>−</button>
                  <span className="detail-qty-num">{qty}</span>
                  <button className="detail-qty-btn" onClick={() => onAdd(product)} disabled={product.stock !== null && product.stock !== undefined && qty >= product.stock}>+</button>
                </div>
                <button className="detail-add-btn" onClick={onClose}>Savatchaga ✓</button>
              </>
            ) : (
              <button className="detail-add-btn" onClick={() => onAdd(product)} disabled={product.stock === 0} style={{ opacity: product.stock === 0 ? 0.5 : 1 }}>
                {product.stock === 0 ? 'Tugagan' : 'Savatchaga qo\'shish'}
              </button>
            )}
          </div>

          {/* BAHO BERISH */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, color: 'var(--text)' }}>⭐ Baho berish</div>
            {ratingSuccess ? (
              <div style={{ background: 'var(--teal-light)', borderRadius: 12, padding: 14, textAlign: 'center', color: 'var(--teal)', fontWeight: 600 }}>
                ✅ Bahoyingiz qabul qilindi! Rahmat!
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: 10 }}>
                  <Stars value={myStars} onChange={setMyStars} size={32} />
                </div>
                <textarea
                  style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--border)', borderRadius: 10, fontSize: 14, fontFamily: 'inherit', outline: 'none', resize: 'none', minHeight: 70, background: 'var(--white)', color: 'var(--text)', marginBottom: 8 }}
                  placeholder="Izoh (ixtiyoriy)..."
                  value={myComment}
                  onChange={e => setMyComment(e.target.value)}
                />
                {ratingError && <div style={{ color: 'var(--red)', fontSize: 12, marginBottom: 8 }}>⚠️ {ratingError}</div>}
                <button
                  onClick={submitRating}
                  disabled={ratingLoading || !myStars}
                  style={{ width: '100%', background: myStars ? 'var(--teal)' : 'var(--text3)', color: '#fff', border: 'none', borderRadius: 10, padding: 12, fontSize: 14, fontWeight: 700, cursor: myStars ? 'pointer' : 'not-allowed', fontFamily: 'inherit' }}
                >{ratingLoading ? 'Yuklanmoqda...' : 'Baho berish'}</button>
              </div>
            )}
          </div>

          {/* IZOHLAR */}
          {ratings.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: 'var(--text)' }}>💬 Izohlar</div>
              {ratings.slice(0, 5).map(r => (
                <div key={r.id} style={{ background: 'var(--bg)', borderRadius: 10, padding: '10px 12px', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <Stars value={r.stars} size={14} />
                    <span style={{ fontSize: 11, color: 'var(--text3)' }}>{new Date(r.createdAt).toLocaleDateString('uz-UZ')}</span>
                  </div>
                  {r.comment && <div style={{ fontSize: 13, color: 'var(--text2)' }}>{r.comment}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
