// admin-firebase.js - CON TUS CREDENCIALES REALES
class AdminFirebase {
    constructor() {
        this.db = null;
        this.fs = null;
        this.storage = null;
        this.inicializar();
    }

    async inicializar() {
        if (typeof firebase !== 'undefined' && firebase.apps.length === 0) {
            // TUS CREDENCIALES ACTUALIZADAS
            const firebaseConfig = {
                apiKey: "AIzaSyDwhMZaJWHcsgM2DE9v-hhVqM4IscTo4Kk",
                authDomain: "my-pagina-web-3aca7.firebaseapp.com",
                databaseURL: "https://my-pagina-web-3aca7-default-rtdb.firebaseio.com",
                projectId: "my-pagina-web-3aca7",
                storageBucket: "my-pagina-web-3aca7.firebasestorage.app",
                messagingSenderId: "677277617824",
                appId: "1:677277617824:web:e1b42b87b038a2690203c5",
                measurementId: "G-HDYB37KYET"
            };
            firebase.initializeApp(firebaseConfig);
        }
        
        this.db = firebase.database();   
        this.fs = firebase.firestore();  
        this.storage = firebase.storage(); 
        console.log("🚀 Conectado a TU proyecto: my-pagina-web-3aca7");
    }

    async guardarProductoCompleto(archivo, datos) {
        try {
            let urlImagen = "";

            // 1. Subir imagen a tu Storage
            if (archivo) {
                const storageRef = this.storage.ref(`productos/${datos.id}`);
                const snapshot = await storageRef.put(archivo);
                urlImagen = await snapshot.ref.getDownloadURL();
            }

            // 2. Guardar en tu Firestore
            await this.fs.collection('productos').doc(datos.id).set({
                nombre: datos.nombre,
                precio: parseFloat(datos.precio),
                stock: parseInt(datos.stock),
                imagenUrl: urlImagen,
                categoria: datos.categoria || 'general',
                ultimaActualizacion: firebase.firestore.FieldValue.serverTimestamp()
            });

            // 3. Actualizar tu Realtime Database
            await this.db.ref(`stock/${datos.id}`).set(parseInt(datos.stock));
            
            return true;
        } catch (error) {
            console.error('❌ Error en tu Firebase:', error);
            // Si sale error aquí, revisa las REGLAS en tu consola web
            throw error;
        }
    }

    escucharProductos(callback) {
        return this.fs.collection('productos').onSnapshot(snap => {
            const productos = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            callback(productos);
        }, error => {
            console.error("❌ Error de lectura:", error);
        });
    }

    async eliminarProducto(id) {
        try {
            await this.fs.collection('productos').doc(id).delete();
            await this.db.ref(`stock/${id}`).remove();
            return true;
        } catch (error) {
            return false;
        }
    }
}

window.adminFirebase = new AdminFirebase();
