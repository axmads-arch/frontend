// src/App.tsx
// Diqqat: bu fayl faqat "orkestratsiya" qiladi — barcha mantiq hooks/ papkasida.

import React, { Suspense, lazy, useState } from 'react';
import './App.css';
import { getUser, removeUser, fmt } from './data/api';

import Home from './pages/Home';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import BottomNav from './components/BottomNav';
import CartStickyBar from './components/CartStickyBar';

// Kod bo'linishi (code splitting): bu 4 ta komponent faqat kerak bo'lganda
// (mijoz tugmani bosganda) yuklanadi — boshlang'ich yuklama hajmi kichrayadi,
// sayt tezroq ochiladi.
const AuthSheet = lazy(() => import('./components/AuthSheet'));
const SearchPage = lazy(() => import('./components/SearchPage'));
const ProductDetail = lazy(() => import('./components/ProductDetail'));
const ChatPage = lazy(() => import('./components/ChatPage'));

import { useAppData } from './hooks/useAppData';
import { useCart } from './hooks/useCart';
import { useFavorites } from './hooks/useFavorites';
import { useTheme } from './hooks/useTheme';
import { useToast } from './hooks/useToast';
import { useOverlays } from './hooks/useOverlays';
import type { TabKey, User } from './types';

// Lazy komponentlar yuklanayotganda ko'rinadigan yengil "spinner" o'rnini bosuvchi
function OverlayFallback() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(20,18,15,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 36, height: 36, border: '3px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .7s linear infinite' }} />
      <style>{'@keyframes spin{to{transform:rotate(360deg)}}'}</style>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState<TabKey>('home');
  const [user, setUser] = useState<User | null>(getUser());

  const { toast, showToast } = useToast();
  const { products, categories, banners, settings, loading } = useAppData();
  const { cart, cartCount, cartTotal, addToCart, removeFromCart, clearCart } =
    useCart(() => showToast("Savatchaga qo'shildi ✓"));
  const { favorites, isFavorite, toggle: toggleFavoriteState } = useFavorites();
  const { darkMode, toggleDark } = useTheme();
  const overlays = useOverlays();

  const handleToggleFavorite = (productId: number) => {
    const added = toggleFavoriteState(productId);
    showToast(added ? "❤️ Sevimlilarga qo'shildi" : 'Olib tashlandi');
  };

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    overlays.closeAuth();
    showToast('Xush kelibsiz! 👋');
  };

  const handleLogout = () => {
    setUser(null);
    removeUser();
  };

  const total = cartTotal(products);

  return (
    <div className="app">
      {tab === 'home' && (
        <Home
          products={products}
          categories={categories}
          banners={banners}
          settings={settings}
          loading={loading}
          cart={cart}
          onAdd={addToCart}
          onRemove={removeFromCart}
          onSearchOpen={overlays.openSearch}
          onProductClick={overlays.openProduct}
          onChatOpen={overlays.openChat}
          fmt={fmt}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
          darkMode={darkMode}
          onToggleDark={toggleDark}
        />
      )}

      {tab === 'cart' && (
        <Cart
          products={products}
          cart={cart}
          settings={settings}
          user={user}
          onAdd={addToCart}
          onRemove={removeFromCart}
          onClearCart={clearCart}
          onBack={() => setTab('home')}
          onOrderSuccess={() => { clearCart(); setTab('orders'); }}
          onAuthRequired={overlays.openAuth}
          showToast={showToast}
          fmt={fmt}
        />
      )}

      {tab === 'orders' && (
        <Orders
          user={user}
          onAuthRequired={overlays.openAuth}
          fmt={fmt}
          onReorder={(order) => {
            order.items?.forEach(item => {
              if (item.product) {
                for (let i = 0; i < item.quantity; i++) addToCart(item.product);
              }
            });
            showToast("Mahsulotlar savatchaga qo'shildi ✓");
          }}
        />
      )}

      {tab === 'profile' && (
        <Profile
          user={user}
          onLogin={overlays.openAuth}
          onLogout={handleLogout}
          settings={settings}
          favorites={favorites}
          products={products}
          onAdd={addToCart}
          fmt={fmt}
          darkMode={darkMode}
          onToggleDark={toggleDark}
        />
      )}

      {cartCount > 0 && tab === 'home' && (
        <CartStickyBar
          cartCount={cartCount}
          cartTotal={total}
          fmt={fmt}
          onClick={() => setTab('cart')}
        />
      )}

      <BottomNav activeTab={tab} cartCount={cartCount} onTabChange={setTab} />

      <Suspense fallback={<OverlayFallback />}>
        {overlays.authOpen && (
          <AuthSheet onClose={overlays.closeAuth} onSuccess={handleLoginSuccess} />
        )}

        {overlays.searchOpen && (
          <SearchPage
            products={products}
            cart={cart}
            onAdd={addToCart}
            onRemove={removeFromCart}
            onClose={overlays.closeSearch}
            fmt={fmt}
            onProductClick={(p) => { overlays.closeSearch(); overlays.openProduct(p); }}
          />
        )}

        {overlays.chatOpen && (
          <ChatPage
            user={user}
            onClose={overlays.closeChat}
            onAuthRequired={() => { overlays.closeChat(); overlays.openAuth(); }}
          />
        )}

        {overlays.selectedProduct && (
          <ProductDetail
            product={overlays.selectedProduct}
            cart={cart}
            onAdd={addToCart}
            onRemove={removeFromCart}
            onClose={overlays.closeProduct}
            isFav={isFavorite(overlays.selectedProduct.id)}
            onToggleFav={() => handleToggleFavorite(overlays.selectedProduct!.id)}
            fmt={fmt}
            user={user}
          />
        )}
      </Suspense>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
