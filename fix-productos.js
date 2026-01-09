// Script de emergencia para cargar productos
console.log('🚨 Script de emergencia cargado');

// Definir la función cargarProductos directamente aquí
window.cargarProductos = function(categoria = 'todos') {
    console.log(`🔄 cargarProductos llamada con categoría: ${categoria}`);
    
    const productosGrid = document.getElementById('productos-grid');
    if (!productosGrid) {
        console.error('❌ Elemento productos-grid no encontrado');
        return;
    }
    
    console.log('✅ Elemento productos-grid encontrado');
    
    // Verificar productosData
    if (!window.productosData || window.productosData.length === 0) {
        console.error('❌ productosData no disponible');
        return;
    }
    
    // Filtrar productos por categoría
    let productos = window.productosData;
    if (categoria !== 'todos') {
        productos = window.productosData.filter(p => p.categoria === categoria);
    }
    
    console.log(`📦 Mostrando ${productos.length} productos para categoría: ${categoria}`);
    
    // Limpiar grid
    productosGrid.innerHTML = '';
    
    if (productos.length === 0) {
        productosGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: #666;">
                <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <h3>No hay productos en esta categoría</h3>
                <p>Intenta con otra categoría o ve todos los productos.</p>
            </div>
        `;
        return;
    }
    
    // Crear cards de productos
    productos.forEach(producto => {
        const descuento = producto.precio_anterior ? 
            Math.round(((producto.precio_anterior - producto.precio) / producto.precio_anterior) * 100) : 0;
        
        const stockDisponible = producto.stock || 0;
        
        const card = document.createElement('div');
        card.className = 'producto-card';
        
        card.innerHTML = `
            <div class="producto-imagen sin-imagen">
                ${producto.imagen ? `<img src="${producto.imagen}" alt="${producto.nombre}">` : ''}
            </div>
            <div class="producto-info">
                <h3 class="producto-nombre">${producto.nombre}</h3>
                <p class="producto-descripcion">${producto.descripcion || 'Delicioso producto casero'}</p>
                <div class="producto-precios">
                    <span class="producto-precio">$${producto.precio?.toLocaleString() || '0'}</span>
                    ${producto.precio_anterior ? `<span class="producto-precio-anterior">$${producto.precio_anterior.toLocaleString()}</span>` : ''}
                    ${descuento > 0 ? `<span class="producto-descuento">${descuento}% OFF</span>` : ''}
                </div>
                <div class="producto-stock">
                    <span>Stock: ${stockDisponible}</span>
                </div>
                <button class="btn-agregar-carrito" onclick="agregarAlCarrito(${producto.id})">
                    <i class="fas fa-shopping-cart"></i> Agregar al Carrito
                </button>
            </div>
        `;
        
        productosGrid.appendChild(card);
    });
    
    console.log('✅ Productos cargados en la interfaz');
};

// Función para obtener productos por categoría
window.getProductosPorCategoria = function(categoria) {
    if (!window.productosData || window.productosData.length === 0) {
        console.error('productosData no está disponible o está vacío');
        return [];
    }
    
    if (categoria === 'todos') return window.productosData;
    return window.productosData.filter(p => p.categoria === categoria);
};

// Función para emergencia
function emergencyLoadProducts() {
    console.log('=== DIAGNÓSTICO DE EMERGENCIA ===');
    
    // 1. Verificar CONFIG
    if (typeof CONFIG === 'undefined') {
        console.error('❌ CONFIG no está definido');
        return false;
    }
    
    if (!CONFIG.productos || CONFIG.productos.length === 0) {
        console.error('❌ CONFIG.productos no existe o está vacío');
        return false;
    }
    
    console.log(`✅ CONFIG disponible con ${CONFIG.productos.length} productos`);
    
    // 2. Inicializar productosData
    window.productosData = [...CONFIG.productos];
    console.log(`✅ productosData inicializado: ${window.productosData.length} productos`);
    
    // 3. Verificar función cargarProductos (ahora definida aquí)
    console.log('✅ cargarProductos definida en script de emergencia');
    
    // 4. Verificar elemento DOM
    const grid = document.getElementById('productos-grid');
    if (!grid) {
        console.error('❌ Elemento productos-grid no encontrado');
        return false;
    }
    
    console.log('✅ Elemento productos-grid encontrado');
    
    // 5. Cargar productos
    try {
        const categoria = new URLSearchParams(window.location.search).get('categoria') || 'todos';
        console.log(`🔄 Cargando productos para categoría: ${categoria}`);
        
        window.cargarProductos(categoria);
        
        console.log('✅ Productos cargados exitosamente');
        return true;
        
    } catch (error) {
        console.error('❌ Error cargando productos:', error);
        return false;
    }
}

// Intentar cargar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM cargado, esperando un momento...');
    
    // Esperar un poco para que otros scripts se carguen
    setTimeout(() => {
        console.log('🔄 Intentando carga de emergencia...');
        const success = emergencyLoadProducts();
        
        if (success) {
            // También animar las estadísticas
            setTimeout(() => {
                if (typeof animarEstadisticas === 'function') {
                    console.log('🎨 Animando estadísticas...');
                    animarEstadisticas();
                } else {
                    console.log('⚠️ animarEstadisticas no disponible, creando versión simple...');
                    // Crear versión simple de las estadísticas
                    const stats = [
                        { id: 'stat-clientes', valor: '+250' },
                        { id: 'stat-experiencia', valor: 'Tradición' },
                        { id: 'stat-soporte', valor: 'Atención Local' },
                        { id: 'stat-productos', valor: 'Hecho a mano' }
                    ];
                    
                    stats.forEach(stat => {
                        const elemento = document.getElementById(stat.id);
                        if (elemento) {
                            elemento.textContent = stat.valor;
                        }
                    });
                    console.log('✅ Estadísticas actualizadas');
                }
            }, 1000);
        }
        
        if (!success) {
            console.log('⚠️ Primera carga falló, reintentando en 2 segundos...');
            setTimeout(() => {
                emergencyLoadProducts();
            }, 2000);
        }
    }, 2000); // Aumentar el tiempo de espera
});

// Función global para uso manual
window.emergencyLoadProducts = emergencyLoadProducts;

console.log('✅ Script de emergencia listo - Usa emergencyLoadProducts() si es necesario');