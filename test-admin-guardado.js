// 🔍 Test específico para el sistema de guardado del admin
// Este script diagnostica problemas en el flujo de guardado

class AdminGuardadoTest {
    constructor() {
        this.resultados = [];
        this.errores = [];
    }

    log(mensaje, tipo = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = `[${timestamp}] ${tipo.toUpperCase()}: ${mensaje}`;
        console.log(logEntry);
        
        this.resultados.push({
            timestamp,
            tipo,
            mensaje
        });
    }

    async ejecutarTodosLosTests() {
        console.log('🔍 INICIANDO DIAGNÓSTICO COMPLETO DEL SISTEMA DE GUARDADO');
        console.log('='.repeat(60));
        
        try {
            await this.testConfiguracionFirebase();
            await this.testConexionRealtime();
            await this.testEstructuraDatos();
            await this.testFlujoGuardado();
            await this.testSincronizacion();
            
            this.mostrarResumen();
            
        } catch (error) {
            this.log(`Error general en tests: ${error.message}`, 'error');
        }
    }

    async testConfiguracionFirebase() {
        this.log('Test 1: Verificando configuración Firebase...', 'info');
        
        try {
            // Verificar que Firebase esté cargado
            if (typeof firebase === 'undefined') {
                this.log('❌ Firebase SDK no está cargado', 'error');
                return false;
            }
            this.log('✅ Firebase SDK cargado', 'success');

            // Verificar configuración
            const expectedConfig = {
                apiKey: "AIzaSyDwhMZaJWHcsgM2DE9v-hhVqM4IscTo4Kk",
                authDomain: "my-pagina-web-3aca7.firebaseapp.com",
                projectId: "my-pagina-web-3aca7",
                databaseURL: "https://my-pagina-web-3aca7-default-rtdb.firebaseio.com/"
            };

            // Inicializar si no está inicializado
            let app;
            if (!firebase.apps.length) {
                app = firebase.initializeApp(expectedConfig);
                this.log('✅ Firebase inicializado', 'success');
            } else {
                app = firebase.app();
                this.log('✅ Usando instancia Firebase existente', 'success');
            }

            return true;

        } catch (error) {
            this.log(`❌ Error en configuración Firebase: ${error.message}`, 'error');
            return false;
        }
    }

    async testConexionRealtime() {
        this.log('Test 2: Probando conexión Realtime Database...', 'info');
        
        try {
            const database = firebase.database();
            const testRef = database.ref('admin-test');
            
            // Test de escritura
            await testRef.set({
                timestamp: Date.now(),
                test: 'admin-connection',
                version: '1.0'
            });
            this.log('✅ Escritura exitosa en Realtime Database', 'success');

            // Test de lectura
            const snapshot = await testRef.once('value');
            const data = snapshot.val();
            
            if (data && data.test === 'admin-connection') {
                this.log('✅ Lectura exitosa de Realtime Database', 'success');
                
                // Limpiar test
                await testRef.remove();
                this.log('✅ Limpieza de datos test completada', 'success');
                return true;
            } else {
                this.log('❌ Error en lectura de datos', 'error');
                return false;
            }

        } catch (error) {
            this.log(`❌ Error en conexión Realtime: ${error.message}`, 'error');
            
            // Diagnóstico adicional
            if (error.message.includes('permission')) {
                this.log('🔧 SOLUCIÓN: Configurar reglas de Firebase:', 'warning');
                this.log('   1. Ve a Firebase Console', 'warning');
                this.log('   2. Realtime Database > Rules', 'warning');
                this.log('   3. Cambiar a: { "rules": { ".read": true, ".write": true } }', 'warning');
            }
            
            return false;
        }
    }

