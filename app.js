const API = 'https://claude-production-8714.up.railway.app';
let cart = [];
let products = [];
let activeCategory = 'hammasi';

async function loadProducts() {
  try {
    const res = await fetch(`${API}/api/products`);
    products = await res.json();
    if (!Array.isArray(products)) throw new Error();
    renderCategories();
    renderProducts(products);
  } catch {
    document.getElementById('productsGrid').innerHTML = '<div​​​​​​​​​​​​​​​​
