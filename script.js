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

function getStockDisponible(id, sabor = null) {
    const producto = getProductoPorId(id);
    if (!producto) return 0;

    // Calcular cuántos items de este producto (y sabor específico) hay en el carrito
    const itemId = sabor ? `${id}-${sabor}` : String(id);
    const itemEnCarrito = carrito.find(item => String(item.itemId) === String(itemId));
    const cantidadEnCarrito = itemEnCarrito ? itemEnCarrito.cantidad : 0;

    const stockDisponible = Math.max(0, producto.stock - cantidadEnCarrito);

    // Debug para verificar cálculos
    console.log(`Stock disponible para ${producto.nombre}${sabor ? ` (${sabor})` : ''}: ${producto.stock} - ${cantidadEnCarrito} = ${stockDisponible}`);

    return stockDisponible;
}

function formatearPrecio(precio) {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(precio);
}

// --- FUNCIONES DEL CARRITO ---
function agregarAlCarrito(id) {
    const producto = getProductoPorId(id);
    if (!producto) return;

    // Obtener sabor seleccionado si el producto tiene sabores
    let saborSeleccionado = null;
    let nombreCompleto = producto.nombre;

    if (producto.sabores) {
        const selectorSabor = document.getElementById(`sabor-${id}`);
        if (selectorSabor) {
            saborSeleccionado = selectorSabor.value;
            nombreCompleto = `${producto.nombre} (${saborSeleccionado})`;
        }
    }

    // Verificar stock disponible
    const stockDisponible = getStockDisponible(id, saborSeleccionado);
    if (stockDisponible <= 0) {
        mostrarNotificacion(`${nombreCompleto} está agotado`, 'error');
        return;
    }

    // Crear un ID único que incluya el sabor si existe
    const itemId = saborSeleccionado ? `${id}-${saborSeleccionado}` : String(id);

    const itemExistente = carrito.find(item => String(item.itemId) === String(itemId));

    if (itemExistente) {
        // Verificar si se puede agregar una unidad más
        if (itemExistente.cantidad >= producto.stock) {
            mostrarNotificacion(`No hay más stock disponible de ${nombreCompleto}`, 'error');
            return;
        }
        itemExistente.cantidad++;
    } else {
        carrito.push({
            id: producto.id,
            itemId: itemId,
            nombre: nombreCompleto,
            precio: producto.precio,
            imagen: producto.imagen,
            sabor: saborSeleccionado,
            cantidad: 1
        });
    }

    actualizarCarrito();
    mostrarNotificacion(`${nombreCompleto} agregado al carrito`, 'success');

    // Recargar productos para actualizar el stock mostrado
    setTimeout(() => {
        const categoriaActual = new URLSearchParams(window.location.search).get('categoria') || 'todos';
        cargarProductos(categoriaActual);
    }, 100);
}

function eliminarDelCarrito(itemId) {
    const itemIdStr = String(itemId);
    carrito = carrito.filter(item => String(item.itemId) !== itemIdStr);
    actualizarCarrito();
}

