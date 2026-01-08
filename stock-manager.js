// 📦 Gestor de Stock con Respaldo Local
// Este archivo maneja el stock con localStorage como respaldo si Firebase falla

class StockManager {
    constructor() {
        this.useFirebase = false;
        this.storageKey = 'delicias_abuela_stock';
        this.hayCambiosPendientes = false;
        this.init();
    }

    async init() {
        console.log('🔄 Inicializando gestor de stock...');

        // Intentar conectar con Firebase PRIMERO
        try {
            // Esperar a que Firebase Setup esté disponible
            if (typeof window.firebaseSetup !== 'undefined') {
                console.log('🔥 Intentando conectar con Firebase...');
                this.useFirebase = await window.inicializarFirebase();

                if (this.useFirebase) {
                    console.log('✅ Firebase conectado y configurado');
                } else {
                    console.log('⚠️ Firebase no disponible, usando localStorage');
                }
            } else {
                console.log('⚠️ Firebase Setup no disponible, usando localStorage');
            }
        } catch (error) {
            console.log('⚠️ Error con Firebase, usando localStorage:', error.message);
        }

        // CAMBIO IMPORTANTE: Cargar stock inicial SIEMPRE desde Firebase primero
        await this.cargarStock();

        // Configurar sincronización automática
        this.configurarSincronizacionAutomatica();
    }

    // Cargar stock desde localStorage o Firebase
    async cargarStock() {
        try {
            console.log('📥 Cargando stock...');

            // CAMBIO IMPORTANTE: Intentar Firebase PRIMERO, siempre
            let stockCargado = false;

            // Intentar cargar desde Firebase primero
            if (typeof window.cargarStockCategorias === 'function') {
                console.log('🔥 Intentando cargar desde Firebase...');
                try {
                    stockCargado = await this.cargarDesdeFirebase();
                } catch (error) {
                    console.log('⚠️ Error cargando desde Firebase:', error.message);
                }
            }

            // Si Firebase falló, usar localStorage como respaldo
            if (!stockCargado) {
                console.log('📱 Cargando desde localStorage como respaldo...');
                this.cargarDesdeLocalStorage();
            }

            console.log('✅ Stock cargado correctamente');
        } catch (error) {
            console.error('❌ Error cargando stock:', error);
            this.cargarDesdeLocalStorage(); // Último respaldo
        }
    }

    // Cargar desde localStorage
    cargarDesdeLocalStorage() {
        console.log('📱 Cargando stock desde localStorage...');

        const stockGuardado = localStorage.getItem(this.storageKey);
        if (stockGuardado) {
            try {
                const stock = JSON.parse(stockGuardado);
                this.aplicarStockAProductos(stock);
                console.log('✅ Stock cargado desde localStorage');
            } catch (error) {
                console.error('❌ Error parseando stock de localStorage:', error);
            }
        } else {
            console.log('📝 No hay stock guardado, usando valores del config');
        }
    }

    // Cargar desde Firebase (cuando esté disponible)
    async cargarDesdeFirebase() {
        console.log('🔥 Cargando stock desde Firebase por categorías...');

        try {
            if (typeof window.cargarStockCategorias === 'function') {
                const resultado = await window.cargarStockCategorias();
                if (resultado) {
                    console.log('✅ Stock cargado desde Firebase por categorías');

                    // Guardar también en localStorage como respaldo
                    this.guardarEnLocalStorage();

                    return true;
                } else {
                    console.log('⚠️ No se pudo cargar desde Firebase');
                    return false;
                }
            } else {
                console.log('⚠️ Sistema de categorías Firebase no disponible');
                return false;
            }
        } catch (error) {
            console.error('❌ Error cargando desde Firebase por categorías:', error);
            return false;
        }
    }

