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

// --- FUNCIONES DEL CARRITO ---
function agregarAlCarrito(id) {
    const producto = getProductoPorId(id);
    if (!producto) return;

    const itemExistente = carrito.find(item => item.id === id);

    if (itemExistente) {
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
}

function eliminarDelCarrito(id) {
    carrito = carrito.filter(item => item.id !== id);
    actualizarCarrito();
}

function cambiarCantidad(id, nuevaCantidad) {
    if (nuevaCantidad <= 0) {
        eliminarDelCarrito(id);
        return;
    }

    const item = carrito.find(item => item.id === id);
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
                        <img src="${item.imagen}" 
                             alt="${item.nombre}" 
                             onerror="this.src='data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'60\' height=\'60\' viewBox=\'0 0 60 60\'%3E%3Crect width=\'60\' height=\'60\' rx=\'8\' fill=\'%23f0f0f0\'/%3E%3Ctext x=\'30\' y=\'38\' font-family=\'Arial\' font-size=\'20\' fill=\'%23999\' text-anchor=\'middle\'%3E🍽️%3C/text%3E%3C/svg%3E';">
                    </div>
                    <div class="carrito-item-info">
                        <div class="carrito-item-nombre">${item.nombre}</div>
                        <div class="carrito-item-precio">${formatearPrecio(item.precio)}</div>
                        <div class="carrito-item-cantidad">
                            <button class="cantidad-btn" onclick="cambiarCantidad(${item.id}, ${item.cantidad - 1})">-</button>
                            <span>${item.cantidad}</span>
                            <button class="cantidad-btn" onclick="cambiarCantidad(${item.id}, ${item.cantidad + 1})">+</button>
                            <button class="eliminar-btn" onclick="eliminarDelCarrito(${item.id})" style="margin-left: 10px; background: #ff6b6b; color: white; border: none; border-radius: 50%; width: 25px; height: 25px; cursor: pointer;">×</button>
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

    const whatsappUrl = `https://wa.me/573135771729?text=${encodeURIComponent(mensaje)}`;
    window.open(whatsappUrl, '_blank');
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
                ${producto.destacado ? '<div class="producto-badge"><i class="fas fa-star"></i> Destacado</div>' : ''}
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
            if (!carritoFlotante.contains(e.target) && !carritoBtn.contains(e.target)) {
                cerrarCarrito();
            }
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

    if (error) {
        inputElement.classList.add('error');
        inputElement.classList.remove('success');
        errorElement.textContent = error;
        return false;
    } else {
        inputElement.classList.remove('error');
        inputElement.classList.add('success');
        errorElement.textContent = '';
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
        function(response) {
            console.log('Email enviado exitosamente:', response.status, response.text);
            return { success: true, response: response };
        },
        function(error) {
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
            input.classList.remove('error', 'success');
            error.textContent = '';
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
                        errorElement.textContent = '';
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
document.addEventListener('touchstart', function() {}, {passive: true});
document.addEventListener('touchmove', function() {}, {passive: true});
