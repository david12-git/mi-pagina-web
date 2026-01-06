// --- VARIABLES GLOBALES ---
let carrito = [];
let categoriaActual = 'todos';

// --- FUNCIONES DE APOYO ---
function getProductosPorCategoria(categoria) {
    // productosData ya es accesible porque se cargó en config.js
    if (categoria === 'todos') return productosData;
    return productosData.filter(p => p.categoria === categoria);
}

function getProductoPorId(id) {
    return productosData.find(p => p.id === id);
}

function formatearPrecio(precio) {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(precio);
}

// --- LÓGICA DE RENDERIZADO ---
function cargarProductos(categoria = 'todos') {
    const productosGrid = document.getElementById('productos-grid');
    if (!productosGrid) return;

    const productos = getProductosPorCategoria(categoria);
    productosGrid.innerHTML = '';
    
    productos.forEach(producto => {
        const descuento = Math.round(((producto.precio_anterior - producto.precio) / producto.precio_anterior) * 100);
        
        const productoHTML = `
            <div class="producto-card">
                ${producto.destacado ? '<div class="producto-badge">Destacado</div>' : ''}
                <img src="${producto.imagen}" alt="${producto.nombre}" class="producto-imagen">
                <div class="producto-info">
                    <h3 class="producto-nombre">${producto.nombre}</h3>
                    <p class="producto-descripcion">${producto.descripcion}</p>
                    <div class="producto-precios">
                        <span class="producto-precio">${formatearPrecio(producto.precio)}</span>
                        ${producto.precio_anterior > producto.precio ? 
                            `<span class="producto-precio-anterior">${formatearPrecio(producto.precio_anterior)}</span>
                            <span class="producto-descuento">-${descuento}%</span>` : ''
                        }
                    </div>
                    <ul class="producto-caracteristicas">
                        ${producto.caracteristicas.map(c => `<li>${c}</li>`).join('')}
                    </ul>
                    <div class="producto-acciones">
                        <button onclick="agregarAlCarrito(${producto.id})" class="btn-agregar-carrito">
                            <i class="fas fa-shopping-cart"></i> Agregar
                        </button>
                    </div>
                </div>
            </div>`;
        productosGrid.innerHTML += productoHTML;
    });
}

function filtrarPorCategoria(categoria) {
    cargarProductos(categoria);
    const section = document.getElementById('productos-grid');
    if(section) section.scrollIntoView({ behavior: 'smooth' });
}

// Cargar al iniciar
document.addEventListener('DOMContentLoaded', () => cargarProductos());

