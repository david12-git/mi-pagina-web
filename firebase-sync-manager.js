// 🔥 Firebase Master - Firebase manda, local obedece
// Firebase es la ÚNICA fuente de verdad, lo local solo refleja lo que Firebase dice

class FirebaseMaster {
    constructor() {
        this.isInitialized = false;
        this.db = null;
        this.listeners = [];
        this.isOnline = navigator.onLine;
        this.pendingChanges = []; // Solo para cambios que esperan confirmación de Firebase

        this.init();
    }

    async init() {
        console.log('🔥 Inicializando Firebase Master - Firebase es la autoridad absoluta');

        // PASO 1: Esperar a que CONFIG esté disponible
        await this.waitForConfig();

        // PASO 2: Inicializar productosData desde CONFIG como base
        if (typeof CONFIG !== 'undefined' && CONFIG.productos) {
            window.productosData = [...CONFIG.productos];
            console.log('📝 Base inicial desde CONFIG cargada - Firebase Master tomará el control');
        } else {
            console.error('❌ CONFIG no disponible después de esperar');
            return;
        }

        // Configurar listeners de conectividad
        window.addEventListener('online', () => {
            console.log('🌐 Conexión restaurada - Escuchando Firebase inmediatamente');
            this.isOnline = true;
            this.connectToFirebase();
        });

        window.addEventListener('offline', () => {
            console.log('📴 Conexión perdida - Solo lectura local hasta reconexión');
            this.isOnline = false;
        });

        // Conectar con Firebase inmediatamente
        await this.connectToFirebase();
    }

    async waitForConfig() {
        console.log('⏳ Esperando a que CONFIG esté disponible...');

        return new Promise((resolve) => {
            const checkConfig = () => {
                if (typeof CONFIG !== 'undefined' && CONFIG.productos && CONFIG.productos.length > 0) {
                    console.log(`✅ CONFIG disponible con ${CONFIG.productos.length} productos`);
                    resolve();
                } else {
                    console.log('⏳ CONFIG no disponible aún, esperando...');
                    setTimeout(checkConfig, 100);
                }
            };
            checkConfig();
        });
    }

    async connectToFirebase() {
        try {
            console.log('🔥 Conectando con Firebase Master...');

            // Importar Firebase modules
            const { initializeApp } = await import("https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js");
            const { getFirestore, collection, doc, getDocs, setDoc, onSnapshot, serverTimestamp, getDoc } = await import("https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js");

            // Inicializar Firebase
            const app = initializeApp(firebaseConfig);
            this.db = getFirestore(app);

            // Guardar funciones de Firebase para uso posterior
            this.firebaseFunctions = {
                collection,
                doc,
                getDocs,
                setDoc,
                getDoc,
                onSnapshot,
                serverTimestamp
            };

            // Probar conexión
            await this.testConnection();

            this.isInitialized = true;
            console.log('✅ Firebase Master conectado - Configurando listener');

            // PASO 1: Configurar listener en tiempo real (Firebase manda)
            this.setupFirebaseListener();

            // PASO 2: Cargar datos iniciales desde Firebase
            await this.loadFromFirebase();

            // PASO 3: Cargar interfaz después de tener datos correctos
            this.loadInitialInterface();

            return true;

        } catch (error) {
            console.log('❌ Error conectando Firebase:', error.message);
            this.isInitialized = false;
            this.useLocalDataTemporarily();
            return false;
        }
    }

    async testConnection() {
        try {
            const { collection, getDocs } = this.firebaseFunctions;
            const testCollection = collection(this.db, 'productos-stock');
            await getDocs(testCollection);
            console.log('✅ Conexión Firebase verificada');
        } catch (error) {
            throw new Error('Error de conexión: ' + error.message);
        }
    }

    setupFirebaseListener() {
        if (!this.isInitialized) return;

        console.log('👂 Configurando listener Firebase - Firebase manda, local obedece');

        const { collection, onSnapshot } = this.firebaseFunctions;
        const stockCollection = collection(this.db, 'productos');

        const unsubscribe = onSnapshot(stockCollection, (snapshot) => {
            console.log('🔄 Firebase envió cambios - Aplicando inmediatamente');

            const productosFirebase = {};

            snapshot.forEach(doc => {
                const data = doc.data();
                productosFirebase[data.id] = {
                    id: data.id,
                    nombre: data.nombre,
                    categoria: data.categoria,
                    stock: data.stock,
                    timestamp: data.timestamp
                };
            });

            // Firebase manda - aplicar TODOS los datos
            this.applyFirebaseData(productosFirebase);
        });

        this.listeners.push(unsubscribe);
    }

