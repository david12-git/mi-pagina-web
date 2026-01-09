// Configuración de Las Delicias de la Abuela
const CONFIG = {
    // Información de la empresa
    empresa: {
        nombre: 'Las Delicias de la Abuela',
        telefono: '+57 313 577 1729',
        email: 'juandavidd342@gmail.com',
        whatsapp: '+573135771729',
        ubicacion: 'Carrera 6 #14-10, Aguadas, Colombia',
        descripcion: 'El sabor tradicional de Aguadas en tu mesa. Postres, platos típicos y delicias caseras hechas con amor.'
    },

    // Configuración de EmailJS
    emailjs: {
        user_id: 'egt70YbUqNlQoPLzM',
        service_id: 'service_2a9faja',
        template_id: 'template_f29p6il'
    },

    // Configuración del formulario
    formulario: {
        campos_requeridos: ['nombre', 'email', 'mensaje'],
        longitud_minima_mensaje: 10,
        longitud_maxima_mensaje: 500,
        longitud_minima_nombre: 2,
        longitud_maxima_nombre: 50,
        envio_whatsapp_automatico: false,
        mostrar_confirmacion_whatsapp: true,
        // Email de destino para los pedidos
        email_destino: 'juandavidd342@gmail.com'
    },

    // Redes sociales
    redes_sociales: {
        linkedin: '#',
        twitter: '#',
        github: '#',
        instagram: '#'
    },

    // Categorías
    categorias: [
        { id: 'bebidas calientes', nombre: 'Bebidas Calientes', icono: 'fas fa-coffee' },
        { id: 'bebidas frias', nombre: 'Bebidas Frías', icono: 'fas fa-glass-whiskey' },
        { id: 'comida', nombre: 'Comida Típica', icono: 'fas fa-utensils' },
        { id: 'postres', nombre: 'Postres Caseros', icono: 'fas fa-ice-cream' }
    ],

    // LISTA DE PRODUCTOS (Corregida la estructura)
    productos: [
        {
            id: 1,
            nombre: 'Tinto Tradicional',
            categoria: 'bebidas calientes',
            precio: 1000,
            precio_anterior: 1300,
            descripcion: 'Café negro recién colado, aroma intenso y sabor balanceado.',
            imagen: 'imagen/Tinto.jpg',
            stock: 100,
            destacado: true,
            activo: true,
            caracteristicas: ['Grano selecto', 'Siempre caliente']
        },
        {
            id: 2,
            nombre: 'Pintaito',
            categoria: 'bebidas calientes',
            precio: 1500,
            precio_anterior: 1800,
            descripcion: 'El equilibrio perfecto entre café y un toque de leche.',
            imagen: 'imagen/Pintaito.jpg',
            stock: 100,
            destacado: true,
            activo: true,
            caracteristicas: ['Cremoso', 'Sabor suave']
        },
        {
            id: 3,
            nombre: 'Milo Caliente',
            categoria: 'bebidas calientes',
            precio: 1600,
            precio_anterior: 1800,
            descripcion: 'Bebida de chocolate y malta energizante.',
            imagen: 'imagen/Milo.jpg',
            stock: 0, // AGOTADO para ejemplo
            destacado: true,
            activo: true,
            caracteristicas: ['Con leche entera', 'Energizante']
        },
        {
            id: 4,
            nombre: 'Aromática de Frutas',
            categoria: 'bebidas calientes',
            precio: 1000,
            precio_anterior: 1000,
            descripcion: 'Infusión natural de hierbabuena con frutas.',
            imagen: 'imagen/Aromatica.jpg',
            stock: 80,
            destacado: false,
            activo: true,
            caracteristicas: ['100% Natural', 'Sin cafeína']
        },
        {
            id: 5,
            nombre: 'Chocolate Espumoso',
            categoria: 'bebidas calientes',
            precio: 1000,
            precio_anterior: 1200,
            descripcion: 'Chocolate tradicional batido con molinillo.',
            imagen: 'imagen/Chocolate.jpg',
            stock: 60,
            destacado: true,
            activo: true,
            caracteristicas: ['Receta tradicional', 'Espumoso']
        },
        {
            id: 6,
            nombre: 'Cifrut',
            categoria: 'bebidas frias',
            precio: 1100,
            precio_anterior: 1200,
            descripcion: 'Bebida refrescante de frutas tropicales.',
            imagen: 'imagen/Cifrut.jpg',
            stock: 50, // Stock total que se distribuye entre sabores
            destacado: true,
            activo: true,
            caracteristicas: ['Frío', 'Refrescante'],
            sabores: ['Naranja', 'Manzana', 'Uva', 'Tropical', 'Limón'],
            stockPorSabor: true // Indica que maneja stock individual por sabor
        },
        {
            id: 7,
            nombre: 'Pony Malta',
            categoria: 'bebidas frias',
            precio: 1600,
            precio_anterior: 1800,
            descripcion: 'Bebida de malta nutritiva.',
            imagen: 'imagen/Poni malta.jpg',
            stock: 8, // Actualizado desde admin
            destacado: true,
            activo: true,
            caracteristicas: ['Nutritiva', 'Muy fría']
        },
        {
            id: 8,
            nombre: 'Coca-Cola',
            categoria: 'bebidas frias',
            precio: 2400,
            precio_anterior: 2500,
            descripcion: 'Gaseosa clásica refrescante.',
            imagen: 'imagen/Cocacola.jpg',
            stock: 60,
            destacado: true,
            activo: true,
            caracteristicas: ['Sabor original', 'Fría']
        },
        {
            id: 9,
            nombre: 'Gaseosa Inn',
            categoria: 'bebidas frias',
            precio: 2000,
            precio_anterior: 2200,
            descripcion: 'Variedad de sabores locales.',
            imagen: 'imagen/Gaseosas.jpg',
            stock: 60, // Stock total que se distribuye entre sabores
            destacado: true,
            activo: true,
            caracteristicas: ['Económica'],
            sabores: ['Cola', 'Naranja', 'Limón', 'Manzana', 'Uva', 'Piña'],
            stockPorSabor: true // Indica que maneja stock individual por sabor
        },
        {
            id: 10,
            nombre: 'Agua Mineral',
            categoria: 'bebidas frias',
            precio: 1000,
            precio_anterior: 2000,
            descripcion: 'Agua pura de manantial.',
            imagen: 'imagen/Agua.jpg',
            stock: 100,
            destacado: false,
            activo: true,
            caracteristicas: ['Frescura natural']
        },
        {
            id: 11,
            nombre: 'Pastel de Pollo',
            categoria: 'comida',
            precio: 2800,
            precio_anterior: 4500,
            descripcion: 'Hojaldre crocante relleno de pollo.',
            imagen: 'imagen/Pastel-pollo.jpg',
            stock: 10, //AGOTADO para ejemplo
            destacado: true,
            activo: true,
            caracteristicas: ['Hojaldre fresco', 'Recién horneado']
        },
        {
            id: 12,
            nombre: 'Torta de Carne',
            categoria: 'comida',
            precio: 3000,
            precio_anterior: 4800,
            descripcion: 'Masa artesanal con carne sazonada.',
            imagen: 'imagen/Torta de carne.jpg',
            stock: 20,
            destacado: true,
            activo: true,
            caracteristicas: ['Sabor casero']
        },
        {
            id: 13,
            nombre: 'Carne Desmechada con Arepa',
            categoria: 'comida',
            precio: 4000,
            precio_anterior: 7500,
            descripcion: 'Carne jugosa sobre arepa de maíz.',
            imagen: 'imagen/Carne desmechada.jpg',
            stock: 15,
            destacado: true,
            activo: true,
            caracteristicas: ['Maíz peto', 'Carne jugosa']
        },
        {
            id: 14,
            nombre: 'Aborrajados',
            categoria: 'comida',
            precio: 2000,
            precio_anterior: 4000,
            descripcion: 'Plátano maduro relleno de queso.',
            imagen: 'imagen/Aborrajado.jpg',
            stock: 30,
            destacado: true,
            activo: true,
            caracteristicas: ['Queso derretido y bocadillo']
        },
        {
            id: 15,
            nombre: 'Empanadas',
            categoria: 'comida',
            precio: 1200,
            precio_anterior: 1500,
            descripcion: 'Empanadas caseras receta de la casa.',
            imagen: 'imagen/Empanadas.jpg',
            stock: 200,
            destacado: true,
            activo: true,
            caracteristicas: ['Hecho hoy']
        },
        {
            id: 16,
            nombre: 'Papa Rellena',
            categoria: 'comida',
            precio: 3800,
            precio_anterior: 4200,
            descripcion: 'Papa rellena de carne y arroz.',
            imagen: 'imagen/Papa-rellena.jpg',
            stock: 40,
            destacado: true,
            activo: true,
            caracteristicas: ['Receta típica']
        },
        {
            id: 17,
            nombre: 'Jugos Naturales',
            categoria: 'bebidas frias',
            precio: 2500,
            precio_anterior: 3000,
            descripcion: 'Jugos frescos de frutas naturales.',
            imagen: 'imagen/Jugos.jpg',
            stock: 48, // Stock total que se distribuye entre sabores
            destacado: true,
            activo: true,
            caracteristicas: ['100% Natural', 'Sin conservantes'],
            sabores: ['Mango', 'Maracuyá', 'Lulo', 'Mora', 'Guayaba', 'Tomate de árbol'],
            stockPorSabor: true // Indica que maneja stock individual por sabor
        },
        {
            id: 18,
            nombre: 'Producto de Prueba',
            categoria: 'postres',
            precio: 2500,
            precio_anterior: 4000,
            descripcion: 'Este es un producto de prueba para verificar que config.js funciona correctamente.',
            imagen: '',
            stock: 100,
            destacado: false,
            activo: true,
            caracteristicas: ['Recién agregado', 'Funciona perfectamente']
        }
    ],

    // Estadísticas
    estadisticas: {
        clientes: '+250',
        experiencia: 'Tradición',
        soporte: 'Atención Local',
        productos: 'Hecho a mano'
    }
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
    console.log(`✅ ${productosData.length} productos cargados correctamente desde config.js`);
} else {
    console.error('❌ Error: No se pudieron cargar los productos desde CONFIG');
}

// Hacer CONFIG disponible globalmente para debugging
window.CONFIG = CONFIG;
