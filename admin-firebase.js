// admin-firebase.js COMPLETO Y ACTUALIZADO
class AdminFirebase {
    constructor() {
        this.db = null;      // Realtime Database (Stock)
        this.fs = null;      // Firestore (Productos e Imágenes)
        this.storage = null; // Firebase Storage (Fotos)
        this.inicializar();
    }

    async inicializar() {
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
        
        // Inicializamos todos los servicios
        this.db = firebase.database();
        this.fs = firebase.firestore();
        this.storage = firebase.storage();
        
        console.log("✅ Firebase (Database, Firestore y Storage) Inicializados");
        await this.sincronizarStockInicial();
    }

    // ==========================================
    // FASE NUEVA: GESTIÓN DE PRODUCTOS E IMÁGENES
    // ==========================================

    /**
     * Sube imagen a Storage y guarda producto en Firestore
     * @param {File} archivo - El archivo de imagen desde el input file
     * @param {Object} datos - {id, nombre, precio, stock, categoria}
     */
    async guardarProductoCompleto(archivo, datos) {
        try {
            let urlImagen = datos.imagenUrl || "";

            // 1. Subir imagen si existe
            if (archivo) {
                const storageRef = this.storage.ref(`productos/${datos.id}_${archivo.name}`);
                const snapshot = await storageRef.put(archivo);
                urlImagen = await snapshot.ref.getDownloadURL();
                console.log("📸 Imagen subida con éxito:", urlImagen);
            }

            // 2. Guardar en Firestore (Fuente de verdad para el catálogo)
            await this.fs.collection('productos').doc(datos.id).set({
                nombre: datos.nombre,
                precio: datos.precio,
                stock: parseInt(datos.stock),
                imagenUrl: urlImagen,
                categoria: datos.categoria || 'general',
                actualizado: firebase.firestore.FieldValue.serverTimestamp()
            });

            // 3. Sincronizar el stock en Realtime Database (Tu lógica anterior)
            await this.actualizarStock(datos.id, datos.stock);

            return true;
        } catch (error) {
            console.error('❌ Error en guardarProductoCompleto:', error);
            throw error;
        }
    }

    // Escuchar productos en tiempo real (Sustituye a config.js)
    escucharProductos(callback) {
        return this.fs.collection('productos').onSnapshot((snapshot) => {
            const productos = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            callback(productos);
        }, error => {
            console.error("Error escuchando productos:", error);
        });
    }

    // ==========================================
    // TUS FUNCIONES ORIGINALES (SIN TOCAR)
    // ==========================================

    async sincronizarStockInicial() {
        try {
            const stockRef = this.db.ref('stock');
            const snapshot = await stockRef.once('value');
            if (!snapshot.exists() && typeof CONFIG !== 'undefined') {
                const initialStock = {};
                CONFIG.productos.forEach(p => { initialStock[p.id] = p.stock; });
                await stockRef.set(initialStock);
            }
        } catch (error) { console.error('Error sincronización:', error); }
    }

    async actualizarStock(productoId, nuevoStock) {
        try {
            await this.db.ref(`stock/${productoId}`).set(parseInt(nuevoStock));
            return true;
        } catch (error) { return false; }
    }

    async obtenerStock(productoId) {
        const snapshot = await this.db.ref(`stock/${productoId}`).once('value');
        return snapshot.val() || 0;
    }

    async guardarCambiosStock(cambios) {
        const updates = {};
        cambios.forEach(c => { updates[`stock/${c.id}`] = parseInt(c.nuevoStock); });
        return this.db.ref().update(updates);
    }
}

// Instancia global
window.adminFirebase = new AdminFirebase();
