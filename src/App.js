import React, { useState, useCallback, useEffect } from 'react';
import { PRODUCTS, SORT_OPTS, fmt, totalItems, totalPrice } from './data/products';
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

const INIT_ORDERS = [
  { id:'#1042', items:'Плов, Шашлык, Чай',  total:162000, status:'done', date:'14.05.2026, 12:30' },
  { id:'#1038', items:'Шакшука x2, Сок',     total:120000, status:'way',  date:'13.05.2026, 19:15' },
  { id:'#1031', items:'Манты, Самса x2',      total:85000,  status:'done', date:'11.05.2026, 13:00' },
];

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
  const [cat,         setCat]         = useState('breakfast');
  const [cart,        setCartRaw]     = useState(loadCart);
  const [sortSel,     setSortSel]     = useState(null);
  const [sortApplied, setSortApplied] = useState(null);
  const [user,        setUserRaw]     = useState(loadUser);
  const [delivery,    setDelivery]    = useState('Доставка');
  const [showSort,    setShowSort]    = useState(false);
  const [showAuth,    setShowAuth]    = useState(false);
  const [showSearch,  setShowSearch]  = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orders,      setOrders]      = useState(INIT_ORDERS);
  const [addrBanner,  setAddrBanner]  = useState(true);

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
  const cartTotal = totalPrice(cart);

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
    if (window.confirm('Очистить корзину?')) setCart({});
  };

  const getProducts = useCallback((q = '') => {
    let list = PRODUCTS.filter(p => cat === 'filter' || p.cat === cat);
    if (q.trim()) list = list.filter(p => p.name.toLowerCase().includes(q.toLowerCase()));
    if (sortApplied === 'az')        list = [...list].sort((a,b) => a.name.localeCompare(b.name, 'ru'));
    if (sortApplied === 'cheap')     list = [...list].sort((a,b) => a.price - b.price);
    if (sortApplied === 'expensive') list = [...list].sort((a,b) => b.price - a.price);
    return list;
  }, [cat, sortApplied]);

  const handleCat = id => {
    if (id === 'filter') { setShowSort(true); return; }
    setCat(id);
  };

  const handleCheckout = () => {
    const newOrder = {
      id: '#' + (1043 + orders.length),
      items: Object.entries(cart)
        .map(([id, qty]) => {
          const p = PRODUCTS.find(p => p.id == id);
          return p ? (qty > 1 ? `${p.name} x${qty}` : p.name) : '';
        })
        .filter(Boolean)
        .join(', '),
      total: cartTotal,
      status: 'new',
      date: new Date().toLocaleString('ru'),
    };
    setCart({});
    setOrders(prev => [newOrder, ...prev]);
    setTab('home');
    setShowSuccess(true);
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

  useEffect(() => {
    const handler = e => {
      if (showSearch) { e.preventDefault(); setShowSearch(false); }
    };
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, [showSearch]);

  const catLabel = {
    breakfast:'Завтраки', salads:'Салаты', sandwich:'Сэндвичи',
    mains:'Вторые блюда', soups:'Супы', pastry:'Выпечка',
    drinks:'Напитки', desserts:'Десерты', filter:'Все блюда'
  }[cat] || 'Блюда';

  return (
    <div className="app">
      <div style={{ display: tab === 'home' ? 'block' : 'none' }}>
        <Header delivery={delivery} onDeliveryChange={setDelivery} onSearch={() => setShowSearch(true)} />
        <Categories cat={cat} onSelect={handleCat} />
        <HomePage
          products={getProducts()}
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
          cartTotal={cartTotal}
          onAdd={addToCart}
          onRem={remFromCart}
          onClear={clearCart}
          onBack={() => setTab('home')}
          onCheckout={handleCheckout}
          fmt={fmt}
        />
      )}

      {tab === 'orders' && (
        <OrdersPage orders={orders} fmt={fmt} />
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
          cart={cart}
          onAdd={addToCart}
          onRem={remFromCart}
          onClose={() => setShowSearch(false)}
          fmt={fmt}
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
