// Inicializar EmailJS
(function() {
	emailjs.init("YOUR_USER_ID"); // Reemplazar con tu User ID de EmailJS
})();

// Variables globales
let carrito = [];
let categoriaActual = 'todos';

// --- FUNCIÓN PARA ESTADÍSTICAS ---
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
						<i class="fas fa-check-circle"></i> Stock: ${producto.stock} unidades
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

// Función para filtrar por categoría
function filtrarPorCategoria(categoria) {
	categoriaActual = categoria;
	document.querySelectorAll('.filtro-btn').forEach(btn => btn.classList.remove('active'));
	if (event && event.target) event.target.classList.add('active');
	cargarProductos(categoria);
	document.getElementById('productos').scrollIntoView({ behavior: 'smooth' });
}

// Función para agregar al carrito
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

// Función para actualizar carrito
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

function abrirCarrito() { document.getElementById('carrito-flotante').classList.add('show'); }
function cerrarCarrito() { document.getElementById('carrito-flotante').classList.remove('show'); }

function irACheckout() {
	if (carrito.length === 0) return;
	const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
	let mensaje = `Hola! Quiero pedir:\n` + carrito.map(i => `- ${i.nombre} x${i.cantidad}`).join('\n');
	mensaje += `\nTotal: ${formatearPrecio(total)}`;
	window.open(`https://wa.me/${CONFIG.empresa.whatsapp}?text=${encodeURIComponent(mensaje)}`, '_blank');
}

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

// --- BLOQUE DE CARGA PRINCIPAL ---
document.addEventListener('DOMContentLoaded', function() {
	cargarProductos();
    cargarEstadisticas(); // ESTO LLENA LOS NÚMEROS
	agregarWhatsAppFlotante();

	const navLinks = document.querySelectorAll('nav a[href^="#"]');
	navLinks.forEach(link => {
		link.addEventListener('click', function(e) {
			e.preventDefault();
			const target = document.querySelector(this.getAttribute('href'));
			if (target) {
				window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
			}
		});
	});
	
	const btn = document.getElementById('carrito-btn');
    if(btn) btn.onclick = (e) => { e.preventDefault(); abrirCarrito(); };
	
	window.addEventListener('scroll', function() {
		const header = document.querySelector('.header');
		header.style.background = window.scrollY > 100 
            ? 'rgba(230, 126, 34, 0.95)' 
            : 'linear-gradient(135deg, #e67e22 0%, #d35400 100%)';
	});
});

function mostrarNotificacion(m, t) {
	const n = document.createElement('div');
	n.className = `notificacion ${t}`;
	n.innerHTML = `<span>${m}</span>`;
	document.body.appendChild(n);
	setTimeout(() => n.classList.add('show'), 10);
	setTimeout(() => { n.classList.remove('show'); setTimeout(() => n.remove(), 300); }, 3000);
}

function agregarWhatsAppFlotante() {
	const w = document.createElement('a');
	w.href = `https://wa.me/${CONFIG.empresa.whatsapp}`;
	w.target = '_blank';
	w.className = 'whatsapp-float show';
	w.innerHTML = '<i class="fab fa-whatsapp"></i>';
	document.body.appendChild(w);
}

