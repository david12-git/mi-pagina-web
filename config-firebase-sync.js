// 🔄 SINCRONIZADOR AUTOMÁTICO CONFIG.JS → FIREBASE
// Este archivo detecta cambios en CONFIG y los sincroniza automáticamente con Firebase

class ConfigFirebaseSync {
    constructor() {
        this.firebaseConfig = {
            apiKey: "AIzaSyDwhMZaJWHcsgM2DE9v-hhVqM4IscTo4Kk",
            authDomain: "my-pagina-web-3aca7.firebaseapp.com",
            databaseURL: "https://my-pagina-web-3aca7-default-rtdb.firebaseio.com",
            projectId: "my-pagina-web-3aca7",
            storageBucket: "my-pagina-web-3aca7.firebasestorage.app",
            messagingSenderId: "677277617824",
            appId: "1:677277617824:web:e1b42b87b038a2690203c5",
            measurementId: "G-HDYB37KYET"
        };
        
        this.db = null;
        this.ultimaActualizacion = null;
        this.productosAnteriores = null;
        
        this.inicializar();
    }

    async inicializar() {
        try {
            console.log('🔄 Inicializando sincronizador CONFIG → Firebase...');
            
            // Importar Firebase modules
            const { initializeApp } = await import("https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js");
            const { getFirestore } = await import("https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js");
            
            // Inicializar Firebase
            const app = initializeApp(this.firebaseConfig);
            this.db = getFirestore(app);
            
            console.log('✅ Firebase inicializado para sincronización');
            
            // Hacer sincronización inicial
            await this.sincronizarConfigConFirebase();
            
            // Configurar monitoreo automático cada 2 segundos
            this.iniciarMonitoreo();
            
        } catch (error) {
            console.error('❌ Error inicializando sincronizador:', error);
        }
    }

    async sincronizarConfigConFirebase() {
        try {
            if (!this.db || typeof CONFIG === 'undefined') {
                console.log('⚠️ Firebase o CONFIG no disponible para sincronización');
                return false;
            }

            const { setDoc, doc, getDocs, collection } = await import("https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js");
            
            console.log('🔄 Sincronización inteligente CONFIG ↔ Firebase...');
            
            // PASO 1: Obtener productos existentes en Firebase
            const productosSnapshot = await getDocs(collection(this.db, 'productos'));
            const productosFirebase = new Map();
            
            productosSnapshot.forEach(doc => {
                const data = doc.data();
                productosFirebase.set(parseInt(doc.id), data);
            });
            
            console.log(`📦 ${productosFirebase.size} productos existentes en Firebase`);
            
            // PASO 2: Procesar cada producto de CONFIG
            let productosNuevos = 0;
            let productosActualizados = 0;
            
            for (const producto of CONFIG.productos) {
                const productoFirebase = productosFirebase.get(producto.id);
                
                if (!productoFirebase) {
                    // PRODUCTO NUEVO: Agregar a Firebase
                    await setDoc(doc(this.db, 'productos', producto.id.toString()), {
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
                        ultimaActualizacion: new Date().toISOString(),
                        origen: 'config.js'
                    });
                    productosNuevos++;
                    console.log(`🆕 Producto nuevo agregado: ${producto.nombre}`);
                    
                } else {
                    // PRODUCTO EXISTENTE: Solo actualizar campos específicos (NO STOCK)
                    const cambios = {};
                    let hayActualizaciones = false;
                    
                    // Comparar campos que SÍ se pueden actualizar desde CONFIG
                    if (productoFirebase.precio !== producto.precio) {
                        cambios.precio = producto.precio;
                        hayActualizaciones = true;
                        console.log(`💰 ${producto.nombre}: Precio ${productoFirebase.precio} → ${producto.precio}`);
                    }
                    
                    if (productoFirebase.precio_anterior !== producto.precio_anterior) {
                        cambios.precio_anterior = producto.precio_anterior;
                        hayActualizaciones = true;
                    }
                    
                    if (productoFirebase.nombre !== producto.nombre) {
                        cambios.nombre = producto.nombre;
                        hayActualizaciones = true;
                    }
                    
                    if (productoFirebase.descripcion !== producto.descripcion) {
                        cambios.descripcion = producto.descripcion;
                        hayActualizaciones = true;
                    }
                    
                    // Solo actualizar si hay cambios
                    if (hayActualizaciones) {
                        cambios.ultimaActualizacion = new Date().toISOString();
                        cambios.origen = 'config.js-update';
                        
                        await setDoc(doc(this.db, 'productos', producto.id.toString()), {
                            ...productoFirebase,
                            ...cambios
                        });
                        
                        productosActualizados++;
                        console.log(`✏️ Producto actualizado: ${producto.nombre}`);
                    }
                }
            }
            
            console.log(`✅ Sincronización completada:`);
            console.log(`   🆕 ${productosNuevos} productos nuevos`);
            console.log(`   ✏️ ${productosActualizados} productos actualizados`);
            console.log(`   📦 Stock preservado desde Firebase (admin)`);
            
            this.ultimaActualizacion = Date.now();
            this.productosAnteriores = JSON.stringify(CONFIG.productos);
            
            return true;
            
        } catch (error) {
            console.error('❌ Error sincronizando con Firebase:', error);
            return false;
        }
    }