    async loadFromFirebase() {
        if (!this.isInitialized) return false;

        try {
            console.log('📥 Cargando datos desde Firebase - Firebase es la autoridad');

            const { collection, getDocs } = this.firebaseFunctions;
            const stockCollection = collection(this.db, 'productos');
            const snapshot = await getDocs(stockCollection);

            if (snapshot.empty) {
                console.log('📝 Firebase completamente vacío - Inicializando SOLO si es necesario');
                // SOLO inicializar si realmente no hay datos en Firebase
                await this.initializeFirebaseWithLocalData();
                return true;
            }

            console.log('🔥 Firebase tiene datos - Firebase manda, local obedece COMPLETAMENTE');

            const productosFirebase = {};
            snapshot.forEach(doc => {
                const data = doc.data();
                productosFirebase[data.id] = {
                    id: data.id,
                    nombre: data.nombre,
                    categoria: data.categoria,
                    stock: data.stock
                };
            });

            // Firebase manda - aplicar datos Y actualizar CONFIG local
            this.applyFirebaseDataCompletely(productosFirebase);
            console.log(`✅ ${Object.keys(productosFirebase).length} productos cargados desde Firebase - Local actualizado`);

            return true;

        } catch (error) {
            console.error('❌ Error cargando desde Firebase:', error);
            return false;
        }
    }

    async initializeFirebaseWithLocalData() {
        if (!this.isInitialized || !window.productosData) return false;

        try {
            console.log('📤 Firebase está vacío - Verificando si realmente necesita inicialización...');

            // Doble verificación: asegurarse de que Firebase realmente esté vacío
            const { collection, getDocs, doc, setDoc, serverTimestamp } = this.firebaseFunctions;
            const stockCollection = collection(this.db, 'productos');
            const doubleCheckSnapshot = await getDocs(stockCollection);

            if (!doubleCheckSnapshot.empty) {
                console.log('⚠️ Firebase ya no está vacío - Cancelando inicialización');
                return false;
            }

            console.log('✅ Firebase confirmado vacío - Inicializando con datos locales SOLO UNA VEZ');

            for (const producto of window.productosData) {
                const docRef = doc(this.db, 'productos', producto.id.toString());
                await setDoc(docRef, {
                    // Datos completos del producto
                    id: producto.id,
                    nombre: producto.nombre,
                    categoria: producto.categoria,
                    precio: producto.precio,
                    precio_anterior: producto.precio_anterior,
                    descripcion: producto.descripcion,
                    imagen: producto.imagen || '',
                    stock: producto.stock,
                    destacado: producto.destacado || false,
                    activo: producto.activo !== false,
                    caracteristicas: producto.caracteristicas || [],
                    sabores: producto.sabores || [],
                    stockPorSabor: producto.stockPorSabor || false,
                    ultimaActualizacion: serverTimestamp(),
                    origen: 'firebase-sync-manager'
                });
            }

            console.log('✅ Firebase inicializado con datos locales - Esto solo debería pasar UNA VEZ');
            return true;

        } catch (error) {
            console.error('❌ Error inicializando Firebase:', error);
            return false;
        }
    }

    applyFirebaseData(productosFirebase) {
        if (!window.productosData) {
            console.log('⚠️ No hay datos locales para actualizar');
            return;
        }

        let cambiosAplicados = 0;
        const cambios = [];

        // Firebase manda - actualizar TODOS los productos locales
        window.productosData.forEach(producto => {
            const firebaseData = productosFirebase[producto.id];

            if (firebaseData && firebaseData.stock !== producto.stock) {
                const stockAnterior = producto.stock;
                producto.stock = firebaseData.stock;

                cambios.push({
                    id: producto.id,
                    nombre: producto.nombre,
                    stockAnterior: stockAnterior,
                    stockNuevo: firebaseData.stock
                });

                cambiosAplicados++;
                console.log(`📦 ${producto.nombre}: ${stockAnterior} → ${firebaseData.stock} (Firebase manda)`);
            }
        });

        if (cambiosAplicados > 0) {
            // Recargar interfaz con datos de Firebase
            this.reloadInterface();

            // Mostrar notificación
            if (typeof mostrarNotificacion === 'function') {
                mostrarNotificacion(`🔄 Firebase actualizó ${cambiosAplicados} productos`, 'info');
            }

            // Notificar cambios
            this.notifyChanges(cambios);
        }
    }

