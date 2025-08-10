// Inicializar EmailJS
(function() {
	emailjs.init("YOUR_USER_ID"); // Reemplazar con tu User ID de EmailJS
})();

// Variables globales
let carrito = [];
let categoriaActual = 'todos';

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
	event.target.classList.add('active');
	
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
	carritoCount.textContent = totalItems;
	
	// Actualizar items del carrito
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
	
	// Actualizar total
	const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
	carritoTotal.textContent = formatearPrecio(total).replace('$', '').replace(',', '');
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
	
	// Trackear evento
	if (typeof gtag !== 'undefined') {
		gtag('event', 'begin_checkout', {
			'event_category': 'Ecommerce',
			'value': total
		});
	}
}

// Función para ver detalle del producto
function verDetalleProducto(productoId) {
	const producto = getProductoPorId(productoId);
	
	if (!producto) {
		mostrarNotificacion('Producto no encontrado', 'error');
		return;
	}
	
	const descuento = Math.round(((producto.precio_anterior - producto.precio) / producto.precio_anterior) * 100);
	
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
					${producto.precio_anterior > producto.precio ? 
						`<p style="color: #999; text-decoration: line-through;">Precio anterior: ${formatearPrecio(producto.precio_anterior)}</p>
						<p style="color: #51cf66; font-weight: bold;">Descuento: -${descuento}%</p>` : ''
					}
				</div>
				<div style="margin: 20px 0;">
					<h4>Características:</h4>
					<ul>
						${producto.caracteristicas.map(caracteristica => `<li>${caracteristica}</li>`).join('')}
					</ul>
				</div>
				<div style="margin: 20px 0;">
					<p><strong>Stock disponible:</strong> ${producto.stock} unidades</p>
				</div>
				<div class="modal-actions">
					<button onclick="agregarAlCarrito(${producto.id}); cerrarModal();" class="btn-agregar-carrito" style="flex: 1; margin: 0;">
						<i class="fas fa-shopping-cart"></i> Agregar al Carrito
					</button>
					<a href="https://wa.me/${CONFIG.empresa.whatsapp}?text=Hola! Me interesa el ${producto.nombre} - ${formatearPrecio(producto.precio)}" target="_blank" class="btn-whatsapp" style="flex: 1; margin: 0; text-align: center;">
						<i class="fab fa-whatsapp"></i> Consultar por WhatsApp
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

// Navegación suave para los enlaces del menú
document.addEventListener('DOMContentLoaded', function() {
	// Cargar productos iniciales
	cargarProductos();
	
	// Obtener todos los enlaces de navegación
	const navLinks = document.querySelectorAll('nav a[href^="#"]');
	
	// Agregar evento click a cada enlace
	navLinks.forEach(link => {
		link.addEventListener('click', function(e) {
			e.preventDefault();
			
			const targetId = this.getAttribute('href');
			const targetSection = document.querySelector(targetId);
			
			if (targetSection) {
				// Calcular la posición considerando el header fijo
				const headerHeight = document.querySelector('.header').offsetHeight;
				const targetPosition = targetSection.offsetTop - headerHeight;
				
				// Scroll suave hacia la sección
				window.scrollTo({
					top: targetPosition,
					behavior: 'smooth'
				});
			}
		});
	});
	
	// Evento para abrir carrito
	document.getElementById('carrito-btn').addEventListener('click', function(e) {
		e.preventDefault();
		abrirCarrito();
	});
	
	// Manejo del formulario de contacto con EmailJS
	const contactForm = document.getElementById('contact-form');
	if (contactForm) {
		contactForm.addEventListener('submit', function(e) {
			e.preventDefault();
			
			// Mostrar loading
			const submitBtn = this.querySelector('button[type="submit"]');
			const originalText = submitBtn.innerHTML;
			submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
			submitBtn.disabled = true;
			
			// Obtener los valores del formulario
			const name = this.querySelector('input[type="text"]').value;
			const email = this.querySelector('input[type="email"]').value;
			const phone = this.querySelector('input[type="tel"]').value;
			const message = this.querySelector('textarea').value;
			
			// Validación básica
			if (!name || !email || !message) {
				mostrarNotificacion('Por favor, completa todos los campos obligatorios.', 'error');
				resetearBoton(submitBtn, originalText);
				return;
			}
			
			// Validación de email
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(email)) {
				mostrarNotificacion('Por favor, ingresa un email válido.', 'error');
				resetearBoton(submitBtn, originalText);
				return;
			}
			
			// Preparar datos para EmailJS
			const templateParams = {
				from_name: name,
				from_email: email,
				from_phone: phone,
				message: message,
				to_name: CONFIG.empresa.nombre
			};
			
			// Enviar email usando EmailJS
			emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
				.then(function(response) {
					console.log('SUCCESS!', response.status, response.text);
					mostrarNotificacion('¡Mensaje enviado con éxito! Te contactaremos pronto.', 'success');
					contactForm.reset();
					
					// Trackear evento en Google Analytics
					if (typeof gtag !== 'undefined') {
						gtag('event', 'form_submit', {
							'event_category': 'Contact',
							'event_label': 'Contact Form'
						});
					}
				}, function(error) {
					console.log('FAILED...', error);
					mostrarNotificacion('Error al enviar el mensaje. Por favor, intenta nuevamente.', 'error');
				})
				.finally(function() {
					resetearBoton(submitBtn, originalText);
				});
		});
	}
	
	// Efecto de scroll para el header
	window.addEventListener('scroll', function() {
		const header = document.querySelector('.header');
		if (window.scrollY > 100) {
			header.style.background = 'rgba(102, 126, 234, 0.95)';
			header.style.backdropFilter = 'blur(10px)';
		} else {
			header.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
			header.style.backdropFilter = 'none';
		}
	});
	
	// Animación de aparición al hacer scroll
	const observerOptions = {
		threshold: 0.1,
		rootMargin: '0px 0px -50px 0px'
	};
	
	const observer = new IntersectionObserver(function(entries) {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.style.opacity = '1';
				entry.target.style.transform = 'translateY(0)';
			}
		});
	}, observerOptions);
	
	// Observar elementos para animación
	const animatedElements = document.querySelectorAll('.section, .producto-card, .categoria-card, .contact-item');
	animatedElements.forEach(el => {
		el.style.opacity = '0';
		el.style.transform = 'translateY(30px)';
		el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
		observer.observe(el);
	});
	
	// Efecto hover para las tarjetas
	const cards = document.querySelectorAll('.producto-card, .categoria-card');
	cards.forEach(card => {
		card.addEventListener('mouseenter', function() {
			this.style.transform = 'translateY(-10px) scale(1.02)';
		});
		
		card.addEventListener('mouseleave', function() {
			this.style.transform = 'translateY(0) scale(1)';
		});
	});
	
	// Agregar WhatsApp flotante
	agregarWhatsAppFlotante();
	
	// Cerrar modal al hacer clic fuera
	document.addEventListener('click', function(e) {
		if (e.target.classList.contains('modal-overlay')) {
			cerrarModal();
		}
	});
	
	// Cerrar modal con ESC
	document.addEventListener('keydown', function(e) {
		if (e.key === 'Escape') {
			cerrarModal();
		}
	});
});

