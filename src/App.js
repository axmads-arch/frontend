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

// Material Symbols Rounded icon komponenti
const Ms = ({ icon, size = 24, fill = 1, style = {} }) => (
  <span
    className="ms"
    style={{
      fontFamily: 'Material Symbols Rounded',
      fontVariationSettings: `'FILL' ${fill}, 'wght' 400, 'GRAD' 0, 'opsz' ${size}`,
      fontSize: size,
      lineHeight: 1,
      display: 'inline-block',
      userSelect: 'none',
      ...style
    }}
  >{icon}</span>
);

const NAV = [
  { key: 'home', label: 'Asosiy', icon: 'home' },
  { key: 'cart', label: 'Savatcha', icon: 'shopping_bag' },
  { key: 'orders', label: 'Buyurtmalar', icon: 'receipt_long' },
  { key: 'profile', label: 'Profil', icon: 'person' },
];

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

      {/* CART STICKY */}
      {cartCount > 0 && tab === 'home' && (
        <button className="cart-sticky" onClick={() => setTab('cart')}>
          <div className="cart-sticky-left">
            <div className="cart-count-badge">{cartCount}</div>
            <span className="cart-sticky-text">Savatcha</span>
          </div>
          <span className="cart-sticky-price">{fmt(cartTotal)}</span>
        </button>
      )}

      {/* BOTTOM NAV */}
      <nav className="bottom-nav">
        {NAV.map(item => {
          const active = tab === item.key;
          return (
            <button key={item.key} className={`nav-item ${active ? 'active' : ''}`} onClick={() => setTab(item.key)}>
              <div style={{ position: 'relative' }}>
                {cartCount > 0 && item.key === 'cart' && (
                  <span className="nav-badge">{cartCount}</span>
                )}
                <Ms icon={item.icon} size={24} fill={active ? 1 : 0} />
              </div>
              <span className="nav-label">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {authOpen && <AuthSheet onClose={() => setAuthOpen(false)} onSuccess={u => { setUser(u); setAuthOpen(false); showToast('Xush kelibsiz! 👋'); }} />}
      {searchOpen && <SearchPage products={products} cart={cart} onAdd={addToCart} onRemove={removeFromCart} onClose={() => setSearchOpen(false)} fmt={fmt} onProductClick={p => { setSearchOpen(false); setSelectedProduct(p); }} />}
      {chatOpen && <ChatPage user={user} onClose={() => setChatOpen(false)} onAuthRequired={() => { setChatOpen(false); setAuthOpen(true); }} />}
      {selectedProduct && <ProductDetail product={selectedProduct} cart={cart} onAdd={addToCart} onRemove={removeFromCart} onClose={() => setSelectedProduct(null)} isFav={favorites.includes(selectedProduct.id)} onToggleFav={() => handleToggleFavorite(selectedProduct.id)} fmt={fmt} user={user} />}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
