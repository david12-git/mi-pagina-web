// 🔥 Sistema de Sincronización Firebase por Categorías
// Organiza todos los productos por categorías en Firebase

class FirebaseCategorias {
    constructor() {
        this.db = null;
        this.isConnected = false;
        this.categorias = [
            'bebidas-calientes',
            'bebidas-frias', 
            'comida',
            'postres'
        ];
    }

    async initialize() {
        console.log('🔥 Inicializando Firebase por Categorías...');
        
        try {
            // Esperar a que Firebase esté disponible
            await this.waitForFirebase();
            this.db = window.firebaseDB;
            
            // Probar conexión
            await this.testConnection();
            
            if (this.isConnected) {
                console.log('✅ Firebase conectado - Iniciando sincronización por categorías');
                
                // CAMBIO: Cargar stock PRIMERO, luego sincronizar si es necesario
                const stockCargado = await this.loadAllStock();
                
                if (!stockCargado) {
                    console.log('📦 No hay stock en Firebase, sincronizando desde config...');
                    await this.syncAllCategories();
                }
                
                return true;
            } else {
                console.log('❌ No se pudo conectar a Firebase');
                return false;
            }
            
        } catch (error) {
            console.error('❌ Error inicializando Firebase por categorías:', error);
            return false;
        }
    }

    async waitForFirebase(timeout = 5000) {
        const startTime = Date.now();
        
        while (typeof window.firebaseDB === 'undefined' && (Date.now() - startTime) < timeout) {
            console.log('⏳ Esperando Firebase...');
            await new Promise(resolve => setTimeout(resolve, 200)); // Reducido de 1000ms a 200ms
        }
        
        if (typeof window.firebaseDB === 'undefined') {
            throw new Error('Firebase no se cargó en el tiempo esperado');
        }
    }

    async testConnection() {
        try {
            console.log('🔍 Probando conexión a Firebase...');
            
            const testDoc = window.firebaseDoc(this.db, "test", "categorias-connection");
            await window.firebaseSetDoc(testDoc, {
                test: true,
                timestamp: new Date().toISOString(),
                message: "Conexión exitosa desde sistema de categorías"
            });
            
            this.isConnected = true;
            console.log('✅ Conexión a Firebase exitosa');
            
        } catch (error) {
            console.error('❌ Error de conexión:', error.message);
            
            if (error.message.includes('Missing or insufficient permissions')) {
                this.showPermissionError();
            }
            
            this.isConnected = false;
        }
    }

    showPermissionError() {
        console.log('🔧 ERROR DE PERMISOS DETECTADO');
        console.log('📋 Para solucionarlo:');
        console.log('1. Ve a: https://console.firebase.google.com/');
        console.log('2. Proyecto: my-pagina-web-3aca7');
        console.log('3. Firestore Database → Rules');
        console.log('4. Reemplaza con:');
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
        
        if (typeof mostrarNotificacion === 'function') {
            mostrarNotificacion('🔧 Firebase requiere configuración. Ver consola para instrucciones.', 'warning');
        }
    }

    async syncAllCategories() {
        console.log('📦 Sincronizando todas las categorías...');
        
        try {
            // Agrupar productos por categoría
            const productosPorCategoria = this.groupProductsByCategory();
            
            // Sincronizar cada categoría
            for (const [categoria, productos] of Object.entries(productosPorCategoria)) {
                await this.syncCategory(categoria, productos);
            }
            
            // Crear índice general
            await this.createGeneralIndex();
            
            console.log('✅ Todas las categorías sincronizadas correctamente');
            
            if (typeof mostrarNotificacion === 'function') {
                mostrarNotificacion('✅ Productos sincronizados con Firebase por categorías', 'success');
            }
            
            return true;
            
        } catch (error) {
            console.error('❌ Error sincronizando categorías:', error);
            
            if (typeof mostrarNotificacion === 'function') {
                mostrarNotificacion('❌ Error sincronizando con Firebase', 'error');
            }
            
            return false;
        }
    }

    groupProductsByCategory() {
        const grupos = {};
        
        CONFIG.productos.forEach(producto => {
            const categoria = this.normalizeCategory(producto.categoria);
            
            if (!grupos[categoria]) {
                grupos[categoria] = [];
            }
            
            grupos[categoria].push(producto);
        });
        
        console.log('📊 Productos agrupados por categoría:', Object.keys(grupos).map(cat => `${cat}: ${grupos[cat].length} productos`));
        
        return grupos;
    }