    iniciarMonitoreo() {
        console.log('👀 Iniciando monitoreo automático de cambios en CONFIG...');
        
        setInterval(() => {
            this.verificarCambios();
        }, 2000); // Verificar cada 2 segundos
    }

    async verificarCambios() {
        try {
            if (typeof CONFIG === 'undefined' || !CONFIG.productos) {
                return;
            }

            const productosActuales = JSON.stringify(CONFIG.productos);
            
            // Si hay cambios, sincronizar
            if (this.productosAnteriores !== productosActuales) {
                console.log('🔄 ¡Cambios detectados en CONFIG.productos!');
                
                // Mostrar qué cambió
                this.mostrarCambiosDetectados();
                
                // Sincronizar con Firebase
                const sincronizado = await this.sincronizarConfigConFirebase();
                
                if (sincronizado) {
                    console.log('✅ Cambios sincronizados automáticamente con Firebase');
                    
                    // Mostrar notificación visual
                    this.mostrarNotificacionSincronizacion();
                } else {
                    console.error('❌ Error sincronizando cambios');
                }
            }
            
        } catch (error) {
            console.error('❌ Error verificando cambios:', error);
        }
    }

    mostrarCambiosDetectados() {
        try {
            const productosAnteriores = this.productosAnteriores ? JSON.parse(this.productosAnteriores) : [];
            const productosActuales = CONFIG.productos;
            
            // Detectar productos nuevos
            const productosNuevos = productosActuales.filter(actual => 
                !productosAnteriores.find(anterior => anterior.id === actual.id)
            );
            
            // Detectar productos modificados
            const productosModificados = productosActuales.filter(actual => {
                const anterior = productosAnteriores.find(ant => ant.id === actual.id);
                return anterior && JSON.stringify(anterior) !== JSON.stringify(actual);
            });
            
            if (productosNuevos.length > 0) {
                console.log('🆕 Productos nuevos:', productosNuevos.map(p => `${p.id}: ${p.nombre}`));
            }
            
            if (productosModificados.length > 0) {
                console.log('✏️ Productos modificados:', productosModificados.map(p => `${p.id}: ${p.nombre}`));
                
                // Mostrar detalles de los cambios
                productosModificados.forEach(actual => {
                    const anterior = productosAnteriores.find(ant => ant.id === actual.id);
                    if (anterior.precio !== actual.precio) {
                        console.log(`💰 ${actual.nombre}: Precio ${anterior.precio} → ${actual.precio}`);
                    }
                    if (anterior.stock !== actual.stock) {
                        console.log(`📦 ${actual.nombre}: Stock ${anterior.stock} → ${actual.stock}`);
                    }
                });
            }
            
        } catch (error) {
            console.log('⚠️ Error mostrando cambios:', error);
        }
    }

    mostrarNotificacionSincronizacion() {
        // Crear notificación visual temporal
        const notificacion = document.createElement('div');
        notificacion.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #2196F3, #1976D2);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(33, 150, 243, 0.3);
            z-index: 10000;
            font-family: Arial, sans-serif;
            font-weight: bold;
            animation: slideIn 0.3s ease-out;
        `;
        
        notificacion.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-sync-alt" style="animation: spin 1s linear infinite;"></i>
                <span>CONFIG → Firebase (Stock preservado)</span>
            </div>
        `;
        
        // Agregar animación CSS
        if (!document.getElementById('sync-animations')) {
            const style = document.createElement('style');
            style.id = 'sync-animations';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notificacion);
        
        // Remover después de 3 segundos
        setTimeout(() => {
            if (notificacion.parentNode) {
                notificacion.remove();
            }
        }, 3000);
    }
}

// Inicializar sincronizador automáticamente cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    // TEMPORALMENTE DESACTIVADO para evitar conflictos
    console.log('🔄 Sincronizador CONFIG → Firebase DESACTIVADO temporalmente');
    /*
    // Esperar un momento para que CONFIG esté disponible
    setTimeout(() => {
        if (typeof CONFIG !== 'undefined') {
            window.configSync = new ConfigFirebaseSync();
            console.log('🚀 Sincronizador CONFIG → Firebase activado');
        } else {
            console.error('❌ CONFIG no disponible para sincronización');
        }
    }, 1000);
    */
});

// Hacer disponible globalmente para debugging
window.ConfigFirebaseSync = ConfigFirebaseSync;