// Configuración de TechSoluciones Store
const CONFIG = {
	// Información de la empresa
	empresa: {
		nombre: 'TechSoluciones Store',
		telefono: '+57 313 577 1729',
		email: 'info@techsoluciones.com',
		whatsapp: '+573135771729',
		ubicacion: 'Aguadas, Colombia',
		descripcion: 'Tu tienda tecnológica de confianza con los mejores productos y precios.'
	},

	// Configuración de EmailJS
	emailjs: {
		user_id: 'YOUR_USER_ID', // Reemplazar con tu User ID
		service_id: 'YOUR_SERVICE_ID', // Reemplazar con tu Service ID
		template_id: 'YOUR_TEMPLATE_ID' // Reemplazar con tu Template ID
	},

	// Configuración de Google Analytics
	analytics: {
		measurement_id: 'GA_MEASUREMENT_ID' // Reemplazar con tu Measurement ID
	},

	// Redes sociales
	redes_sociales: {
		linkedin: 'https://linkedin.com/company/techsoluciones',
		twitter: 'https://twitter.com/techsoluciones',
		github: 'https://github.com/techsoluciones',
		instagram: 'https://instagram.com/techsoluciones'
	},

	// Categorías de productos
	categorias: [
		{
			id: 'smartphones',
			nombre: 'Smartphones',
			icono: 'fas fa-mobile-alt',
			descripcion: 'Los mejores celulares del mercado'
		},
		{
			id: 'accesorios',
			nombre: 'Accesorios',
			icono: 'fas fa-headphones',
			descripcion: 'Fundas, auriculares y más'
		},
		{
			id: 'computadoras',
			nombre: 'Computadoras',
			icono: 'fas fa-laptop',
			descripcion: 'Laptops y componentes'
		},
		{
			id: 'gaming',
			nombre: 'Gaming',
			icono: 'fas fa-gamepad',
			descripcion: 'Todo para gamers'
		}
	],

	// Productos de la tienda
	productos: [
		{
			id: 1,
			nombre: 'iPhone 15 Pro',
			categoria: 'smartphones',
			precio: 4500000,
			precio_anterior: 5000000,
			descripcion: 'El iPhone más avanzado con cámara profesional y chip A17 Pro',
			imagen: 'https://via.placeholder.com/300x300/007AFF/FFFFFF?text=iPhone+15+Pro',
			stock: 10,
			destacado: true,
			caracteristicas: ['256GB', 'Cámara 48MP', 'Chip A17 Pro', 'iOS 17']
		},
		{
			id: 2,
			nombre: 'Samsung Galaxy S24',
			categoria: 'smartphones',
			precio: 3200000,
			precio_anterior: 3800000,
			descripcion: 'Smartphone Android de última generación con IA integrada',
			imagen: 'https://via.placeholder.com/300x300/1428A0/FFFFFF?text=Galaxy+S24',
			stock: 15,
			destacado: true,
			caracteristicas: ['128GB', 'Cámara 50MP', 'Snapdragon 8 Gen 3', 'Android 14']
		},
		{
			id: 3,
			nombre: 'AirPods Pro 2',
			categoria: 'accesorios',
			precio: 1200000,
			precio_anterior: 1500000,
			descripcion: 'Auriculares inalámbricos con cancelación de ruido activa',
			imagen: 'https://via.placeholder.com/300x300/000000/FFFFFF?text=AirPods+Pro',
			stock: 25,
			destacado: false,
			caracteristicas: ['Cancelación de ruido', 'Audio espacial', 'Carga inalámbrica', '30h batería']
		},
		{
			id: 4,
			nombre: 'MacBook Air M2',
			categoria: 'computadoras',
			precio: 5800000,
			precio_anterior: 6500000,
			descripcion: 'Laptop ultraportátil con chip M2 y hasta 18 horas de batería',
			imagen: 'https://via.placeholder.com/300x300/000000/FFFFFF?text=MacBook+Air',
			stock: 8,
			destacado: true,
			caracteristicas: ['13.6" Retina', 'Chip M2', '8GB RAM', '256GB SSD']
		},
		{
			id: 5,
			nombre: 'PlayStation 5',
			categoria: 'gaming',
			precio: 2800000,
			precio_anterior: 3200000,
			descripcion: 'La consola de nueva generación con gráficos 4K y ray tracing',
			imagen: 'https://via.placeholder.com/300x300/003791/FFFFFF?text=PS5',
			stock: 12,
			destacado: true,
			caracteristicas: ['4K Gaming', 'Ray Tracing', 'SSD 825GB', 'DualSense']
		},
		{
			id: 6,
			nombre: 'Nintendo Switch OLED',
			categoria: 'gaming',
			precio: 1800000,
			precio_anterior: 2000000,
			descripcion: 'Consola híbrida con pantalla OLED de 7 pulgadas',
			imagen: 'https://via.placeholder.com/300x300/E60012/FFFFFF?text=Nintendo+Switch',
			stock: 20,
			destacado: false,
			caracteristicas: ['Pantalla OLED 7"', '64GB', 'Modo portátil', 'Joy-Con incluidos']
		},
		{
			id: 7,
			nombre: 'iPad Air 5',
			categoria: 'computadoras',
			precio: 2800000,
			precio_anterior: 3200000,
			descripcion: 'Tablet versátil con chip M1 y compatibilidad con Apple Pencil',
			imagen: 'https://via.placeholder.com/300x300/007AFF/FFFFFF?text=iPad+Air',
			stock: 18,
			destacado: false,
			caracteristicas: ['10.9" Liquid Retina', 'Chip M1', '64GB', 'iPadOS 15']
		},
		{
			id: 8,
			nombre: 'Fundas iPhone 15',
			categoria: 'accesorios',
			precio: 150000,
			precio_anterior: 200000,
			descripcion: 'Fundas protectoras de alta calidad para iPhone 15',
			imagen: 'https://via.placeholder.com/300x300/FF6B6B/FFFFFF?text=Fundas+iPhone',
			stock: 50,
			destacado: false,
			caracteristicas: ['Silicón premium', 'Protección total', 'Múltiples colores', 'MagSafe compatible']
		}
	],

	// Configuración de la tienda
	tienda: {
		moneda: 'COP',
		simbolo_moneda: '$',
		envio_gratis_desde: 100000,
		costo_envio: 15000,
		impuestos: 0.19, // 19% IVA
		metodos_pago: [
			{
				id: 'mercadopago',
				nombre: 'MercadoPago',
				icono: 'fas fa-credit-card',
				descripcion: 'Pago seguro con tarjeta o efectivo'
			},
			{
				id: 'paypal',
				nombre: 'PayPal',
				icono: 'fab fa-paypal',
				descripcion: 'Pago internacional seguro'
			},
			{
				id: 'transferencia',
				nombre: 'Transferencia Bancaria',
				icono: 'fas fa-university',
				descripcion: 'Transferencia directa a cuenta bancaria'
			},
			{
				id: 'whatsapp',
				nombre: 'WhatsApp Business',
				icono: 'fab fa-whatsapp',
				descripcion: 'Compra directa por WhatsApp'
			}
		]
	},

	// Estadísticas de la empresa
	estadisticas: {
		clientes: '+1000',
		experiencia: '5 Años',
		soporte: '24/7',
		productos: '+500'
	},

	// Colores del tema
	colores: {
		primario: '#667eea',
		secundario: '#764ba2',
		acento: '#ffd700',
		whatsapp: '#25d366',
		exito: '#51cf66',
		error: '#ff6b6b',
		precio: '#ff6b6b',
		descuento: '#51cf66'
	}
};

// Función para obtener configuración
function getConfig(key) {
	return key.split('.').reduce((obj, k) => obj && obj[k], CONFIG);
}

// Función para actualizar configuración dinámicamente
function updateConfig(key, value) {
	const keys = key.split('.');
	const lastKey = keys.pop();
	const obj = keys.reduce((o, k) => o[k] = o[k] || {}, CONFIG);
	obj[lastKey] = value;
}

// Función para obtener productos por categoría
function getProductosPorCategoria(categoria) {
	if (categoria === 'todos') {
		return CONFIG.productos;
	}
	return CONFIG.productos.filter(producto => producto.categoria === categoria);
}

// Función para obtener producto por ID
function getProductoPorId(id) {
	return CONFIG.productos.find(producto => producto.id === id);
}

// Función para formatear precio
function formatearPrecio(precio) {
	return new Intl.NumberFormat('es-CO', {
		style: 'currency',
		currency: 'COP',
		minimumFractionDigits: 0
	}).format(precio);
}

// Exportar configuración
if (typeof module !== 'undefined' && module.exports) {
	module.exports = CONFIG;
}
