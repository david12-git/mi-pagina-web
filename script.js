// Inicializar EmailJS
(function() {
	emailjs.init("YOUR_USER_ID"); // Reemplazar con tu User ID de EmailJS
})();

// Variables globales
let carrito = [];
let categoriaActual = 'todos';

// --- NUEVA FUNCIÓN PARA ESTADÍSTICAS ---
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

// Función para cargar productos
function cargarProductos(categoria = 'todos') {
	const productosGrid = document.getElementById('productos-grid');
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
						<i class="fas fa-check-circle"></i> Stock disponible: ${producto.stock} unidades
					</div>
					<div class="producto-acciones">
						<button onclick="agregarAlCarrito(${producto.id})" class="btn-agregar-carrito">
							<i class="fas fa-shopping-cart"></i> Agregar al Carrito
						</button>
						<button onclick="verDetalleProducto(${producto.id})" class="btn-ver-detalle">
							<i class="fas fa-eye"></i> Ver Detalle
						</button>
					</div>
				</div>
			</div>
		`;
		
		productosGrid.innerHTML += productoHTML;
	});
}

// Función para filtrar por categoría
function filtrarPorCategoria(categoria) {
	categoriaActual = categoria;
	
	// Actualizar botones de filtro
	document.querySelectorAll('.filtro-btn').forEach(btn => {
		btn.classList.remove('active');
	});
	if (event && event.target) {
        event.target.classList.add('active');
    }
	
	// Cargar productos
	cargarProductos(categoria);
	
	// Scroll a productos
	document.getElementById('productos').scrollIntoView({ behavior: 'smooth' });
}

// Función para agregar al carrito
function agregarAlCarrito(productoId) {
	const producto = getProductoPorId(productoId);
	
	if (!producto) {
		mostrarNotificacion('Producto no encontrado', 'error');
		return;
	}
	
	// Verificar stock
	if (producto.stock <= 0) {
		mostrarNotificacion('Producto sin stock disponible', 'error');
		return;
	}
	
	// Buscar si ya existe en el carrito
	const itemExistente = carrito.find(item => item.id === productoId);
	
	if (itemExistente) {
		// Verificar que no exceda el stock
		if (itemExistente.cantidad >= producto.stock) {
			mostrarNotificacion('No hay más stock disponible de este producto', 'error');
			return;
		}
		itemExistente.cantidad++;
	} else {
		carrito.push({
			id: producto.id,
			nombre: producto.nombre,
			precio: producto.precio,
			imagen: producto.imagen,
			cantidad: 1
		});
	}
	
	actualizarCarrito();
	mostrarNotificacion(`${producto.nombre} agregado al carrito`, 'success');
	
	// Trackear evento
	if (typeof gtag !== 'undefined') {
		gtag('event', 'add_to_cart', {
			'event_category': 'Ecommerce',
			'event_label': producto.nombre,
			'value': producto.precio
		});
	}
}

// Función para actualizar carrito
function actualizarCarrito() {
	const carritoCount = document.getElementById('carrito-count');
	const carritoItems = document.getElementById('carrito-items');
	const carritoTotal = document.getElementById('carrito-total');
	
	// Actualizar contador
	const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
	if (carritoCount) carritoCount.textContent = totalItems;
	
	// Actualizar items del carrito
	if (carritoItems) {
        carritoItems.innerHTML = '';
        if (carrito.length === 0) {
            carritoItems.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">Tu carrito está vacío</p>';
        } else {
            carrito.forEach(item => {
                const itemHTML = `
                    <div class="carrito-item">
                        <img src="${item.imagen}" alt="${item.nombre}">
                        <div class="carrito-item-info">
                            <div class="carrito-item-nombre">${item.nombre}</div>
                            <div class="carrito-item-precio">${formatearPrecio(item.precio)}</div>
                            <div class="carrito-item-cantidad">
                                <button onclick="cambiarCantidad(${item.id}, -1)" class="cantidad-btn">-</button>
                                <span>${item.cantidad}</span>
                                <button onclick="cambiarCantidad(${item.id}, 1)" class="cantidad-btn">+</button>
                                <button onclick="eliminarDelCarrito(${item.id})" style="margin-left: 10px; background: #ff6b6b; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                carritoItems.innerHTML += itemHTML;
            });
        }
    }
	
	// Actualizar total
	const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
	if (carritoTotal) carritoTotal.textContent = formatearPrecio(total).replace('$', '').trim();
}

