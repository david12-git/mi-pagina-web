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

    // Configuración de EmailJS (Actualizar con tus credenciales reales)
    emailjs: {
        user_id: 'YOUR_USER_ID', // Obtener en https://www.emailjs.com/
        service_id: 'YOUR_SERVICE_ID', // Configurar servicio de email
        template_id: 'YOUR_TEMPLATE_ID' // Crear template de email
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
            precio_anterior: 1200,
            descripcion: 'Café negro recién colado, aroma intenso y sabor balanceado.',
            imagen: 'https://via.placeholder.com/300x200/667eea/ffffff?text=Tinto+Tradicional',
            stock: 100,
            destacado: false,
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
            imagen: 'https://via.placeholder.com/300x200/764ba2/ffffff?text=Pintaito',
            stock: 100,
            destacado: false,
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
            imagen: 'https://via.placeholder.com/300x200/ff6b6b/ffffff?text=Milo+Caliente',
            stock: 50,
            destacado: true,
            activo: true,
            caracteristicas: ['Con leche entera', 'Energizante']
        },
        {
            id: 4,
            nombre: 'Aromática de Frutas',
            categoria: 'bebidas calientes',
            precio: 1100,
            precio_anterior: 1500,
            descripcion: 'Infusión natural de hierbabuena con frutas.',
            imagen: 'https://via.placeholder.com/300x200/51cf66/ffffff?text=Aromatica',
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
            imagen: 'https://via.placeholder.com/300x200/f39c12/ffffff?text=Chocolate',
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
            imagen: 'https://via.placeholder.com/300x200/25d366/ffffff?text=Cifrut',
            stock: 40,
            destacado: false,
            activo: true,
            caracteristicas: ['Frío', 'Refrescante'],
            sabores: ['Naranja', 'Manzana', 'Uva', 'Tropical', 'Limón']
        },
        {
            id: 7,
            nombre: 'Pony Malta',
            categoria: 'bebidas frias',
            precio: 1600,
            precio_anterior: 1800,
            descripcion: 'Bebida de malta nutritiva.',
            imagen: 'https://via.placeholder.com/300x200/128c7e/ffffff?text=Pony+Malta',
            stock: 40,
            destacado: true,
            activo: true,
            caracteristicas: ['Nutritiva', 'Muy fría']
        },
        {
            id: 8,
            nombre: 'Coca-Cola',
            categoria: 'bebidas frias',
            precio: 2400,
            precio_anterior: 2800,
            descripcion: 'Gaseosa clásica refrescante.',
            imagen: 'https://via.placeholder.com/300x200/dc3545/ffffff?text=Coca+Cola',
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
            precio_anterior: 2500,
            descripcion: 'Variedad de sabores locales.',
            imagen: 'https://via.placeholder.com/300x200/6f42c1/ffffff?text=Gaseosa+Inn',
            stock: 30,
            destacado: false,
            activo: true,
            caracteristicas: ['Económica'],
            sabores: ['Cola', 'Naranja', 'Limón', 'Manzana', 'Uva', 'Piña']
        },
        {
            id: 10,
            nombre: 'Agua Mineral',
            categoria: 'bebidas frias',
            precio: 1000,
            precio_anterior: 2200,
            descripcion: 'Agua pura de manantial.',
            imagen: 'https://via.placeholder.com/300x200/17a2b8/ffffff?text=Agua+Mineral',
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
            precio_anterior: 3000,
            descripcion: 'Hojaldre crocante relleno de pollo.',
            imagen: 'https://via.placeholder.com/300x200/fd7e14/ffffff?text=Pastel+Pollo',
            stock: 25,
            destacado: true,
            activo: true,
            caracteristicas: ['Hojaldre fresco', 'Recién horneado']
        },
        {
            id: 12,
            nombre: 'Torta de Carne',
            categoria: 'comida',
            precio: 3000,
            precio_anterior: 3500,
            descripcion: 'Masa artesanal con carne sazonada.',
            imagen: 'https://via.placeholder.com/300x200/e74c3c/ffffff?text=Torta+Carne',
            stock: 20,
            destacado: false,
            activo: true,
            caracteristicas: ['Sabor casero']
        },
        {
            id: 13,
            nombre: 'Carne Desmechada con Arepa',
            categoria: 'comida',
            precio: 4000,
            precio_anterior: 4500,
            descripcion: 'Carne jugosa sobre arepa de maíz.',
            imagen: 'https://via.placeholder.com/300x200/28a745/ffffff?text=Carne+Arepa',
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
            precio_anterior: 2500,
            descripcion: 'Plátano maduro relleno de queso.',
            imagen: 'https://via.placeholder.com/300x200/ffc107/ffffff?text=Aborrajados',
            stock: 30,
            destacado: true,
            activo: true,
            caracteristicas: ['Queso derretido']
        },
        {
            id: 15,
            nombre: 'Empanadas',
            categoria: 'comida',
            precio: 1200,
            precio_anterior: 1500,
            descripcion: 'Empanadas caseras receta de la casa.',
            imagen: 'https://via.placeholder.com/300x200/20c997/ffffff?text=Empanadas',
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
            imagen: 'https://via.placeholder.com/300x200/6610f2/ffffff?text=Papa+Rellena',
            stock: 40,
            destacado: true,
            activo: true,
            caracteristicas: ['Receta típica']
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

