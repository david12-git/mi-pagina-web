// Inicializar EmailJS (Mantenlo si tienes tu ID, si no, no afecta la carga)
(function() {
    emailjs.init("YOUR_USER_ID"); 
})();

// --- 1. BASE DE DATOS DE PRODUCTOS ---
const productosData = [
    {
        id: 1,
        nombre: 'Tinto Tradicional',
        categoria: 'bebidas calientes',
        precio: 1500,
        precio_anterior: 1800,
        descripcion: 'Café negro recién colado, aroma intenso y sabor balanceado.',
        imagen: 'tinto.jpg',
        stock: 100,
        destacado: false,
        activo: true,
        caracteristicas: ['Grano selecto', 'Siempre caliente']
    },
    {
        id: 2,
        nombre: 'Pintaito',
        categoria: 'bebidas calientes',
        precio: 1800,
        precio_anterior: 2000,
        descripcion: 'El equilibrio perfecto entre café y un toque de leche.',
        imagen: 'pintaito.jpg',
        stock: 100,
        destacado: false,
        activo: true,
        caracteristicas: ['Cremoso', 'Sabor suave']
    },
    {
        id: 3,
        nombre: 'Milo Caliente',
        categoria: 'bebidas calientes',
        precio: 3500,
        precio_anterior: 4000,
        descripcion: 'Bebida de chocolate y malta con toda la energía necesaria.',
        imagen: 'milo.jpg',
        stock: 50,
        destacado: true,
        activo: true,
        caracteristicas: ['Con leche entera', 'Energizante']
    },
    {
        id: 4,
        nombre: 'Aromática de Frutas',
        categoria: 'bebidas calientes',
        precio: 2000,
        precio_anterior: 2500,
        descripcion: 'Infusión natural de hierbabuena con trozos de frutas frescas.',
        imagen: 'aromatica.jpg',
        stock: 80,
        destacado: false,
        activo: true,
        caracteristicas: ['100% Natural', 'Relajante']
    },
    {
        id: 5,
        nombre: 'Chocolate Espumoso',
        categoria: 'bebidas calientes',
        precio: 3000,
        precio_anterior: 3500,
        descripcion: 'Chocolate tradicional batido con molinillo hasta obtener espuma.',
        imagen: 'chocolate.jpg',
        stock: 60,
        destacado: true,
        activo: true,
        caracteristicas: ['Receta tradicional', 'Espumoso']
    },
    {
        id: 6,
        nombre: 'Cifrut',
        categoria: 'bebidas frias',
        precio: 2500,
        precio_anterior: 2800,
        descripcion: 'Bebida refrescante con sabor a frutas tropicales.',
        imagen: 'cifrut.jpg',
        stock: 40,
        destacado: false,
        activo: true,
        caracteristicas: ['Frío', 'Refrescante']
    },
    {
        id: 7,
        nombre: 'Pony Malta',
        categoria: 'bebidas frias',
        precio: 2800,
        precio_anterior: 3200,
        descripcion: 'Bebida de malta nutritiva y refrescante.',
        imagen: 'pony-malta.jpg',
        stock: 40,
        destacado: true,
        activo: true,
        caracteristicas: ['Energía natural']
    },
    {
        id: 8,
        nombre: 'Coca-Cola',
        categoria: 'bebidas frias',
        precio: 3500,
        precio_anterior: 3800,
        descripcion: 'Gaseosa clásica refrescante en presentación personal.',
        imagen: 'cocacola.jpg',
        stock: 60,
        destacado: true,
        activo: true,
        caracteristicas: ['Sabor original']
    },
    {
        id: 9,
        nombre: 'Gaseosa Inn',
        categoria: 'bebidas frias',
        precio: 2200,
        precio_anterior: 2500,
        descripcion: 'Variedad de sabores locales refrescantes.',
        imagen: 'gaseosa-inn.jpg',
        stock: 30,
        destacado: false,
        activo: true,
        caracteristicas: ['Económica']
    },
    {
        id: 10,
        nombre: 'Agua Mineral',
        categoria: 'bebidas frias',
        precio: 2000,
        precio_anterior: 2200,
        descripcion: 'Agua pura de manantial para hidratarte.',
        imagen: 'agua.jpg',
        stock: 100,
        destacado: false,
        activo: true,
        caracteristicas: ['Hidratante']
    },
    {
        id: 11,
        nombre: 'Pastel de Pollo',
        categoria: 'comida',
        precio: 4500,
        precio_anterior: 5000,
        descripcion: 'Hojaldre crocante relleno de pollo desmechado.',
        imagen: 'pastel-pollo.jpg',
        stock: 25,
        destacado: true,
        activo: true,
        caracteristicas: ['Hojaldre fresco', 'Recién horneado']
    },
    {
        id: 12,
        nombre: 'Torta de Carne',
        categoria: 'comida',
        precio: 4800,
        precio_anterior: 5500,
        descripcion: 'Deliciosa base de masa con relleno de carne de res sazonada.',
        imagen: 'torta-carne.jpg',
        stock: 20,
        destacado: false,
        activo: true,
        caracteristicas: ['Sabor casero']
    },
    {
        id: 13,
        nombre: 'Carne Desmechada con Arepa',
        categoria: 'comida',
        precio: 7500,
        precio_anterior: 8500,
        descripcion: 'Carne de res cocinada a fuego lento sobre arepa de maíz.',
        imagen: 'carne-arepa.jpg',
        stock: 15,
        destacado: true,
        activo: true,
        caracteristicas: ['Maíz peto', 'Carne jugosa']
    },
    {
        id: 14,
        nombre: 'Aborrajados',
        categoria: 'comida',
        precio: 3500,
        precio_anterior: 4000,
        descripcion: 'Plátano maduro relleno de queso frito.',
        imagen: 'aborrajado.jpg',
        stock: 30,
        destacado: true,
        activo: true,
        caracteristicas: ['Queso derretido']
    },
    {
        id: 15,
        nombre: 'Empanadas',
        categoria: 'comida',
        precio: 1200,
        precio_anterior: 1500,
        descripcion: 'Deliciosas empanadas caseras con la receta de la casa.',
        imagen: 'Empanadas.jpg',
        stock: 200,
        destacado: true,
        activo: true,
        caracteristicas: ['Crocantes']
    },
    {
        id: 16,
        nombre: 'Papa Rellena',
        categoria: 'comida',
        precio: 3800,
        precio_anterior: 4200,
        descripcion: 'Papa rellena de carne y arroz con capa crujiente.',
        imagen: 'papa-rellena.jpg',
        stock: 40,
        destacado: true,
        activo: true,
        caracteristicas: ['Receta típica']
    }
];

