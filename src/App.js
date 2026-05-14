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
  const [deliveryType, setDeliveryType] = useState('delivery');
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
      if (existing) return prev.map(c => c.id === product.id ? {...c, qty: c.qty + 1} : c);
      return [...prev, {...product, qty: 1}];
    });
  }

  function removeFromCart(id) {
    setCart(prev => {
      const existing = prev.find(c => c.id === id);
      if (!existing) return prev;
      if (existing.qty > 1) return prev.map(c => c.id === id ? {...c, qty: c.qty - 1} : c);
      return prev.filter(c => c.id !== id);
    });
  }

  function openProduct(product) {
    setSelectedProduct(product);
    setPage('detail');
  }

  const cartTotal = cart.reduce((s, c) => s + c.qty, 0);
  const cartSum = cart.reduce((s, c) => s + c.qty * c.price, 0);

  return (
    <div className="app">
      {notification && (
        <div className="notification">
          🔔 {notification}
        </div>
      )}

      {page === 'home' && (
        <Home
          products={products}
          banner={banner}
          cart={cart}
          cartTotal={cartTotal}
          cartSum={cartSum}
          addToCart={addToCart}
          setPage={setPage}
          openProduct={openProduct}
          loading={loading}
          deliveryType={deliveryType}
          setDeliveryType={setDeliveryType}
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
          cartSum={cartSum}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
          setPage={setPage}
          setCart={setCart}
          API={API}
          deliveryType={deliveryType}
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
          <span className="nav-icon">🏠</span>
          <span>Bosh sahifa</span>
        </button>
        <button className={page === 'cart' ? 'active' : ''} onClick={() => setPage('cart')}>
          <span className="nav-icon">🛒</span>
          {cartTotal > 0 && <span className="badge">{cartTotal}</span>}
          <span>Savat</span>
        </button>
        <button className={page === 'orders' ? 'active' : ''} onClick={() => setPage('orders')}>
          <span className="nav-icon">📋</span>
          <span>Buyurtmalar</span>
        </button>
        <button className={page === 'profile' ? 'active' : ''} onClick={() => setPage('profile')}>
          <span className="nav-icon">👤</span>
          <span>Profil</span>
        </button>
      </nav>
    </div>
  );
}