    applyFirebaseDataCompletely(productosFirebase) {
        if (!window.productosData) {
            console.log('⚠️ No hay datos locales para actualizar');
            return;
        }

        let cambiosAplicados = 0;
        const cambios = [];

        // Firebase manda - actualizar TODOS los productos locales Y CONFIG
        window.productosData.forEach(producto => {
            const firebaseData = productosFirebase[producto.id];

            if (firebaseData) {
                const stockAnterior = producto.stock;

                // Actualizar productosData (interfaz)
                producto.stock = firebaseData.stock;

                // Actualizar CONFIG (para evitar reenvío en próxima recarga)
                if (window.CONFIG && window.CONFIG.productos) {
                    const configProducto = window.CONFIG.productos.find(p => p.id === producto.id);
                    if (configProducto) {
                        configProducto.stock = firebaseData.stock;
                    }
                }

                if (stockAnterior !== firebaseData.stock) {
                    cambios.push({
                        id: producto.id,
                        nombre: producto.nombre,
                        stockAnterior: stockAnterior,
                        stockNuevo: firebaseData.stock
                    });

                    cambiosAplicados++;
                    console.log(`📦 ${producto.nombre}: ${stockAnterior} → ${firebaseData.stock} (Firebase autoridad)`);
                }
            }
        });

        if (cambiosAplicados > 0) {
            // Recargar interfaz con datos de Firebase
            this.reloadInterface();

            // Mostrar notificación
            if (typeof mostrarNotificacion === 'function') {
                mostrarNotificacion(`🔥 Firebase actualizó ${cambiosAplicados} productos - Local sincronizado`, 'info');
            }

            // Notificar cambios
            this.notifyChanges(cambios);
        }

        console.log('✅ CONFIG local actualizado con datos de Firebase - No se reenviarán datos obsoletos');
    }

    // Método para enviar cambios A Firebase (no sincronizar)
    async sendChangeToFirebase(cambio) {
        if (!this.isInitialized || !this.isOnline) {
            console.log('⚠️ Sin conexión - Cambio no enviado a Firebase');
            return false;
        }

        try {
            console.log(`📤 Enviando cambio a Firebase: ${cambio.nombre} → ${cambio.nuevoStock}`);

            const { doc, setDoc, serverTimestamp, getDoc } = this.firebaseFunctions;
            const docRef = doc(this.db, 'productos', cambio.id.toString());

            // Obtener el producto actual de Firebase para mantener todos los datos
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                // Actualizar solo el stock, mantener el resto de datos
                const datosActuales = docSnap.data();
                await setDoc(docRef, {
                    ...datosActuales,
                    stock: cambio.nuevoStock,
                    ultimaActualizacion: serverTimestamp(),
                    origen: 'admin-update'
                });
            } else {
                // Si no existe, buscar en productosData local para crear el documento completo
                const productoLocal = window.productosData.find(p => p.id === cambio.id);
                if (productoLocal) {
                    await setDoc(docRef, {
                        id: productoLocal.id,
                        nombre: productoLocal.nombre,
                        categoria: productoLocal.categoria,
                        precio: productoLocal.precio,
                        precio_anterior: productoLocal.precio_anterior,
                        descripcion: productoLocal.descripcion,
                        imagen: productoLocal.imagen || '',
                        stock: cambio.nuevoStock,
                        destacado: productoLocal.destacado || false,
                        activo: productoLocal.activo !== false,
                        caracteristicas: productoLocal.caracteristicas || [],
                        sabores: productoLocal.sabores || [],
                        stockPorSabor: productoLocal.stockPorSabor || false,
                        ultimaActualizacion: serverTimestamp(),
                        origen: 'admin-create'
                    });
                }
            }

            console.log(`✅ Cambio enviado a Firebase - Esperando confirmación`);
            return true;

        } catch (error) {
            console.error('❌ Error enviando a Firebase:', error);
            return false;
        }
    }

    useLocalDataTemporarily() {
        console.log('📱 Usando datos locales temporalmente - Firebase no disponible');

        // Solo mostrar datos locales, no sincronizar nada
        if (typeof cargarProductos === 'function') {
            const categoriaActual = new URLSearchParams(window.location.search).get('categoria') || 'todos';
            cargarProductos(categoriaActual);
        }
    }

    notifyChanges(cambios) {
        // Notificar a otras ventanas
        try {
            const bc = new BroadcastChannel('stock-updates');
            bc.postMessage({
                type: 'FIREBASE_UPDATE',
                cambios: cambios,
                source: 'firebase-master'
            });
        } catch (error) {
            console.log('⚠️ Error notificando cambios:', error.message);
        }
    }

    reloadInterface() {
        // Recargar productos en la interfaz
        if (typeof cargarProductos === 'function') {
            const categoriaActual = new URLSearchParams(window.location.search).get('categoria') || 'todos';
            cargarProductos(categoriaActual);
        }
    }

    loadInitialInterface() {
        console.log('🎨 Cargando interfaz inicial con datos correctos');

        // Esperar un poco para asegurar que productosData esté disponible
        setTimeout(() => {
            if (window.productosData && window.productosData.length > 0) {
                console.log(`✅ productosData disponible: ${window.productosData.length} productos`);

                // Cargar productos en la interfaz
                if (typeof cargarProductos === 'function') {
                    const categoriaActual = new URLSearchParams(window.location.search).get('categoria') || 'todos';
                    cargarProductos(categoriaActual);
                    console.log('✅ Interfaz cargada con datos de Firebase Master');
                } else {
                    console.log('⚠️ Función cargarProductos no disponible aún');
                }
            } else {
                console.log('⚠️ productosData no disponible, reintentando...');
                // Reintentar después de un momento
                setTimeout(() => this.loadInitialInterface(), 1000);
            }
        }, 500);
    }

    // Método público para enviar cambios (NO sincronizar)
    async updateStock(cambio) {
        console.log(`🔄 Procesando cambio: ${cambio.nombre} → ${cambio.nuevoStock}`);

        // Enviar a Firebase - Firebase decidirá si aplicar o no
        const enviado = await this.sendChangeToFirebase(cambio);

        if (enviado) {
            console.log('✅ Cambio enviado a Firebase - Esperando respuesta del listener');
        } else {
            console.log('❌ No se pudo enviar a Firebase');
        }

        return enviado;
    }

    // Método para obtener estado
    getStatus() {
        return {
            initialized: this.isInitialized,
            online: this.isOnline,
            firebaseConnected: this.isInitialized && this.isOnline
        };
    }

    // Cleanup
    destroy() {
        this.listeners.forEach(unsubscribe => unsubscribe());
        this.listeners = [];
    }
}