function cambiarCantidad(itemId, nuevaCantidad) {
    console.log('=== INICIO cambiarCantidad ===');
    console.log('ItemId recibido:', itemId, 'Nueva cantidad:', nuevaCantidad);
    console.log('Carrito actual:', carrito.map(item => ({ itemId: item.itemId, nombre: item.nombre })));

    if (nuevaCantidad <= 0) {
        console.log('Cantidad <= 0, eliminando del carrito');
        eliminarDelCarrito(itemId);
        return;
    }

    // Convertir itemId a string para asegurar comparación correcta
    const itemIdStr = String(itemId);
    const item = carrito.find(item => String(item.itemId) === itemIdStr);
    console.log('Item encontrado:', item);

    if (!item) {
        console.error('Item no encontrado en carrito. ItemId buscado:', itemIdStr);
        console.log('ItemIds en carrito:', carrito.map(item => String(item.itemId)));
        return;
    }

    // Obtener el producto original para verificar stock
    const producto = getProductoPorId(item.id);
    console.log('Producto encontrado:', producto);

    if (!producto) {
        console.error('Producto no encontrado:', item.id);
        return;
    }

    const cantidadActual = item.cantidad;
    console.log('Cantidad actual:', cantidadActual, 'Stock disponible:', producto.stock);

    // Si está intentando aumentar la cantidad
    if (nuevaCantidad > cantidadActual) {
        console.log('Intentando aumentar cantidad');
        // Verificar si hay stock suficiente
        if (cantidadActual >= producto.stock) {
            console.log('Sin stock suficiente');
            mostrarNotificacion(`No hay más stock disponible de ${item.nombre}`, 'error');
            return;
        }
    }

    // Actualizar cantidad
    console.log('Actualizando cantidad de', cantidadActual, 'a', nuevaCantidad);
    item.cantidad = nuevaCantidad;
    console.log('Cantidad actualizada. Item ahora:', item);

    // Actualizar carrito
    console.log('Llamando actualizarCarrito()');
    actualizarCarrito();

    // Recargar productos para actualizar el stock mostrado
    setTimeout(() => {
        try {
            const categoriaActual = new URLSearchParams(window.location.search).get('categoria') || 'todos';
            cargarProductos(categoriaActual);
        } catch (error) {
            console.error('Error recargando productos:', error);
        }
    }, 100);

    console.log('=== FIN cambiarCantidad ===');
}

function actualizarCarrito() {
    try {
        const carritoCount = document.getElementById('carrito-count');
        const carritoItems = document.getElementById('carrito-items');
        const carritoTotal = document.getElementById('carrito-total');

        if (!carritoCount || !carritoItems || !carritoTotal) {
            console.error('Elementos del carrito no encontrados');
            return;
        }

        // Actualizar contador
        const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
        carritoCount.textContent = totalItems;

        // Actualizar items del carrito
        carritoItems.innerHTML = '';

        if (carrito.length === 0) {
            carritoItems.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">Tu carrito está vacío</p>';
        } else {
            carrito.forEach(item => {
                try {
                    // Verificar stock disponible para este item
                    const producto = getProductoPorId(item.id);
                    if (!producto) return;

                    const puedeAumentar = item.cantidad < producto.stock;

                    const itemHTML = `
                        <div class="carrito-item">
                            <div class="carrito-item-imagen">
                                <img src="${item.imagen}" 
                                     alt="${item.nombre}" 
                                     onerror="this.src='data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'60\' height=\'60\' viewBox=\'0 0 60 60\'%3E%3Crect width=\'60\' height=\'60\' rx=\'8\' fill=\'%23f0f0f0\'/%3E%3Ctext x=\'30\' y=\'38\' font-family=\'Arial\' font-size=\'20\' fill=\'%23999\' text-anchor=\'middle\'%3E🍽️%3C/text%3E%3C/svg%3E';">
                            </div>
                            <div class="carrito-item-info">
                                <div class="carrito-item-nombre">${item.nombre}</div>
                                <div class="carrito-item-precio">${formatearPrecio(item.precio)}</div>
                                <div class="carrito-item-cantidad">
                                    <button class="cantidad-btn disminuir" data-id="${item.itemId}" type="button">-</button>
                                    <span>${item.cantidad}</span>
                                    <button class="cantidad-btn aumentar ${!puedeAumentar ? 'btn-deshabilitado' : ''}" 
                                            data-id="${item.itemId}"
                                            type="button"
                                            ${!puedeAumentar ? 'disabled title="Sin más stock disponible"' : ''}>+</button>
                                    <button class="eliminar-btn" data-id="${item.itemId}" type="button" style="margin-left: 10px; background: #ff6b6b; color: white; border: none; border-radius: 50%; width: 25px; height: 25px; cursor: pointer;">×</button>
                                </div>
                                ${!puedeAumentar ? '<div style="font-size: 0.8rem; color: #ff8c00; margin-top: 5px;"><i class="fas fa-exclamation-triangle"></i> Stock máximo alcanzado</div>' : ''}
                            </div>
                        </div>`;
                    carritoItems.innerHTML += itemHTML;
                } catch (error) {
                    console.error('Error renderizando item del carrito:', error, item);
                }
            });
        }

        // Actualizar total
        const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
        carritoTotal.textContent = total.toLocaleString('es-CO');

        console.log('Carrito actualizado correctamente'); // Debug
    } catch (error) {
        console.error('Error actualizando carrito:', error);
    }
}

