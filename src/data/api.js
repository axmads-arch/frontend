export const API_URL = 'https://claude-production-0b03.up.railway.app/api';
export const LOGO_URL = 'https://raw.githubusercontent.com/axmads-arch/frontend/main/logo.jpg';

export const fmt = (n) => Number(n).toLocaleString('uz-UZ') + ' so\'m';

export async function fetchProducts(category) {
  const url = category && category !== 'Barchasi'
    ? `${API_URL}/products?category=${encodeURIComponent(category)}`
    : `${API_URL}/products`;
  const r = await fetch(url);
  return r.json();
}

export async function fetchCategories() {
  const r = await fetch(`${API_URL}/products/categories`);
  return r.json();
}

export async function fetchBanners() {
  const r = await fetch(`${API_URL}/banner`);
  return r.json();
}

export async function fetchSettings() {
  const r = await fetch(`${API_URL}/settings`);
  return r.json();
}

export async function createOrder(data) {
  const r = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return r.json();
}

export async function fetchMyOrders(phone) {
  const r = await fetch(`${API_URL}/orders/my/${phone}`);
  return r.json();
}

export async function sendOtp(phone) {
  const r = await fetch(`${API_URL}/auth/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone }),
  });
  return r.json();
}

export async function verifyOtp(phone, otp) {
  const r = await fetch(`${API_URL}/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, otp }),
  });
  return r.json();
}

export function getCart() {
  try { return JSON.parse(localStorage.getItem('rc_cart') || '[]'); } catch { return []; }
}

export function saveCart(cart) {
  localStorage.setItem('rc_cart', JSON.stringify(cart));
}

export function getUser() {
  try { return JSON.parse(localStorage.getItem('rc_user') || 'null'); } catch { return null; }
}

export function saveUser(user) {
  localStorage.setItem('rc_user', JSON.stringify(user));
}

export function totalItems(cart) {
  return cart.reduce((s, i) => s + i.qty, 0);
}

export function totalPrice(cart, products) {
  return cart.reduce((s, i) => {
    const p = products.find(x => x.id === i.id);
    return s + (p ? p.price * i.qty : 0);
  }, 0);
}
