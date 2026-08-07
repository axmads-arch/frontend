// src/App.tsx
// Diqqat: bu fayl endi faqat "orkestratsiya" qiladi — barcha mantiq hooks/ papkasida.
// App.tsx'ni ochgan har qanday dasturchi 30 soniyada butun ilova qanday ishlashini tushunadi.

import React from 'react';
import './App.css';
import { getUser, removeUser, fmt } from './data/api';

import Home from './pages/Home';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import AuthSheet from './components/AuthSheet';
import SearchPage from './components/SearchPage';
import ProductDetail from './components/ProductDetail';
import ChatPage from './components/ChatPage';
import BottomNav from './components/BottomNav';
import CartStickyBar from './components/CartStickyBar';

import { useAppData } from './hooks/useAppData';
import { useCart } from './hooks/useCart';
import { useFavorites } from './hooks/useFavorites';
import { useTheme } from './hooks/useTheme';
import { useToast } from './hooks/useToast';
import { useOverlays } from './hooks/useOverlays';
import { useState } from 'react';
import type { TabKey, User } from './types';

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
        <Orders user={user} onAuthRequired={overlays.openAuth} fmt={fmt} />
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

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
