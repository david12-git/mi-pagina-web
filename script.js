// --- VARIABLES GLOBALES ---
let carrito = [];
let categoriaActual = 'todos';

// --- FUNCIONES DE CONFIGURACIÓN ---
function cargarInformacionEmpresa() {
    // Cargar información de contacto desde config.js
    const ubicacionElement = document.getElementById('empresa-ubicacion');
    const telefonoElement = document.getElementById('empresa-telefono');
    const whatsappElement = document.getElementById('empresa-whatsapp');
    const btnWhatsappHero = document.getElementById('btn-whatsapp-hero');
    const whatsappFloat = document.getElementById('whatsapp-float');
    
    if (ubicacionElement && CONFIG.empresa.ubicacion) {
        ubicacionElement.textContent = CONFIG.empresa.ubicacion;
    }
    
    if (telefonoElement && CONFIG.empresa.telefono) {
        telefonoElement.textContent = CONFIG.empresa.telefono;
    }
    
    const whatsappNumber = CONFIG.empresa.whatsapp.replace(/[^0-9]/g, '');
    const mensajeInicial = `Hola! Me gustaría hacer un pedido a ${CONFIG.empresa.nombre}`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(mensajeInicial)}`;
    
    if (whatsappElement) {
        whatsappElement.href = whatsappUrl;
    }
    
    if (btnWhatsappHero) {
        btnWhatsappHero.href = whatsappUrl;
        btnWhatsappHero.target = '_blank';
    }
    
    if (whatsappFloat) {
        whatsappFloat.href = whatsappUrl;
        whatsappFloat.target = '_blank';
    }
}

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

// --- FUNCIONES DEL CARRITO ---
function agregarAlCarrito(id, saborSeleccionado = null) {
    const producto = getProductoPorId(id);
    if (!producto) return;
    
    // Crear un identificador único que incluya el sabor si existe
    const itemId = saborSeleccionado ? `${id}-${saborSeleccionado}` : id;
    const itemExistente = carrito.find(item => item.itemId === itemId);
    
    if (itemExistente) {
        itemExistente.cantidad++;
    } else {
        const nuevoItem = {
            itemId: itemId,
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            cantidad: 1
        };
        
        // Agregar sabor si existe
        if (saborSeleccionado) {
            nuevoItem.sabor = saborSeleccionado;
            nuevoItem.nombre = `${producto.nombre} - ${saborSeleccionado}`;
        }
        
        carrito.push(nuevoItem);
    }
    
    actualizarCarrito();
    const nombreCompleto = saborSeleccionado ? `${producto.nombre} - ${saborSeleccionado}` : producto.nombre;
    mostrarNotificacion(`${nombreCompleto} agregado al carrito`, 'success');
}

function eliminarDelCarrito(itemId) {
    carrito = carrito.filter(item => item.itemId !== itemId);
    actualizarCarrito();
}

function cambiarCantidad(itemId, nuevaCantidad) {
    if (nuevaCantidad <= 0) {
        eliminarDelCarrito(itemId);
        return;
    }
    
    const item = carrito.find(item => item.itemId === itemId);
    if (item) {
        item.cantidad = nuevaCantidad;
        actualizarCarrito();
    }
}

function actualizarCarrito() {
    const carritoCount = document.getElementById('carrito-count');
    const carritoItems = document.getElementById('carrito-items');
    const carritoTotal = document.getElementById('carrito-total');
    
    // Actualizar contador
    const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    carritoCount.textContent = totalItems;
    
    // Actualizar items del carrito
    carritoItems.innerHTML = '';
    
    if (carrito.length === 0) {
        carritoItems.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">Tu carrito está vacío</p>';
    } else {
        carrito.forEach(item => {
            const itemHTML = `
                <div class="carrito-item">
                    <div class="carrito-item-imagen">
                        <img src="${item.imagen}" alt="${item.nombre}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                        <div class="imagen-fallback" style="width: 60px; height: 60px; background: #f0f0f0; border-radius: 8px; display: none; align-items: center; justify-content: center; font-size: 1.5rem;">🍽️</div>
                    </div>
                    <div class="carrito-item-info">
                        <div class="carrito-item-nombre">${item.nombre}</div>
                        <div class="carrito-item-precio">${formatearPrecio(item.precio)}</div>
                        <div class="carrito-item-cantidad">
                            <button class="cantidad-btn" onclick="cambiarCantidad('${item.itemId}', ${item.cantidad - 1})">-</button>
                            <span>${item.cantidad}</span>
                            <button class="cantidad-btn" onclick="cambiarCantidad('${item.itemId}', ${item.cantidad + 1})">+</button>
                            <button class="eliminar-btn" onclick="eliminarDelCarrito('${item.itemId}')" style="margin-left: 10px; background: #ff6b6b; color: white; border: none; border-radius: 50%; width: 25px; height: 25px; cursor: pointer;">×</button>
                        </div>
                    </div>
                </div>`;
            carritoItems.innerHTML += itemHTML;
        });
    }
    
    // Actualizar total
    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    carritoTotal.textContent = total.toLocaleString('es-CO');
}

function mostrarCarrito() {
    const carritoFlotante = document.getElementById('carrito-flotante');
    carritoFlotante.classList.add('show');
}

function cerrarCarrito() {
    const carritoFlotante = document.getElementById('carrito-flotante');
    carritoFlotante.classList.remove('show');
}

function irACheckout() {
    if (carrito.length === 0) {
        mostrarNotificacion('Tu carrito está vacío', 'error');
        return;
    }
    
    let mensaje = '¡Hola! Me gustaría hacer el siguiente pedido:\n\n';
    let total = 0;
    
    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        mensaje += `• ${item.nombre} x${item.cantidad} - ${formatearPrecio(subtotal)}\n`;
        total += subtotal;
    });
    
    mensaje += `\n*Total: ${formatearPrecio(total)}*\n\n¡Gracias!`;
    
    const whatsappNumber = CONFIG.empresa.whatsapp.replace(/[^0-9]/g, '');
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(mensaje)}`;
    window.open(whatsappUrl, '_blank');
}

