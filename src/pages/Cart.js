import React, { useState } from 'react';

export default function Cart({ cart, addToCart, removeFromCart, setPage, API }) {
  const [step, setStep] = useState('cart'); // cart | form | success
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const total = cart.reduce((s, c) => s + c.qty * c.price, 0);

  async function submitOrder() {
    if (!name || !phone || !address) return alert('Barcha maydonlarni to\'ldiring!');
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name, phone, address,
          items: cart.map(c => ({ productId: c.id, quantity: c.qty, price: c.price }))
        })
      });
      if (!res.ok) throw new Error('Xatolik');
      setStep('success');
      setTimeout(() => {
        setStep('cart');
        setPage('home');
      }, 3000);
    } catch(e) {
      alert('Xatolik: ' + e.message);
    } finally {
      setLoading(false);
    }
  }

  if (step === 'success') {
    return (
      <div className="success-overlay">
        <div className="success-box">
          <div className="icon">🎉</div>
          <h3>Buyurtma qabul qilindi!</h3>
          <p>Tez orada siz bilan bog'lanamiz</p>
        </div>
      </div>
    );
  }

  if (step === 'form') {
    return (
      <div>
        <div className="page-header">
          <button className="back-btn" onClick={() => setStep('cart')}>←</button>
          <h2>📝 Buyurtma</h2>
        </div>
        <div className="page">
          <div className="form-group">
            <label>Ismingiz</label>
            <input type="text" placeholder="Ism Familiya" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Telefon</label>
            <input type="tel" placeholder="+998 90 000 00 00" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Manzil</label>
            <textarea placeholder="To'liq manzilingizni kiriting" value={address} onChange={e => setAddress(e.target.value)} />
          </div>
          <button className="order-btn" onClick={submitOrder} disabled={loading}>
            {loading ? 'Yuborilmoqda...' : '✅ Buyurtma berish'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <button className="back-btn" onClick={() => setPage('home')}>←</button>
        <h2>🛒 Savat</h2>
      </div>
      <div className="page">
        {cart.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🛒</div>
            <p>Savat bo'sh</p>
          </div>
        ) : (
          <>
            {cart.map(c => (
              <div key={c.id} className="cart-item">
                <div className="cart-item-name">{c.name}</div>
                <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                  <button className="qty-btn" onClick={() => removeFromCart(c.id)}>−</button>
                  <span className="qty-num">{c.qty}</span>
                  <button className="qty-btn" onClick={() => addToCart(c)}>+</button>
                </div>
                <div className="cart-item-price">{Number(c.qty * c.price).toLocaleString()} so'm</div>
              </div>
            ))}
            <div className="cart-total-row">
              <span>Jami:</span>
              <span>{Number(total).toLocaleString()} so'm</span>
            </div>
            <button className="order-btn" onClick={() => setStep('form')}>
              📦 Buyurtma berish
            </button>
          </>
        )}
      </div>
    </div>
  );
}
