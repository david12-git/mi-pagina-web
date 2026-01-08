// 🍹 Gestor de Sabores y Stock Individual
// Sistema para manejar productos con múltiples sabores y stock independiente

class SaboresManager {
    constructor() {
        this.storageKey = 'delicias_abuela_sabores_stock';
        this.stockPorSabor = new Map();
        this.init();
    }

    init() {
        console.log('🍹 Inicializando gestor de sabores...');
        this.cargarStockSabores();
        this.inicializarStockSabores();
    }

    // Inicializar stock por sabores basado en la configuración
    inicializarStockSabores() {
        CONFIG.productos.forEach(producto => {
            if (producto.sabores && Array.isArray(producto.sabores)) {
                producto.sabores.forEach(sabor => {
                    const key = this.generarKeySabor(producto.id, sabor);
                    
                    // Si no existe stock para este sabor, inicializar
                    if (!this.stockPorSabor.has(key)) {
                        // Distribuir el stock total entre los sabores
                        const stockPorSabor = Math.floor(producto.stock / producto.sabores.length);
                        this.stockPorSabor.set(key, stockPorSabor);
                        
                        console.log(`🍹 ${producto.nombre} - ${sabor}: ${stockPorSabor} unidades`);
                    }
                });
            }
        });
        
        this.guardarStockSabores();
    }

    // Generar clave única para producto-sabor
    generarKeySabor(productoId, sabor) {
        return `${productoId}-${sabor.toLowerCase().replace(/\s+/g, '-')}`;
    }

    // Obtener stock disponible para un sabor específico
    getStockSabor(productoId, sabor) {
        const key = this.generarKeySabor(productoId, sabor);
        return this.stockPorSabor.get(key) || 0;
    }

    // Actualizar stock de un sabor específico
    actualizarStockSabor(productoId, sabor, cantidad) {
        const key = this.generarKeySabor(productoId, sabor);
        const stockActual = this.getStockSabor(productoId, sabor);
        const nuevoStock = Math.max(0, stockActual + cantidad);
        
        this.stockPorSabor.set(key, nuevoStock);
        this.guardarStockSabores();
        
        console.log(`📦 ${sabor}: ${stockActual} → ${nuevoStock}`);
        return nuevoStock;
    }

    // Verificar si hay stock disponible para un sabor
    hayStockDisponible(productoId, sabor, cantidadRequerida = 1) {
        const stockDisponible = this.getStockSabor(productoId, sabor);
        return stockDisponible >= cantidadRequerida;
    }

    // Obtener todos los sabores con stock de un producto
    getSaboresConStock(productoId) {
        const producto = CONFIG.productos.find(p => p.id === productoId);
        if (!producto || !producto.sabores) return [];

        return producto.sabores.filter(sabor => {
            return this.getStockSabor(productoId, sabor) > 0;
        }).map(sabor => ({
            sabor: sabor,
            stock: this.getStockSabor(productoId, sabor)
        }));
    }

    // Obtener resumen de stock por sabores
    getResumenStockSabores(productoId) {
        const producto = CONFIG.productos.find(p => p.id === productoId);
        if (!producto || !producto.sabores) return null;

        const resumen = {
            producto: producto.nombre,
            sabores: [],
            totalStock: 0,
            saboresAgotados: 0,
            saboresDisponibles: 0
        };

        producto.sabores.forEach(sabor => {
            const stock = this.getStockSabor(productoId, sabor);
            resumen.sabores.push({
                sabor: sabor,
                stock: stock,
                disponible: stock > 0
            });
            
            resumen.totalStock += stock;
            
            if (stock === 0) {
                resumen.saboresAgotados++;
            } else {
                resumen.saboresDisponibles++;
            }
        });

        return resumen;
    }

    // Procesar venta de un sabor específico
    procesarVentaSabor(productoId, sabor, cantidad) {
        if (!this.hayStockDisponible(productoId, sabor, cantidad)) {
            console.error(`❌ Stock insuficiente para ${sabor}: necesario ${cantidad}, disponible ${this.getStockSabor(productoId, sabor)}`);
            return false;
        }

        this.actualizarStockSabor(productoId, sabor, -cantidad);
        console.log(`✅ Venta procesada: ${sabor} x${cantidad}`);
        return true;
    }

