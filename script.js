// --- 1. VARIABLES GLOBALES ---
let carrito = [];
let categoriaActual = 'todos';

// --- 2. CONEXIÓN REALTIME CON EL PANEL DE ADMIN ---
function conectarCatalogoRealtime() {
    if (window.adminFirebase) {
        console.log("🔗 Conectando con el motor de Firebase...");
        
        // Esta función escucha a Firebase y actualiza la web solita
        window.adminFirebase.escucharProductos((productosRecibidos) => {
            console.log("📦 Catálogo actualizado desde la nube:", productosRecibidos);
            
            // Guardamos los datos en la variable que usa tu tienda
            window.productosData = productosRecibidos;

            // Detectamos la categoría para mostrar los productos correctos
            const params = new URLSearchParams(window.location.search);
            const cat = params.get('categoria') || 'todos';
            
            // Llamamos a tu función de la línea 1319
            if (typeof cargarProductos === 'function') {
                cargarProductos(cat);
            }
        });
    } else {
        console.error("❌ Error: No se encontró admin-firebase.js. Revisa el orden en tu HTML.");
    }
}

// Iniciar cuando la página carga
document.addEventListener('DOMContentLoaded', () => {
    conectarCatalogoRealtime();
});

// ================================================================
// --- AQUÍ EMPIEZA TU FUNCIÓN ORIGINAL (Línea 1319) ---


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
        let selectorSabores = '';
        if (producto.sabores && producto.stockPorSabor && typeof window.saboresManager !== 'undefined') {
            selectorSabores = window.saboresManager.generarSelectorSabores(producto);
        } else if (producto.sabores) {
            // Fallback para productos con sabores sin stock individual
            selectorSabores = `
                <div class="producto-sabores" style="margin-bottom: 1rem;">
                    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: #2c3e50;">🍹 Elige tu sabor:</label>
                    <select id="sabor-${producto.id}" class="selector-sabor" style="width: 100%; padding: 8px 12px; border: 2px solid rgba(102, 126, 234, 0.2); border-radius: 8px; font-size: 0.9rem; background: white;">
                        <option value="">-- Selecciona un sabor --</option>
                        ${producto.sabores.map(sabor => `<option value="${sabor}">${sabor}</option>`).join('')}
                    </select>
                </div>
            `;
        }

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

    // Mostrar notificación de filtro aplicado con emojis
    const totalProductos = getProductosPorCategoria(categoria).length;
    let emoji = '🍽️';
    let categoriaTexto = categoria;

    // Emojis específicos por categoría
    switch (categoria) {
        case 'bebidas calientes':
            emoji = '☕';
            categoriaTexto = 'Bebidas Calientes';
            break;
        case 'bebidas frias':
            emoji = '🥤';
            categoriaTexto = 'Bebidas Frías';
            break;
        case 'comida':
            emoji = '🍗';
            categoriaTexto = 'Comida Típica';
            break;
        case 'postres':
            emoji = '🍰';
            categoriaTexto = 'Postres Caseros';
            break;
        case 'todos':
            emoji = '🎯';
            categoriaTexto = 'Todos los Productos';
            break;
    }

    const mensaje = categoria === 'todos'
        ? `${emoji} Mostrando todos los productos (${totalProductos} disponibles)`
        : `${emoji} Mostrando ${totalProductos} productos de ${categoriaTexto}`;

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
// Los event listeners se configuran en el DOMContentLoaded principal arriba


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
    const fechaHora = new Date().toLocaleString('es-CO', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const mensaje = `*NUEVO MENSAJE - LAS DELICIAS DE LA ABUELA*
=======================================

Hola! Me comunico desde la pagina web oficial.

*Fecha:* ${fechaHora}
*Consulta #:* ${Date.now().toString().slice(-6)}

*MIS DATOS:*
-------------------------
• *Nombre:* ${datos.nombre}
• *Email:* ${datos.email}
${datos.telefono ? `• *Telefono:* ${datos.telefono}` : ''}

*MI MENSAJE:*
-------------------------
${datos.mensaje}

=======================================
Gracias por su atencion!
*"El sabor tradicional de Aguadas en tu mesa"*`;

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

// --- FUNCIONES DE ADMINISTRACIÓN REMOVIDAS POR SEGURIDAD ---
// El botón de restaurar stock fue eliminado para evitar que los clientes
// puedan modificar el inventario accidentalmente

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

// Función de diagnóstico para verificar la carga de datos
function diagnosticarCargaDatos() {
    console.log('=== DIAGNÓSTICO DE CARGA DE DATOS ===');

    // Verificar CONFIG
    if (typeof CONFIG === 'undefined') {
        console.error('❌ CONFIG no está definido - verificar que config.js se esté cargando');
        return;
    } else {
        console.log('✅ CONFIG está disponible');
    }

    // Verificar CONFIG.productos
    if (!CONFIG.productos || CONFIG.productos.length === 0) {
        console.error('❌ CONFIG.productos está vacío o no definido');
        return;
    } else {
        console.log(`✅ CONFIG.productos tiene ${CONFIG.productos.length} productos`);
    }

    // Verificar productosData
    if (typeof productosData === 'undefined') {
        console.error('❌ productosData no está definido');
        // Intentar reparar
        window.productosData = CONFIG.productos;
        console.log('🔧 Intentando reparar productosData...');
    } else if (productosData.length === 0) {
        console.error('❌ productosData está vacío');
    } else {
        console.log(`✅ productosData tiene ${productosData.length} productos`);
    }

    // Verificar elementos del DOM
    const productosGrid = document.getElementById('productos-grid');
    if (!productosGrid) {
        console.error('❌ Elemento productos-grid no encontrado en el DOM');
    } else {
        console.log('✅ Elemento productos-grid encontrado');
        console.log(`📊 productos-grid tiene ${productosGrid.children.length} elementos hijos`);
    }

    // Si todo está bien, recargar productos
    if (productosData && productosData.length > 0 && productosGrid) {
        console.log('🔄 Recargando productos...');
        cargarProductos();
    }
}

// Hacer la función de diagnóstico disponible globalmente
window.diagnosticarCargaDatos = diagnosticarCargaDatos;
// --
- LISTENERS PARA CAMBIOS DEL ADMIN ---
// Configurar listeners para cambios del admin
function configurarListenersAdmin() {
    console.log('👂 Configurando listeners para cambios del admin...');

    // Listener para mensajes del admin
    window.addEventListener('message', function(event) {
        if (event.data.type === 'STOCK_UPDATED_FROM_ADMIN') {
            console.log('🔄 Cambios recibidos del admin:', event.data.cambios);
            aplicarCambiosDelAdmin(event.data.cambios);
        }
    });

    // Listener para BroadcastChannel
    try {
        const bc = new BroadcastChannel('stock-updates');
        bc.addEventListener('message', function(event) {
            if (event.data.type === 'STOCK_UPDATED' && event.data.source === 'admin') {
                console.log('📡 Cambios recibidos por broadcast:', event.data.cambios);
                aplicarCambiosDelAdmin(event.data.cambios);
            }
        });
    } catch (error) {
        console.log('⚠️ BroadcastChannel no disponible:', error.message);
    }

    // Listener para cambios en localStorage
    window.addEventListener('storage', function(event) {
        if (event.key === 'stockActualizado') {
            console.log('💾 Cambios detectados en localStorage');
            try {
                const data = JSON.parse(event.newValue);
                aplicarCambiosDelAdmin(data.cambios);
            } catch (error) {
                console.log('⚠️ Error procesando cambios de localStorage:', error.message);
            }
        }
    });
}

// Aplicar cambios del admin
function aplicarCambiosDelAdmin(cambios) {
    console.log('🔄 Aplicando cambios del admin...');
    
    let cambiosAplicados = 0;
    
    cambios.forEach(cambio => {
        const producto = window.productosData.find(p => p.id === cambio.id);
        if (producto) {
            const stockAnterior = producto.stock;
            producto.stock = cambio.nuevoStock;
            console.log(`📦 ${producto.nombre}: ${stockAnterior} → ${cambio.nuevoStock}`);
            cambiosAplicados++;
        }
    });
    
    if (cambiosAplicados > 0) {
        console.log(`✅ ${cambiosAplicados} productos actualizados`);
        
        // Recargar productos en la interfaz
        if (typeof cargarProductos === 'function') {
            const categoriaActual = new URLSearchParams(window.location.search).get('categoria') || 'todos';
            cargarProductos(categoriaActual);
        }
        
        // Mostrar notificación
        if (typeof mostrarNotificacion === 'function') {
            mostrarNotificacion(`⚡ Stock actualizado: ${cambios.map(c => c.nombre).join(', ')}`, 'success');
        }
    }
}

// Inicializar listeners cuando la página esté lista
document.addEventListener('DOMContentLoaded', () => {
    // Configurar listeners para cambios del admin
    configurarListenersAdmin();
});
