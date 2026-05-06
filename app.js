const API = 'https://claude-production-0b03.up.railway.app';
let cart = [];
let products = [];
let activeCategory = 'hammasi';

async function loadProducts() {
  try {
    const res = await fetch(`${API}/api/products`);
    const text = await res.text();
    products = JSON.parse(text);
    if (!Array.isArray(products)) throw new Error('Array emas');
    renderCategories();
    renderProducts(products);
  } catch(e) {
    document.getElementById('productsGrid').innerHTML = '<div class="loading"><p>❌ ' + e.message + '</p></div>';
  }
}

function renderCategories() {
  const cats = ['hammasi', ...new Set(products.map(p => p.category))];
  document.getElementById('categories').innerHTML = cats.map(cat => `
    <button class="cat-btn ${cat === activeCategory ? 'active' : ''
