// Configuración de Las Delicias de la Abuela
const CONFIG = {
    // 1. INFORMACIÓN DE LA EMPRESA
    empresa: {
        nombre: 'Las Delicias de la Abuela',
        telefono: '+57 313 577 1729',
        email: 'juandavidd342@gmail.com',
        // El número de WhatsApp debe ir sin el símbolo '+' para que funcione el enlace
        whatsapp: '573135771729', 
        ubicacion: 'Carrera 6 #14-10, Aguadas, Colombia',
        descripcion: 'El sabor tradicional de Aguadas en tu mesa. Postres, platos típicos y delicias caseras hechas con amor.'
    },

    // 2. CONFIGURACIÓN DE EMAILJS (Para el formulario de contacto)
    emailjs: {
        user_id: 'YOUR_USER_ID',       // Reemplaza con tu User ID real
        service_id: 'YOUR_SERVICE_ID', // Reemplaza con tu Service ID real
        template_id: 'YOUR_TEMPLATE_ID' // Reemplaza con tu Template ID real
    },

    // 3. REDES SOCIALES (Enlaces del pie de página)
    redes_sociales: {
        linkedin: '#',
        twitter: '#',
        github: '#',
        instagram: '#'
    },

    // 4. DEFINICIÓN DE CATEGORÍAS (Para referencia visual)
    categorias: [
        { id: 'bebidas', nombre: 'Bebidas', icono: 'fas fa-glass-whiskey' },
        { id: 'panaderia', nombre: 'Panadería', icono: 'fas fa-bread-slice' },
        { id: 'platos-fuertes', nombre: 'Platos Fuertes', icono: 'fas fa-utensils' },
        { id: 'postres', nombre: 'Postres', icono: 'fas fa-ice-cream' }
    ],

    // 5. ESTADÍSTICAS (Números que aparecen en la página)
    estadisticas: {
        clientes: '+150',
        experiencia: 'Tradición',
        soporte: 'Atención Local',
        productos: 'Hecho a mano'
    },

    // 6. LISTA DE PRODUCTOS 
    // Nota: Las categorías aquí deben coincidir con los IDs de arriba: 'bebidas', 'panaderia', 'platos-fuertes', 'postres'
    productos: [
        // --- BEBIDAS ---
        {
            id: 1,
            nombre: 'Tinto Tradicional',
            categoria: 'bebidas',
            precio: 3000,
            precio_anterior: 1200,
            descripcion: 'Café negro recién colado, aroma intenso y sabor balanceado.',
            imagen: 'tinto.jpg',
            stock: 100,
            destacado: false,
            activo: true,
            caracteristicas: ['Grano selecto', 'Siempre caliente']
        },
        {
            id: 2,
            nombre: 'Pintaito',
            categoria: 'bebidas',
            precio: 1500,
            precio_anterior: 1800,
            descripcion: 'El equilibrio perfecto entre café y un toque de leche.',
            imagen: 'pintaito.jpg',
            stock: 100,
            destacado: false,
            activo: true,
            caracteristicas: ['Cremoso', 'Sabor suave']
        },
        {
            id: 3,
            nombre: 'Milo Caliente',
            categoria: 'bebidas',
            precio: 1600,
            precio_anterior: 1800,
            descripcion: 'Bebida de chocolate y malta energizante.',
            imagen: 'milo.jpg',
            stock: 50,
            destacado: true,
            activo: true,
            caracteristicas: ['Con leche entera', 'Energizante']
        },
        {
            id: 4,
            nombre: 'Aromática de Frutas',
            categoria: 'bebidas',
            precio: 1000,
            precio_anterior: 2000,
            descripcion: 'Infusión natural de hierbabuena con frutas.',
            imagen: 'aromatica.jpg',
            stock: 80,
            destacado: false,
            activo: true,
            caracteristicas: ['100% Natural', 'Sin cafeína']
        },
        {
            id: 5,
            nombre: 'Chocolate Espumoso',
            categoria: 'bebidas',
            precio: 1000,
            precio_anterior: 3000,
            descripcion: 'Chocolate tradicional batido con molinillo.',
            imagen: 'chocolate.jpg',
            stock: 60,
            destacado: true,
            activo: true,
            caracteristicas: ['Receta tradicional', 'Espumoso']
        },
        {
            id: 6,
            nombre: 'Cifrut',
            categoria: 'bebidas',
            precio: 1100,
            precio_anterior: 1300,
            descripcion: 'Bebida refrescante de frutas tropicales.',
            imagen: 'cifrut.jpg',
            stock: 40,
            destacado: false,
            activo: true,
            caracteristicas: ['Frío', 'Refrescante']
        },
        {
            id: 7,
            nombre: 'Pony Malta',
            categoria: 'bebidas',
            precio: 1600,
            precio_anterior: 3000,
            descripcion: 'Bebida de malta nutritiva 200cm.',
            imagen: 'pony-malta.jpg',
            stock: 40,
            destacado: true,
            activo: true,
            caracteristicas: ['Energía', 'Fría']
        },
        {
            id: 8,
            nombre: 'Coca-Cola',
            categoria: 'bebidas',
            precio: 3000,
            precio_anterior: 3500,
            descripcion: 'Gaseosa clásica refrescante.',
            imagen: 'cocacola.jpg',
            stock: 60,
            destacado: true,
            activo: true,
            caracteristicas: ['Sabor original', 'Con hielo']
        },
        {
            id: 9,
            nombre: 'Gaseosa Inn',
            categoria: 'bebidas',
            precio: 2000,
            precio_anterior: 2200,
            descripcion: 'Variedad de sabores 400 ml.',
            imagen: 'gaseosa-inn.jpg',
            stock: 30,
            destacado: false,
            activo: true,
            caracteristicas: ['Económica']
        },
        {
            id: 10,
            nombre: 'Agua Mineral',
            categoria: 'bebidas',
            precio: 1000,
            precio_anterior: 1800,
            descripcion: 'Agua pura de manantial.',
            imagen: 'agua.jpg',
            stock: 100,
            destacado: false,
            activo: true,
            caracteristicas: ['Hidratante', 'Fría']
        },

        // --- PANADERÍA ---
        {
            id: 11,
            nombre: 'Pastel de Pollo',
            categoria: 'panaderia',
            precio: 2500,
            precio_anterior: 4000,
            descripcion: 'Hojaldre crocante relleno de pollo desmechado.',
            imagen: 'pastel-pollo.jpg',
            stock: 25,
            destacado: true,
            activo: true,
            caracteristicas: ['Hojaldre fresco', 'Recién horneado']
        },
        {
            id: 12,
            nombre: 'Torta de Carne',
            categoria: 'panaderia',
            precio: 3000,
            precio_anterior: 4500,
            descripcion: 'Masa artesanal con carne sazonada.',
            imagen: 'torta-carne.jpg',
            stock: 20,
            destacado: false,
            activo: true,
            caracteristicas: ['Sabor casero', 'Sustanciosa']
        },
        {
            id: 14,
            nombre: 'Aborrajados',
            categoria: 'panaderia', // También podría ir en 'postres' si prefieres
            precio: 2000,
            precio_anterior: 3000,
            descripcion: 'Plátano maduro relleno de queso.',
            imagen: 'aborrajado.jpg',
            stock: 30,
            destacado: true,
            activo: true,
            caracteristicas: ['Queso derretido', 'Dulce y Salado']
        },
        {
            id: 15,
            nombre: 'Empanadas',
            categoria: 'panaderia',
            precio: 1200,
            precio_anterior: 1500,
            descripcion: 'Empanadas crocantes con ají casero.',
            imagen: 'Empanadas.jpg',
            stock: 200,
            destacado: true,
            activo: true,
            caracteristicas: ['Hecho hoy', 'Crocantes']
        },
        {
            id: 16,
            nombre: 'Papa Rellena',
            categoria: 'panaderia',
            precio: 3500,
            precio_anterior: 4000,
            descripcion: 'Papa rellena de carne y arroz.',
            imagen: 'papa-rellena.jpg',
            stock: 40,
            destacado: true,
            activo: true,
            caracteristicas: ['Receta típica', 'Grande']
        },

        // --- PLATOS FUERTES ---
        {
            id: 13,
            nombre: 'Carne Desmechada con Arepa',
            categoria: 'platos-fuertes',
            precio: 4000,
            precio_anterior: 7500,
            descripcion: 'Carne jugosa sobre arepa de maíz.',
            imagen: 'carne-arepa.jpg',
            stock: 15,
            destacado: true,
            activo: true,
            caracteristicas: ['Maíz peto', 'Carne jugosa']
        }
        
        // Si añades postres en el futuro, usa categoria: 'postres'
    ]
};

// EXPORTACIÓN FINAL (Muy importante para que script.js funcione)
const productosData = CONFIG.productos;