    // Aplicar stock a los productos
    aplicarStockAProductos(stock) {
        if (!stock || typeof stock !== 'object') return;

        CONFIG.productos.forEach(producto => {
            const stockKey = `producto_${producto.id}`;
            if (stock[stockKey] !== undefined) {
                const stockAnterior = producto.stock;
                producto.stock = stock[stockKey];
                console.log(`📦 ${producto.nombre}: ${stockAnterior} → ${producto.stock}`);
            }
        });
    }

    // Guardar stock después de una venta
    async guardarStock(ventasRealizadas) {
        try {
            console.log('💾 Guardando stock después de venta...');

            // Actualizar stock local
            ventasRealizadas.forEach(venta => {
                const producto = CONFIG.productos.find(p => p.id === venta.id);
                if (producto) {
                    producto.stock = Math.max(0, producto.stock - venta.cantidad);
                    console.log(`📦 ${producto.nombre}: stock actualizado a ${producto.stock}`);
                }
            });

            // Guardar en localStorage INMEDIATAMENTE
            this.guardarEnLocalStorage();

            // Intentar guardar en Firebase INMEDIATAMENTE
            if (typeof window.actualizarStockCategoria === 'function') {
                console.log('🔥 Actualizando Firebase inmediatamente...');
                await this.guardarEnFirebase(ventasRealizadas);
            } else {
                // Marcar cambios pendientes si Firebase no está disponible
                this.hayCambiosPendientes = true;
                console.log('⏳ Cambios marcados como pendientes para Firebase');
            }

            console.log('✅ Stock guardado correctamente');
            return true;

        } catch (error) {
            console.error('❌ Error guardando stock:', error);
            this.hayCambiosPendientes = true; // Marcar como pendiente en caso de error
            return false;
        }
    }

    // Guardar en localStorage
    guardarEnLocalStorage() {
        try {
            const stock = {};
            CONFIG.productos.forEach(producto => {
                stock[`producto_${producto.id}`] = producto.stock;
            });

            localStorage.setItem(this.storageKey, JSON.stringify(stock));
            console.log('💾 Stock guardado en localStorage');
        } catch (error) {
            console.error('❌ Error guardando en localStorage:', error);
        }
    }

    // Guardar en Firebase (cuando esté disponible)
    async guardarEnFirebase(ventasRealizadas) {
        console.log('🔥 Guardando stock en Firebase por categorías...');

        try {
            if (typeof window.actualizarStockCategoria === 'function') {
                for (const venta of ventasRealizadas) {
                    const producto = CONFIG.productos.find(p => p.id === venta.id);
                    if (producto) {
                        await window.actualizarStockCategoria(producto.id, producto.stock);
                        console.log(`✅ ${producto.nombre} actualizado en Firebase: ${producto.stock}`);
                    }
                }
                console.log('✅ Stock guardado en Firebase por categorías');
            } else {
                console.log('⚠️ Sistema de categorías Firebase no disponible');
            }
        } catch (error) {
            console.error('❌ Error guardando en Firebase por categorías:', error);
        }
    }

    // Restaurar stock original
    restaurarStock() {
        console.log('🔄 Restaurando stock original...');

        CONFIG.productos.forEach(producto => {
            // Buscar el producto original en CONFIG
            const productoOriginal = window.CONFIG?.productos?.find(p => p.id === producto.id);
            if (productoOriginal) {
                producto.stock = productoOriginal.stock;
            }
        });

        // Limpiar localStorage
        localStorage.removeItem(this.storageKey);

        console.log('✅ Stock restaurado');

        // Recargar interfaz
        if (typeof cargarProductos === 'function') {
            const categoriaActual = new URLSearchParams(window.location.search).get('categoria') || 'todos';
            cargarProductos(categoriaActual);
        }
    }

    // Obtener resumen del stock
    obtenerResumen() {
        const resumen = {
            total: 0,
            agotados: 0,
            stockBajo: 0,
            productos: []
        };

        CONFIG.productos.forEach(producto => {
            resumen.total++;
            resumen.productos.push({
                id: producto.id,
                nombre: producto.nombre,
                stock: producto.stock
            });

            if (producto.stock === 0) {
                resumen.agotados++;
            } else if (producto.stock <= 5) {
                resumen.stockBajo++;
            }
        });

        return resumen;
    }