    async testEstructuraDatos() {
        this.log('Test 3: Verificando estructura de datos...', 'info');
        
        try {
            const database = firebase.database();
            const productosRef = database.ref('productos');
            
            // Crear estructura de test
            const testProducts = {
                1: {
                    id: 1,
                    nombre: "Test Producto 1",
                    stock: 10,
                    categoria: "test"
                },
                2: {
                    id: 2,
                    nombre: "Test Producto 2", 
                    stock: 5,
                    categoria: "test"
                }
            };

            await productosRef.set(testProducts);
            this.log('✅ Estructura de datos creada', 'success');

            // Verificar lectura
            const snapshot = await productosRef.once('value');
            const data = snapshot.val();
            
            if (data && Object.keys(data).length === 2) {
                this.log('✅ Estructura de datos verificada', 'success');
                return true;
            } else {
                this.log('❌ Error en estructura de datos', 'error');
                return false;
            }

        } catch (error) {
            this.log(`❌ Error en estructura de datos: ${error.message}`, 'error');
            return false;
        }
    }

    async testFlujoGuardado() {
        this.log('Test 4: Probando flujo completo de guardado...', 'info');
        
        try {
            const database = firebase.database();
            const productosRef = database.ref('productos');
            
            // Simular cambios del admin
            const cambios = {
                '1/stock': 15,
                '2/stock': 8
            };

            this.log('Aplicando cambios simulados...', 'info');
            await productosRef.update(cambios);
            this.log('✅ Cambios aplicados', 'success');

            // Verificar cambios
            const snapshot = await productosRef.once('value');
            const data = snapshot.val();
            
            if (data['1'].stock === 15 && data['2'].stock === 8) {
                this.log('✅ Cambios verificados correctamente', 'success');
                return true;
            } else {
                this.log('❌ Los cambios no se aplicaron correctamente', 'error');
                return false;
            }

        } catch (error) {
            this.log(`❌ Error en flujo de guardado: ${error.message}`, 'error');
            return false;
        }
    }

    async testSincronizacion() {
        this.log('Test 5: Probando sincronización en tiempo real...', 'info');
        
        try {
            const database = firebase.database();
            const productosRef = database.ref('productos');
            
            return new Promise((resolve) => {
                let cambiosDetectados = 0;
                
                // Configurar listener
                const listener = productosRef.on('value', (snapshot) => {
                    cambiosDetectados++;
                    this.log(`Cambio detectado #${cambiosDetectados}`, 'info');
                    
                    if (cambiosDetectados >= 2) {
                        productosRef.off('value', listener);
                        this.log('✅ Sincronización en tiempo real funciona', 'success');
                        resolve(true);
                    }
                });

                // Hacer un cambio para activar el listener
                setTimeout(async () => {
                    await productosRef.child('1/stock').set(20);
                    this.log('Cambio de prueba aplicado', 'info');
                }, 1000);

                // Timeout de seguridad
                setTimeout(() => {
                    productosRef.off('value', listener);
                    if (cambiosDetectados === 0) {
                        this.log('❌ No se detectaron cambios en tiempo real', 'error');
                        resolve(false);
                    }
                }, 5000);
            });

        } catch (error) {
            this.log(`❌ Error en sincronización: ${error.message}`, 'error');
            return false;
        }
    }

    mostrarResumen() {
        console.log('\n' + '='.repeat(60));
        console.log('📊 RESUMEN DEL DIAGNÓSTICO');
        console.log('='.repeat(60));
        
        const errores = this.resultados.filter(r => r.tipo === 'error');
        const exitos = this.resultados.filter(r => r.tipo === 'success');
        const advertencias = this.resultados.filter(r => r.tipo === 'warning');
        
        console.log(`✅ Éxitos: ${exitos.length}`);
        console.log(`❌ Errores: ${errores.length}`);
        console.log(`⚠️ Advertencias: ${advertencias.length}`);
        
        if (errores.length > 0) {
            console.log('\n🔍 ERRORES ENCONTRADOS:');
            errores.forEach(error => {
                console.log(`   - ${error.mensaje}`);
            });
        }
        
        if (advertencias.length > 0) {
            console.log('\n⚠️ ADVERTENCIAS:');
            advertencias.forEach(warning => {
                console.log(`   - ${warning.mensaje}`);
            });
        }
        
        // Recomendaciones
        console.log('\n💡 RECOMENDACIONES:');
        if (errores.length === 0) {
            console.log('   ✅ El sistema parece estar funcionando correctamente');
        } else {
            console.log('   🔧 Revisar la configuración de Firebase');
            console.log('   🔧 Verificar las reglas de la base de datos');
            console.log('   🔧 Comprobar la conexión a internet');
        }
        
        console.log('\n' + '='.repeat(60));
    }

