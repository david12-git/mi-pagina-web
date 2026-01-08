// 🔥 Configuración de Firebase (Pública - Segura con reglas de Firestore)
// NOTA: Estas credenciales son públicas por diseño de Firebase Web
// La seguridad se maneja en las reglas de Firestore, no en ocultar estas claves

const firebaseConfig = {
    apiKey: "AIzaSyDwhMZaJWHcsgM2DE9v-hhVqM4IscTo4Kk",
    authDomain: "my-pagina-web-3aca7.firebaseapp.com",
    projectId: "my-pagina-web-3aca7",
    storageBucket: "my-pagina-web-3aca7.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};

class FirebaseConfig {
    constructor() {
        this.app = null;
        this.db = null;
        this.isInitialized = false;
    }

    async initialize() {
        try {
            console.log('🔥 Conectando con Firebase...');
            
            // Verificar que Firebase esté disponible
            if (typeof firebase === 'undefined') {
                throw new Error('Firebase SDK no cargado');
            }

            // Inicializar con timeout
            const initPromise = this.initializeFirebase();
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Timeout de conexión')), 8000)
            );

            await Promise.race([initPromise, timeoutPromise]);
            
            this.isInitialized = true;
            console.log('✅ Conectado a Firebase: my-pagina-web-3aca7');
            return true;
            
        } catch (error) {
            console.log('❌ Error conectando Firebase:', error.message);
            this.isInitialized = false;
            return false;
        }
    }

    async initializeFirebase() {
        // Inicializar Firebase
        if (!firebase.apps.length) {
            this.app = firebase.initializeApp(firebaseConfig);
            console.log('🔥 Firebase App inicializada');
        } else {
            this.app = firebase.app();
            console.log('🔥 Usando Firebase App existente');
        }

        // Inicializar Firestore
        this.db = firebase.firestore();
        
        // Probar conexión
        await this.quickTest();
    }

    async quickTest() {
        try {
            console.log('🔍 Probando conexión a Firestore...');
            
            // Test rápido de conexión
            const testRef = this.db.collection('admin-test').doc('connection');
            await testRef.set({ 
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                test: 'admin-connection',
                app: 'las-delicias-admin'
            });
            
            console.log('✅ Conexión exitosa a Firestore');
            
            // Limpiar test
            await testRef.delete();
            
        } catch (error) {
            console.error('❌ Error en test de conexión:', error);
            throw error;
        }
    }

    async batchUpdateStock(cambios) {
        if (!this.isInitialized) {
            console.log('⚠️ Firebase no inicializado');
            return false;
        }

        try {
            console.log(`🔄 Actualizando ${cambios.length} productos en Firebase...`);
            
            const batch = this.db.batch();
            
            cambios.forEach(cambio => {
                const docRef = this.db.collection('productos-stock').doc(`producto-${cambio.id}`);
                batch.set(docRef, {
                    id: cambio.id,
                    nombre: cambio.nombre,
                    stock: cambio.nuevoStock,
                    stockAnterior: cambio.stockAnterior,
                    ultimaActualizacion: firebase.firestore.FieldValue.serverTimestamp(),
                    actualizadoPor: 'admin',
                    fecha: new Date().toISOString()
                }, { merge: true });
            });
            
            await batch.commit();
            console.log(`✅ ${cambios.length} productos actualizados en Firebase`);
            return true;
            
        } catch (error) {
            console.error('❌ Error actualizando en Firebase:', error);
            return false;
        }
    }

    onStockChange(callback) {
        if (!this.isInitialized) {
            console.log('⚠️ Firebase no inicializado para listeners');
            return null;
        }

        console.log('👂 Escuchando cambios en tiempo real...');
        
        return this.db.collection('productos-stock').onSnapshot((snapshot) => {
            const cambios = [];
            
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'modified' || change.type === 'added') {
                    const data = change.doc.data();
                    if (data.actualizadoPor === 'admin') {
                        cambios.push({
                            id: data.id,
                            nombre: data.nombre,
                            nuevoStock: data.stock
                        });
                    }
                }
            });
            
            if (cambios.length > 0) {
                console.log('🔄 Cambios detectados:', cambios);
                callback(cambios);
            }
        }, (error) => {
            console.error('❌ Error en listener:', error);
        });
    }

    // Método para sincronizar stock inicial
    async syncInitialStock() {
        if (!this.isInitialized) return false;

        try {
            console.log('📦 Sincronizando stock inicial...');
            
            const batch = this.db.batch();
            
            CONFIG.productos.forEach(producto => {
                const docRef = this.db.collection('productos-stock').doc(`producto-${producto.id}`);
                batch.set(docRef, {
                    id: producto.id,
                    nombre: producto.nombre,
                    categoria: producto.categoria,
                    stock: producto.stock,
                    ultimaActualizacion: firebase.firestore.FieldValue.serverTimestamp(),
                    sincronizadoPor: 'admin-inicial'
                }, { merge: true });
            });
            
            await batch.commit();
            console.log('✅ Stock inicial sincronizado');
            return true;
            
        } catch (error) {
            console.error('❌ Error sincronizando stock inicial:', error);
            return false;
        }
    }
}

// Instancia global
window.firebaseReal = new FirebaseConfig();

// Función de inicialización
window.initializeFirebaseReal = async function() {
    try {
        const result = await window.firebaseReal.initialize();
        
        if (result) {
            // Sincronizar stock inicial si es la primera vez
            await window.firebaseReal.syncInitialStock();
        }
        
        return result;
    } catch (error) {
        console.log('⚠️ Error inicializando Firebase:', error.message);
        return false;
    }
};