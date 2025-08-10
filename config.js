// Configuración de TechSoluciones Store
const CONFIG = {
	// Información de la empresa
	empresa: {
		nombre: 'StreamingStore Colombia',
		telefono: '+57 313 577 1729',
		email: 'info@streamingstore.com',
		whatsapp: '+573135771729',
		ubicacion: 'Aguadas, Colombia',
		descripcion: 'Tu tienda de confianza para plataformas de streaming. Netflix, Disney+, Spotify y más al mejor precio.'
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
			id: 'streaming-video',
			nombre: 'Streaming Video',
			icono: 'fas fa-tv',
			descripcion: 'Netflix, Disney+, HBO Max y más'
		},
		{
			id: 'streaming-musica',
			nombre: 'Streaming Música',
			icono: 'fas fa-music',
			descripcion: 'Spotify, Apple Music, YouTube Music'
		},
		{
			id: 'gaming',
			nombre: 'Gaming',
			icono: 'fas fa-gamepad',
			descripcion: 'Xbox Game Pass, PlayStation Plus'
		},
		{
			id: 'productividad',
			nombre: 'Productividad',
			icono: 'fas fa-briefcase',
			descripcion: 'Office 365, Adobe Creative Cloud'
		}
	],

	// Productos de la tienda
	productos: [
		{
			id: 1,
			nombre: 'Netflix Premium 4K',
			categoria: 'streaming-video',
			precio: 13000,
			precio_anterior: 18000,
			descripcion: 'Netflix Premium con 4 pantallas, Ultra HD y descargas ilimitadas',
			imagen: 'https://via.placeholder.com/300x300/E50914/FFFFFF?text=Netflix+Premium',
			stock: 13,
			destacado: true,
			caracteristicas: ['4 pantallas simultáneas', 'Ultra HD 4K', 'Descargas ilimitadas', 'Sin anuncios']
		},
		{
			id: 2,
			nombre: 'Disney+ Premium',
			categoria: 'streaming-video',
			precio: 35000,
			precio_anterior: 42000,
			descripcion: 'Disney+ con contenido de Disney, Marvel, Star Wars y National Geographic',
			imagen: 'https://via.placeholder.com/300x300/0063E1/FFFFFF?text=Disney+',
			stock: 80,
			destacado: true,
			caracteristicas: ['4K Ultra HD', '4 pantallas', 'Perfiles infantiles', 'Descargas']
		},
		{
			id: 3,
			nombre: 'HBO Max Premium',
			categoria: 'streaming-video',
			precio: 40000,
			precio_anterior: 48000,
			descripcion: 'HBO Max con series premium, películas y contenido exclusivo',
			imagen: 'https://via.placeholder.com/300x300/5F2EEA/FFFFFF?text=HBO+Max',
			stock: 60,
			destacado: false,
			caracteristicas: ['4K Ultra HD', '3 pantallas', 'Descargas', 'Sin anuncios']
		},
		{
			id: 4,
			nombre: 'Spotify Premium',
			categoria: 'streaming-musica',
			precio: 2000,
			precio_anterior: 30000,
			descripcion: 'Spotify Premium con música sin anuncios y descargas offline',
			imagen: 'https://via.placeholder.com/300x300/1DB954/FFFFFF?text=Spotify+Premium',
			stock: 150,
			destacado: true,
			caracteristicas: ['Sin anuncios', 'Descargas offline', 'Calidad alta', 'Múltiples dispositivos']
		},
		{
			id: 5,
			nombre: 'Apple Music',
			categoria: 'streaming-musica',
			precio: 28000,
			precio_anterior: 35000,
			descripcion: 'Apple Music con 90 millones de canciones y radio en vivo',
			imagen: 'https://via.placeholder.com/300x300/FA243C/FFFFFF?text=Apple+Music',
			stock: 90,
			destacado: false,
			caracteristicas: ['90M+ canciones', 'Radio en vivo', 'Spatial Audio', 'Letras sincronizadas']
		},
		{
			id: 6,
			nombre: 'YouTube Premium',
			categoria: 'streaming-musica',
			precio: 32000,
			precio_anterior: 38000,
			descripcion: 'YouTube Premium sin anuncios, YouTube Music y descargas',
			imagen: 'https://via.placeholder.com/300x300/FF0000/FFFFFF?text=YouTube+Premium',
			stock: 70,
			destacado: true,
			caracteristicas: ['Sin anuncios', 'YouTube Music', 'Descargas', 'Reproducción en segundo plano']
		},
		{
			id: 7,
			nombre: 'Xbox Game Pass Ultimate',
			categoria: 'gaming',
			precio: 55000,
			precio_anterior: 65000,
			descripcion: 'Xbox Game Pass Ultimate con cientos de juegos y Xbox Live Gold',
			imagen: 'https://via.placeholder.com/300x300/107C10/FFFFFF?text=Xbox+Game+Pass',
			stock: 50,
			destacado: true,
			caracteristicas: ['400+ juegos', 'Xbox Live Gold', 'EA Play', 'Cloud Gaming']
		},
		{
			id: 8,
			nombre: 'PlayStation Plus Premium',
			categoria: 'gaming',
			precio: 60000,
			precio_anterior: 70000,
			descripcion: 'PlayStation Plus Premium con juegos mensuales y catálogo clásico',
			imagen: 'https://via.placeholder.com/300x300/003791/FFFFFF?text=PlayStation+Plus',
			stock: 45,
			destacado: false,
			caracteristicas: ['Juegos mensuales', 'Catálogo clásico', 'Cloud Gaming', 'Descuentos exclusivos']
		},
		{
			id: 9,
			nombre: 'Office 365 Personal',
			categoria: 'productividad',
			precio: 38000,
			precio_anterior: 45000,
			descripcion: 'Office 365 Personal con Word, Excel, PowerPoint y 1TB OneDrive',
			imagen: 'https://via.placeholder.com/300x300/D83B01/FFFFFF?text=Office+365',
			stock: 75,
			destacado: true,
			caracteristicas: ['Word, Excel, PowerPoint', '1TB OneDrive', 'Outlook', 'Actualizaciones']
		},
		{
			id: 10,
			nombre: 'Adobe Creative Cloud',
			categoria: 'productividad',
			precio: 85000,
			precio_anterior: 95000,
			descripcion: 'Adobe Creative Cloud con Photoshop, Illustrator, Premiere Pro y más',
			imagen: 'https://via.placeholder.com/300x300/FF0000/FFFFFF?text=Adobe+CC',
			stock: 30,
			destacado: false,
			caracteristicas: ['Photoshop, Illustrator', 'Premiere Pro', '20+ apps', '100GB almacenamiento']
		},
		{
			id: 11,
			nombre: 'Amazon Prime Video',
			categoria: 'streaming-video',
			precio: 30000,
			precio_anterior: 36000,
			descripcion: 'Amazon Prime Video con series exclusivas y películas premium',
			imagen: 'https://via.placeholder.com/300x300/00A8E1/FFFFFF?text=Prime+Video',
			stock: 85,
			destacado: false,
			caracteristicas: ['4K Ultra HD', 'Descargas', 'Contenido exclusivo', 'Sin anuncios']
		},
		{
			id: 12,
			nombre: 'Tidal HiFi',
			categoria: 'streaming-musica',
			precio: 42000,
			precio_anterior: 50000,
			descripcion: 'Tidal HiFi con calidad de audio lossless y contenido exclusivo',
			imagen: 'https://via.placeholder.com/300x300/000000/FFFFFF?text=Tidal+HiFi',
			stock: 40,
			destacado: false,
			caracteristicas: ['Audio lossless', 'MQA', 'Contenido exclusivo', 'Videos musicales']
		},
		{
			id: 13,
			nombre: 'Paramount+ Premium',
			categoria: 'streaming-video',
			precio: 28000,
			precio_anterior: 35000,
			descripcion: 'Paramount+ con series exclusivas, películas y contenido de CBS',
			imagen: 'https://via.placeholder.com/300x300/0066CC/FFFFFF?text=Paramount+',
			stock: 65,
			destacado: false,
			caracteristicas: ['4K Ultra HD', 'Sin anuncios', 'Descargas', 'Contenido exclusivo']
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
