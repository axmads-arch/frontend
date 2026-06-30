import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import { fetchProducts, fetchCategories, fetchBanners, fetchSettings, getCart, saveCart, getUser, totalItems, totalPrice, fmt, getFavorites, toggleFavorite } from './data/api';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import AuthSheet from './components/AuthSheet';
import SearchPage from './components/SearchPage';
import ProductDetail from './components/ProductDetail';
import ChatPage from './components/ChatPage';

export default function App() {
  const [tab, setTab] = useState('home');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [settings, setSettings] = useState({});
  const [cart, setCart] = useState(getCart());
  const [user, setUser] = useState(getUser());
  const [favorites, setFavorites] = useState(getFavorites());
  const [loading, setLoading] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [darkMode, setDarkMode] = useState(localStorage.getItem('rc_dark') === 'true');

  // Dark mode
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('rc_dark', darkMode);
  }, [darkMode]);

  // Push notification
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      setTimeout(() => Notification.requestPermission(), 3000);
    }
  }, []);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  }, []);

  useEffect(() => {
    Promise.all([
      fetchProducts(),
      fetchCategories(),
      fetchBanners(),
      fetchSettings(),
    ]).then(([prods, cats, bans, sets]) => {
      setProducts(Array.isArray(prods) ? prods : []);
      setCategories(Array.isArray(cats) ? cats : []);
      setBanners(Array.isArray(bans) ? bans : []);
      setSettings(sets || {});
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const updateCart = (newCart) => { setCart(newCart); saveCart(newCart); };

  const addToCart = (product) => {
    const existing = cart.find(i => i.id === product.id);
    const newCart = existing
      ? cart.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
      : [...cart, { id: product.id, qty: 1 }];
    updateCart(newCart);
    showToast('Savatchaga qo\'shildi ✓');
  };

  const removeFromCart = (productId) => {
    const existing = cart.find(i => i.id === productId);
    if (!existing) return;
    const newCart = existing.qty === 1
      ? cart.filter(i => i.id !== productId)
      : cart.map(i => i.id === productId ? { ...i, qty: i.qty - 1 } : i);
    updateCart(newCart);
  };

  const handleToggleFavorite = (productId) => {
    const newFavs = toggleFavorite(productId, favorites);
    setFavorites(newFavs);
    showToast(newFavs.includes(productId) ? '❤️ Sevimlilarga qo\'shildi' : '🤍 Olib tashlandi');
  };

  const clearCart = () => updateCart([]);
  const cartCount = totalItems(cart);
  const cartTotal = totalPrice(cart, products);

  return (
    <div className="app">
      {tab === 'home' && (
        <Home
          products={products} categories={categories} banners={banners}
          settings={settings} loading={loading} cart={cart}
          onAdd={addToCart} onRemove={removeFromCart}
          onSearchOpen={() => setSearchOpen(true)}
          onProductClick={(p) => setSelectedProduct(p)}
          onChatOpen={() => setChatOpen(true)}
          cartCount={cartCount} cartTotal={cartTotal} fmt={fmt}
          favorites={favorites} onToggleFavorite={handleToggleFavorite}
          darkMode={darkMode} onToggleDark={() => setDarkMode(d => !d)}
        />
      )}
      {tab === 'cart' && (
        <Cart products={products} cart={cart} settings={settings} user={user}
          onAdd={addToCart} onRemove={removeFromCart} onClearCart={clearCart}
          onBack={() => setTab('home')}
          onOrderSuccess={() => { clearCart(); setTab('orders'); }}
          onAuthRequired={() => setAuthOpen(true)} showToast={showToast} fmt={fmt} />
      )}
      {tab === 'orders' && (
        <Orders user={user} onAuthRequired={() => setAuthOpen(true)} fmt={fmt} />
      )}
      {tab === 'profile' && (
        <Profile user={user} onLogin={() => setAuthOpen(true)}
          onLogout={() => { setUser(null); localStorage.removeItem('rc_user'); localStorage.removeItem('rc_token'); }}
          settings={settings} favorites={favorites} products={products}
          onAdd={addToCart} fmt={fmt}
          darkMode={darkMode} onToggleDark={() => setDarkMode(d => !d)} />
      )}

      {cartCount > 0 && tab === 'home' && (
        <button className="cart-sticky" onClick={() => setTab('cart')}>
          <div className="cart-sticky-left">
            <div className="cart-count-badge">{cartCount}</div>
            <span className="cart-sticky-text">Savatcha</span>
          </div>
          <span className="cart-sticky-price">{fmt(cartTotal)}</span>
        </button>
      )}

      <nav className="bottom-nav">
        <button className={`nav-item ${tab==='home'?'active':''}`} onClick={() => setTab('home')}>
          <svg viewBox="0 0 24 24" fill={tab==='home'?'currentColor':'none'} stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span className="nav-label">Asosiy</span>
        </button>
        <button className={`nav-item ${tab==='cart'?'active':''}`} onClick={() => setTab('cart')}>
          {cartCount > 0 && <span className="nav-badge">{cartCount}</span>}
          <svg viewBox="0 0 24 24" fill={tab==='cart'?'currentColor':'none'} stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
          <span className="nav-label">Savatcha</span>
        </button>
        <button className={`nav-item ${tab==='orders'?'active':''}`} onClick={() => setTab('orders')}>
          <svg viewBox="0 0 24 24" fill={tab==='orders'?'currentColor':'none'} stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          <span className="nav-label">Buyurtmalar</span>
        </button>
        <button className={`nav-item ${tab==='profile'?'active':''}`} onClick={() => setTab('profile')}>
          <svg viewBox="0 0 24 24" fill={tab==='profile'?'currentColor':'none'} stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span className="nav-label">Profil</span>
        </button>
      </nav>

      {authOpen && <AuthSheet onClose={() => setAuthOpen(false)} onSuccess={(u) => { setUser(u); setAuthOpen(false); showToast('Xush kelibsiz! 👋'); }} />}
      {searchOpen && <SearchPage products={products} cart={cart} onAdd={addToCart} onRemove={removeFromCart} onClose={() => setSearchOpen(false)} fmt={fmt} onProductClick={(p) => { setSearchOpen(false); setSelectedProduct(p); }} />}
      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          cart={cart}
          onAdd={addToCart}
          onRemove={removeFromCart}
          onClose={() => setSelectedProduct(null)}
          isFav={favorites.includes(selectedProduct.id)}
          onToggleFav={() => handleToggleFavorite(selectedProduct.id)}
          fmt={fmt}
          user={user}
        />
      )}
      {chatOpen && <ChatPage user={user} onClose={() => setChatOpen(false)} onAuthRequired={() => { setChatOpen(false); setAuthOpen(true); }} />}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
