// --- VARIABLES GLOBALES ---
let carrito = [];
let categoriaActual = 'todos';

// --- 1. FUNCIONES DE AYUDA ---

// Busca un producto específico por su ID
function getProductoPorId(id) {
    // productosData viene de config.js
    if (typeof productosData === 'undefined') return null;
    return productosData.find(p => p.id === id);
}

// Da formato de pesos colombianos (Ej: $2.500)
function formatearPrecio(precio) {
    return new Intl.NumberFormat('es-CO', { 
        style: 'currency', 
        currency: 'COP', 
        minimumFractionDigits: 0 
    }).format(precio);
}

// --- 2. LÓGICA DE MOSTRAR PRODUCTOS ---

function cargarProductos(categoria = 'todos') {
    const productosGrid = document.getElementById('productos-grid');
    
    // Verificación de seguridad
    if (!productosGrid) return;
    if (typeof productosData === 'undefined') {
        productosGrid.innerHTML = '<p>Error: No se cargaron los datos de configuración.</p>';
        return;
    }

    // Filtrar la lista según el botón presionado
    let productosFiltrados;
    if (categoria === 'todos') {
        productosFiltrados = productosData.filter(p => p.activo !== false);
    } else {
        productosFiltrados = productosData.filter(p => p.activo !== false && p.categoria === categoria);
    }
    
    // Limpiar pantalla
    productosGrid.innerHTML = '';
    
    // Si no hay productos en esa categoría
    if (productosFiltrados.length === 0) {
        productosGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
                <i class="fas fa-search" style="font-size: 3rem; color: #ddd; margin-bottom: 20px;"></i>
                <p>No hay productos disponibles en esta categoría por el momento.</p>
                <button onclick="filtrarPorCategoria('todos')" style="margin-top:10px; padding:10px 20px; border:none; background:#e67e22; color:white; border-radius:20px; cursor:pointer;">Ver todo el menú</button>
            </div>`;
        return;
    }

    // Dibujar cada producto
    productosFiltrados.forEach(producto => {
        const descuento = Math.round(((producto.precio_anterior - producto.precio) / producto.precio_anterior) * 100);
        
        const productoHTML = `
            <div class="producto-card">
                ${producto.destacado ? '<div class="producto-badge">Destacado</div>' : ''}
                <div class="producto-imagen">
                    <img src="${producto.imagen}" alt="${producto.nombre}" onerror="this.src='https://via.placeholder.com/300x200?text=Delicias'">
                </div>
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

// Función para los botones de categoría
function filtrarPorCategoria(categoria) {
    categoriaActual = categoria;
    
    // Actualizar estilo de los botones (opcional, si tienes la clase .active en CSS)
    const botones = document.querySelectorAll('.categoria-card'); // Asumiendo que usas los cards como botones
    // Aquí podrías agregar lógica visual si quisieras
    
    cargarProductos(categoria);
    
    // Desplazar suavemente hacia la carta
    const section = document.getElementById('productos');
    if(section) section.scrollIntoView({ behavior: 'smooth' });
}


// --- 3. LÓGICA DEL CARRITO ---

function agregarAlCarrito(productoId) {
    const producto = getProductoPorId(productoId);
    if (!producto) return;
    
    if (producto.stock <= 0) {
        alert('Lo sentimos, este producto está agotado.');
        return;
    }
    
    const itemExistente = carrito.find(item => item.id === productoId);
    
    if (itemExistente) {
        if (itemExistente.cantidad >= producto.stock) {
            alert('Has alcanzado el límite de stock disponible.');
            return;
        }
        itemExistente.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }
    
    actualizarCarrito();
    mostrarNotificacion(`${producto.nombre} agregado al pedido`);
    abrirCarrito();
}

function actualizarCarrito() {
    const carritoCount = document.getElementById('carrito-count');
    const carritoItems = document.getElementById('carrito-items');
    const carritoTotal = document.getElementById('carrito-total');
    
    // Actualizar contador del icono
    const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
    if (carritoCount) carritoCount.textContent = totalItems;
    
    // Actualizar lista visual
    if (carritoItems) {
        if (carrito.length === 0) {
            carritoItems.innerHTML = `
                <div style="text-align: center; padding: 40px 20px;">
                    <i class="fas fa-shopping-basket" style="font-size: 3rem; color: #eee; margin-bottom: 15px;"></i>
                    <p style="color: #666;">Tu canasta está vacía</p>
                    <button onclick="cerrarCarrito()" style="margin-top:10px; color: #e67e22; background:none; border:none; cursor:pointer; text-decoration:underline;">Volver al menú</button>
                </div>`;
        } else {
            carritoItems.innerHTML = carrito.map(item => `
                <div class="carrito-item">
                    <img src="${item.imagen}" alt="${item.nombre}" onerror="this.src='https://via.placeholder.com/60'">
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
    }
    
    // Actualizar precio total
    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    if (carritoTotal) carritoTotal.textContent = formatearPrecio(total).replace('$', '').trim(); // Quitamos el signo $ porque el HTML ya lo tiene
}

function cambiarCantidad(productoId, cambio) {
    const item = carrito.find(item => item.id === productoId);
    const producto = getProductoPorId(productoId);
    if (!item || !producto) return;
    
    const nuevaCantidad = item.cantidad + cambio;
    
    if (nuevaCantidad <= 0) {
        // Eliminar del carrito
        carrito = carrito.filter(i => i.id !== productoId);
    } else if (nuevaCantidad <= producto.stock) {
        item.cantidad = nuevaCantidad;
    } else {
        alert('No hay más unidades disponibles.');
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

// --- 4. FINALIZAR COMPRA (WHATSAPP) ---

function irACheckout() {
    if (carrito.length === 0) {
        alert("Agrega productos antes de pedir.");
        return;
    }
    
    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    
    let mensaje = `👋 ¡Hola! Me gustaría hacer el siguiente pedido:\n\n`;
    
    carrito.forEach(item => {
        mensaje += `▪️ *${item.nombre}* x${item.cantidad} - ${formatearPrecio(item.precio * item.cantidad)}\n`;
    });
    
    mensaje += `\n💰 *Total a pagar: ${formatearPrecio(total)}*`;
    mensaje += `\n\n📍 Quedo atento para la entrega.`;
    
    const numeroWhatsApp = CONFIG.empresa.whatsapp;
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    
    window.open(url, '_blank');
}

// --- 5. NOTIFICACIONES Y EVENTOS ---

function mostrarNotificacion(mensaje) {
    const n = document.createElement('div');
    n.className = 'notificacion success'; // Asumiendo que tienes estilos para esto
    n.innerText = mensaje;
    document.body.appendChild(n);
    
    // Animación simple si no hay CSS específico
    n.style.position = 'fixed';
    n.style.bottom = '20px';
    n.style.left = '50%';
    n.style.transform = 'translateX(-50%)';
    n.style.background = '#2ecc71';
    n.style.color = 'white';
    n.style.padding = '10px 20px';
    n.style.borderRadius = '30px';
    n.style.zIndex = '3000';
    n.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
    
    setTimeout(() => {
        n.remove();
    }, 3000);
}

// Evento principal: Se ejecuta cuando la página carga
document.addEventListener('DOMContentLoaded', function() {
    // 1. Cargar estadísticas
    if (typeof CONFIG !== 'undefined' && CONFIG.estadisticas) {
        const stats = CONFIG.estadisticas;
        if(document.getElementById('stat-clientes')) document.getElementById('stat-clientes').innerText = stats.clientes;
        if(document.getElementById('stat-experiencia')) document.getElementById('stat-experiencia').innerText = stats.experiencia;
        if(document.getElementById('stat-soporte')) document.getElementById('stat-soporte').innerText = stats.soporte;
        if(document.getElementById('stat-productos')) document.getElementById('stat-productos').innerText = stats.productos;
    }

    // 2. Cargar productos iniciales
    cargarProductos();
    
    // 3. Activar botón del carrito en el menú
    const btnCarrito = document.getElementById('carrito-btn');
    if (btnCarrito) {
        btnCarrito.addEventListener('click', (e) => {
            e.preventDefault();
            abrirCarrito();
        });
    }
});
// --- CÓDIGO PARA RECUPERAR EL BOTÓN DE WHATSAPP ---
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si existe la configuración
    if (typeof CONFIG !== 'undefined' && CONFIG.empresa && CONFIG.empresa.whatsapp) {
        const whatsappBtn = document.createElement('a');
        whatsappBtn.href = `https://wa.me/${CONFIG.empresa.whatsapp}`;
        whatsappBtn.target = '_blank';
        // Añadimos la clase 'show' para que el CSS lo haga visible
        whatsappBtn.className = 'whatsapp-float show'; 
        whatsappBtn.innerHTML = '<i class="fab fa-whatsapp"></i>';
        document.body.appendChild(whatsappBtn);
    }
});
