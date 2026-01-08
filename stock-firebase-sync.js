// Sincronización automática de stock con Firebase
class StockFirebaseSync {
    constructor() {
        this.db = null;
        this.inicializar();
    }

    async inicializar() {
        try {
            // Esperar a que Firebase esté listo
            if (typeof firebase !== 'undefined') {
                this.db = firebase.database();
                await this.cargarStockDesdeFirebase();
                this.escucharCambiosEnTiempoReal();
                console.log('🔥 Sincronización con Firebase activada');
            }
        } catch (error) {
            console.log('⚠️ Firebase no disponible, usando stock local');
        }
    }

    // Cargar stock desde Firebase al iniciar
    async cargarStockDesdeFirebase() {
        try {
            const snapshot = await this.db.ref('stock').once('value');
            const stockFirebase = snapshot.val();
            
            if (stockFirebase) {
                // Actualizar CONFIG con el stock de Firebase
                CONFIG.productos.forEach(producto => {
                    if (stockFirebase[producto.id] !== undefined) {
                        producto.stock = stockFirebase[producto.id];
                    }
                });
                
                console.log('📦 Stock cargado desde Firebase');
                
                // Recargar productos en la página si existe la función
                if (typeof cargarProductos === 'function') {
                    cargarProductos();
                }
            }
        } catch (error) {
            console.error('❌ Error cargando stock desde Firebase:', error);
        }
    }

    // Escuchar cambios en tiempo real
    escucharCambiosEnTiempoReal() {
        this.db.ref('stock').on('value', (snapshot) => {
            const stockFirebase = snapshot.val();
            
            if (stockFirebase) {
                let cambiosDetectados = false;
                
                CONFIG.productos.forEach(producto => {
                    if (stockFirebase[producto.id] !== undefined && 
                        stockFirebase[producto.id] !== producto.stock) {
                        producto.stock = stockFirebase[producto.id];
                        cambiosDetectados = true;
                    }
                });
                
                if (cambiosDetectados) {
                    console.log('🔄 Stock actualizado en tiempo real');
                    
                    // Recargar productos si la función existe
                    if (typeof cargarProductos === 'function') {
                        cargarProductos();
                    }
                    
                    // Actualizar carrito si hay productos agotados
                    if (typeof actualizarCarritoPorStock === 'function') {
                        actualizarCarritoPorStock();
                    }
                }
            }
        });
    }

    // Reducir stock cuando se hace una venta
    async reducirStock(productoId, cantidad) {
        try {
            const stockActual = await this.obtenerStock(productoId);
            const nuevoStock = Math.max(0, stockActual - cantidad);
            
            await this.db.ref(`stock/${productoId}`).set(nuevoStock);
            
            // Actualizar CONFIG local
            const producto = CONFIG.productos.find(p => p.id === productoId);
            if (producto) {
                producto.stock = nuevoStock;
            }
            
            console.log(`📉 Stock reducido: Producto ${productoId} → ${nuevoStock}`);
            return nuevoStock;
        } catch (error) {
            console.error('❌ Error reduciendo stock:', error);
            return null;
        }
    }

    // Obtener stock actual
    async obtenerStock(productoId) {
        try {
            const snapshot = await this.db.ref(`stock/${productoId}`).once('value');
            return snapshot.val() || 0;
        } catch (error) {
            console.error('❌ Error obteniendo stock:', error);
            return 0;
        }
    }
}

// Función para actualizar carrito cuando hay cambios de stock
function actualizarCarritoPorStock() {
    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    let carritoModificado = false;
    
    carrito.forEach(item => {
        const producto = CONFIG.productos.find(p => p.id === item.id);
        if (producto && producto.stock < item.cantidad) {
            item.cantidad = Math.max(0, producto.stock);
            carritoModificado = true;
        }
    });
    
    if (carritoModificado) {
        // Filtrar items con cantidad 0
        const carritoFiltrado = carrito.filter(item => item.cantidad > 0);
        localStorage.setItem('carrito', JSON.stringify(carritoFiltrado));
        
        // Actualizar UI del carrito si existe
        if (typeof actualizarCarrito === 'function') {
            actualizarCarrito();
        }
        
        console.log('🛒 Carrito actualizado por cambios de stock');
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Esperar un poco para que Firebase se inicialice
    setTimeout(() => {
        window.stockFirebaseSync = new StockFirebaseSync();
    }, 1000);
});

// Hacer disponible globalmente
window.StockFirebaseSync = StockFirebaseSync;