function mostrarCarrito() {
    const carritoFlotante = document.getElementById('carrito-flotante');
    carritoFlotante.classList.add('show');

    // Asegurar que los event listeners estén activos
    setupCarritoEventListeners();
}

// Función para configurar event listeners específicos del carrito
function setupCarritoEventListeners() {
    const carritoItems = document.getElementById('carrito-items');
    if (!carritoItems) return;

    // Remover listeners anteriores para evitar duplicados
    carritoItems.removeEventListener('click', handleCarritoClick);

    // Agregar nuevo listener
    carritoItems.addEventListener('click', handleCarritoClick);
}

// Función para manejar clics en el carrito
function handleCarritoClick(e) {
    e.stopPropagation();

    const target = e.target;
    const itemId = target.getAttribute('data-id');

    console.log('=== CLIC EN CARRITO ===');
    console.log('Target:', target);
    console.log('Classes:', target.classList.toString());
    console.log('Data-id:', itemId);
    console.log('Carrito actual:', carrito.map(item => ({ itemId: item.itemId, nombre: item.nombre })));

    if (!itemId) {
        console.log('No hay data-id, saliendo');
        return;
    }

    // Convertir a string para comparación consistente
    const itemIdStr = String(itemId);

    // Botón disminuir
    if (target.classList.contains('disminuir')) {
        console.log('Clic en disminuir:', itemIdStr);
        const item = carrito.find(item => String(item.itemId) === itemIdStr);
        console.log('Item encontrado para disminuir:', item);
        if (item) {
            cambiarCantidad(itemIdStr, item.cantidad - 1);
        } else {
            console.error('No se encontró el item para disminuir');
        }
    }

    // Botón aumentar
    else if (target.classList.contains('aumentar') && !target.disabled) {
        console.log('Clic en aumentar:', itemIdStr);
        const item = carrito.find(item => String(item.itemId) === itemIdStr);
        console.log('Item encontrado para aumentar:', item);
        if (item) {
            cambiarCantidad(itemIdStr, item.cantidad + 1);
        } else {
            console.error('No se encontró el item para aumentar');
        }
    }

    // Botón eliminar
    else if (target.classList.contains('eliminar-btn')) {
        console.log('Clic en eliminar:', itemIdStr);
        eliminarDelCarrito(itemIdStr);
    }

    console.log('=== FIN CLIC EN CARRITO ===');
}

