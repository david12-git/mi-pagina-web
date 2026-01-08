// Generador automático de config.js actualizado
class ConfigGenerator {
    constructor() {
        this.configTemplate = null;
        this.cargarTemplate();
    }

    async cargarTemplate() {
        // Obtener el contenido actual de config.js
        this.configTemplate = CONFIG;
    }

    // Generar nuevo archivo config.js con stock actualizado
    generarConfigActualizado(cambiosStock) {
        // Crear copia del CONFIG actual
        const configActualizado = JSON.parse(JSON.stringify(CONFIG));
        
        // Aplicar cambios de stock
        cambiosStock.forEach(cambio => {
            const producto = configActualizado.productos.find(p => p.id === cambio.id);
            if (producto) {
                producto.stock = cambio.nuevoStock;
            }
        });

        // Generar el código JavaScript completo
        const codigoJS = this.generarCodigoCompleto(configActualizado);
        
        return codigoJS;
    }

    generarCodigoCompleto(config) {
        return `// Configuración de Las Delicias de la Abuela
const CONFIG = {
    // Información de la empresa
    empresa: ${JSON.stringify(config.empresa, null, 8)},

    // Configuración de EmailJS
    emailjs: ${JSON.stringify(config.emailjs, null, 8)},

    // Configuración del formulario
    formulario: ${JSON.stringify(config.formulario, null, 8)},

    // Redes sociales
    redes_sociales: ${JSON.stringify(config.redes_sociales, null, 8)},

    // Categorías
    categorias: ${JSON.stringify(config.categorias, null, 8)},

    // LISTA DE PRODUCTOS (Actualizada automáticamente desde admin)
    productos: [
${config.productos.map(producto => this.generarProductoJS(producto)).join(',\n')}
    ],

    // Estadísticas
    estadisticas: ${JSON.stringify(config.estadisticas, null, 8)}
};

// --- Funciones de utilidad ---
function getProductosPorCategoria(categoria) {
    let lista = CONFIG.productos.filter(p => p.activo !== false);
    if (categoria === 'todos') return lista;
    return lista.filter(p => p.categoria === categoria);
}

// Variable global para que script.js la encuentre fácilmente
const productosData = CONFIG.productos;

// Verificación de que los productos se cargaron correctamente
if (productosData && productosData.length > 0) {
    console.log(\`✅ \${productosData.length} productos cargados correctamente desde config.js\`);
} else {
    console.error('❌ Error: No se pudieron cargar los productos desde CONFIG');
}

// Hacer CONFIG disponible globalmente para debugging
window.CONFIG = CONFIG;`;
    }

    generarProductoJS(producto) {
        const saboresStr = producto.sabores ? 
            `\n            sabores: ${JSON.stringify(producto.sabores)},` : '';
        const stockPorSaborStr = producto.stockPorSabor ? 
            `\n            stockPorSabor: ${producto.stockPorSabor} // Indica que maneja stock individual por sabor` : '';

        return `        {
            id: ${producto.id},
            nombre: '${producto.nombre}',
            categoria: '${producto.categoria}',
            precio: ${producto.precio},
            precio_anterior: ${producto.precio_anterior},
            descripcion: '${producto.descripcion}',
            imagen: '${producto.imagen}',
            stock: ${producto.stock},
            destacado: ${producto.destacado},
            activo: ${producto.activo},
            caracteristicas: ${JSON.stringify(producto.caracteristicas)}${saboresStr}${stockPorSaborStr}
        }`;
    }

    // Descargar archivo config.js actualizado
    descargarConfigActualizado(cambiosStock) {
        const codigoActualizado = this.generarConfigActualizado(cambiosStock);
        
        // Crear blob con el contenido
        const blob = new Blob([codigoActualizado], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        
        // Crear enlace de descarga
        const a = document.createElement('a');
        a.href = url;
        a.download = 'config.js';
        a.style.display = 'none';
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
        
        return codigoActualizado;
    }

    // Mostrar código en modal para copiar
    mostrarCodigoEnModal(cambiosStock) {
        const codigoActualizado = this.generarConfigActualizado(cambiosStock);
        
        // Crear modal
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            backdrop-filter: blur(5px);
        `;
        
        modal.innerHTML = `
            <div style="
                background: white;
                padding: 30px;
                border-radius: 15px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                max-width: 90%;
                max-height: 90%;
                overflow: hidden;
                display: flex;
                flex-direction: column;
            ">
                <div style="margin-bottom: 20px; text-align: center;">
                    <h2 style="color: #2c3e50; margin: 0 0 10px 0;">
                        <i class="fas fa-file-code"></i> Config.js Actualizado
                    </h2>
                    <p style="color: #7f8c8d; margin: 0;">
                        Copia este código y reemplaza tu archivo config.js
                    </p>
                </div>
                
                <div style="flex: 1; overflow: hidden; display: flex; flex-direction: column;">
                    <textarea id="codigoActualizado" readonly style="
                        width: 100%;
                        height: 400px;
                        font-family: 'Courier New', monospace;
                        font-size: 12px;
                        border: 2px solid #ddd;
                        border-radius: 8px;
                        padding: 15px;
                        resize: none;
                        background: #f8f9fa;
                        flex: 1;
                    ">${codigoActualizado}</textarea>
                </div>
                
                <div style="margin-top: 20px; display: flex; gap: 15px; justify-content: center;">
                    <button onclick="copiarCodigo()" style="
                        background: linear-gradient(135deg, #27ae60 0%, #229954 100%);
                        color: white;
                        border: none;
                        padding: 12px 25px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 16px;
                        font-weight: 600;
                        transition: all 0.3s ease;
                    ">
                        <i class="fas fa-copy"></i> Copiar Código
                    </button>
                    <button onclick="descargarArchivo()" style="
                        background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
                        color: white;
                        border: none;
                        padding: 12px 25px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 16px;
                        font-weight: 600;
                        transition: all 0.3s ease;
                    ">
                        <i class="fas fa-download"></i> Descargar Archivo
                    </button>
                    <button onclick="cerrarModal()" style="
                        background: #95a5a6;
                        color: white;
                        border: none;
                        padding: 12px 25px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 16px;
                        font-weight: 600;
                        transition: all 0.3s ease;
                    ">
                        <i class="fas fa-times"></i> Cerrar
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Funciones del modal
        window.copiarCodigo = () => {
            const textarea = document.getElementById('codigoActualizado');
            textarea.select();
            document.execCommand('copy');
            alert('✅ Código copiado al portapapeles');
        };
        
        window.descargarArchivo = () => {
            this.descargarConfigActualizado(cambiosStock);
            alert('✅ Archivo config.js descargado');
        };
        
        window.cerrarModal = () => {
            document.body.removeChild(modal);
            delete window.copiarCodigo;
            delete window.descargarArchivo;
            delete window.cerrarModal;
        };
        
        // Cerrar con Escape
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                window.cerrarModal();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    }
}

// Instancia global
window.configGenerator = new ConfigGenerator();