    normalizeCategory(categoria) {
        return categoria.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[áàäâ]/g, 'a')
            .replace(/[éèëê]/g, 'e')
            .replace(/[íìïî]/g, 'i')
            .replace(/[óòöô]/g, 'o')
            .replace(/[úùüû]/g, 'u')
            .replace(/ñ/g, 'n');
    }

    async syncCategory(categoria, productos) {
        try {
            console.log(`📂 Sincronizando categoría: ${categoria} (${productos.length} productos)`);
            
            const categoriaDoc = window.firebaseDoc(this.db, "categorias", categoria);
            
            // Preparar datos de la categoría
            const categoriaData = {
                nombre: categoria,
                nombreOriginal: productos[0]?.categoria || categoria,
                totalProductos: productos.length,
                ultimaActualizacion: new Date().toISOString(),
                productos: {}
            };
            
            // Agregar cada producto
            productos.forEach(producto => {
                const productoKey = `producto_${producto.id}`;
                categoriaData.productos[productoKey] = {
                    id: producto.id,
                    nombre: producto.nombre,
                    precio: producto.precio,
                    precio_anterior: producto.precio_anterior || producto.precio,
                    stock: producto.stock,
                    descripcion: producto.descripcion || '',
                    imagen: producto.imagen || '',
                    destacado: producto.destacado || false,
                    activo: producto.activo !== false,
                    caracteristicas: producto.caracteristicas || [],
                    sabores: producto.sabores || null,
                    ultimaActualizacion: new Date().toISOString()
                };
            });
            
            // Guardar en Firebase
            await window.firebaseSetDoc(categoriaDoc, categoriaData);
            
            console.log(`✅ Categoría ${categoria} sincronizada: ${productos.length} productos`);
            
            // Sincronizar productos individuales también
            await this.syncIndividualProducts(categoria, productos);
            
        } catch (error) {
            console.error(`❌ Error sincronizando categoría ${categoria}:`, error);
        }
    }

    async syncIndividualProducts(categoria, productos) {
        try {
            for (const producto of productos) {
                const productoDoc = window.firebaseDoc(this.db, "productos", `${categoria}_${producto.id}`);
                
                const productoData = {
                    id: producto.id,
                    nombre: producto.nombre,
                    categoria: categoria,
                    categoriaOriginal: producto.categoria,
                    precio: producto.precio,
                    precio_anterior: producto.precio_anterior || producto.precio,
                    stock: producto.stock,
                    descripcion: producto.descripcion || '',
                    imagen: producto.imagen || '',
                    destacado: producto.destacado || false,
                    activo: producto.activo !== false,
                    caracteristicas: producto.caracteristicas || [],
                    sabores: producto.sabores || null,
                    ultimaActualizacion: new Date().toISOString()
                };
                
                await window.firebaseSetDoc(productoDoc, productoData);
            }
            
            console.log(`📦 ${productos.length} productos individuales sincronizados para ${categoria}`);
            
        } catch (error) {
            console.error(`❌ Error sincronizando productos individuales de ${categoria}:`, error);
        }
    }

    async createGeneralIndex() {
        try {
            console.log('📋 Creando índice general...');
            
            const indexDoc = window.firebaseDoc(this.db, "sistema", "indice-general");
            
            const indexData = {
                totalProductos: CONFIG.productos.length,
                totalCategorias: this.categorias.length,
                categorias: {},
                ultimaActualizacion: new Date().toISOString(),
                version: "1.0"
            };
            
            // Estadísticas por categoría
            const grupos = this.groupProductsByCategory();
            Object.entries(grupos).forEach(([categoria, productos]) => {
                indexData.categorias[categoria] = {
                    nombre: categoria,
                    totalProductos: productos.length,
                    stockTotal: productos.reduce((sum, p) => sum + p.stock, 0),
                    precioPromedio: productos.reduce((sum, p) => sum + p.precio, 0) / productos.length
                };
            });
            
            await window.firebaseSetDoc(indexDoc, indexData);
            
            console.log('✅ Índice general creado');
            
        } catch (error) {
            console.error('❌ Error creando índice general:', error);
        }
    }

    async updateProductStock(productoId, nuevoStock) {
        if (!this.isConnected) {
            console.log('⚠️ Firebase no conectado para actualizar stock');
            return false;
        }

        try {
            // Encontrar el producto y su categoría
            const producto = CONFIG.productos.find(p => p.id === productoId);
            if (!producto) {
                console.error(`❌ Producto ${productoId} no encontrado`);
                return false;
            }

            const categoria = this.normalizeCategory(producto.categoria);
            
            // Actualizar en documento de categoría
            const categoriaDoc = window.firebaseDoc(this.db, "categorias", categoria);
            await window.firebaseUpdateDoc(categoriaDoc, {
                [`productos.producto_${productoId}.stock`]: nuevoStock,
                [`productos.producto_${productoId}.ultimaActualizacion`]: new Date().toISOString()
            });
            
            // Actualizar producto individual
            const productoDoc = window.firebaseDoc(this.db, "productos", `${categoria}_${productoId}`);
            await window.firebaseUpdateDoc(productoDoc, {
                stock: nuevoStock,
                ultimaActualizacion: new Date().toISOString()
            });
            
            console.log(`✅ Stock actualizado en Firebase: ${producto.nombre} = ${nuevoStock}`);
            return true;
            
        } catch (error) {
            console.error(`❌ Error actualizando stock en Firebase:`, error);
            return false;
        }
    }

    async loadAllStock() {
        if (!this.isConnected) {
            console.log('⚠️ Firebase no conectado para cargar stock');
            return false;
        }

        try {
            console.log('📥 Cargando stock desde Firebase...');
            
            let productosActualizados = 0;
            
            for (const producto of CONFIG.productos) {
                const categoria = this.normalizeCategory(producto.categoria);
                const productoDoc = window.firebaseDoc(this.db, "productos", `${categoria}_${producto.id}`);
                const docSnap = await window.firebaseGetDoc(productoDoc);
                
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    const stockFirebase = data.stock || 0;
                    
                    if (producto.stock !== stockFirebase) {
                        console.log(`📦 ${producto.nombre}: ${producto.stock} → ${stockFirebase}`);
                        producto.stock = stockFirebase;
                        productosActualizados++;
                    }
                }
            }
            
            console.log(`✅ Stock cargado desde Firebase: ${productosActualizados} productos actualizados`);
            
            // Recargar interfaz si es necesario
            if (productosActualizados > 0 && typeof cargarProductos === 'function') {
                const categoriaActual = new URLSearchParams(window.location.search).get('categoria') || 'todos';
                cargarProductos(categoriaActual);
            }
            
            return true;
            
        } catch (error) {
            console.error('❌ Error cargando stock desde Firebase:', error);
            return false;
        }
    }

    async getStockReport() {
        try {
            console.log('📊 Generando reporte de stock...');
            
            const reporte = {
                timestamp: new Date().toISOString(),
                categorias: {},
                resumen: {
                    totalProductos: 0,
                    stockTotal: 0,
                    agotados: 0,
                    stockBajo: 0
                }
            };
            
            const grupos = this.groupProductsByCategory();
            
            Object.entries(grupos).forEach(([categoria, productos]) => {
                const stockCategoria = productos.reduce((sum, p) => sum + p.stock, 0);
                const agotados = productos.filter(p => p.stock === 0).length;
                const stockBajo = productos.filter(p => p.stock > 0 && p.stock <= 5).length;
                
                reporte.categorias[categoria] = {
                    nombre: categoria,
                    productos: productos.length,
                    stockTotal: stockCategoria,
                    agotados: agotados,
                    stockBajo: stockBajo,
                    productos: productos.map(p => ({
                        id: p.id,
                        nombre: p.nombre,
                        stock: p.stock
                    }))
                };
                
                reporte.resumen.totalProductos += productos.length;
                reporte.resumen.stockTotal += stockCategoria;
                reporte.resumen.agotados += agotados;
                reporte.resumen.stockBajo += stockBajo;
            });
            
            console.log('📊 Reporte generado:', reporte.resumen);
            return reporte;
            
        } catch (error) {
            console.error('❌ Error generando reporte:', error);
            return null;
        }
    }
}

// Crear instancia global
window.firebaseCategorias = new FirebaseCategorias();

// Funciones de compatibilidad
window.sincronizarTodasLasCategorias = async function() {
    return await window.firebaseCategorias.initialize();
};

window.actualizarStockCategoria = async function(productoId, nuevoStock) {
    return await window.firebaseCategorias.updateProductStock(productoId, nuevoStock);
};

window.cargarStockCategorias = async function() {
    return await window.firebaseCategorias.loadAllStock();
};

window.reporteStockCategorias = async function() {
    return await window.firebaseCategorias.getStockReport();
};

console.log('🔥 Firebase Categorías inicializado');