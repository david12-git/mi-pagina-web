// 🔥 Sistema de Sincronización en Tiempo Real con Firebase
// Este archivo permite que la página web se actualice automáticamente cuando el admin hace cambios

class FirebaseRealtimeSync {
    constructor() {
        this.db = null;
        this.isInitialized = false;
        this.listeners = [];
    }

    // Inicializar Firebase
    async inicializar() {
        try {
            console.log('🔥 Inicializando sincronización en tiempo real...');

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

            // Inicializar Firebase App si no está inicializado
            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }

            // Inicializar Firestore
            this.db = firebase.firestore();

            this.isInitialized = true;
            console.log('✅ Sincronización en tiempo real inicializada');
            
            return true;
        } catch (error) {
            console.error('❌ Error inicializando sincronización:', error);
            return false;
        }
    }

    // Escuchar cambios en productos
    escucharCambiosProductos(callback) {
        if (!this.isInitialized) {
            console.log('⚠️ Firebase no inicializado');
            return null;
        }

        console.log('👂 Escuchando cambios en productos...');

        const unsubscribe = this.db.collection('productos').onSnapshot((snapshot) => {
            console.log('🔔 Cambios detectados en Firebase');
            
            const cambios = [];
            snapshot.docChanges().forEach((change) => {
                const data = { id: change.doc.id, ...change.doc.data() };
                
                if (change.type === 'added') {
                    console.log('➕ Producto agregado:', data.nombre);
                    cambios.push({ tipo: 'added', producto: data });
                }
                
                if (change.type === 'modified') {
                    console.log('📝 Producto modificado:', data.nombre);
                    cambios.push({ tipo: 'modified', producto: data });
                }
                
                if (change.type === 'removed') {
                    console.log('➖ Producto eliminado:', data.nombre);
                    cambios.push({ tipo: 'removed', producto: data });
                }
            });

            if (cambios.length > 0 && callback) {
                callback(cambios);
            }
        }, (error) => {
            console.error('❌ Error en listener:', error);
        });

        this.listeners.push(unsubscribe);
        return unsubscribe;
    }

    // Cargar productos desde Firebase
    async cargarProductos() {
        try {
            if (!this.isInitialized) {
                console.log('⚠️ Firebase no inicializado');
                return [];
            }

            console.log('📥 Cargando productos desde Firebase...');

            const snapshot = await this.db.collection('productos').get();
            
            const productos = [];
            snapshot.forEach(doc => {
                productos.push({
                    id: parseInt(doc.id),
                    ...doc.data()
                });
            });

            console.log(`✅ ${productos.length} productos cargados desde Firebase`);
            return productos;
        } catch (error) {
            console.error('❌ Error cargando productos:', error);
            return [];
        }
    }

    // Aplicar cambios a los productos locales
    aplicarCambios(cambios) {
        console.log('🔄 Aplicando cambios a productos locales...');

        cambios.forEach(cambio => {
            const { tipo, producto } = cambio;
            const productoId = parseInt(producto.id);

            switch (tipo) {
                case 'added':
                    // Verificar si el producto ya existe
                    const existe = productosData.find(p => p.id === productoId);
                    if (!existe) {
                        productosData.push(producto);
                        console.log(`➕ Producto agregado localmente: ${producto.nombre}`);
                    }
                    break;

                case 'modified':
                    // Actualizar producto existente
                    const index = productosData.findIndex(p => p.id === productoId);
                    if (index !== -1) {
                        productosData[index] = { ...productosData[index], ...producto };
                        console.log(`📝 Producto actualizado localmente: ${producto.nombre}`);
                    }
                    break;

                case 'removed':
                    // Eliminar producto
                    const indexEliminar = productosData.findIndex(p => p.id === productoId);
                    if (indexEliminar !== -1) {
                        productosData.splice(indexEliminar, 1);
                        console.log(`➖ Producto eliminado localmente: ${producto.nombre}`);
                    }
                    break;
            }
        });

        // Recargar la interfaz
        if (typeof cargarProductos === 'function') {
            const categoriaActual = new URLSearchParams(window.location.search).get('categoria') || 'todos';
            cargarProductos(categoriaActual);
            console.log('✅ Interfaz actualizada');
        }

        // Mostrar notificación
        if (typeof mostrarNotificacion === 'function') {
            const mensaje = cambios.length === 1 
                ? `Producto actualizado: ${cambios[0].producto.nombre}`
                : `${cambios.length} productos actualizados`;
            mostrarNotificacion(mensaje, 'success');
        }
    }

    // Detener listeners
    detenerListeners() {
        console.log('🛑 Deteniendo listeners...');
        this.listeners.forEach(unsubscribe => unsubscribe());
        this.listeners = [];
    }
}

// Crear instancia global
window.firebaseRealtimeSync = new FirebaseRealtimeSync();

// Función de inicialización automática
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Iniciando sincronización en tiempo real...');
    
    try {
        // Inicializar sincronización
        const initialized = await window.firebaseRealtimeSync.inicializar();
        
        if (initialized) {
            // Cargar productos desde Firebase
            const productosFirebase = await window.firebaseRealtimeSync.cargarProductos();
            
            if (productosFirebase && productosFirebase.length > 0) {
                console.log('📦 Usando productos de Firebase');
                window.productosData = productosFirebase;
                
                // Recargar interfaz si es necesario
                if (typeof cargarProductos === 'function') {
                    const categoriaActual = new URLSearchParams(window.location.search).get('categoria') || 'todos';
                    cargarProductos(categoriaActual);
                }
            }
            
            // Configurar listener de cambios
            window.firebaseRealtimeSync.escucharCambiosProductos((cambios) => {
                console.log('🔔 Cambios recibidos del admin');
                window.firebaseRealtimeSync.aplicarCambios(cambios);
            });
            
            console.log('✅ Sincronización en tiempo real configurada');
        } else {
            console.log('⚠️ Sincronización en tiempo real no disponible, usando productos locales');
        }
    } catch (error) {
        console.error('❌ Error configurando sincronización:', error);
    }
});

console.log('🔥 FirebaseRealtimeSync cargado correctamente');
