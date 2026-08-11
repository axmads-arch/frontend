// src/types/order.ts
// Buyurtma bilan bog'liq tiplar — alohida faylda, index.ts bilan bog'liq
// saqlash muammolarini chetlab o'tish uchun.

import type { Product } from './index';

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