function procesarPedido() {
    console.log('=== PROCESANDO PEDIDO ===');
    console.log('Carrito antes del pedido:', carrito);

    // Crear copia del carrito para el mensaje
    const pedidoRealizado = [...carrito];

    // Actualizar stock de cada producto
    carrito.forEach(item => {
        const producto = getProductoPorId(item.id);
        if (producto) {
            console.log(`Actualizando stock de ${producto.nombre}: ${producto.stock} -> ${producto.stock - item.cantidad}`);
            producto.stock -= item.cantidad;

            // Asegurar que el stock no sea negativo
            if (producto.stock < 0) {
                producto.stock = 0;
            }
        }
    });

    // Generar mensaje para WhatsApp
    let mensaje = '¡Hola! Me gustaría hacer el siguiente pedido:\n\n';
    let total = 0;

    pedidoRealizado.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        mensaje += `• ${item.nombre} x${item.cantidad} - ${formatearPrecio(subtotal)}\n`;
        total += subtotal;
    });

    mensaje += `\n*Total: ${formatearPrecio(total)}*\n\n¡Gracias!`;

    // Limpiar carrito
    carrito.length = 0;

    // Actualizar interfaz
    actualizarCarrito();

    // Recargar productos para mostrar el nuevo stock
    const categoriaActual = new URLSearchParams(window.location.search).get('categoria') || 'todos';
    cargarProductos(categoriaActual);

    // Cerrar carrito
    cerrarCarrito();

    // Mostrar notificación de éxito
    mostrarNotificacion('¡Pedido procesado! Stock actualizado automáticamente', 'success');

    // Abrir WhatsApp
    const whatsappUrl = `https://wa.me/573135771729?text=${encodeURIComponent(mensaje)}`;
    window.open(whatsappUrl, '_blank');

    // Verificar stock después del pedido
    setTimeout(() => {
        const estadoStock = verificarStockBajo();
        if (estadoStock.agotados.length > 0) {
            mostrarNotificacion(`${estadoStock.agotados.length} productos se han agotado`, 'error');
        } else if (estadoStock.stockBajo.length > 0) {
            mostrarNotificacion(`${estadoStock.stockBajo.length} productos tienen stock bajo`, 'error');
        }
    }, 2000);

    console.log('=== PEDIDO PROCESADO ===');
    console.log('Stock actualizado en productos');
}

function cerrarCarrito() {
    const carritoFlotante = document.getElementById('carrito-flotante');
    carritoFlotante.classList.remove('show');
}

// Función para restaurar stock (útil para testing o cancelaciones)
function restaurarStock() {
    // Restaurar stock original de todos los productos
    productosData.forEach(producto => {
        // Buscar el producto original en CONFIG.productos
        const productoOriginal = CONFIG.productos.find(p => p.id === producto.id);
        if (productoOriginal) {
            producto.stock = productoOriginal.stock;
        }
    });

    // Recargar productos para mostrar el stock restaurado
    const categoriaActual = new URLSearchParams(window.location.search).get('categoria') || 'todos';
    cargarProductos(categoriaActual);

    mostrarNotificacion('Stock restaurado a valores originales', 'success');
    console.log('Stock restaurado para todos los productos');
}

// Función para verificar stock bajo
function verificarStockBajo() {
    const productosStockBajo = productosData.filter(producto =>
        producto.stock > 0 && producto.stock <= 5
    );

    const productosAgotados = productosData.filter(producto =>
        producto.stock === 0
    );

    if (productosAgotados.length > 0) {
        console.warn('Productos agotados:', productosAgotados.map(p => p.nombre));
    }

    if (productosStockBajo.length > 0) {
        console.warn('Productos con stock bajo:', productosStockBajo.map(p => `${p.nombre} (${p.stock})`));
    }

    return {
        stockBajo: productosStockBajo,
        agotados: productosAgotados
    };
}

