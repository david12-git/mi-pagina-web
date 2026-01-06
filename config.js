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
			precio: 100,
			precio_anterior: 180,
			descripcion: 'Netflix Premium con 2 pantalla, Ultra HD y descargas ilimitadas',
			imagen: 'https://cdn-icons-png.flaticon.com/512/5977/5977590.png',
			stock: 10,
			destacado: true,
			activo: true,
			caracteristicas: ['1 pantalla', 'Ultra HD 4K', 'Descargas ilimitadas', 'Sin anuncios']
		},
		{
			id: 2,
			nombre: 'Disney+ Premium',
			categoria: 'streaming-video',
			precio: 350,
			precio_anterior: 400,
			descripcion: 'Disney+ con contenido de Disney, Marvel, Star Wars y National Geographic',
			imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Disney%2B_logo.svg/1200px-Disney%2B_logo.svg.png',
			stock: 80,
			destacado: true,
			activo: true,
			caracteristicas: ['4K Ultra HD', '4 pantallas', 'Perfiles infantiles', 'Descargas']
		},
		{
			id: 3,
			nombre: 'HBO Max Premium',
			categoria: 'streaming-video',
			precio: 40000,
			precio_anterior: 48000,
			descripcion: 'HBO Max con series premium, películas y contenido exclusivo',
			imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/HBO_Max_Logo.svg/1200px-HBO_Max_Logo.svg.png',
			stock: 60,
			destacado: false,
			activo: false,
			caracteristicas: ['4K Ultra HD', '3 pantallas', 'Descargas', 'Sin anuncios']
		},
		{
			id: 4,
			nombre: 'Spotify Premium',
			categoria: 'streaming-musica',
			precio: 2000,
			precio_anterior: 30000,
			descripcion: 'Spotify Premium con música sin anuncios y descargas offline',
			imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Spotify_icon.svg/1200px-Spotify_icon.svg.png',
			stock: 150,
			destacado: true,
			activo: false,
			caracteristicas: ['Sin anuncios', 'Descargas offline', 'Calidad alta', 'Múltiples dispositivos']
		},
		{
			id: 5,
			nombre: 'Apple Music',
			categoria: 'streaming-musica',
			precio: 28000,
			precio_anterior: 35000,
			descripcion: 'Apple Music con 90 millones de canciones y radio en vivo',
			imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Apple_Music_logo.svg/1200px-Apple_Music_logo.svg.png',
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
			imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/1200px-YouTube_full-color_icon_%282017%29.svg.png',
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
			imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Xbox_one_logo.svg/1200px-Xbox_one_logo.svg.png',
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
			imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/PlayStation_logo.svg/1200px-PlayStation_logo.svg.png',
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
			imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Microsoft_Office_logo_%282019%E2%80%93present%29.svg/1200px-Microsoft_Office_logo_%282019%E2%80%93present%29.svg.png',
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
			imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Adobe_Systems_logo_and_wordmark.svg/1200px-Adobe_Systems_logo_and_wordmark.svg.png',
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
			imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Amazon_Prime_Video_logo.svg/1200px-Amazon_Prime_Video_logo.svg.png',
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
			imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Tidal_logo.svg/1200px-Tidal_logo.svg.png',
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
			imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Paramount_Plus_logo.svg/1200px-Paramount_Plus_logo.svg.png',
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
	let productos = CONFIG.productos.filter(producto => producto.activo !== false);
	
	if (categoria === 'todos') {
		return productos;
	}
	return productos.filter(producto => producto.categoria === categoria);
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
