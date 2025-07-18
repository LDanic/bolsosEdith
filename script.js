// script.js

let products = [];

// Carga JSON y arranca todo
async function loadProducts() {
  try {
    const res = await fetch('products.json');
    const data = await res.json();
    products = data.products;

    // Sección de destacados en Inicio
    if (document.getElementById('featuredGrid')) {
      displayFeatured();
    }
    // Página Productos: filtros y listado
    if (document.getElementById('productsGrid')) {
      initCategoryFilters();
      displayProducts('todos');
    }

    // Tras inyectar tarjetas, inicializa sus carruseles
    initCardCarousels();
  } catch (e) {
    console.error('Error cargando productos:', e);
  }
}

// Mostrar hasta 4 special en Inicio
function displayFeatured() {
  const grid = document.getElementById('featuredGrid');
  grid.innerHTML = '';
  const specials = products.filter(p => p.special).slice(0, 4);
  if (!specials.length) {
    grid.innerHTML = '<p>No hay productos destacados.</p>';
    return;
  }
  specials.forEach(p => grid.innerHTML += productCard(p));
}

// Genera botones de filtro dinámicos
function initCategoryFilters() {
  const container = document.getElementById('categoryFilters');
  container.innerHTML = '';
  const cats = ['todos', ...new Set(products.map(p => p.category).filter(Boolean))];
  cats.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'category-btn';
    btn.dataset.category = cat;
    btn.textContent = cat === 'todos' ? 'Todos' : capitalize(cat);
    if (cat === 'todos') btn.classList.add('active');
    btn.addEventListener('click', () => {
      document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      displayProducts(cat);
      initCardCarousels();
    });
    container.appendChild(btn);
  });
}

// Muestra productos según categoría
function displayProducts(category) {
  const grid = document.getElementById('productsGrid');
  grid.innerHTML = '';
  const filtered = category === 'todos'
    ? products
    : products.filter(p => p.category === category);
  if (!filtered.length) {
    grid.innerHTML = '<p>No hay productos en esta categoría.</p>';
    return;
  }
  filtered.forEach(p => grid.innerHTML += productCard(p));
}

// Plantilla de tarjeta con mini-carrusel
function productCard(product) {
  const imgs = product.images || [product.image];
  const slides = imgs.map(src =>
    `<img src="${src}" alt="${product.name}" class="card-slide"/>`
  ).join('');
  const arrows = imgs.length > 1
    ? `<button class="card-btn prev-btn">‹</button>
       <button class="card-btn next-btn">›</button>`
    : ``;

  return `
    <div class="product-card">
      <div class="card-carousel">
        <div class="card-track">
          ${slides}
        </div>
        ${arrows}
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.price ? '$' + product.price : ''}</p>
      </div>
    </div>`;
}

// Inicializa carruseles dentro de cada tarjeta
function initCardCarousels() {
  document.querySelectorAll('.card-carousel').forEach(carousel => {
    const track = carousel.querySelector('.card-track');
    const slides = Array.from(track.children);
    let current = 0;
    const prevBtn = carousel.querySelector('.prev-btn');
    const nextBtn = carousel.querySelector('.next-btn');

    // Si solo una imagen, ocultar flechas
    if (slides.length < 2) {
      if (prevBtn) prevBtn.style.display = 'none';
      if (nextBtn) nextBtn.style.display = 'none';
      return;
    }

    function update() {
      track.style.transform = `translateX(-${current * 100}%)`;
    }
    prevBtn.onclick = () => {
      current = (current - 1 + slides.length) % slides.length;
      update();
    };
    nextBtn.onclick = () => {
      current = (current + 1) % slides.length;
      update();
    };
    update();
  });
}

// Inicializa el carrusel principal de Inicio
function initCarousel() {
  const track = document.querySelector('.carousel-track');
  if (!track) return;
  const slides = Array.from(track.children);
  let current = 0;
  document.querySelector('.next')?.addEventListener('click', () => {
    current = (current + 1) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
  });
  document.querySelector('.prev')?.addEventListener('click', () => {
    current = (current - 1 + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
  });
}

// Inicializa menú móvil
function initMenuToggle() {
  document.querySelector('.menu-toggle')?.addEventListener('click', () => {
    document.querySelector('.nav-links')?.classList.toggle('open');
  });
}

// Capitaliza primera letra
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Arranca todo al cargar
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  initCarousel();
  initMenuToggle();
});
