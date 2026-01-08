// Sistema completo Firebase + Config.js automático
class FirebaseConfigSync {
    constructor() {
        this.db = null;
        this.inicializar();
    }

    async inicializar() {
        try {
            // Configuración Firebase (usa tu configuración real)
            const firebaseConfig = {
                apiKey: "AIzaSyBqKG5d7J_4VQJ5d7J_4VQJ5d7J_4VQJ5d7J",
                authDomain: "las-delicias-abuela.firebaseapp.com",
                databaseURL: "https://las-delicias-abuela-default-rtdb.firebaseio.com",
                projectId: "las-delicias-abuela",
                storageBucket: "las-delicias-abuela.appspot.com",
                messagingSenderId: "123456789",
                appId: "1:123456789:web:abcdef123456"
            };

            if (typeof firebase !== 'undefined' && firebase.apps.length === 0) {
                firebase.initializeApp(firebaseConfig);
            }
            
            this.db = firebase.database();
            console.log('🔥 Firebase conectado exitosamente');
            
            await this.sincronizarStockInicial();
            this.escucharCambiosEnTiempoReal();
            
        } catch (error) {
            console.error('❌ Error conectando Firebase:', error);
            this.usarModoOffline();
        }
    }

    // Sincronizar stock inicial desde config.js a Firebase
    async sincronizarStockInicial() {
        try {
            const stockRef = this.db.ref('productos/stock');
            const snapshot = await stockRef.once('value');
            
            if (!snapshot.exists()) {
                console.log('📦 Sincronizando stock inicial a Firebase...');
                const stockInicial = {};
                CONFIG.productos.forEach(producto => {
                    stockInicial[producto.id] = {
                        stock: producto.stock,
                        nombre: producto.nombre,
                        categoria: producto.categoria,
                        ultimaActualizacion: Date.now()
                    };
                });
                await stockRef.set(stockInicial);
                console.log('✅ Stock inicial sincronizado');
            } else {
                // Cargar stock desde Firebase
                await this.cargarStockDesdeFirebase();
            }
        } catch (error) {
            console.error('❌ Error sincronizando stock inicial:', error);
        }
    }

    // Cargar stock desde Firebase
    async cargarStockDesdeFirebase() {
        try {
            const snapshot = await this.db.ref('productos/stock').once('value');
            const stockFirebase = snapshot.val();
            
            if (stockFirebase) {
                let cambiosDetectados = false;
                
                CONFIG.productos.forEach(producto => {
                    if (stockFirebase[producto.id] && 
                        stockFirebase[producto.id].stock !== producto.stock) {
                        producto.stock = stockFirebase[producto.id].stock;
                        cambiosDetectados = true;
                    }
                });
                
                if (cambiosDetectados) {
                    console.log('🔄 Stock cargado desde Firebase');
                    this.notificarCambiosConfig();
                }
            }
        } catch (error) {
            console.error('❌ Error cargando stock desde Firebase:', error);
        }
    }

    // Actualizar stock en Firebase (desde admin)
    async actualizarStockEnFirebase(productoId, nuevoStock, nombreProducto) {
        try {
            const updates = {};
            updates[`productos/stock/${productoId}`] = {
                stock: nuevoStock,
                nombre: nombreProducto,
                ultimaActualizacion: Date.now(),
                actualizadoPor: 'admin'
            };
            
            await this.db.ref().update(updates);
            console.log(`✅ Stock actualizado en Firebase: ${nombreProducto} → ${nuevoStock}`);
            
            // También generar config.js automáticamente
            this.generarConfigActualizado();
            
            return true;
        } catch (error) {
            console.error('❌ Error actualizando stock en Firebase:', error);
            return false;
        }
    }

    // Escuchar cambios en tiempo real
    escucharCambiosEnTiempoReal() {
        this.db.ref('productos/stock').on('value', (snapshot) => {
            const stockFirebase = snapshot.val();
            
            if (stockFirebase) {
                let cambiosDetectados = false;
                const cambios = [];
                
                CONFIG.productos.forEach(producto => {
                    if (stockFirebase[producto.id] && 
                        stockFirebase[producto.id].stock !== producto.stock) {
                        
                        cambios.push({
                            id: producto.id,
                            nombre: producto.nombre,
                            stockAnterior: producto.stock,
                            stockNuevo: stockFirebase[producto.id].stock
                        });
                        
                        producto.stock = stockFirebase[producto.id].stock;
                        cambiosDetectados = true;
                    }
                });
                
                if (cambiosDetectados) {
                    console.log('🔄 Stock actualizado en tiempo real desde Firebase');
                    this.notificarCambiosConfig(cambios);
                    
                    // Recargar productos en la página
                    if (typeof cargarProductos === 'function') {
                        cargarProductos();
                    }
                }
            }
        });
    }

