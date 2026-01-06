
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

	// Redes sociales (Puedes actualizar los enlaces luego)
	redes_sociales: {
		linkedin: '#',
		twitter: '#',
		github: '#',
		instagram: '#'
	},

	// Categorías de productos adaptadas a comida
	categorias: [
		{
			id: 'postres',
			nombre: 'Postres Caseros',
			icono: 'fas fa-ice-cream',
			descripcion: 'Dulces tentaciones con receta de la abuela'
		},
		{
			id: 'platos-fuertes',
			nombre: 'Platos Fuertes',
			icono: 'fas fa-utensils',
			descripcion: 'Almuerzos y cenas tradicionales'
		},
		{
			id: 'panaderia',
			nombre: 'Panadería',
			icono: 'fas fa-bread-slice',
			descripcion: 'Pan fresco y amasijos horneados'
		},
		{
			id: 'bebidas',
			nombre: 'Bebidas',
			icono: 'fas fa-glass-cheers',
			descripcion: 'Refrescos naturales y jugos'
		}
	],

	// Productos de la tienda transformados a comida
	productos: [
		{
			id: 1,
			nombre: 'Empanadas recién hechas',
			categoria: 'postres',
			precio: 1200,
			precio_anterior: 1500,
			descripcion: 'deliciosas empanadas casero con la receta secreta de la abuela.',
			imagen: 'Empanadas.jpg', // Tu imagen subida
			stock: 200,
			destacado: true,
			activo: true,
			caracteristicas: ['Ingredientes frescos', 'Sin conservantes', 'Tamaño familiar', 'Hecho hoy']
		},
		{
			id: 2,
			nombre: 'Bandeja Tradicional',
			categoria: 'platos-fuertes',
			precio: 25000,
			precio_anterior: 30000,
			descripcion: 'Completo almuerzo tradicional con el sazón de hogar.',
			imagen: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=500', 
			stock: 15,
			destacado: true,
			activo: false,
			caracteristicas: ['Porción generosa', 'Incluye bebida', 'Acompañamiento variado', 'Sabor de Aguadas']
		},
		{
			id: 3,
			nombre: 'Pan Casero Aliñado',
			categoria: 'panaderia',
			precio: 5000,
			precio_anterior: 6000,
			descripcion: 'Pan recién horneado, suave y con un toque de mantequilla.',
			imagen: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=500',
			stock: 50,
			destacado: false,
			activo: true,
			caracteristicas: ['Recién horneado', 'Sin químicos', 'Perfecto para el café', 'Suave textura']
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

	// Estadísticas actualizadas
	estadisticas: {
		clientes: '+500',
		experiencia: 'Tradición',
		soporte: 'Atención Local',
		productos: 'Hecho a mano'
	},

	// Colores del tema (Sugerencia: Naranjas y Cafés para comida)
	colores: {
		primario: '#e67e22', // Naranja cálido
		secundario: '#d35400', // Naranja oscuro
		acento: '#f1c40f', // Amarillo
		whatsapp: '#25d366',
		exito: '#2ecc71',
		error: '#e74c3c',
		precio: '#e67e22',
		descuento: '#2ecc71'
	}
};

// ... Las funciones de abajo se mantienen igual ...
function getConfig(key) {
	return key.split('.').reduce((obj, k) => obj && obj[k], CONFIG);
}

function updateConfig(key, value) {
	const keys = key.split('.');
	const lastKey = keys.pop();
	const obj = keys.reduce((o, k) => o[k] = o[k] || {}, CONFIG);
	obj[lastKey] = value;
}

function getProductosPorCategoria(categoria) {
	let productos = CONFIG.productos.filter(producto => producto.activo !== false);
	if (categoria === 'todos') return productos;
	return productos.filter(producto => producto.categoria === categoria);
}

function getProductoPorId(id) {
	return CONFIG.productos.find(producto => producto.id === id);
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