// Función para cambiar cantidad
function cambiarCantidad(productoId, cambio) {
	const item = carrito.find(item => item.id === productoId);
	const producto = getProductoPorId(productoId);
	
	if (!item || !producto) return;
	
	const nuevaCantidad = item.cantidad + cambio;
	
	if (nuevaCantidad <= 0) {
		eliminarDelCarrito(productoId);
	} else if (nuevaCantidad > producto.stock) {
		mostrarNotificacion('No hay más stock disponible', 'error');
	} else {
		item.cantidad = nuevaCantidad;
		actualizarCarrito();
	}
}

// Función para eliminar del carrito
function eliminarDelCarrito(productoId) {
	carrito = carrito.filter(item => item.id !== productoId);
	actualizarCarrito();
	mostrarNotificacion('Producto eliminado del carrito', 'success');
}

// Función para abrir carrito
function abrirCarrito() {
	document.getElementById('carrito-flotante').classList.add('show');
}

// Función para cerrar carrito
function cerrarCarrito() {
	document.getElementById('carrito-flotante').classList.remove('show');
}

// Función para ir al checkout
function irACheckout() {
	if (carrito.length === 0) {
		mostrarNotificacion('Tu carrito está vacío', 'error');
		return;
	}
	
	// Crear mensaje para WhatsApp
	const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
	let mensaje = `Hola! Quiero comprar los siguientes productos:\n\n`;
	
	carrito.forEach(item => {
		mensaje += `• ${item.nombre} x${item.cantidad} - ${formatearPrecio(item.precio * item.cantidad)}\n`;
	});
	
	mensaje += `\nTotal: ${formatearPrecio(total)}\n\n¿Podrías ayudarme con el proceso de compra?`;
	
	// Abrir WhatsApp
	const whatsappUrl = `https://wa.me/${CONFIG.empresa.whatsapp}?text=${encodeURIComponent(mensaje)}`;
	window.open(whatsappUrl, '_blank');
	
	// Cerrar carrito
	cerrarCarrito();
}

// Función para ver detalle del producto
function verDetalleProducto(productoId) {
	const producto = getProductoPorId(productoId);
	
	if (!producto) {
		mostrarNotificacion('Producto no encontrado', 'error');
		return;
	}
	
	const modal = document.createElement('div');
	modal.className = 'modal-overlay';
	modal.innerHTML = `
		<div class="modal-content">
			<div class="modal-header">
				<h3><i class="fas fa-box"></i> ${producto.nombre}</h3>
				<button class="modal-close" onclick="cerrarModal()">&times;</button>
			</div>
			<div class="modal-body">
				<div style="text-align: center; margin-bottom: 20px;">
					<img src="${producto.imagen}" alt="${producto.nombre}" style="max-width: 300px; border-radius: 10px;">
				</div>
				<p><strong>Descripción:</strong> ${producto.descripcion}</p>
				<div style="margin: 20px 0;">
					<h4>Precio: ${formatearPrecio(producto.precio)}</h4>
				</div>
				<div class="modal-actions">
					<button onclick="agregarAlCarrito(${producto.id}); cerrarModal();" class="btn-agregar-carrito" style="flex: 1; margin: 0;">
						<i class="fas fa-shopping-cart"></i> Agregar al Carrito
					</button>
					<a href="https://wa.me/${CONFIG.empresa.whatsapp}?text=Hola! Me interesa el ${producto.nombre}" target="_blank" class="btn-whatsapp" style="flex: 1; margin: 0; text-align: center;">
						<i class="fab fa-whatsapp"></i> WhatsApp
					</a>
				</div>
			</div>
		</div>
	`;
	
	document.body.appendChild(modal);
	setTimeout(() => modal.classList.add('show'), 10);
}