function irACheckout() {
    if (carrito.length === 0) {
        mostrarNotificacion('Tu carrito está vacío', 'error');
        return;
    }

    // Verificar stock disponible antes de procesar el pedido
    const stockInsuficiente = [];

    carrito.forEach(item => {
        const producto = getProductoPorId(item.id);
        if (!producto) {
            stockInsuficiente.push(`${item.nombre} - Producto no encontrado`);
            return;
        }

        const stockDisponible = getStockDisponible(item.id, item.sabor);
        if (item.cantidad > stockDisponible) {
            stockInsuficiente.push(`${item.nombre} - Solo quedan ${stockDisponible} disponibles`);
        }
    });

    if (stockInsuficiente.length > 0) {
        mostrarNotificacion(`Stock insuficiente para: ${stockInsuficiente.join(', ')}`, 'error');
        actualizarCarrito(); // Actualizar para mostrar el stock real
        return;
    }

    // Procesar el pedido y actualizar stock
    procesarPedido();
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
        const stockDisponible = getStockDisponible(producto.id);

        // Determinar el estado del stock
        let stockClass = 'stock-disponible';
        let stockTexto = `${stockDisponible} disponibles`;

        if (stockDisponible === 0) {
            stockClass = 'stock-agotado';
            stockTexto = 'Agotado';
        } else if (stockDisponible <= 5) {
            stockClass = 'stock-bajo';
            stockTexto = `¡Solo ${stockDisponible} disponibles!`;
        }

        // Generar selector de sabores si el producto los tiene
        const selectorSabores = producto.sabores ? `
            <div class="producto-sabores" style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #2c3e50;">Elige tu sabor:</label>
                <select id="sabor-${producto.id}" class="selector-sabor" style="width: 100%; padding: 8px 12px; border: 2px solid rgba(102, 126, 234, 0.2); border-radius: 8px; font-size: 0.9rem; background: white;">
                    ${producto.sabores.map(sabor => `<option value="${sabor}">${sabor}</option>`).join('')}
                </select>
            </div>
        ` : '';

        const productoHTML = `
            <div class="producto-card ${stockDisponible === 0 ? 'producto-agotado' : ''}">
                ${producto.destacado ? '<div class="producto-badge"><i class="fas fa-star"></i> Destacado</div>' : ''}
                <div class="producto-imagen">
                    <img src="${producto.imagen}" alt="${producto.nombre}" onerror="this.style.display='none'; this.parentElement.classList.add('sin-imagen');">
                    ${stockDisponible === 0 ? '<div class="overlay-agotado"><span>AGOTADO</span></div>' : ''}
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
                    <div class="producto-stock">
                        <i class="fas ${stockDisponible === 0 ? 'fa-times-circle' : stockDisponible <= 5 ? 'fa-exclamation-triangle' : 'fa-check-circle'}"></i>
                        <span class="${stockClass}">${stockTexto}</span>
                    </div>
                    <ul class="producto-caracteristicas">
                        ${producto.caracteristicas.map(c => `<li>${c}</li>`).join('')}
                    </ul>
                    ${selectorSabores}
                    <div class="producto-acciones">
                        <button onclick="agregarAlCarrito(${producto.id})" 
                                class="btn-agregar-carrito ${stockDisponible === 0 ? 'btn-deshabilitado' : ''}" 
                                ${stockDisponible === 0 ? 'disabled' : ''}>
                            <i class="fas ${stockDisponible === 0 ? 'fa-ban' : 'fa-shopping-cart'}"></i> 
                            ${stockDisponible === 0 ? 'Agotado' : 'Agregar'}
                        </button>
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
    if (section) {
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
            // Verificar si el clic fue en el carrito o en sus elementos internos
            const clickEnCarrito = carritoFlotante.contains(e.target);
            const clickEnBotonCarrito = carritoBtn && carritoBtn.contains(e.target);

            // No cerrar si el clic fue dentro del carrito o en sus botones
            if (!clickEnCarrito && !clickEnBotonCarrito) {
                cerrarCarrito();
            }
        }
    });

    // Event delegation para botones del carrito
    document.addEventListener('click', (e) => {
        // Botón disminuir cantidad
        if (e.target.classList.contains('disminuir')) {
            e.preventDefault();
            e.stopPropagation();
            const itemId = e.target.getAttribute('data-id');
            console.log('Disminuir cantidad para item:', itemId); // Debug

            // Encontrar el item en el carrito
            const itemIdStr = String(itemId);
            const item = carrito.find(item => String(item.itemId) === itemIdStr);
            if (item) {
                cambiarCantidad(itemIdStr, item.cantidad - 1);
            }
        }

        // Botón aumentar cantidad
        if (e.target.classList.contains('aumentar') && !e.target.disabled) {
            e.preventDefault();
            e.stopPropagation();
            const itemId = e.target.getAttribute('data-id');
            console.log('Aumentar cantidad para item:', itemId); // Debug

            // Encontrar el item en el carrito
            const itemIdStr = String(itemId);
            const item = carrito.find(item => String(item.itemId) === itemIdStr);
            if (item) {
                cambiarCantidad(itemIdStr, item.cantidad + 1);
            }
        }

        // Botón eliminar
        if (e.target.classList.contains('eliminar-btn')) {
            e.preventDefault();
            e.stopPropagation();
            const itemId = e.target.getAttribute('data-id');
            console.log('Eliminar item:', itemId); // Debug
            eliminarDelCarrito(String(itemId));
        }
    });
});


// --- FUNCIONALIDAD DEL FORMULARIO DE CONTACTO ---

// Validadores
const validadores = {
    nombre: (valor) => {
        if (!valor.trim()) return 'El nombre es obligatorio';
        if (valor.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres';
        if (valor.trim().length > 50) return 'El nombre no puede tener más de 50 caracteres';
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor.trim())) return 'El nombre solo puede contener letras y espacios';
        return null;
    },

    email: (valor) => {
        if (!valor.trim()) return 'El correo electrónico es obligatorio';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(valor.trim())) return 'Por favor ingresa un correo electrónico válido';
        return null;
    },

    telefono: (valor) => {
        if (valor.trim() && !/^[\d\s\+\-\(\)]+$/.test(valor.trim())) {
            return 'Por favor ingresa un número de teléfono válido';
        }
        return null;
    },

    mensaje: (valor) => {
        if (!valor.trim()) return 'El mensaje es obligatorio';
        if (valor.trim().length < 10) return 'El mensaje debe tener al menos 10 caracteres';
        if (valor.trim().length > 500) return 'El mensaje no puede tener más de 500 caracteres';
        return null;
    }
};

// Función para validar un campo individual
function validarCampo(campo, valor) {
    const error = validadores[campo] ? validadores[campo](valor) : null;
    const inputElement = document.getElementById(campo);
    const errorElement = document.getElementById(`error-${campo}`);

    if (!inputElement) {
        console.warn(`Elemento no encontrado: ${campo}`);
        return true; // Si no existe el elemento, consideramos que es válido
    }

    if (error) {
        inputElement.classList.add('error');
        inputElement.classList.remove('success');
        if (errorElement) {
            errorElement.textContent = error;
        }
        return false;
    } else {
        inputElement.classList.remove('error');
        inputElement.classList.add('success');
        if (errorElement) {
            errorElement.textContent = '';
        }
        return true;
    }
}

// Función para validar todo el formulario
function validarFormulario() {
    const campos = ['nombre', 'email', 'telefono', 'mensaje'];
    let esValido = true;

    campos.forEach(campo => {
        const input = document.getElementById(campo);
        const valor = input ? input.value : '';
        if (!validarCampo(campo, valor)) {
            esValido = false;
        }
    });

    return esValido;
}

// Función para mostrar mensaje del formulario
function mostrarMensajeFormulario(mensaje, tipo) {
    const messageElement = document.getElementById('form-message');
    messageElement.textContent = mensaje;
    messageElement.className = `form-message ${tipo}`;
    messageElement.style.display = 'block';

    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
        messageElement.style.display = 'none';
    }, 5000);
}

// Función para enviar por WhatsApp
function enviarPorWhatsApp(datos) {
    const mensaje = `¡Hola! Me comunico desde la web de Las Delicias de la Abuela.

*Mis datos:*
• Nombre: ${datos.nombre}
• Email: ${datos.email}
${datos.telefono ? `• Teléfono: ${datos.telefono}` : ''}

*Mi mensaje:*
${datos.mensaje}

¡Gracias por su atención!`;

    const whatsappUrl = `https://wa.me/573135771729?text=${encodeURIComponent(mensaje)}`;
    window.open(whatsappUrl, '_blank');
}

