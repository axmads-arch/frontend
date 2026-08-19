// src/data/api.ts
import type { Product, CartItem, User, Order } from '../types';

export const API_URL = 'https://claude-production-0b03.up.railway.app/api';
export const LOGO_URL = 'https://raw.githubusercontent.com/axmads-arch/frontend/main/logo.jpg';

export const fmt = (n: number): string => Number(n).toLocaleString('uz-UZ') + " so'm";

export async function fetchProducts(category?: string): Promise<Product[]> {
  const url = category && category !== 'Barchasi'
    ? `${API_URL}/products?category=${encodeURIComponent(category)}`
    : `${API_URL}/products`;
  const r = await fetch(url);
  return r.json();
}

export async function fetchCategories(): Promise<string[]> {
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

// Buyurtma yaratishda backend'ga yuboriladigan ma'lumot shakli
export interface CreateOrderPayload {
  customerPhone: string;
  customerName: string;
  deliveryType: 'delivery' | 'pickup';
  paymentMethod: string;
  address: string;
  comment: string;
  totalPrice: number;
  latitude: number | null;
  longitude: number | null;
  promoCode: string | null;
  discount: number;
  scheduledTime: string | null;
  items: { productId: number; quantity: number; price: number }[];
}

export async function createOrder(data: CreateOrderPayload): Promise<{ id?: number; error?: string }> {
  const r = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return r.json();
}

export async function fetchMyOrders(phone: string): Promise<Order[]> {
  const r = await fetch(`${API_URL}/orders/my/${phone}`);
  return r.json();
}

export async function loginUser(phone: string, name: string) {
  const r = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, name }),
  });
  return r.json();
}

export async function sendOtp(phone: string) {
  const r = await fetch(`${API_URL}/auth/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone }),
  });
  return r.json();
}

export async function verifyOtp(phone: string, otp: string) {
  const r = await fetch(`${API_URL}/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, otp }),
  });
  return r.json();
}

// CART
export function getCart(): CartItem[] {
  try { return JSON.parse(localStorage.getItem('rc_cart') || '[]'); } catch { return []; }
}
export function saveCart(cart: CartItem[]): void {
  localStorage.setItem('rc_cart', JSON.stringify(cart));
}

// USER — faqat localStorage, oddiy va ishonchli
export function getUser(): User | null {
  try {
    const raw = localStorage.getItem('rc_user');
    if (!raw || raw === 'null' || raw === 'undefined') return null;
    const user = JSON.parse(raw);
    if (!user || !user.phone) return null;
    return user;
  } catch {
    return null;
  }
}

export function saveUser(user: User | null): void {
  if (!user) return;
  localStorage.setItem('rc_user', JSON.stringify(user));
  if (user.token) localStorage.setItem('rc_token', user.token);
}

export function removeUser(): void {
  localStorage.removeItem('rc_user');
  localStorage.removeItem('rc_token');
}

export function totalItems(cart: CartItem[]): number {
  return cart.reduce((s, i) => s + i.qty, 0);
}

export function totalPrice(cart: CartItem[], products: Product[]): number {
  return cart.reduce((s, i) => {
    const p = products.find(x => x.id === i.id);
    return s + (p ? p.price * i.qty : 0);
  }, 0);
}

// SEVIMLILAR
export function getFavorites(): number[] {
  try { return JSON.parse(localStorage.getItem('rc_favorites') || '[]'); } catch { return []; }
}
export function saveFavorites(favs: number[]): void {
  localStorage.setItem('rc_favorites', JSON.stringify(favs));
}
export function toggleFavorite(productId: number, favs: number[]): number[] {
  const exists = favs.includes(productId);
  const newFavs = exists ? favs.filter(id => id !== productId) : [...favs, productId];
  saveFavorites(newFavs);
  return newFavs;
}
