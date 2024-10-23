// Variable global para almacenar los productos
let products = [];

// Función para cargar los productos desde el JSON
async function loadProducts() {
    try {
        const response = await fetch('products.json');
        const data = await response.json();
        products = data.products;
        // Mostrar todos los productos inicialmente
        displayProducts();
    } catch (error) {
        console.error('Error al cargar los productos:', error);
        document.getElementById('productsGrid').innerHTML = '<p>Error al cargar los productos</p>';
    }
}

// Función para mostrar productos
function displayProducts(category = 'todos') {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';

    const filteredProducts = category === 'todos'
        ? products
        : products.filter(product => product.category === category);

    filteredProducts.forEach(product => {
        const productCard = `
                    <div class="product-card">
                        <div class="product-image-container">
                            <img src="${product.image}" alt="${product.name}" class="product-image">
                            <div class="product-overlay">
                                <button class="view-more-btn" onclick="openModal('${product.image}')">Ver más</button>
                            </div>
                        </div>
                        <div class="product-info">
                            <h3>${product.name}</h3>
                            <p>${product.price ? '$'+product.price:""}</p>
                        </div>
                    </div>
                `;
        productsGrid.innerHTML += productCard;
    });
}

// Funciones para el modal
const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');

function openModal(imageSrc) {
    modal.classList.add('active');
    modalImage.src = imageSrc;
    document.body.style.overflow = 'hidden'; // Previene el scroll
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restaura el scroll
}

// Cerrar modal con el botón
document.querySelector('.close-modal').addEventListener('click', closeModal);

// Cerrar modal haciendo clic fuera de la imagen
modal.addEventListener('click', function (e) {
    if (e.target === modal) {
        closeModal();
    }
});

// Event listeners para los botones de categoría
document.querySelectorAll('.category-btn').forEach(button => {
    button.addEventListener('click', () => {
        // Remover clase active de todos los botones
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        // Agregar clase active al botón clickeado
        button.classList.add('active');
        // Mostrar productos de la categoría seleccionada
        displayProducts(button.dataset.category);
    });
});

// Mostrar todos los productos al cargar la página
displayProducts();


// Cargar los productos cuando la página se cargue
document.addEventListener('DOMContentLoaded', loadProducts);