// --- 2. VARIABLES GLOBALES ---
let carrito = [];
let categoriaActual = 'todos';

// --- 3. FUNCIONES DE APOYO (LAS QUE FALTABAN) ---
function getProductosPorCategoria(categoria) {
    if (categoria === 'todos') return productosData;
    return productosData.filter(p => p.categoria === categoria);
}

function getProductoPorId(id) {
    return productosData.find(p => p.id === id);
}

function formatearPrecio(precio) {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(precio);
}

// --- 4. LÓGICA DE CARGA Y RENDERIZADO ---
function cargarEstadisticas() {
    if (typeof CONFIG !== 'undefined' && CONFIG.estadisticas) {
        const stats = CONFIG.estadisticas;
        const mapping = {
            'stat-clientes': stats.clientes,
            'stat-experiencia': stats.experiencia,
            'stat-soporte': stats.soporte,
            'stat-productos': stats.productos
        };
        for (const [id, valor] of Object.entries(mapping)) {
            const el = document.getElementById(id);
            if (el) el.innerText = valor;
        }
    }
}

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
                        ${producto.caracteristicas.map(caracteristica => `<li>${caracteristica}</li>`).join('')}
                    </ul>
                    <div class="producto-stock">
                        <i class="fas fa-check-circle"></i> Stock: ${producto.stock} uds
                    </div>
                    <div class="producto-acciones">
                        <button onclick="agregarAlCarrito(${producto.id})" class="btn-agregar-carrito">
                            <i class="fas fa-shopping-cart"></i> Agregar
                        </button>
                        <button onclick="verDetalleProducto(${producto.id})" class="btn-ver-detalle">
                            <i class="fas fa-eye"></i> Detalle
                        </button>
                    </div>
                </div>
            </div>
        `;
        productosGrid.innerHTML += productoHTML;
    });
}

function filtrarPorCategoria(categoria) {
    categoriaActual = categoria;
    document.querySelectorAll('.filtro-btn').forEach(btn => btn.classList.remove('active'));
    if (event && event.target) event.target.classList.add('active');
    cargarProductos(categoria);
    // Cambiamos 'productos' por 'productos-grid' o la sección de la carta
    const section = document.getElementById('productos-grid');
    if(section) section.scrollIntoView({ behavior: 'smooth' });
}

// --- 5. LÓGICA DEL CARRITO ---
function agregarAlCarrito(productoId) {
    const producto = getProductoPorId(productoId);
    if (!producto) return;
    if (producto.stock <= 0) {
        mostrarNotificacion('Sin stock disponible', 'error');
        return;
    }
    
    const itemExistente = carrito.find(item => item.id === productoId);
    if (itemExistente) {
        if (itemExistente.cantidad >= producto.stock) {
            mostrarNotificacion('Límite de stock alcanzado', 'error');
            return;
        }
        itemExistente.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }
    actualizarCarrito();
    mostrarNotificacion(`${producto.nombre} agregado`, 'success');
}

function actualizarCarrito() {
    const carritoCount = document.getElementById('carrito-count');
    const carritoItems = document.getElementById('carrito-items');
    const carritoTotal = document.getElementById('carrito-total');
    
    const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
    if (carritoCount) carritoCount.textContent = totalItems;
    
    if (carritoItems) {
        carritoItems.innerHTML = carrito.length === 0 
            ? '<p style="text-align: center; padding: 20px;">Tu carrito está vacío</p>'
            : carrito.map(item => `
                <div class="carrito-item">
                    <img src="${item.imagen}" alt="${item.nombre}">
                    <div class="carrito-item-info">
                        <div class="carrito-item-nombre">${item.nombre}</div>
                        <div class="carrito-item-precio">${formatearPrecio(item.precio)}</div>
                        <div class="carrito-item-cantidad">
                            <button onclick="cambiarCantidad(${item.id}, -1)" class="cantidad-btn">-</button>
                            <span>${item.cantidad}</span>
                            <button onclick="cambiarCantidad(${item.id}, 1)" class="cantidad-btn">+</button>
                        </div>
                    </div>
                </div>
            `).join('');
    }
    
    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    if (carritoTotal) carritoTotal.textContent = formatearPrecio(total).replace('$', '').trim();
}

function cambiarCantidad(productoId, cambio) {
    const item = carrito.find(item => item.id === productoId);
    const producto = getProductoPorId(productoId);
    if (!item || !producto) return;
    
    const nuevaCantidad = item.cantidad + cambio;
    if (nuevaCantidad <= 0) {
        carrito = carrito.filter(i => i.id !== productoId);
    } else if (nuevaCantidad <= producto.stock) {
        item.cantidad = nuevaCantidad;
    }
    actualizarCarrito();
}

function abrirCarrito() { 
    const c = document.getElementById('carrito-flotante');
    if(c) c.classList.add('show'); 
}
function cerrarCarrito() { 
    const c = document.getElementById('carrito-flotante');
    if(c) c.classList.remove('show'); 
}

function irACheckout() {
    if (carrito.length === 0) return;
    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    let mensaje = `Hola! Quiero pedir:\n` + carrito.map(i => `- ${i.nombre} x${i.cantidad}`).join('\n');
    mensaje += `\nTotal: ${formatearPrecio(total)}`;
    
    // Si CONFIG no está definido, usa un número por defecto o el tuyo
    const whatsapp = (typeof CONFIG !== 'undefined') ? CONFIG.empresa.whatsapp : '573135771729';
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(mensaje)}`, '_blank');
}

