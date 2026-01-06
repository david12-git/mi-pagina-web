// Configuración de Las Delicias de la Abuela
const CONFIG = {
    // Información de la empresa
    empresa: {
        nombre: 'Las Delicias de la Abuela',
        telefono: '+57 313 577 1729',
        email: 'juandavidd342@gmail.com',
        whatsapp: '+573135771729',
        ubicacion: 'Aguadas, Colombia',
        descripcion: 'El sabor tradicional de Aguadas en tu mesa. Postres, platos típicos y delicias caseras hechas con amor.'
    },

    // Configuración de EmailJS
    emailjs: {
        user_id: 'YOUR_USER_ID', 
        service_id: 'YOUR_SERVICE_ID', 
        template_id: 'YOUR_TEMPLATE_ID' 
    },

    // Configuración de Google Analytics
    analytics: {
        measurement_id: 'GA_MEASUREMENT_ID' 
    },

    // Redes sociales
    redes_sociales: {
        linkedin: '#',
        twitter: '#',
        github: '#',
        instagram: '#'
    },

   // Categorías actualizadas para que coincidan con tus productos
	categorias: [
		{
			id: 'bebidas calientes', // Coincide con Tinto, Milo, etc.
			nombre: 'Bebidas Calientes',
			icono: 'fas fa-coffee',
			descripcion: 'Café, chocolate y bebidas calientes'
		},
		{
			id: 'bebidas frias', // Coincide con Coca-Cola, Pony Malta, etc.
			nombre: 'Bebidas Frías',
			icono: 'fas fa-glass-whiskey',
			descripcion: 'Refrescos y aguas bien frías'
		},
		{
			id: 'comida', // Coincide con Empanadas, Pasteles, Papa rellena
			nombre: 'Comida Típica',
			icono: 'fas fa-utensils',
			descripcion: 'Pasteles, empanadas y antojos salados'
		},
		{
			id: 'postres', // Por si agregas los postres del primer mensaje
			nombre: 'Postres Caseros',
			icono: 'fas fa-ice-cream',
			descripcion: 'Dulces tentaciones caseras'
		}
	],

    // Productos
    productos: [
        {
            id: 1,
            nombre: 'Tinto Tradicional',
            categoria: 'bebidas calientes',
            precio: 1500,
            precio_anterior: 1800,
            descripcion: 'Café negro recién colado, aroma intenso y sabor balanceado.',
            imagen: 'tinto.jpg',
            stock: 100,
            destacado: false,
            activo: true,
            caracteristicas: ['Grano selecto', 'Siempre caliente', 'Preparación al instante']
        },
        {
            id: 2,
            nombre: 'Pintaito',
            categoria: 'bebidas calientes',
            precio: 1800,
            precio_anterior: 2000,
            descripcion: 'El equilibrio perfecto entre café y un toque de leche.',
            imagen: 'pintaito.jpg',
            stock: 100,
            destacado: false,
            activo: true,
            caracteristicas: ['Cremoso', 'Toque de espuma', 'Sabor suave']
        },
        {
            id: 3,
            nombre: 'Milo Caliente',
            categoria: 'bebidas calientes',
            precio: 3500,
            precio_anterior: 4000,
            descripcion: 'Bebida de chocolate y malta con toda la energía necesaria.',
            imagen: 'milo.jpg',
            stock: 50,
            destacado: true,
            activo: true,
            caracteristicas: ['Con leche entera', 'Energizante', 'Sabor único']
        },
        {
            id: 4,
            nombre: 'Aromática de Frutas',
            categoria: 'bebidas calientes',
            precio: 2000,
            precio_anterior: 2500,
            descripcion: 'Infusión natural de hierbabuena con trozos de frutas frescas.',
            imagen: 'aromatica.jpg',
            stock: 80,
            destacado: false,
            activo: true,
            caracteristicas: ['100% Natural', 'Sin cafeína', 'Relajante']
        },
        {
            id: 5,
            nombre: 'Chocolate Espumoso',
            categoria: 'bebidas calientes',
            precio: 3000,
            precio_anterior: 3500,
            descripcion: 'Chocolate tradicional batido con molinillo hasta obtener espuma.',
            imagen: 'chocolate.jpg',
            stock: 60,
            destacado: true,
            activo: true,
            caracteristicas: ['Receta tradicional', 'Bajo en azúcar', 'Acompañante ideal']
        },
        {
            id: 6,
            nombre: 'Cifrut',
            categoria: 'bebidas frias',
            precio: 2500,
            precio_anterior: 2800,
            descripcion: 'Bebida refrescante con sabor a frutas tropicales.',
            imagen: 'cifrut.jpg',
            stock: 40,
            destacado: false,
            activo: true,
            caracteristicas: ['Frío', 'Refrescante']
        },
        {
            id: 7,
            nombre: 'Pony Malta',
            categoria: 'bebidas frias',
            precio: 2800,
            precio_anterior: 3200,
            descripcion: 'Bebida de malta nutritiva y refrescante.',
            imagen: 'pony-malta.jpg',
            stock: 40,
            destacado: true,
            activo: true,
            caracteristicas: ['Bebida de campeones', 'Muy fría']
        },
        {
            id: 8,
            nombre: 'Coca-Cola',
            categoria: 'bebidas frias',
            precio: 3500,
            precio_anterior: 3800,
            descripcion: 'Gaseosa clásica refrescante en presentación personal.',
            imagen: 'cocacola.jpg',
            stock: 60,
            destacado: true,
            activo: true,
            caracteristicas: ['Sabor original', 'Burbujeante']
        },
        {
            id: 9,
            nombre: 'Gaseosa Inn',
            categoria: 'bebidas frias',
            precio: 2200,
            precio_anterior: 2500,
            descripcion: 'Variedad de sabores locales refrescantes.',
            imagen: 'gaseosa-inn.jpg',
            stock: 30,
            destacado: false,
            activo: true,
            caracteristicas: ['Económica', 'Sabor nacional']
        },
        {
            id: 10,
            nombre: 'Agua Mineral',
            categoria: 'bebidas frias',
            precio: 2000,
            precio_anterior: 2200,
            descripcion: 'Agua pura de manantial para hidratarte.',
            imagen: 'agua.jpg',
            stock: 100,
            destacado: false,
            activo: true,
            caracteristicas: ['Cero calorías', 'Frescura natural']
        },
        {
            id: 11,
            nombre: 'Pastel de Pollo',
            categoria: 'comida',
            precio: 4500,
            precio_anterior: 5000,
            descripcion: 'Hojaldre crocante relleno de pollo desmechado en salsa blanca.',
            imagen: 'pastel-pollo.jpg',
            stock: 25,
            destacado: true,
            activo: true,
            caracteristicas: ['Hojaldre fresco', 'Relleno generoso', 'Recién horneado']
        },
        {
            id: 12,
            nombre: 'Torta de Carne',
            categoria: 'comida',
            precio: 4800,
            precio_anterior: 5500,
            descripcion: 'Deliciosa base de masa con relleno de carne de res sazonada.',
            imagen: 'torta-carne.jpg',
            stock: 20,
            destacado: false,
            activo: true,
            caracteristicas: ['Sabor casero', 'Muy nutritiva']
        },
        {
            id: 13,
            nombre: 'Carne Desmechada con Arepa',
            categoria: 'comida',
            precio: 7500,
            precio_anterior: 8500,
            descripcion: 'Carne de res cocinada a fuego lento sobre arepa de maíz caliente.',
            imagen: 'carne-arepa.jpg',
            stock: 15,
            destacado: true,
            activo: true,
            caracteristicas: ['Maíz peto', 'Carne jugosa', 'Tamaño grande']
        },
        {
            id: 14,
            nombre: 'Aborrajados',
            categoria: 'comida',
            precio: 3500,
            precio_anterior: 4000,
            descripcion: 'Plátano maduro relleno de queso, frito con un rebozado crocante.',
            imagen: 'aborrajado.jpg',
            stock: 30,
            destacado: true,
            activo: true,
            caracteristicas: ['Queso derretido', 'Dulce y salado']
        },
        {
            id: 15,
            nombre: 'Empanadas',
            categoria: 'comida',
            precio: 1200,
            precio_anterior: 1500,
            descripcion: 'Deliciosas empanadas caseras con la receta secreta de la casa.',
            imagen: 'Empanadas.jpg',
            stock: 200,
            destacado: true,
            activo: true,
            caracteristicas: ['Ingredientes frescos', 'Sin conservantes', 'Hecho hoy']
        },
        {
            id: 16,
            nombre: 'Papa Rellena',
            categoria: 'comida',
            precio: 3800,
            precio_anterior: 4200,
            descripcion: 'Papa suave rellena de carne, arroz y especias, con una capa externa crujiente.',
            imagen: 'papa-rellena.jpg',
            stock: 40,
            destacado: true,
            activo: true,
            caracteristicas: ['Receta típica', 'Acompañado de ají']
        }
    ],

    // Configuración de la tienda
    tienda: {
        moneda: 'COP',
        simbolo_moneda: '$',
        envio_gratis_desde: 50000,
        costo_envio: 5000,
        impuestos: 0,
        metodos_pago: [
            {
                id: 'whatsapp',
                nombre: 'Pedido por WhatsApp',
                icono: 'fab fa-whatsapp',
                descripcion: 'Paga al recibir o por transferencia'
            },
            {
                id: 'transferencia',
                nombre: 'Transferencia Nequi/Daviplata',
                icono: 'fas fa-university',
                descripcion: 'Pago directo e inmediato'
            }
        ]
    },

    // Estadísticas
    estadisticas: {
        clientes: '+500',
        experiencia: 'Tradición',
        soporte: 'Atención Local',
        productos: 'Hecho a mano'
    },

    // Colores
    colores: {
        primario: '#e67e22',
        secundario: '#d35400',
        acento: '#f1c40f',
        whatsapp: '#25d366',
        exito: '#2ecc71',
        error: '#e74c3c',
        precio: '#e67e22',
        descuento: '#2ecc71'
    }
};

// --- Funciones de utilidad ---
function getConfig(key) {
    return key.split('.').reduce((obj, k) => obj && obj[k], CONFIG);
}

function getProductosPorCategoria(categoria) {
    let lista = CONFIG.productos.filter(p => p.activo !== false);
    if (categoria === 'todos') return lista;
    return lista.filter(p => p.categoria === categoria);
}

function getProductoPorId(id) {
    return CONFIG.productos.find(p => p.id === id);
}

function formatearPrecio(precio) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(precio);
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