// Función para enviar por email (con EmailJS)
function enviarPorEmail(datos) {
    // Verificar si EmailJS está configurado
    if (CONFIG.emailjs.user_id === 'YOUR_USER_ID') {
        console.log('EmailJS no configurado, usando simulación');
        // Simulamos un envío exitoso después de 2 segundos
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true });
            }, 2000);
        });
    }

    // Configurar EmailJS si no está inicializado
    if (typeof emailjs !== 'undefined') {
        emailjs.init(CONFIG.emailjs.user_id);
    } else {
        throw new Error('EmailJS no está cargado');
    }

    // Preparar los datos para el template
    const templateParams = {
        from_name: datos.nombre,
        from_email: datos.email,
        from_phone: datos.telefono || 'No proporcionado',
        message: datos.mensaje,
        to_email: CONFIG.formulario.email_destino,
        reply_to: datos.email,
        // Información adicional
        fecha: new Date().toLocaleDateString('es-CO'),
        hora: new Date().toLocaleTimeString('es-CO'),
        sitio_web: 'Las Delicias de la Abuela'
    };

    // Enviar email usando EmailJS
    return emailjs.send(
        CONFIG.emailjs.service_id,
        CONFIG.emailjs.template_id,
        templateParams
    ).then(
        function (response) {
            console.log('Email enviado exitosamente:', response.status, response.text);
            return { success: true, response: response };
        },
        function (error) {
            console.error('Error al enviar email:', error);
            throw error;
        }
    );
}

