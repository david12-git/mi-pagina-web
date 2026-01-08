// 🔥 Configuración y Setup de Firebase
// Este archivo maneja la configuración correcta de Firebase

class FirebaseSetup {
    constructor() {
        this.db = null;
        this.isConnected = false;
        this.retryCount = 0;
        this.maxRetries = 3;
    }

    async initialize() {
        console.log('🔥 Inicializando Firebase...');
        
        try {
            // Verificar si Firebase está disponible
            if (typeof window.firebaseDB === 'undefined') {
                console.log('⚠️ Firebase no está disponible, esperando...');
                await this.waitForFirebase();
            }

            this.db = window.firebaseDB;
            
            // Probar conexión
            await this.testConnection();
            
            if (this.isConnected) {
                console.log('✅ Firebase conectado correctamente');
                await this.initializeCollections();
                return true;
            } else {
                console.log('❌ No se pudo conectar a Firebase');
                return false;
            }
            
        } catch (error) {
            console.error('❌ Error inicializando Firebase:', error);
            return false;
        }
    }

    async waitForFirebase(timeout = 10000) {
        const startTime = Date.now();
        
        while (typeof window.firebaseDB === 'undefined' && (Date.now() - startTime) < timeout) {
            await new Promise(resolve => setTimeout(resolve, 100)); // Reducido de 500ms a 100ms
        }
        
        if (typeof window.firebaseDB === 'undefined') {
            throw new Error('Firebase no se cargó en el tiempo esperado');
        }
    }

    async testConnection() {
        try {
            console.log('🔍 Probando conexión a Firebase...');
            
            // Intentar leer un documento de prueba
            const testDoc = window.firebaseDoc(this.db, "test", "connection");
            await window.firebaseGetDoc(testDoc);
            
            this.isConnected = true;
            console.log('✅ Conexión a Firebase exitosa');
            
        } catch (error) {
            console.error('❌ Error de conexión:', error.message);
            
            if (error.message.includes('Missing or insufficient permissions')) {
                console.log('🔧 Intentando configurar permisos...');
                await this.handlePermissionError();
            } else {
                this.isConnected = false;
            }
        }
    }

    async handlePermissionError() {
        console.log('⚠️ Error de permisos detectado');
        console.log('📋 Para solucionarlo:');
        console.log('1. Ve a Firebase Console: https://console.firebase.google.com/');
        console.log('2. Selecciona tu proyecto: my-pagina-web-3aca7');
        console.log('3. Ve a Firestore Database > Rules');
        console.log('4. Reemplaza las reglas con:');
        console.log(`
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
        `);
        console.log('5. Haz clic en "Publish"');
        
        // Mostrar notificación al usuario
        if (typeof mostrarNotificacion === 'function') {
            mostrarNotificacion('❌ Firebase requiere configuración de permisos. Ver consola para instrucciones.', 'error');
        }
    }

    async initializeCollections() {
        try {
            console.log('📦 Inicializando colecciones de Firebase...');
            
            // Crear documento de configuración si no existe
            const configDoc = window.firebaseDoc(this.db, "config", "sistema");
            const configSnap = await window.firebaseGetDoc(configDoc);
            
            if (!configSnap.exists()) {
                await window.firebaseSetDoc(configDoc, {
                    version: "1.0",
                    ultimaActualizacion: new Date().toISOString(),
                    descripcion: "Sistema de inventario Las Delicias de la Abuela"
                });
                console.log('✅ Documento de configuración creado');
            }
            
            // Sincronizar productos iniciales
            await this.syncInitialProducts();
            
        } catch (error) {
            console.error('❌ Error inicializando colecciones:', error);
        }
    }

    async syncInitialProducts() {
        try {
            console.log('🔄 Sincronizando productos iniciales...');
            
            for (const producto of CONFIG.productos) {
                await this.syncProduct(producto);
            }
            
            console.log('✅ Productos sincronizados correctamente');
            
        } catch (error) {
            console.error('❌ Error sincronizando productos:', error);
        }
    }

