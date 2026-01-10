// 🔥 Gestor de Firebase para Admin Panel
// Sistema completo de sincronización bidireccional con Firebase

class AdminFirebaseManager {
    constructor() {
        this.db = null;
        this.storage = null;
        this.isInitialized = false;
        this.listeners = [];
    }

    // Inicializar Firebase
    async inicializar() {
        try {
            console.log('🔥 Inicializando Firebase para Admin...');

            // Configuración de Firebase
            const firebaseConfig = {
                apiKey: "AIzaSyDwhMZaJWHcsgM2DE9v-hhVqM4IscTo4Kk",
                authDomain: "my-pagina-web-3aca7.firebaseapp.com",
                projectId: "my-pagina-web-3aca7",
                storageBucket: "my-pagina-web-3aca7.firebasestorage.app",
                messagingSenderId: "677277617824",
                appId: "1:677277617824:web:e1b42b87b038a2690203c5",
                measurementId: "G-HDYB37KYET"
            };

            // Inicializar Firebase App
            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }

            // Inicializar Firestore
            this.db = firebase.firestore();
            this.storage = firebase.storage();

            // Verificar conexión
            await this.verificarConexion();

            this.isInitialized = true;
            console.log('✅ Firebase inicializado correctamente');
            
            return true;
        } catch (error) {
            console.error('❌ Error inicializando Firebase:', error);
            throw error;
        }
    }

    // Verificar conexión con Firebase
    async verificarConexion() {
        try {
            // Hacer una consulta simple para verificar conexión
            await this.db.collection('productos').limit(1).get();
            console.log('✅ Conexión a Firestore verificada');
        } catch (error) {
            console.error('❌ Error verificando conexión:', error);
            throw new Error('No se pudo conectar con Firebase');
        }
    }

    // ==================== PRODUCTOS ====================

    // Cargar todos los productos desde Firebase
    async cargarProductos() {
        try {
            console.log('📥 Cargando productos desde Firebase...');

            const snapshot = await this.db.collection('productos').get();
            
            const productos = [];
            snapshot.forEach(doc => {
                productos.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            console.log(`✅ ${productos.length} productos cargados`);
            return productos;
        } catch (error) {
            console.error('❌ Error cargando productos:', error);
            return [];
        }
    }

    // Crear nuevo producto
    async crearProducto(producto) {
        try {
            console.log('➕ Creando nuevo producto:', producto.nombre);

            // Usar el ID del producto o generar uno nuevo
            const docRef = this.db.collection('productos').doc(producto.id.toString());

            await docRef.set({
                ...producto,
                fechaCreacion: firebase.firestore.FieldValue.serverTimestamp(),
                ultimaActualizacion: firebase.firestore.FieldValue.serverTimestamp()
            });

            console.log('✅ Producto creado en Firebase');
            return true;
        } catch (error) {
            console.error('❌ Error creando producto:', error);
            throw error;
        }
    }

    // Actualizar producto existente
    async actualizarProducto(producto) {
        try {
            console.log('🔄 Actualizando producto:', producto.nombre);

            const docRef = this.db.collection('productos').doc(producto.id.toString());

            await docRef.set({
                ...producto,
                ultimaActualizacion: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });

            console.log('✅ Producto actualizado en Firebase');
            
            // Notificar a la página web
            await this.notificarCambio('producto_actualizado', producto);
            
            return true;
        } catch (error) {
            console.error('❌ Error actualizando producto:', error);
            throw error;
        }
    }

    // Eliminar producto
    async eliminarProducto(productoId) {
        try {
            console.log('🗑️ Eliminando producto:', productoId);

            await this.db.collection('productos').doc(productoId.toString()).delete();

            console.log('✅ Producto eliminado de Firebase');
            
            // Notificar a la página web
            await this.notificarCambio('producto_eliminado', { id: productoId });
            
            return true;
        } catch (error) {
            console.error('❌ Error eliminando producto:', error);
            throw error;
        }
    }

    // ==================== STOCK ====================

    // Actualizar stock de un producto
    async actualizarStock(productoId, nuevoStock) {
        try {
            console.log(`📦 Actualizando stock del producto ${productoId}: ${nuevoStock}`);

            const docRef = this.db.collection('productos').doc(productoId.toString());

            await docRef.update({
                stock: nuevoStock,
                ultimaActualizacion: firebase.firestore.FieldValue.serverTimestamp()
            });

            console.log('✅ Stock actualizado en Firebase');
            
            // Notificar a la página web
            await this.notificarCambio('stock_actualizado', { id: productoId, stock: nuevoStock });
            
            return true;
        } catch (error) {
            console.error('❌ Error actualizando stock:', error);
            throw error;
        }
    }

    // Actualizar stock de sabor específico
    async actualizarStockSabor(productoId, sabor, nuevoStock) {
        try {
            console.log(`🍹 Actualizando stock del sabor ${sabor} del producto ${productoId}: ${nuevoStock}`);

            const docRef = this.db.collection('productos').doc(productoId.toString());

            // Obtener documento actual
            const doc = await docRef.get();
            const producto = doc.data();

            // Actualizar stock del sabor
            const stockPorSabor = producto.stockPorSabor || {};
            stockPorSabor[sabor] = nuevoStock;

            await docRef.update({
                stockPorSabor: stockPorSabor,
                ultimaActualizacion: firebase.firestore.FieldValue.serverTimestamp()
            });

            console.log('✅ Stock de sabor actualizado en Firebase');
            
            // Notificar a la página web
            await this.notificarCambio('stock_sabor_actualizado', { 
                id: productoId, 
                sabor: sabor, 
                stock: nuevoStock 
            });
            
            return true;
        } catch (error) {
            console.error('❌ Error actualizando stock de sabor:', error);
            throw error;
        }
    }

    // ==================== PRECIOS ====================

    // Actualizar precio de un producto
    async actualizarPrecio(productoId, nuevoPrecio) {
        try {
            console.log(`💰 Actualizando precio del producto ${productoId}: $${nuevoPrecio}`);

            const docRef = this.db.collection('productos').doc(productoId.toString());

            await docRef.update({
                precio: nuevoPrecio,
                ultimaActualizacion: firebase.firestore.FieldValue.serverTimestamp()
            });

            console.log('✅ Precio actualizado en Firebase');
            
            // Notificar a la página web
            await this.notificarCambio('precio_actualizado', { id: productoId, precio: nuevoPrecio });
            
            return true;
        } catch (error) {
            console.error('❌ Error actualizando precio:', error);
            throw error;
        }
    }

    // ==================== NOTIFICACIONES ====================

    // Notificar cambios a la página web
    async notificarCambio(tipo, datos) {
        try {
            // Guardar notificación en Firebase
            await this.db.collection('notificaciones').add({
                tipo: tipo,
                datos: datos,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                leido: false
            });

            console.log('📢 Notificación enviada:', tipo);
        } catch (error) {
            console.error('❌ Error enviando notificación:', error);
        }
    }

    // Escuchar cambios en tiempo real
    escucharCambios(callback) {
        console.log('👂 Configurando listener de cambios...');

        const unsubscribe = this.db.collection('productos').onSnapshot((snapshot) => {
            console.log('🔔 Cambios detectados en Firebase');
            
            const productos = [];
            snapshot.forEach(doc => {
                productos.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            callback(productos);
        }, (error) => {
            console.error('❌ Error en listener:', error);
        });

        this.listeners.push(unsubscribe);
        return unsubscribe;
    }

    // Detener listeners
    detenerListeners() {
        console.log('🛑 Deteniendo listeners...');
        this.listeners.forEach(unsubscribe => unsubscribe());
        this.listeners = [];
    }

    // ==================== SINCRONIZACIÓN MASIVA ====================

    // Sincronizar todos los productos desde config.js
    async sincronizarDesdeConfig() {
        try {
            console.log('🔄 Sincronizando productos desde config.js...');

            if (typeof CONFIG === 'undefined' || !CONFIG.productos) {
                throw new Error('CONFIG no está disponible');
            }

            const batch = this.db.batch();

            CONFIG.productos.forEach(producto => {
                const docRef = this.db.collection('productos').doc(producto.id.toString());
                batch.set(docRef, {
                    ...producto,
                    ultimaActualizacion: firebase.firestore.FieldValue.serverTimestamp()
                }, { merge: true });
            });

            await batch.commit();

            console.log(`✅ ${CONFIG.productos.length} productos sincronizados`);
            return true;
        } catch (error) {
            console.error('❌ Error en sincronización masiva:', error);
            throw error;
        }
    }

    // ==================== UTILIDADES ====================

    // Obtener estadísticas
    async obtenerEstadisticas() {
        try {
            const productos = await this.cargarProductos();

            return {
                total: productos.length,
                disponibles: productos.filter(p => p.stock > 0).length,
                agotados: productos.filter(p => p.stock === 0).length,
                conSabores: productos.filter(p => p.sabores && p.sabores.length > 0).length,
                stockTotal: productos.reduce((sum, p) => sum + (p.stock || 0), 0)
            };
        } catch (error) {
            console.error('❌ Error obteniendo estadísticas:', error);
            return null;
        }
    }
}

// Hacer disponible globalmente
window.AdminFirebaseManager = AdminFirebaseManager;

console.log('🔥 AdminFirebaseManager cargado correctamente');