// Función principal para manejar el envío del formulario
async function manejarEnvioFormulario(event) {
    event.preventDefault();

    // Validar formulario
    if (!validarFormulario()) {
        mostrarMensajeFormulario('Por favor corrige los errores antes de enviar', 'error');
        return;
    }

    // Obtener datos del formulario
    const datos = {
        nombre: document.getElementById('nombre').value.trim(),
        email: document.getElementById('email').value.trim(),
        telefono: document.getElementById('telefono').value.trim(),
        mensaje: document.getElementById('mensaje').value.trim()
    };

    // Mostrar estado de carga
    const btnEnviar = document.getElementById('btn-enviar');
    const btnText = btnEnviar.querySelector('.btn-text');
    const btnLoading = btnEnviar.querySelector('.btn-loading');

    btnEnviar.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';

    try {
        // Intentar enviar por email (simulado)
        await enviarPorEmail(datos);

        // Mostrar mensaje de éxito
        mostrarMensajeFormulario('¡Mensaje enviado correctamente! Te contactaremos pronto.', 'success');

        // Limpiar formulario
        document.getElementById('contact-form').reset();

        // Limpiar clases de validación
        ['nombre', 'email', 'telefono', 'mensaje'].forEach(campo => {
            const input = document.getElementById(campo);
            const error = document.getElementById(`error-${campo}`);
            if (input) {
                input.classList.remove('error', 'success');
            }
            if (error) {
                error.textContent = '';
            }
        });

        // También enviar por WhatsApp como respaldo
        setTimeout(() => {
            if (confirm('¿Te gustaría también contactarnos directamente por WhatsApp?')) {
                enviarPorWhatsApp(datos);
            }
        }, 1000);

    } catch (error) {
        console.error('Error al enviar:', error);
        mostrarMensajeFormulario('Hubo un error al enviar el mensaje. ¿Te gustaría intentar por WhatsApp?', 'error');

        // Ofrecer WhatsApp como alternativa
        setTimeout(() => {
            if (confirm('¿Quieres enviar tu mensaje por WhatsApp en su lugar?')) {
                enviarPorWhatsApp(datos);
            }
        }, 2000);
    } finally {
        // Restaurar botón
        btnEnviar.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
    }
}

// Event listeners para el formulario
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    if (form) {
        // Event listener para el envío del formulario
        form.addEventListener('submit', manejarEnvioFormulario);

        // Event listeners para validación en tiempo real
        ['nombre', 'email', 'telefono', 'mensaje'].forEach(campo => {
            const input = document.getElementById(campo);
            if (input) {
                // Validar al perder el foco
                input.addEventListener('blur', () => {
                    validarCampo(campo, input.value);
                });

                // Limpiar errores al escribir
                input.addEventListener('input', () => {
                    const errorElement = document.getElementById(`error-${campo}`);
                    if (input.classList.contains('error')) {
                        input.classList.remove('error');
                        if (errorElement) {
                            errorElement.textContent = '';
                        }
                    }
                });
            }
        });
    }
});

