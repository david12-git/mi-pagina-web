// Configuración de TechSoluciones
const CONFIG = {
	           // Información de la empresa
           empresa: {
               nombre: 'TechSoluciones',
               telefono: '+57 313 577 1729',
               email: 'info@techsoluciones.com',
               whatsapp: '+573135771729',
               ubicacion: 'Aguadas, Colombia',
               descripcion: 'Transformamos ideas en tecnología innovadora y soluciones digitales de vanguardia.'
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
	
	// Servicios
	servicios: [
		{
			nombre: 'Desarrollo Web',
			icono: 'fas fa-globe',
			descripcion: 'Sitios web modernos, responsivos y optimizados para SEO.',
			caracteristicas: ['Diseño responsivo', 'Optimización SEO', 'Integración CMS']
		},
		{
			nombre: 'Aplicaciones Móviles',
			icono: 'fas fa-mobile-alt',
			descripcion: 'Apps para iOS y Android con tecnologías de vanguardia.',
			caracteristicas: ['iOS y Android', 'React Native', 'Flutter']
		},
		{
			nombre: 'Inteligencia Artificial',
			icono: 'fas fa-brain',
			descripcion: 'Soluciones de IA para automatización y análisis de datos.',
			caracteristicas: ['Machine Learning', 'Chatbots', 'Análisis predictivo']
		}
	],
	
	// Estadísticas de la empresa
	estadisticas: {
		clientes: '+500',
		experiencia: '8 Años',
		soporte: '24/7'
	},
	
	// Colores del tema
	colores: {
		primario: '#667eea',
		secundario: '#764ba2',
		acento: '#ffd700',
		whatsapp: '#25d366',
		exito: '#51cf66',
		error: '#ff6b6b'
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

// Exportar configuración
if (typeof module !== 'undefined' && module.exports) {
	module.exports = CONFIG;
}
