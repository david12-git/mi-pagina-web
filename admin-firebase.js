// Sistema de administración con Firebase para persistencia automática
class AdminFirebase {
    constructor() {
        this.db = null;
        this.inicializar();
    }

    async inicializar() {
        // Usar la configuración existente de Firebase
        if (typeof firebase !== 'undefined' && firebase.apps.length === 0) {
            const firebaseConfig = {
                apiKey: "AIzaSyBqKG5d7J_4VQJ5d7J_4VQJ5d7J_4VQJ5d7J",
                authDomain: "las-delicias-abuela.firebaseapp.com",
                databaseURL: "https://las-delicias-abuela-default-rtdb.firebaseio.com",
                projectId: "las-delicias-abuela",
                storageBucket: "las-delicias-abuela.appspot.com",
                messagingSenderId: "123456789",
                appId: "1:123456789:web:abcdef123456"
            };
            firebase.initializeApp(firebaseConfig);
        }
        
        this.db = firebase.database();
        await this.sincronizarStockInicial();
    }

    // Sincronizar stock inicial desde config.js a Firebase
    async sincronizarStockInicial() {
        try {
            const stockRef = this.db.ref('stock');
            const snapshot = await stockRef.once('value');
            
            if (!snapshot.exists()) {
                console.log('📦 Sincronizando stock inicial a Firebase...');
                const stockInicial = {};
                CONFIG.productos.forEach(producto => {
                    stockInicial[producto.id] = producto.stock;
                });
                await stockRef.set(stockInicial);
                console.log('✅ Stock inicial sincronizado');
            }
        } catch (error) {
            console.error('❌ Error sincronizando stock inicial:', error);
        }
    }

    // Actualizar stock de un producto
    async actualizarStock(productoId, nuevoStock) {
        try {
            await this.db.ref(`stock/${productoId}`).set(nuevoStock);
            console.log(`✅ Stock actualizado: Producto ${productoId} → ${nuevoStock}`);
            return true;
        } catch (error) {
            console.error('❌ Error actualizando stock:', error);
            return false;
        }
    }

    // Obtener stock actual de Firebase
    async obtenerStock(productoId) {
        try {
            const snapshot = await this.db.ref(`stock/${productoId}`).once('value');
            return snapshot.val() || 0;
        } catch (error) {
            console.error('❌ Error obteniendo stock:', error);
            return 0;
        }
    }

    // Obtener todo el stock
    async obtenerTodoElStock() {
        try {
            const snapshot = await this.db.ref('stock').once('value');
            return snapshot.val() || {};
        } catch (error) {
            console.error('❌ Error obteniendo todo el stock:', error);
            return {};
        }
    }

    // Guardar múltiples cambios de stock
    async guardarCambiosStock(cambios) {
        try {
            const updates = {};
            cambios.forEach(cambio => {
                updates[`stock/${cambio.id}`] = cambio.nuevoStock;
            });
            
            await this.db.ref().update(updates);
            console.log('✅ Todos los cambios guardados en Firebase');
            return true;
        } catch (error) {
            console.error('❌ Error guardando cambios:', error);
            return false;
        }
    }

    // Escuchar cambios en tiempo real
    escucharCambiosStock(callback) {
        this.db.ref('stock').on('value', (snapshot) => {
            const stock = snapshot.val() || {};
            callback(stock);
        });
    }
}

// Instancia global
window.adminFirebase = new AdminFirebase();