    // Generar config.js actualizado automáticamente
    generarConfigActualizado() {
        if (typeof window.configGenerator !== 'undefined') {
            const cambios = CONFIG.productos.map(producto => ({
                id: producto.id,
                nombre: producto.nombre,
                nuevoStock: producto.stock
            }));
            
            // Generar y mostrar automáticamente
            const codigoActualizado = window.configGenerator.generarConfigActualizado(cambios);
            
            // Guardar en localStorage para acceso posterior
            localStorage.setItem('configActualizado', JSON.stringify({
                codigo: codigoActualizado,
                timestamp: Date.now(),
                cambios: cambios
            }));
            
            console.log('📝 Config.js actualizado automáticamente');
            
            // Mostrar notificación
            this.mostrarNotificacionConfigActualizado();
        }
    }

    // Mostrar notificación de config actualizado
    mostrarNotificacionConfigActualizado() {
        // Crear notificación flotante
        const notificacion = document.createElement('div');
        notificacion.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #27ae60 0%, #229954 100%);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(39, 174, 96, 0.3);
            z-index: 10000;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            max-width: 300px;
        `;
        
        notificacion.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-sync-alt fa-spin"></i>
                <div>
                    <div>Config.js Actualizado</div>
                    <div style="font-size: 0.8rem; opacity: 0.9;">Haz clic para descargar</div>
                </div>
            </div>
        `;
        
        notificacion.onclick = () => {
            this.descargarConfigActualizado();
            document.body.removeChild(notificacion);
        };
        
        document.body.appendChild(notificacion);
        
        // Auto-remover después de 10 segundos
        setTimeout(() => {
            if (document.body.contains(notificacion)) {
                document.body.removeChild(notificacion);
            }
        }, 10000);
    }

    // Descargar config actualizado
    descargarConfigActualizado() {
        const configGuardado = localStorage.getItem('configActualizado');
        if (configGuardado) {
            const data = JSON.parse(configGuardado);
            
            // Crear blob y descargar
            const blob = new Blob([data.codigo], { type: 'text/javascript' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `config-actualizado-${new Date().toISOString().slice(0,10)}.js`;
            a.style.display = 'none';
            
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            URL.revokeObjectURL(url);
            
            alert('✅ Config.js actualizado descargado. Reemplaza tu archivo original.');
        }
    }

    // Notificar cambios en config
    notificarCambiosConfig(cambios = []) {
        // Disparar evento personalizado
        window.dispatchEvent(new CustomEvent('configActualizado', {
            detail: { cambios }
        }));
        
        // Actualizar localStorage
        localStorage.setItem('stockActualizado', JSON.stringify({
            timestamp: Date.now(),
            cambios: cambios
        }));
    }

    // Modo offline como fallback
    usarModoOffline() {
        console.log('⚠️ Usando modo offline - Firebase no disponible');
        // Usar el sistema localStorage existente
    }

    // Guardar múltiples cambios desde admin
    async guardarCambiosDesdeAdmin(cambios) {
        try {
            const updates = {};
            
            cambios.forEach(cambio => {
                updates[`productos/stock/${cambio.id}`] = {
                    stock: cambio.nuevoStock,
                    nombre: cambio.nombre,
                    ultimaActualizacion: Date.now(),
                    actualizadoPor: 'admin'
                };
            });
            
            await this.db.ref().update(updates);
            console.log('✅ Todos los cambios guardados en Firebase');
            
            // Generar config automáticamente
            this.generarConfigActualizado();
            
            return true;
        } catch (error) {
            console.error('❌ Error guardando cambios en Firebase:', error);
            return false;
        }
    }
}

// Instancia global
window.firebaseConfigSync = new FirebaseConfigSync();