    // Cargar stock de sabores desde localStorage
    cargarStockSabores() {
        try {
            const stockGuardado = localStorage.getItem(this.storageKey);
            if (stockGuardado) {
                const stock = JSON.parse(stockGuardado);
                this.stockPorSabor = new Map(Object.entries(stock));
                console.log('📥 Stock de sabores cargado desde localStorage');
            }
        } catch (error) {
            console.error('❌ Error cargando stock de sabores:', error);
        }
    }

    // Guardar stock de sabores en localStorage
    guardarStockSabores() {
        try {
            const stockObj = Object.fromEntries(this.stockPorSabor);
            localStorage.setItem(this.storageKey, JSON.stringify(stockObj));
            console.log('💾 Stock de sabores guardado');
        } catch (error) {
            console.error('❌ Error guardando stock de sabores:', error);
        }
    }

    // Restaurar stock original de sabores
    restaurarStockSabores() {
        console.log('🔄 Restaurando stock original de sabores...');
        this.stockPorSabor.clear();
        localStorage.removeItem(this.storageKey);
        this.inicializarStockSabores();
        console.log('✅ Stock de sabores restaurado');
    }

    // Generar HTML para selector de sabores
    generarSelectorSabores(producto) {
        if (!producto.sabores || !Array.isArray(producto.sabores)) {
            return '';
        }

        const saboresConStock = this.getSaboresConStock(producto.id);
        
        if (saboresConStock.length === 0) {
            return '<p style="color: #ff6b6b; font-size: 0.9rem; margin: 10px 0;">❌ Todos los sabores agotados</p>';
        }

        let html = `
            <div class="selector-sabores" style="margin: 10px 0;">
                <label style="display: block; font-weight: bold; margin-bottom: 5px; color: #333;">
                    🍹 Elige tu sabor:
                </label>
                <select id="sabor-${producto.id}" class="sabor-selector" style="
                    width: 100%; 
                    padding: 8px; 
                    border: 2px solid #ddd; 
                    border-radius: 5px; 
                    font-size: 0.9rem;
                    background: white;
                ">
                    <option value="">-- Selecciona un sabor --</option>`;

        saboresConStock.forEach(item => {
            const stockInfo = item.stock <= 5 ? ` (${item.stock} disponibles)` : '';
            html += `<option value="${item.sabor}">${item.sabor}${stockInfo}</option>`;
        });

        html += `
                </select>
                <div class="info-sabores" style="margin-top: 5px; font-size: 0.8rem; color: #666;">
                    ${saboresConStock.length} de ${producto.sabores.length} sabores disponibles
                </div>
            </div>`;

        return html;
    }

    // Validar selección de sabor antes de agregar al carrito
    validarSeleccionSabor(productoId) {
        const producto = CONFIG.productos.find(p => p.id === productoId);
        if (!producto || !producto.sabores) return { valido: true };

        const selector = document.getElementById(`sabor-${productoId}`);
        if (!selector || !selector.value) {
            return {
                valido: false,
                mensaje: '🍹 Por favor selecciona un sabor'
            };
        }

        const saborSeleccionado = selector.value;
        if (!this.hayStockDisponible(productoId, saborSeleccionado)) {
            return {
                valido: false,
                mensaje: `❌ ${saborSeleccionado} no está disponible`
            };
        }

        return {
            valido: true,
            sabor: saborSeleccionado
        };
    }
}

// Crear instancia global
window.saboresManager = new SaboresManager();

// Funciones de utilidad globales
window.getStockSabor = function(productoId, sabor) {
    return window.saboresManager.getStockSabor(productoId, sabor);
};

window.procesarVentaSabor = function(productoId, sabor, cantidad) {
    return window.saboresManager.procesarVentaSabor(productoId, sabor, cantidad);
};

window.validarSeleccionSabor = function(productoId) {
    return window.saboresManager.validarSeleccionSabor(productoId);
};

window.restaurarStockSabores = function() {
    return window.saboresManager.restaurarStockSabores();
};

console.log('🍹 Gestor de Sabores inicializado correctamente');