    // Método para limpiar datos de test
    async limpiarDatosTest() {
        try {
            const database = firebase.database();
            await database.ref('productos').remove();
            await database.ref('admin-test').remove();
            this.log('✅ Datos de test eliminados', 'success');
        } catch (error) {
            this.log(`❌ Error limpiando datos test: ${error.message}`, 'error');
        }
    }
}

// Función para ejecutar el test desde la consola
window.ejecutarTestGuardado = async function() {
    const test = new AdminGuardadoTest();
    await test.ejecutarTodosLosTests();
    
    // Limpiar después del test
    setTimeout(async () => {
        await test.limpiarDatosTest();
    }, 2000);
    
    return test.resultados;
};

// Función específica para probar el admin
window.testearAdminGuardado = async function() {
    console.log('🔍 INICIANDO TEST ESPECÍFICO DEL ADMIN');
    
    try {
        // Simular el flujo del admin.html
        const firebaseConfig = {
            apiKey: "AIzaSyDwhMZaJWHcsgM2DE9v-hhVqM4IscTo4Kk",
            authDomain: "my-pagina-web-3aca7.firebaseapp.com",
            projectId: "my-pagina-web-3aca7",
            storageBucket: "my-pagina-web-3aca7.firebasestorage.app",
            messagingSenderId: "677277617824",
            appId: "1:677277617824:web:e1b42b87b038a2690203c5",
            measurementId: "G-HDYB37KYET",
            databaseURL: "https://my-pagina-web-3aca7-default-rtdb.firebaseio.com/"
        };

        // Verificar si ya está inicializado
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
            console.log('✅ Firebase inicializado para test admin');
        }

        const database = firebase.database();
        const productosRef = database.ref('productos');

        // Simular datos de productos como en el admin
        const productosTest = {
            1: { id: 1, nombre: "Tinto", stock: 50, categoria: "Bebidas Calientes" },
            2: { id: 2, nombre: "Empanada", stock: 30, categoria: "Repostería" },
            3: { id: 3, nombre: "Jugo", stock: 20, categoria: "Bebidas Frías" }
        };

        console.log('📦 Creando productos de test...');
        await productosRef.set(productosTest);

        // Simular actualización masiva como en guardarCambios()
        const updates = {
            '/productos/1/stock': 45,
            '/productos/2/stock': 25,
            '/productos/3/stock': 15
        };

        console.log('🔄 Aplicando actualización masiva...');
        await database.ref().update(updates);

        // Verificar cambios
        const snapshot = await productosRef.once('value');
        const data = snapshot.val();

        console.log('📊 Verificando resultados:');
        console.log('Producto 1 stock:', data[1].stock, '(esperado: 45)');
        console.log('Producto 2 stock:', data[2].stock, '(esperado: 25)');
        console.log('Producto 3 stock:', data[3].stock, '(esperado: 15)');

        if (data[1].stock === 45 && data[2].stock === 25 && data[3].stock === 15) {
            console.log('✅ TEST ADMIN EXITOSO: Los cambios se guardaron correctamente');
            
            // Limpiar
            await productosRef.remove();
            return true;
        } else {
            console.log('❌ TEST ADMIN FALLIDO: Los cambios no se guardaron');
            return false;
        }

    } catch (error) {
        console.error('❌ Error en test admin:', error);
        return false;
    }
};

console.log('🔍 Test de guardado admin cargado. Usa ejecutarTestGuardado() o testearAdminGuardado()');