// --- FUNCIONES DE SABORES ---
function mostrarSelectorSabores(productoId) {
    const producto = getProductoPorId(productoId);
    if (!producto || !producto.sabores) {
        agregarAlCarrito(productoId);
        return;
    }
    
    // Crear modal de selección de sabores
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fas fa-palette"></i> Selecciona el sabor</h3>
                <button onclick="cerrarModalSabores()" class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <h4>${producto.nombre}</h4>
                <p>Elige tu sabor favorito:</p>
                <div class="sabores-grid">
                    ${producto.sabores.map(sabor => `
                        <button class="sabor-btn" onclick="seleccionarSabor(${productoId}, '${sabor}')">
                            <i class="fas fa-glass-whiskey"></i>
                            ${sabor}
                        </button>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 100);
}

function seleccionarSabor(productoId, sabor) {
    agregarAlCarrito(productoId, sabor);
    cerrarModalSabores();
}

function cerrarModalSabores() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => document.body.removeChild(modal), 300);
    }
}

function mostrarNotificacion(mensaje, tipo = 'success') {
    // Crear elemento de notificación
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion ${tipo}`;
    notificacion.innerHTML = `
        <i class="fas ${tipo === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        ${mensaje}
    `;
    
    document.body.appendChild(notificacion);
    
    // Mostrar notificación
    setTimeout(() => notificacion.classList.add('show'), 100);
    
    // Ocultar y eliminar notificación
    setTimeout(() => {
        notificacion.classList.remove('show');
        setTimeout(() => document.body.removeChild(notificacion), 300);
    }, 3000);
}

// --- LÓGICA DE RENDERIZADO ---
function cargarProductos(categoria = 'todos') {
    const productosGrid = document.getElementById('productos-grid');
    if (!productosGrid) return;

    const productos = getProductosPorCategoria(categoria);
    productosGrid.innerHTML = '';
    
    console.log(`Cargando ${productos.length} productos para categoría: ${categoria}`); // Para debug
    
    if (productos.length === 0) {
        productosGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: #666;">
                <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <h3>No hay productos en esta categoría</h3>
                <p>Intenta con otra categoría o ve todos los productos.</p>
                <button onclick="filtrarPorCategoria('todos')" class="btn-primary" style="margin-top: 1rem;">
                    <i class="fas fa-th-large"></i> Ver Todos
                </button>
            </div>
        `;
        return;
    }
    
    productos.forEach(producto => {
        const descuento = Math.round(((producto.precio_anterior - producto.precio) / producto.precio_anterior) * 100);
        
        const productoHTML = `
            <div class="producto-card">
                ${producto.destacado ? '<div class="producto-badge">Destacado</div>' : ''}
                <div class="producto-imagen">
                    <img src="${producto.imagen}" alt="${producto.nombre}" onerror="this.style.display='none'; this.parentElement.classList.add('sin-imagen');">
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
                        ${producto.sabores ? 
                            `<button onclick="mostrarSelectorSabores(${producto.id})" class="btn-agregar-carrito">
                                <i class="fas fa-palette"></i> Elegir Sabor
                            </button>` :
                            `<button onclick="agregarAlCarrito(${producto.id})" class="btn-agregar-carrito">
                                <i class="fas fa-shopping-cart"></i> Agregar
                            </button>`
                        }
                    </div>
                </div>
            </div>`;
        productosGrid.innerHTML += productoHTML;
    });
}

function filtrarPorCategoria(categoria) {
    console.log('Filtrando por categoría:', categoria); // Para debug
    
    // Actualizar productos
    cargarProductos(categoria);
    
    // Scroll suave a la sección de productos
    const section = document.getElementById('productos');
    if(section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Mostrar notificación de filtro aplicado
    const totalProductos = getProductosPorCategoria(categoria).length;
    const mensaje = categoria === 'todos' 
        ? `Mostrando todos los productos (${totalProductos})`
        : `Mostrando ${totalProductos} productos de ${categoria}`;
    
    mostrarNotificacion(mensaje, 'success');
}

// --- ANIMACIONES Y EFECTOS ---
function animarEstadisticas() {
    const stats = [
        { id: 'stat-clientes', valor: '+250', duracion: 2000 },
        { id: 'stat-experiencia', valor: 'Tradición', duracion: 1000 },
        { id: 'stat-soporte', valor: 'Atención Local', duracion: 1500 },
        { id: 'stat-productos', valor: 'Hecho a mano', duracion: 1800 }
    ];
    
    stats.forEach(stat => {
        const elemento = document.getElementById(stat.id);
        if (elemento) {
            if (stat.valor.includes('+')) {
                // Animar números
                const numero = parseInt(stat.valor.replace('+', ''));
                let contador = 0;
                const incremento = numero / (stat.duracion / 50);
                
                const timer = setInterval(() => {
                    contador += incremento;
                    if (contador >= numero) {
                        elemento.textContent = stat.valor;
                        clearInterval(timer);
                    } else {
                        elemento.textContent = '+' + Math.floor(contador);
                    }
                }, 50);
            } else {
                // Mostrar texto con delay
                setTimeout(() => {
                    elemento.textContent = stat.valor;
                }, stat.duracion / 4);
            }
        }
    });
}

// --- EVENT LISTENERS ---
document.addEventListener('DOMContentLoaded', () => {
    cargarInformacionEmpresa();
    cargarProductos();
    
    // Mostrar botón de WhatsApp después de 2 segundos
    setTimeout(() => {
        const whatsappBtn = document.getElementById('whatsapp-float');
        if (whatsappBtn) {
            whatsappBtn.style.opacity = '1';
            whatsappBtn.style.transform = 'scale(1)';
        }
    }, 2000);
    
    // Animar estadísticas cuando sean visibles
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animarEstadisticas();
                observer.unobserve(entry.target);
            }
        });
    });
    
    const statsContainer = document.querySelector('.estadisticas-container');
    if (statsContainer) {
        observer.observe(statsContainer);
    }
    
    // Event listener para el botón del carrito
    const carritoBtn = document.getElementById('carrito-btn');
    if (carritoBtn) {
        carritoBtn.addEventListener('click', (e) => {
            e.preventDefault();
            mostrarCarrito();
        });
    }
    
    // Cerrar carrito al hacer clic fuera
    document.addEventListener('click', (e) => {
        const carritoFlotante = document.getElementById('carrito-flotante');
        const carritoBtn = document.getElementById('carrito-btn');
        
        if (carritoFlotante && carritoFlotante.classList.contains('show')) {
            if (!carritoFlotante.contains(e.target) && !carritoBtn.contains(e.target)) {
                cerrarCarrito();
            }
        }
    });
});
