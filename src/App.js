import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import './App.css';

const API = 'https://claude-production-0b03.up.railway.app';

export default function App() {
  const [page, setPage] = useState('home');
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState({
    title: 'Yangi mahsulotlar! 🎉',
    subtitle: 'Har kuni yangi va mazali taomlar',
    emoji: '🍩'
  });

  useEffect(() => {
    loadProducts();
    loadBanner();
  }, []);

  async function loadProducts() {
    try {
      const res = await fetch(`${API}/api/products`);
      const data = await res.json();
      if (Array.isArray(data)) setProducts(data);
    } catch(e) {}
    setLoading(false);
  }

  async function loadBanner() {
    try {
      const res = await fetch(`${API}/api/banner`);
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

  const cartTotal = cart.reduce((s, c) => s + c.qty, 0);

  return (
    <div className="app">
      {page === 'home' && (
        <Home
          products={products}
          banner={banner}
          cart={cart}
          addToCart={addToCart}
          cartTotal={cartTotal}
          setPage={setPage}
          API={API}
          loading={loading}
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
