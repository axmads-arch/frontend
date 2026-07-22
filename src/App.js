import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import { fetchProducts, fetchCategories, fetchBanners, fetchSettings, getCart, saveCart, getUser, removeUser, totalItems, totalPrice, fmt, getFavorites, toggleFavorite } from './data/api';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import AuthSheet from './components/AuthSheet';
import SearchPage from './components/SearchPage';
import ProductDetail from './components/ProductDetail';
import ChatPage from './components/ChatPage';

// NAV ICONS
const NavIcon = {
  home: (active) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.5" : "1.75"} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.55 5.45 21 6 21H9M19 10L21 12M19 10V20C19 20.55 18.55 21 18 21H15M9 21V15C9 15 9 13 12 13C15 13 15 15 15 15V21M9 21H15"/>
    </svg>
  ),
  cart: (active) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.5" : "1.75"} strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V6L18 2H6Z"/>
      <path d="M3 6H21"/>
      <path d="M16 10C16 12.21 14.21 14 12 14C9.79 14 8 12.21 8 10"/>
    </svg>
  ),
  orders: (active) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.5" : "1.75"} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5H7C5.9 5 5 5.9 5 7V19C5 20.1 5.9 21 7 21H17C18.1 21 19 20.1 19 19V7C19 5.9 18.1 5 17 5H15"/>
      <path d="M9 5C9 3.9 9.9 3 11 3H13C14.1 3 15 3.9 15 5V7H9V5Z"/>
      <path d="M9 12H15"/><path d="M9 16H12"/>
    </svg>
  ),
  profile: (active) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.5" : "1.75"} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4"/>
      <path d="M4 20C4 17.79 7.58 16 12 16C16.42 16 20 17.79 20 20"/>
    </svg>
  ),
};

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
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toast, setToast] = useState('');
  const [darkMode, setDarkMode] = useState(localStorage.getItem('rc_dark') === 'true');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('rc_dark', darkMode);
  }, [darkMode]);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2200);
  }, []);

  useEffect(() => {
    Promise.all([fetchProducts(), fetchCategories(), fetchBanners(), fetchSettings()])
      .then(([prods, cats, bans, sets]) => {
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
    showToast("Savatchaga qo'shildi ✓");
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
    showToast(newFavs.includes(productId) ? "❤️ Sevimlilarga qo'shildi" : 'Olib tashlandi');
  };

  const clearCart = () => updateCart([]);
  const cartCount = totalItems(cart);
  const cartTotal = totalPrice(cart, products);

  return (
    <div className="app">
      {tab === 'home' && <Home products={products} categories={categories} banners={banners} settings={settings} loading={loading} cart={cart} onAdd={addToCart} onRemove={removeFromCart} onSearchOpen={() => setSearchOpen(true)} onProductClick={p => setSelectedProduct(p)} onChatOpen={() => setChatOpen(true)} cartCount={cartCount} cartTotal={cartTotal} fmt={fmt} favorites={favorites} onToggleFavorite={handleToggleFavorite} darkMode={darkMode} onToggleDark={() => setDarkMode(d => !d)} />}
      {tab === 'cart' && <Cart products={products} cart={cart} settings={settings} user={user} onAdd={addToCart} onRemove={removeFromCart} onClearCart={clearCart} onBack={() => setTab('home')} onOrderSuccess={() => { clearCart(); setTab('orders'); }} onAuthRequired={() => setAuthOpen(true)} showToast={showToast} fmt={fmt} />}
      {tab === 'orders' && <Orders user={user} onAuthRequired={() => setAuthOpen(true)} fmt={fmt} />}
      {tab === 'profile' && <Profile user={user} onLogin={() => setAuthOpen(true)} onLogout={() => { setUser(null); removeUser(); }} settings={settings} favorites={favorites} products={products} onAdd={addToCart} fmt={fmt} darkMode={darkMode} onToggleDark={() => setDarkMode(d => !d)} />}

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
        {[
          { key: 'home', label: 'Asosiy' },
          { key: 'cart', label: 'Savatcha' },
          { key: 'orders', label: 'Buyurtmalar' },
          { key: 'profile', label: 'Profil' },
        ].map(item => (
          <button key={item.key} className={`nav-item ${tab === item.key ? 'active' : ''}`} onClick={() => setTab(item.key)}>
            {cartCount > 0 && item.key === 'cart' && <span className="nav-badge">{cartCount}</span>}
            {NavIcon[item.key](tab === item.key)}
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      {authOpen && <AuthSheet onClose={() => setAuthOpen(false)} onSuccess={u => { setUser(u); setAuthOpen(false); showToast('Xush kelibsiz! 👋'); }} />}
      {searchOpen && <SearchPage products={products} cart={cart} onAdd={addToCart} onRemove={removeFromCart} onClose={() => setSearchOpen(false)} fmt={fmt} onProductClick={p => { setSearchOpen(false); setSelectedProduct(p); }} />}
      {chatOpen && <ChatPage user={user} onClose={() => setChatOpen(false)} onAuthRequired={() => { setChatOpen(false); setAuthOpen(true); }} />}
      {selectedProduct && <ProductDetail product={selectedProduct} cart={cart} onAdd={addToCart} onRemove={removeFromCart} onClose={() => setSelectedProduct(null)} isFav={favorites.includes(selectedProduct.id)} onToggleFav={() => handleToggleFavorite(selectedProduct.id)} fmt={fmt} user={user} />}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
