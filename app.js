const API = 'https://claude-production-0b03.up.railway.app';
let cart = [];
let products = [];
let activeCategory = 'hammasi';

async function loadProducts() {
  try {
    const res = await fetch(`${API}/api/products`);
    products = await res.json();
    if (!Array.isArray(products)) throw new Error('Array emas');
    renderCategories();
    renderProducts(products);
  } catch(e) {
    document.getElementById('productsGrid').innerHTML = '<div style="padding:20px;text-align:center;color:red">❌ ' + e.message + '</div>';
  }
}

function renderCategories() {
  const cats = ['hammasi', ...new Set(products.map(p => p.category))];
  document.getElementById('categories').innerHTML = cats.map(cat => `
    <button class="cat-btn ${cat === activeCategory ? 'active' : ''}" onclick="filterCategory('${cat}')">${cat}</button>
  `).join('');
}

function filterCategory(cat) {
  activeCategory = cat;
  renderCategories();
  const filtered = cat === 'hammasi' ? products : products.filter(p => p.category === cat);
  renderProducts(filtered);
}

function renderProducts(list) {
  const grid = document.getElementById('productsGrid');
  if (!list.length) {
    grid.innerHTML = '<div style="padding:40px;text-align:center;color:#888">Mahsulot topilmadi</div>';
    return;
  }
  grid.innerHTML = list.map(p => `
    <div class="product-card">
      <div class="product-img" style="background:#e8f5f1;display:flex;align-items:center;justify-content:center;font-size:2rem">
        ${p.image ? `<img src="${p.image}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover">` : '🍰'}
      </div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-desc">${p.description || ''}</div>
        <div class="product-footer">
          <div class="product-price">${Number(p.price).toLocaleString()} so'm</div>
          <button class="add-btn" onclick="addToCart(${p.id})">+</button>
        </div>
      </div>
    </div>
  `).join('');
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;
  const existing = cart.find(c => c.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({...product, qty: 1});
  }
  updateCartBtn();
}

function updateCartBtn() {
  const total = cart.reduce((s, c) => s + c.qty, 0);
  const sum = cart.reduce((s, c) => s + c.qty * c.price, 0);
  document.getElementById('cartCount').textContent = total;
  document.getElementById('cartSum').textContent = total > 0 ? Number(sum).toLocaleString() + " so'm" : '';
}

function searchProducts(query) {
  const q = query.toLowerCase();
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(q) ||
    (p.description && p.description.toLowerCase().includes(q))
  );
  renderProducts(filtered);
}

document.addEventListener('DOMContentLoaded', loadProducts);