    async syncProduct(producto) {
        try {
            const docRef = window.firebaseDoc(this.db, "productos", `producto-${producto.id}`);
            const docSnap = await window.firebaseGetDoc(docRef);
            
            const productData = {
                id: producto.id,
                nombre: producto.nombre,
                categoria: producto.categoria,
                precio: producto.precio,
                stock: producto.stock,
                sabores: producto.sabores || null,
                ultimaActualizacion: new Date().toISOString()
            };
            
            if (!docSnap.exists()) {
                // Crear nuevo producto
                await window.firebaseSetDoc(docRef, productData);
                console.log(`✅ Producto creado: ${producto.nombre}`);
            } else {
                // Actualizar solo si es necesario
                const existingData = docSnap.data();
                if (existingData.stock !== producto.stock) {
                    await window.firebaseUpdateDoc(docRef, {
                        stock: producto.stock,
                        ultimaActualizacion: new Date().toISOString()
                    });
                    console.log(`🔄 Stock actualizado: ${producto.nombre} = ${producto.stock}`);
                }
            }
            
        } catch (error) {
            console.error(`❌ Error sincronizando ${producto.nombre}:`, error);
        }
    }

    async updateProductStock(productoId, nuevoStock) {
        if (!this.isConnected) {
            console.log('⚠️ Firebase no conectado, usando solo localStorage');
            return false;
        }

        try {
            const docRef = window.firebaseDoc(this.db, "productos", `producto-${productoId}`);
            await window.firebaseUpdateDoc(docRef, {
                stock: nuevoStock,
                ultimaActualizacion: new Date().toISOString()
            });
            
            console.log(`✅ Stock actualizado en Firebase: Producto ${productoId} = ${nuevoStock}`);
            return true;
            
        } catch (error) {
            console.error(`❌ Error actualizando stock en Firebase:`, error);
            return false;
        }
    }

    async loadProductStock() {
        if (!this.isConnected) {
            console.log('⚠️ Firebase no conectado, usando stock local');
            return false;
        }

        try {
            console.log('📥 Cargando stock desde Firebase...');
            
            for (const producto of CONFIG.productos) {
                const docRef = window.firebaseDoc(this.db, "productos", `producto-${producto.id}`);
                const docSnap = await window.firebaseGetDoc(docRef);
                
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    const stockFirebase = data.stock || 0;
                    
                    if (producto.stock !== stockFirebase) {
                        console.log(`📦 ${producto.nombre}: ${producto.stock} → ${stockFirebase}`);
                        producto.stock = stockFirebase;
                    }
                }
            }
            
            console.log('✅ Stock cargado desde Firebase');
            return true;
            
        } catch (error) {
            console.error('❌ Error cargando stock desde Firebase:', error);
            return false;
        }
    }

    async forceSync() {
        console.log('🔄 Forzando sincronización completa...');
        
        try {
            await this.syncInitialProducts();
            
            if (typeof mostrarNotificacion === 'function') {
                mostrarNotificacion('✅ Sincronización forzada completada', 'success');
            }
            
            return true;
            
        } catch (error) {
            console.error('❌ Error en sincronización forzada:', error);
            
            if (typeof mostrarNotificacion === 'function') {
                mostrarNotificacion('❌ Error en sincronización forzada', 'error');
            }
            
            return false;
        }
    }
}

// Crear instancia global
window.firebaseSetup = new FirebaseSetup();

// Funciones de compatibilidad
window.inicializarFirebase = async function() {
    return await window.firebaseSetup.initialize();
};

window.sincronizarConFirebase = async function() {
    return await window.firebaseSetup.forceSync();
};

window.actualizarStockFirebase = async function(productoId, nuevoStock) {
    return await window.firebaseSetup.updateProductStock(productoId, nuevoStock);
};

window.cargarStockFirebase = async function() {
    return await window.firebaseSetup.loadProductStock();
};

console.log('🔥 Firebase Setup inicializado');