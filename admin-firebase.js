class AdminFirebase {
    constructor() {
        this.db = null;      // Realtime Database
        this.fs = null;      // Firestore
        this.storage = null; // Storage
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
        
        this.db = firebase.database();
        this.fs = firebase.firestore();
        this.storage = firebase.storage();
        console.log("🚀 Firebase Total Conectado");
    }

    // NUEVA FUNCIÓN: Guarda imagen y producto sin usar config.js
    async guardarProductoCompleto(archivo, datos) {
        try {
            let urlImagen = datos.imagenUrl || "";

            // 1. Subir imagen si se seleccionó una nueva
            if (archivo) {
                const storageRef = this.storage.ref(`productos/${datos.id}`);
                const snapshot = await storageRef.put(archivo);
                urlImagen = await snapshot.ref.getDownloadURL();
            }

            // 2. Guardar en Firestore (Catálogo permanente)
            await this.fs.collection('productos').doc(datos.id).set({
                nombre: datos.nombre,
                precio: parseFloat(datos.precio),
                stock: parseInt(datos.stock),
                imagenUrl: urlImagen,
                categoria: datos.categoria || 'general',
                ultimaActualizacion: firebase.firestore.FieldValue.serverTimestamp()
            });

            // 3. Actualizar Realtime Database (Tu lógica de stock actual)
            await this.db.ref(`stock/${datos.id}`).set(parseInt(datos.stock));
            
            return true;
        } catch (error) {
            console.error('❌ Error guardando:', error);
            return false;
        }
    }

    // Obtener productos en tiempo real para la web principal
    escucharProductos(callback) {
        return this.fs.collection('productos').onSnapshot(snap => {
            const productos = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            callback(productos);
        });
    }

    // Mantenemos tu función de actualizar stock individual
    async actualizarStock(id, nuevoStock) {
        await this.db.ref(`stock/${id}`).set(parseInt(nuevoStock));
        await this.fs.collection('productos').doc(id).update({ stock: parseInt(nuevoStock) });
    }
}

window.adminFirebase = new AdminFirebase();