// --- 6. MODALES Y NOTIFICACIONES ---
function verDetalleProducto(productoId) {
    const producto = getProductoPorId(productoId);
    if (!producto) return;
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header"><h3>${producto.nombre}</h3><button onclick="cerrarModal()">&times;</button></div>
            <div class="modal-body">
                <img src="${producto.imagen}" style="width: 100%; border-radius: 10px;">
                <p>${producto.descripcion}</p>
                <button onclick="agregarAlCarrito(${producto.id}); cerrarModal();" class="btn-agregar-carrito">Agregar</button>
            </div>
        </div>`;
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 10);
}

function cerrarModal() {
    const m = document.querySelector('.modal-overlay');
    if (m) { m.classList.remove('show'); setTimeout(() => m.remove(), 300); }
}

function mostrarNotificacion(m, t) {
    const n = document.createElement('div');
    n.className = `notificacion ${t}`;
    n.innerHTML = `<span>${m}</span>`;
    document.body.appendChild(n);
    setTimeout(() => n.classList.add('show'), 10);
    setTimeout(() => { n.classList.remove('show'); setTimeout(() => n.remove(), 300); }, 3000);
}

// --- 7. EVENTOS INICIALES ---
document.addEventListener('DOMContentLoaded', function() {
    cargarProductos();
    cargarEstadisticas();
    
    // WhatsApp Flotante
    const whatsapp = (typeof CONFIG !== 'undefined') ? CONFIG.empresa.whatsapp : '573135771729';
    const w = document.createElement('a');
    w.href = `https://wa.me/${whatsapp}`;
    w.target = '_blank';
    w.className = 'whatsapp-float show';
    w.innerHTML = '<i class="fab fa-whatsapp"></i>';
    document.body.appendChild(w);

    // Carrito click
    const btn = document.getElementById('carrito-btn');
    if(btn) btn.onclick = (e) => { e.preventDefault(); abrirCarrito(); };
});