// Función para cerrar modal
function cerrarModal() {
	const modal = document.querySelector('.modal-overlay');
	if (modal) {
		modal.classList.remove('show');
		setTimeout(() => modal.remove(), 300);
	}
}

// --- BLOQUE DE CARGA PRINCIPAL (DOM CONTENT LOADED) ---
document.addEventListener('DOMContentLoaded', function() {
	// 1. Cargar productos iniciales
	cargarProductos();
	
    // 2. ACTIVAR LAS ESTADÍSTICAS (Nuevo)
    cargarEstadisticas();

	// 3. Obtener todos los enlaces de navegación
	const navLinks = document.querySelectorAll('nav a[href^="#"]');
	navLinks.forEach(link => {
		link.addEventListener('click', function(e) {
			e.preventDefault();
			const targetId = this.getAttribute('href');
			const targetSection = document.querySelector(targetId);
			if (targetSection) {
				const headerHeight = document.querySelector('.header').offsetHeight;
				window.scrollTo({
					top: targetSection.offsetTop - headerHeight,
					behavior: 'smooth'
				});
			}
		});
	});
	
	// Evento para abrir carrito
	const carritoBtn = document.getElementById('carrito-btn');
    if(carritoBtn) {
        carritoBtn.addEventListener('click', function(e) {
            e.preventDefault();
            abrirCarrito();
        });
    }
	
	// Manejo del formulario de contacto con EmailJS
	const contactForm = document.getElementById('contact-form');
	if (contactForm) {
		contactForm.addEventListener('submit', function(e) {
			e.preventDefault();
			const submitBtn = this.querySelector('button[type="submit"]');
			const originalText = submitBtn.innerHTML;
			submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
			submitBtn.disabled = true;
			
			const templateParams = {
				from_name: this.querySelector('input[type="text"]').value,
				from_email: this.querySelector('input[type="email"]').value,
				message: this.querySelector('textarea').value,
				to_name: CONFIG.empresa.nombre
			};
			
			emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
				.then(() => {
					mostrarNotificacion('¡Mensaje enviado con éxito!', 'success');
					contactForm.reset();
				})
				.catch(() => mostrarNotificacion('Error al enviar mensaje', 'error'))
				.finally(() => resetearBoton(submitBtn, originalText));
		});
	}
	
	// Efecto de scroll para el header
	window.addEventListener('scroll', function() {
		const header = document.querySelector('.header');
		if (window.scrollY > 100) {
			header.style.background = 'rgba(230, 126, 34, 0.95)';
			header.style.backdropFilter = 'blur(10px)';
		} else {
			header.style.background = 'linear-gradient(135deg, #e67e22 0%, #d35400 100%)';
			header.style.backdropFilter = 'none';
		}
	});

	// Agregar WhatsApp flotante
	agregarWhatsAppFlotante();
});

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje, tipo) {
	const notificacion = document.createElement('div');
	notificacion.className = `notificacion ${tipo}`;
	notificacion.innerHTML = `<span>${mensaje}</span>`;
	document.body.appendChild(notificacion);
	setTimeout(() => notificacion.classList.add('show'), 10);
	setTimeout(() => {
		notificacion.classList.remove('show');
		setTimeout(() => notificacion.remove(), 300);
	}, 3000);
}

function resetearBoton(boton, textoOriginal) {
	boton.innerHTML = textoOriginal;
	boton.disabled = false;
}

function agregarWhatsAppFlotante() {
	const whatsappFloat = document.createElement('a');
	whatsappFloat.href = `https://wa.me/${CONFIG.empresa.whatsapp}?text=Hola! Me interesa conocer sus productos`;
	whatsappFloat.target = '_blank';
	whatsappFloat.className = 'whatsapp-float';
	whatsappFloat.innerHTML = '<i class="fab fa-whatsapp"></i>';
	document.body.appendChild(whatsappFloat);
	setTimeout(() => whatsappFloat.classList.add('show'), 1000);
}
});
	});
});