    // NUEVA FUNCIÓN: Configurar sincronización automática
    configurarSincronizacionAutomatica() {
        console.log('⚙️ Configurando sincronización automática rápida...');

        // Sincronizar cada 5 segundos si hay cambios pendientes (reducido de 30s)
        setInterval(async () => {
            if (this.useFirebase && this.hayCambiosPendientes) {
                console.log('🔄 Sincronización automática rápida...');
                await this.sincronizarCambiosPendientes();
            }
        }, 5000);

        // Cargar stock desde Firebase cada 15 segundos (reducido de 2 minutos)
        setInterval(async () => {
            if (typeof window.cargarStockCategorias === 'function') {
                console.log('📥 Recarga automática rápida desde Firebase...');
                await this.cargarDesdeFirebase();

                // Recargar interfaz si hay cambios
                if (typeof cargarProductos === 'function') {
                    const categoriaActual = new URLSearchParams(window.location.search).get('categoria') || 'todos';
                    cargarProductos(categoriaActual);
                }
            }
        }, 15000);

        // NUEVO: Sincronización inmediata al detectar cambios en la ventana
        window.addEventListener('focus', async () => {
            console.log('👁️ Ventana enfocada - Sincronizando inmediatamente...');
            if (typeof window.cargarStockCategorias === 'function') {
                await this.cargarDesdeFirebase();
            }
        });

        // NUEVO: Sincronización al hacer visible la página
        document.addEventListener('visibilitychange', async () => {
            if (!document.hidden) {
                console.log('👁️ Página visible - Sincronizando...');
                if (typeof window.cargarStockCategorias === 'function') {
                    await this.cargarDesdeFirebase();
                }
            }
        });
    }

    // NUEVA FUNCIÓN: Sincronización instantánea
    async sincronizacionInstantanea() {
        console.log('⚡ Iniciando sincronización instantánea...');
        
        try {
            // Cargar desde Firebase inmediatamente
            if (typeof window.cargarStockCategorias === 'function') {
                const resultado = await window.cargarStockCategorias();
                if (resultado) {
                    console.log('⚡ Stock cargado instantáneamente desde Firebase');
                    
                    // Recargar interfaz inmediatamente
                    if (typeof cargarProductos === 'function') {
                        const categoriaActual = new URLSearchParams(window.location.search).get('categoria') || 'todos';
                        cargarProductos(categoriaActual);
                    }
                    
                    // Mostrar notificación
                    if (typeof mostrarNotificacion === 'function') {
                        mostrarNotificacion('⚡ Stock sincronizado instantáneamente', 'success');
                    }
                    
                    return true;
                }
            }
            
            return false;
            
        } catch (error) {
            console.error('❌ Error en sincronización instantánea:', error);
            return false;
        }
    }

    // NUEVA FUNCIÓN: Sincronizar cambios pendientes
    async sincronizarCambiosPendientes() {
        try {
            if (typeof window.sincronizarTodasLasCategorias === 'function') {
                await window.sincronizarTodasLasCategorias();
                this.hayCambiosPendientes = false;
                console.log('✅ Cambios pendientes sincronizados');
            }
        } catch (error) {
            console.error('❌ Error sincronizando cambios pendientes:', error);
        }
    }
}

// Crear instancia global
window.stockManager = new StockManager();

// Funciones de compatibilidad para el código existente
window.actualizarStockEnFirebase = async function (pedidoRealizado) {
    return await window.stockManager.guardarStock(pedidoRealizado);
};

window.cargarStockDesdeFirebase = async function () {
    return await window.stockManager.cargarStock();
};

window.restaurarStock = function () {
    return window.stockManager.restaurarStock();
};

// NUEVA: Función de sincronización instantánea
window.sincronizacionInstantanea = async function () {
    return await window.stockManager.sincronizacionInstantanea();
};

console.log('📦 Stock Manager inicializado con sincronización rápida');