// --- FUNCIONALIDAD DEL MENÚ MÓVIL ---
document.addEventListener('DOMContentLoaded', () => {
    // Código del menú móvil removido ya que ahora usamos grid 2x2

    // Smooth scroll mejorado para móviles
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Optimización de rendimiento para móviles
if ('serviceWorker' in navigator) {
    // Registrar service worker para mejor rendimiento (opcional)
    console.log('Service Worker disponible para futuras mejoras');
}

// Detección de dispositivo móvil para optimizaciones específicas
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

if (isMobile) {
    // Optimizaciones específicas para móviles

    // Reducir animaciones en dispositivos de baja potencia
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
        document.documentElement.style.setProperty('--animation-duration', '0.1s');
    }

    // Mejorar el rendimiento del scroll
    let ticking = false;
    function updateScrollPosition() {
        // Aquí se pueden agregar optimizaciones de scroll
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateScrollPosition);
            ticking = true;
        }
    });
}

// Mejorar la experiencia táctil en móviles
document.addEventListener('touchstart', function () { }, { passive: true });
document.addEventListener('touchmove', function () { }, { passive: true });
// -
--FUNCIONES DE ADMINISTRACIÓN(para testing)-- -
// Agregar botón de restaurar stock en modo desarrollo
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname.includes('file://')) {
    document.addEventListener('DOMContentLoaded', () => {
        // Crear botón de administrador
        const adminBtn = document.createElement('button');
        adminBtn.innerHTML = '<i class="fas fa-undo"></i> Restaurar Stock';
        adminBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
            color: white;
            border: none;
            padding: 12px 16px;
            border-radius: 25px;
            font-weight: 600;
            cursor: pointer;
            z-index: 1000;
            box-shadow: 0 4px 15px rgba(243, 156, 18, 0.3);
            transition: all 0.3s ease;
            font-size: 0.9rem;
        `;

        adminBtn.addEventListener('click', restaurarStock);
        adminBtn.addEventListener('mouseenter', () => {
            adminBtn.style.transform = 'translateY(-3px)';
            adminBtn.style.boxShadow = '0 8px 25px rgba(243, 156, 18, 0.4)';
        });
        adminBtn.addEventListener('mouseleave', () => {
            adminBtn.style.transform = 'translateY(0)';
            adminBtn.style.boxShadow = '0 4px 15px rgba(243, 156, 18, 0.3)';
        });

        document.body.appendChild(adminBtn);

        console.log('Modo desarrollo: Botón de restaurar stock agregado');
    });
}

// Función para mostrar estadísticas de stock en consola
function mostrarEstadisticasStock() {
    console.log('=== ESTADÍSTICAS DE STOCK ===');

    const estadisticas = {
        total: productosData.length,
        disponibles: productosData.filter(p => p.stock > 0).length,
        agotados: productosData.filter(p => p.stock === 0).length,
        stockBajo: productosData.filter(p => p.stock > 0 && p.stock <= 5).length
    };

    console.table(estadisticas);

    console.log('Productos agotados:');
    productosData.filter(p => p.stock === 0).forEach(p => {
        console.log(`- ${p.nombre}`);
    });

    console.log('Productos con stock bajo (≤5):');
    productosData.filter(p => p.stock > 0 && p.stock <= 5).forEach(p => {
        console.log(`- ${p.nombre}: ${p.stock} unidades`);
    });

    return estadisticas;
}

// Hacer funciones disponibles globalmente para debugging
window.restaurarStock = restaurarStock;
window.mostrarEstadisticasStock = mostrarEstadisticasStock;
window.verificarStockBajo = verificarStockBajo;
