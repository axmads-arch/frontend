export const LOGO_URL = 'https://raw.githubusercontent.com/axmads-arch/frontend/main/logo.jpg';
export const API_URL = 'https://claude-production-0b03.up.railway.app';

export const CATS = [
  { id: 'all',       label: 'Barchasi',    icon: '⊞' },
  { id: 'breakfast', label: 'Nonushta',    icon: 'Н' },
  { id: 'salads',    label: 'Salatlar',    icon: 'С' },
  { id: 'sandwich',  label: 'Sendvichlar', icon: 'СД'},
  { id: 'mains',     label: 'Asosiy',      icon: 'А' },
  { id: 'soups',     label: 'Sho\'rvalar', icon: 'Ш' },
  { id: 'pastry',    label: 'Non',         icon: 'Н' },
  { id: 'drinks',    label: 'Ichimliklar', icon: 'И' },
  { id: 'desserts',  label: 'Desertlar',   icon: 'Д' },
];

export const SORT_OPTS = [
  { id: 'az',        label: 'A dan Z gacha'    },
  { id: 'cheap',     label: 'Arzondan qimmatga'},
  { id: 'expensive', label: 'Qimmatdan arzonga'},
];

export const MENU_ITEMS = [
  { icon: '💳', label: 'Mening kartalarim' },
  { icon: 'ℹ️', label: 'Biz haqimizda'    },
  { icon: '📍', label: 'Filiallar'         },
  { icon: '📞', label: 'Aloqa'             },
  { icon: '🌐', label: 'Til'               },
];

export const fmt = n => Number(n).toLocaleString('ru') + ' UZS';

export const totalItems = cart =>
  Object.values(cart).reduce((a, b) => a + b, 0);

export const totalPrice = (cart, products) =>
  Object.entries(cart).reduce((s, [id, qty]) => {
    const p = products.find(p => p.id === Number(id));
    return s + (p ? p.price * qty : 0);
  }, 0);

export async function fetchProducts(category) {
  const url = category && category !== 'all'
    ? `${API_URL}/api/products?category=${category}`
    : `${API_URL}/api/products`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Mahsulotlar yuklanmadi');
  return res.json();
}

export async function createOrder(orderData) {
  const res = await fetch(`${API_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });
  if (!res.ok) throw new Error('Buyurtma yuborilmadi');
  return res.json();
}

export async function fetchMyOrders(phone) {
  const res = await fetch(`${API_URL}/api/orders/my/${phone}`);
  if (!res.ok) throw new Error('Buyurtmalar yuklanmadi');
  return res.json();
}
