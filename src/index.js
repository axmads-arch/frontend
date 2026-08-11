// src/types/index.ts
// Butun ilova bo'ylab ishlatiladigan umumiy tiplar.
// Bitta joyda saqlanadi — o'zgarsa, hamma joyda avtomatik yangilanadi.

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description?: string;
  image?: string;
  available: boolean;
  stock: number | null; // null = cheksiz
}

export interface CartItem {
  id: number;    // Product.id
  qty: number;
}

export interface Banner {
  id: number;
  image: string;
  title?: string;
}

export interface Settings {
  siteName?: string;
  bannerText?: string;
  phone?: string;
  address?: string;
  instagram?: string;
  deliveryPrice?: number;
  minOrderPrice?: number;
  isOpen?: boolean;
}

export interface User {
  phone: string;
  name: string;
  token: string;
}

export type TabKey = 'home' | 'cart' | 'orders' | 'profile';

export interface NavItem {
  key: TabKey;
  label: string;
  icon: string;
}

export type OrderStatus = 'new' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  product?: Product;
}

export interface Order {
  id: number;
  status: OrderStatus;
  deliveryType: 'delivery' | 'pickup';
  paymentMethod: string;
  address?: string;
  totalPrice: number;
  createdAt: string;
  scheduledTime?: string | null;
  items?: OrderItem[];
}