// Crear instancia global
window.firebaseSyncManager = new FirebaseMaster();

// Funciones de compatibilidad
window.syncStockChanges = async function (cambio) {
    return await window.firebaseSyncManager.updateStock(cambio);
};

window.forceSyncFirebase = async function () {
    if (window.firebaseSyncManager.isInitialized) {
        return await window.firebaseSyncManager.loadFromFirebase();
    }
    return false;
};

// Función de emergencia para cargar interfaz
window.forceLoadInterface = function () {
    console.log('🚨 Forzando carga de interfaz...');
    console.log('=== DIAGNÓSTICO COMPLETO ===');

    // Verificar CONFIG
    console.log('CONFIG disponible:', typeof CONFIG !== 'undefined');
    if (typeof CONFIG !== 'undefined') {
        console.log('CONFIG.productos:', CONFIG.productos ? CONFIG.productos.length : 'no disponible');
    }

    // Verificar productosData
    console.log('productosData disponible:', typeof window.productosData !== 'undefined');
    if (window.productosData) {
        console.log('productosData length:', window.productosData.length);
        console.log('Primer producto:', window.productosData[0]);
    }

    // Verificar función cargarProductos
    console.log('cargarProductos disponible:', typeof cargarProductos !== 'undefined');

    // Verificar elemento del DOM
    const grid = document.getElementById('productos-grid');
    console.log('productos-grid elemento:', grid ? 'encontrado' : 'NO encontrado');

    // Intentar cargar si todo está disponible
    if (window.productosData && window.productosData.length > 0) {
        if (typeof cargarProductos === 'function') {
            const categoriaActual = new URLSearchParams(window.location.search).get('categoria') || 'todos';
            console.log('Intentando cargar categoría:', categoriaActual);
            cargarProductos(categoriaActual);
            console.log('✅ Interfaz forzada cargada');
        } else {
            console.log('❌ cargarProductos no es una función');
        }
    } else {
        console.log('❌ productosData no disponible o vacío');

        // Intentar inicializar desde CONFIG si está disponible
        if (typeof CONFIG !== 'undefined' && CONFIG.productos) {
            console.log('🔧 Intentando inicializar desde CONFIG...');
            window.productosData = [...CONFIG.productos];
            console.log('✅ productosData inicializado desde CONFIG');

            // Intentar cargar de nuevo
            if (typeof cargarProductos === 'function') {
                const categoriaActual = new URLSearchParams(window.location.search).get('categoria') || 'todos';
                cargarProductos(categoriaActual);
                console.log('✅ Interfaz cargada después de inicializar');
            }
        }
    }
};

console.log('🔥 Firebase Master cargado - Firebase manda, local obedece');