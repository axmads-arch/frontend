import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import ProductDetail from './pages/ProductDetail';
import './App.css';

const API = 'https://claude-production-0b03.up.railway.app';
const socket = io(API);

export default function App() {
  const [page, setPage] = useState('home');
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [notification, setNotification] = useState(null);
  const [banner, setBanner] = useState({
    title: 'Yangi mahsulotlar!',
    subtitle: 'Har kuni yangi va mazali taomlar',
    emoji: '🍩'
  });

  useEffect(() => {
    loadProducts();
    loadBanner();
    const userPhone = localStorage.getItem('userPhone');
    socket.on('orderStatus', (data) => {
      if (userPhone && data.phone === userPhone) {
        setNotification('Buyurtma #' + data.id + ' holati: ' + data.status);
        setTimeout(() => setNotification(null), 4000);
      }
    });
    return () => { socket.off('orderStatus'); };
  }, []);

  async function loadProducts() {
    try {
      const res = await fetch(API + '/api/products');
      const data = await res.json();
      if (Array.isArray(data)) setProducts(data);
    } catch(e) {}
    setLoading(false);
  }

  async function loadBanner() {
    try {
      const res = await fetch(API + '/api/banner');
      const data = await res.json();
      setBanner(data);
    } catch(e) {}
  }

  function addToCart(product) {
    setCart(prev => {
      const existing = prev.find(c => c.id === product.id);
      if (existing) {
        return prev.map(c => c.id === product.id ? {...c, qty: c.qty + 1} : c);
      }
      return [...prev, {...product, qty: 1}];
    });
  }

  function removeFromCart(id) {
    setCart(prev => {
      const existing = prev.find(c => c.id === id);
      if (existing.qty > 1) {
        return prev.map(c => c.id === id ? {...c, qty: c.qty - 1} : c);
      }
      return prev.filter(c => c.id !== id);
    });
  }

  function openProduct(product) {
    setSelectedProduct(product);
    setPage('detail');
  }

  const cartTotal = cart.reduce((s, c) => s + c.qty, 0);

  return (
    <div className="app">
      {notification && (
        <div style={{
          position:'fixed',top:0,left:'50%',transform:'translateX(-50%)',
          width:'100%',maxWidth:'480px',background:'#1a6b5a',color:'#fff',
          padding:'14px 16px',zIndex:1000,textAlign:'center',
          fontWeight:700,fontSize:'0.9rem',boxShadow:'0 4px 12px rgba(0,0,0,0.2)'
        }}>
          {notification}
        </div>
      )}
      {page === 'home' && (
        <Home
          products={products}
          banner={banner}
          cart={cart}
          addToCart={addToCart}
          cartTotal={cartTotal}
          setPage={setPage}
          openProduct={openProduct}
          API={API}
          loading={loading}
        />
      )}
      {page === 'detail' && (
        <ProductDetail
          product={selectedProduct}
          setPage={setPage}
          addToCart={addToCart}
          cart={cart}
        />
      )}
      {page === 'cart' && (
        <Cart
          cart={cart}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
          setPage={setPage}
          API={API}
        />
      )}
      {page === 'orders' && (
        <Orders setPage={setPage} API={API} />
      )}
      {page === 'profile' && (
        <Profile setPage={setPage} API={API} />
      )}
      <nav className="bottom-nav">
        <button className={page === 'home' ? 'active' : ''} onClick={() => setPage('home')}>
          <span>🏠</span><span>Bosh sahifa</span>
        </button>
        <button className={page === 'cart' ? 'active' : ''} onClick={() => setPage('cart')}>
          <span>🛒</span>
          {cartTotal > 0 && <span className="badge">{cartTotal}</span>}
          <span>Savat</span>
        </button>
        <button className={page === 'orders' ? 'active' : ''} onClick={() => setPage('orders')}>
          <span>📋</span><span>Buyurtmalar</span>
        </button>
        <button className={page === 'profile' ? 'active' : ''} onClick={() => setPage('profile')}>
          <span>👤</span><span>Profil</span>
        </button>
      </nav>
    </div>
  );
}