// Función para validar el formulario en tiempo real
function validarCampo(campo) {
	const valor = campo.value.trim();
	const tipo = campo.type;
	
	switch(tipo) {
		case 'email':
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(valor)) {
				campo.style.borderColor = '#ff6b6b';
				return false;
			} else {
				campo.style.borderColor = '#51cf66';
				return true;
			}
			break;
			
		case 'text':
			if (valor.length < 2) {
				campo.style.borderColor = '#ff6b6b';
				return false;
			} else {
				campo.style.borderColor = '#51cf66';
				return true;
			}
			break;
			
		case 'tel':
			const phoneRegex = /^[\+]?[0-9\s\-\(\)]{9,}$/;
			if (valor && !phoneRegex.test(valor)) {
				campo.style.borderColor = '#ff6b6b';
				return false;
			} else if (valor) {
				campo.style.borderColor = '#51cf66';
				return true;
			} else {
				campo.style.borderColor = '#e1e5e9';
				return true;
			}
			break;
			
		default:
			if (valor.length < 10) {
				campo.style.borderColor = '#ff6b6b';
				return false;
			} else {
				campo.style.borderColor = '#51cf66';
				return true;
			}
	}
}

// Agregar validación en tiempo real a los campos del formulario
document.addEventListener('DOMContentLoaded', function() {
	const formInputs = document.querySelectorAll('#contact-form input, #contact-form textarea');
	
	formInputs.forEach(input => {
		input.addEventListener('blur', function() {
			validarCampo(this);
		});
		
		input.addEventListener('input', function() {
			if (this.value.trim() !== '') {
				validarCampo(this);
			} else {
				this.style.borderColor = '#e1e5e9';
			}
		});
	});
});

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje, tipo) {
	const notificacion = document.createElement('div');
	notificacion.className = `notificacion ${tipo}`;
	notificacion.innerHTML = `
		<i class="fas fa-${tipo === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
		<span>${mensaje}</span>
	`;
	
	document.body.appendChild(notificacion);
	
	// Animar entrada
	setTimeout(() => notificacion.classList.add('show'), 10);
	
	// Remover después de 5 segundos
	setTimeout(() => {
		notificacion.classList.remove('show');
		setTimeout(() => notificacion.remove(), 300);
	}, 5000);
}

// Función para resetear botón
function resetearBoton(boton, textoOriginal) {
	boton.innerHTML = textoOriginal;
	boton.disabled = false;
}

// Función para agregar WhatsApp flotante
function agregarWhatsAppFlotante() {
	const whatsappFloat = document.createElement('a');
	whatsappFloat.href = `https://wa.me/${CONFIG.empresa.whatsapp}?text=Hola! Me interesa conocer sus productos`;
	whatsappFloat.target = '_blank';
	whatsappFloat.className = 'whatsapp-float';
	whatsappFloat.innerHTML = '<i class="fab fa-whatsapp"></i>';
	whatsappFloat.title = 'Contactar por WhatsApp';
	
	document.body.appendChild(whatsappFloat);
	
	// Animar entrada
	setTimeout(() => whatsappFloat.classList.add('show'), 1000);
}

// Función para trackear eventos en Google Analytics
function trackearEvento(categoria, accion, etiqueta) {
	if (typeof gtag !== 'undefined') {
		gtag('event', accion, {
			'event_category': categoria,
			'event_label': etiqueta
		});
	}
}

// Trackear clics en enlaces importantes
document.addEventListener('DOMContentLoaded', function() {
	// Trackear clics en WhatsApp
	const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
	whatsappLinks.forEach(link => {
		link.addEventListener('click', function() {
			trackearEvento('Contact', 'whatsapp_click', 'WhatsApp Link');
		});
	});
	
	// Trackear clics en productos
	const productoCards = document.querySelectorAll('.producto-card');
	productoCards.forEach(card => {
		card.addEventListener('click', function() {
			const productName = this.querySelector('.producto-nombre').textContent;
			trackearEvento('Products', 'product_click', productName);
		});
	});
});
