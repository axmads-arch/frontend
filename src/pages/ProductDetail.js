import React, { useState } from 'react';

export default function ProductDetail({ product, setPage, addToCart, cart }) {
  if (!product) return null;

  const cartItem = cart.find(c => c.id === product.id);
  const [qty, setQty] = useState(cartItem ? cartItem.qty : 1);

  function handleAdd() {
    for (let i = 0; i < qty; i++) addToCart(product);
    setPage('cart');
  }

  return (
    <div>
      <div className="page-header">
        <button className="back-btn" onClick={() => setPage('home')}>←</button>
        <h2>Mahsulot</h2>
      </div>

      <div style={{background:'#fff'}}>
        <div style={{height:'280px',background:'#e8f5f1',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'5rem',overflow:'hidden'}}>
          {product.image ? <img src={product.image} alt={product.name} style={{width:'100%',height:'100%',objectFit:'cover'}} /> : '🍰'}
        </div>

        <div style={{padding:'20px'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'8px'}}>
            <h1 style={{fontSize:'1.3rem',fontWeight:900,flex:1}}>{product.name}</h1>
            <span style={{background:'#e8f5f1',color:'#1a6b5a',padding:'4px 12px',borderRadius:'20px',fontSize:'0.8rem',fontWeight:700,marginLeft:'10px'}}>{product.category}</span>
          </div>

          <p style={{color:'#888',fontSize:'0.9rem',lineHeight:1.6,marginBottom:'20px'}}>{product.description || 'Tavsif yo\'q'}</p>

          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'16px',background:'#f8f8f8',borderRadius:'16px',marginBottom:'20px'}}>
            <div>
              <div style={{fontSize:'0.78rem',color:'#888',marginBottom:'4px'}}>Narx</div>
              <div style={{fontSize:'1.4rem',fontWeight:900,color:'#1a6b5a'}}>{Number(product.price * qty).toLocaleString()} so'm</div>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                style={{background:'#e8f5f1',border:'none',width:'36px',height:'36px',borderRadius:'50%',fontSize:'1.2rem',fontWeight:900,color:'#1a6b5a',cursor:'pointer'}}
              >−</button>
              <span style={{fontWeight:900,fontSize:'1.1rem',minWidth:'20px',textAlign:'center'}}>{qty}</span>
              <button
                onClick={() => setQty(q => q + 1)}
                style={{background:'#1a6b5a',border:'none',width:'36px',height:'36px',borderRadius:'50%',fontSize:'1.2rem',fontWeight:900,color:'#fff',cursor:'pointer'}}
              >+</button>
            </div>
          </div>

          <button className="order-btn" onClick={handleAdd}>
            🛒 Savatga qo'shish — {Number(product.price * qty).toLocaleString()} so'm
          </button>
        </div>
      </div>
    </div>
  );
}
