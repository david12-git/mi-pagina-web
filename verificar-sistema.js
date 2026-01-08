// 🔍 Script de Verificación del Sistema de Sabores
// Ejecutar en la consola del navegador para verificar que todo funcione

console.log('🔍 === VERIFICACIÓN DEL SISTEMA DE SABORES ===');

// 1. Verificar CONFIG
console.log('\n📋 1. Verificando CONFIG...');
if (typeof CONFIG !== 'undefined') {
    console.log('✅ CONFIG disponible');
    console.log(`📦 ${CONFIG.productos.length} productos cargados`);
    
    const productosConSabores = CONFIG.productos.filter(p => p.sabores && p.stockPorSabor);
    console.log(`🍹 ${productosConSabores.length} productos con sabores configurados:`);
    
    productosConSabores.forEach(producto => {
        console.log(`   • ${producto.nombre}: ${producto.sabores.length} sabores (${producto.sabores.join(', ')})`);
    });
} else {
    console.error('❌ CONFIG no disponible');
}

// 2. Verificar SaboresManager
console.log('\n🍹 2. Verificando SaboresManager...');
if (typeof window.saboresManager !== 'undefined') {
    console.log('✅ SaboresManager disponible');
    
    // Probar funciones principales
    const productosConSabores = CONFIG.productos.filter(p => p.sabores && p.stockPorSabor);
    
    if (productosConSabores.length > 0) {
        const producto = productosConSabores[0];
        console.log(`\n🧪 Probando con ${producto.nombre}:`);
        
        producto.sabores.forEach(sabor => {
            const stock = window.saboresManager.getStockSabor(producto.id, sabor);
            console.log(`   • ${sabor}: ${stock} unidades`);
        });
        
        // Probar resumen
        const resumen = window.saboresManager.getResumenStockSabores(producto.id);
        console.log(`\n📊 Resumen de ${producto.nombre}:`);
        console.log(`   • Stock total: ${resumen.totalStock}`);
        console.log(`   • Sabores disponibles: ${resumen.saboresDisponibles}/${resumen.sabores.length}`);
        console.log(`   • Sabores agotados: ${resumen.saboresAgotados}`);
    }
} else {
    console.error('❌ SaboresManager no disponible');
}

// 3. Verificar funciones globales
console.log('\n🌐 3. Verificando funciones globales...');
const funcionesEsperadas = [
    'getStockSabor',
    'procesarVentaSabor', 
    'validarSeleccionSabor',
    'restaurarStockSabores'
];

funcionesEsperadas.forEach(funcion => {
    if (typeof window[funcion] === 'function') {
        console.log(`✅ ${funcion} disponible`);
    } else {
        console.error(`❌ ${funcion} no disponible`);
    }
});

// 4. Verificar localStorage
console.log('\n💾 4. Verificando persistencia...');
const stockGuardado = localStorage.getItem('delicias_abuela_sabores_stock');
if (stockGuardado) {
    try {
        const stock = JSON.parse(stockGuardado);
        const cantidadSabores = Object.keys(stock).length;
        console.log(`✅ Stock guardado en localStorage: ${cantidadSabores} sabores`);
        console.log('📋 Primeros 5 sabores guardados:');
        Object.entries(stock).slice(0, 5).forEach(([key, value]) => {
            console.log(`   • ${key}: ${value} unidades`);
        });
    } catch (error) {
        console.error('❌ Error parseando stock guardado:', error);
    }
} else {
    console.log('⚠️ No hay stock guardado en localStorage (normal en primera ejecución)');
}

// 5. Prueba de funcionalidad
console.log('\n🧪 5. Prueba de funcionalidad...');
if (typeof window.saboresManager !== 'undefined' && CONFIG.productos) {
    const productosConSabores = CONFIG.productos.filter(p => p.sabores && p.stockPorSabor);
    
    if (productosConSabores.length > 0) {
        const producto = productosConSabores[0];
        const saboresDisponibles = window.saboresManager.getSaboresConStock(producto.id);
        
        if (saboresDisponibles.length > 0) {
            const sabor = saboresDisponibles[0].sabor;
            const stockAntes = window.saboresManager.getStockSabor(producto.id, sabor);
            
            console.log(`🛒 Simulando venta de ${producto.nombre} - ${sabor}`);
            console.log(`   Stock antes: ${stockAntes}`);
            
            const exito = window.saboresManager.procesarVentaSabor(producto.id, sabor, 1);
            const stockDespues = window.saboresManager.getStockSabor(producto.id, sabor);
            
            if (exito) {
                console.log(`✅ Venta exitosa - Stock después: ${stockDespues}`);
                
                // Restaurar el stock para no afectar el sistema
                window.saboresManager.actualizarStockSabor(producto.id, sabor, 1);
                console.log(`🔄 Stock restaurado para la prueba`);
            } else {
                console.error(`❌ Error en la venta simulada`);
            }
        } else {
            console.log('⚠️ No hay sabores disponibles para probar');
        }
    }
}

console.log('\n🎉 === VERIFICACIÓN COMPLETADA ===');
console.log('💡 Para más pruebas, abre test-sabores.html o test-sabores-simple.html');

// Función para ejecutar desde la consola
window.verificarSistema = function() {
    // Re-ejecutar este script
    eval(document.querySelector('script[src="verificar-sistema.js"]').textContent);
};