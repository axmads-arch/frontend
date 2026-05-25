import React, { useState, useCallback, useEffect } from 'react';
import {
  SORT_OPTS, fmt, totalItems, totalPrice,
  fetchProducts, createOrder, fetchMyOrders
} from './data/products';
import Header from './components/Header';
import Categories from './components/Categories';
import BottomNav from './components/BottomNav';
import HomePage from './pages/Home';
import CartPage from './pages/Cart';
import OrdersPage from './pages/Orders';
import ProfilePage from './pages/Profile';
import SortSheet from './components/SortSheet';
import AuthSheet from './components/AuthSheet';
import SearchPage from './components/SearchPage';
import SuccessModal from './components/SuccessModal';

function loadCart() {
  try { return JSON.parse(localStorage.getItem('rc_cart') || '{}'); }
  catch { return {}; }
}

function loadUser() {
  try { return JSON.parse(localStorage.getItem('rc_user') || 'null'); }
  catch { return null; }
}

export default function App() {
  const [tab,         setTab]         = useState('home');
  const [cat,         setCat]         = useState('all');
  const [cart,        setCartRaw]     = useState(loadCart);
  const [sortSel,     setSortSel]     = useState(null);
  const [sortApplied, setSortApplied] = useState(null);
  const [user,        setUserRaw]     = useState(loadUser);
  const [delivery,    setDelivery]    = useState('Yetkazib berish');
  const [showSort,    setShowSort]    = useState(false);
  const [showAuth,    setShowAuth]    = useState(false);
  const [showSearch,  setShowSearch]  = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orders,      setOrders]      = useState([]);
  const [products,    setProducts]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [addrBanner,  setAddrBanner]  = useState(true);
  const [ordering,    setOrdering]    = useState(false);

  // Load products from backend
  useEffect(() => {
    setLoading(true);
    fetchProducts(cat)
      .then(data => {
        let list = Array.isArray(data) ? data : [];
        if (sortApplied === 'az')        list = [...list].sort((a,b) => a.name.localeCompare(b.name));
        if (sortApplied === 'cheap')     list = [...list].sort((a,b) => a.price - b.price);
        if (sortApplied === 'expensive') list = [...list].sort((a,b) => b.price - a.price);
        setProducts(list);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [cat, sortApplied]);

  // Load user orders
  useEffect(() => {
    if (user?.phone && tab === 'orders') {
      fetchMyOrders(user.phone)
        .then(data => setOrders(Array.isArray(data) ? data : []))
        .catch(() => setOrders([]));
    }
  }, [user, tab]);

  const setCart = useCallback(fn => {
    setCartRaw(prev => {
      const next = typeof fn === 'function' ? fn(prev) : fn;
      try { localStorage.setItem('rc_cart', JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const setUser = useCallback(val => {
    setUserRaw(val);
    try { localStorage.setItem('rc_user', JSON.stringify(val)); } catch {}
  }, []);

  const cartCount = totalItems(cart);
  const cartTotal = totalPrice(cart, products);

  const addToCart = useCallback(id => {
    setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }));
  }, [setCart]);

  const remFromCart = useCallback(id => {
    setCart(c => {
      const qty = (c[id] || 0) - 1;
      if (qty <= 0) { const { [id]: _, ...rest } = c; return rest; }
      return { ...c, [id]: qty };
    });
  }, [setCart]);

  const clearCart = () => {
    if (window.confirm('Savatchani tozalash?')) setCart({});
  };

  const handleCat = id => {
    if (id === 'filter') { setShowSort(true); return; }
    setCat(id);
  };

  const handleCheckout = async (orderInfo) => {
    if (!user) { setShowAuth(true); return; }
    setOrdering(true);
    try {
      const items = Object.entries(cart).map(([id, qty]) => {
        const p = products.find(p => p.id === Number(id));
        return { productId: Number(id), quantity: qty, price: p?.price || 0 };
      });
      await createOrder({
        customerName: user.name,
        phone: user.phone,
        address: orderInfo?.address || 'Manzil kiritilmagan',
        items,
      });
      setCart({});
      setShowSuccess(true);
      setTab('home');
    } catch (e) {
      alert('Xatolik: ' + e.message);
    } finally {
      setOrdering(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    setTab('orders');
  };

  const handleVerifyOTP = (name, phone) => {
    setUser({ name, phone });
    setShowAuth(false);
    setTab('profile');
  };

  const getFilteredProducts = (q = '') => {
    if (!q.trim()) return products;
    return products.filter(p =>
      p.name.toLowerCase().includes(q.toLowerCase())
    );
  };

  const catLabel = {
    all:'Barcha taomlar', breakfast:'Nonushta', salads:'Salatlar',
    sandwich:'Sendvichlar', mains:'Asosiy taomlar', soups:"Sho'rvalar",
    pastry:'Non va pishiriqlar', drinks:'Ichimliklar', desserts:'Desertlar',
    filter:'Barcha taomlar'
  }[cat] || 'Taomlar';

  return (
    <div className="app">
      <div style={{ display: tab === 'home' ? 'block' : 'none' }}>
        <Header
          delivery={delivery}
          onDeliveryChange={setDelivery}
          onSearch={() => setShowSearch(true)}
        />
        <Categories cat={cat} onSelect={handleCat} />
        <HomePage
          products={products}
          loading={loading}
          catLabel={catLabel}
          cart={cart}
          onAdd={addToCart}
          onRem={remFromCart}
          addrBanner={addrBanner}
          onCloseBanner={() => setAddrBanner(false)}
          cartCount={cartCount}
          cartTotal={cartTotal}
          onOpenCart={() => setTab('cart')}
          fmt={fmt}
        />
      </div>

      {tab === 'cart' && (
        <CartPage
          cart={cart}
          products={products}
          cartTotal={cartTotal}
          onAdd={addToCart}
          onRem={remFromCart}
          onClear={clearCart}
          onBack={() => setTab('home')}
          onCheckout={handleCheckout}
          ordering={ordering}
          user={user}
          onLogin={() => setShowAuth(true)}
          fmt={fmt}
        />
      )}

      {tab === 'orders' && (
        <OrdersPage
          orders={orders}
          user={user}
          onLogin={() => setShowAuth(true)}
          fmt={fmt}
        />
      )}

      {tab === 'profile' && (
        <ProfilePage
          user={user}
          onLogin={() => setShowAuth(true)}
          onLogout={() => setUser(null)}
        />
      )}

      <BottomNav tab={tab} onNav={setTab} cartCount={cartCount} />

      {showSearch && (
        <SearchPage
          products={products}
          cart={cart}
          onAdd={addToCart}
          onRem={remFromCart}
          onClose={() => setShowSearch(false)}
          fmt={fmt}
          getFiltered={getFilteredProducts}
        />
      )}

      {showSort && (
        <SortSheet
          opts={SORT_OPTS}
          selected={sortSel}
          onSelect={setSortSel}
          onReset={() => setSortSel(null)}
          onApply={() => { setSortApplied(sortSel); setShowSort(false); }}
          onClose={() => setShowSort(false)}
        />
      )}

      {showAuth && (
        <AuthSheet
          onClose={() => setShowAuth(false)}
          onVerify={handleVerifyOTP}
        />
      )}

      {showSuccess && <SuccessModal onClose={handleSuccessClose} />}
    </div>
  );
}
