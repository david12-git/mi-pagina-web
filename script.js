// Inicializar EmailJS
(function() {
	emailjs.init("YOUR_USER_ID"); // Reemplazar con tu User ID de EmailJS
})();

// Función para mostrar más información
function mostrarMas() {
	// Crear modal personalizado
	const modal = document.createElement('div');
	modal.className = 'modal-overlay';
	modal.innerHTML = `
		<div class="modal-content">
			<div class="modal-header">
				<h3><i class="fas fa-info-circle"></i> Más sobre TechSoluciones</h3>
				<button class="modal-close" onclick="cerrarModal()">&times;</button>
			</div>
			<div class="modal-body">
				<p><strong>Nuestra misión:</strong> Transformar ideas en soluciones tecnológicas innovadoras que impulsen el crecimiento de tu negocio.</p>
				<div class="modal-features">
					<div class="feature-item">
						<i class="fas fa-users"></i>
						<h4>+500 Clientes</h4>
						<p>Proyectos exitosos</p>
					</div>
					<div class="feature-item">
						<i class="fas fa-award"></i>
						<h4>8 Años</h4>
						<p>De experiencia</p>
					</div>
					<div class="feature-item">
						<i class="fas fa-clock"></i>
						<h4>24/7</h4>
						<p>Soporte técnico</p>
					</div>
				</div>
				<div class="modal-actions">
					<a href="#contacto" class="btn-primary" onclick="cerrarModal()">
						<i class="fas fa-envelope"></i> Contactar ahora
					</a>
					<a href="https://wa.me/573135771729?text=Hola,%20me%20interesa%20sus%20servicios" target="_blank" class="btn-whatsapp">
						<i class="fab fa-whatsapp"></i> WhatsApp
					</a>
				</div>
			</div>
		</div>
	`;
	document.body.appendChild(modal);
	
	// Animar entrada del modal
	setTimeout(() => modal.classList.add('show'), 10);
}

function cerrarModal() {
	const modal = document.querySelector('.modal-overlay');
	if (modal) {
		modal.classList.remove('show');
		setTimeout(() => modal.remove(), 300);
	}
}

// Navegación suave para los enlaces del menú
document.addEventListener('DOMContentLoaded', function() {
	// Obtener todos los enlaces de navegación
	const navLinks = document.querySelectorAll('nav a[href^="#"]');
	
	// Agregar evento click a cada enlace
	navLinks.forEach(link => {
		link.addEventListener('click', function(e) {
			e.preventDefault();
			
			const targetId = this.getAttribute('href');
			const targetSection = document.querySelector(targetId);
			
			if (targetSection) {
				// Calcular la posición considerando el header fijo
				const headerHeight = document.querySelector('.header').offsetHeight;
				const targetPosition = targetSection.offsetTop - headerHeight;
				
				// Scroll suave hacia la sección
				window.scrollTo({
					top: targetPosition,
					behavior: 'smooth'
				});
			}
		});
	});
	
	// Manejo del formulario de contacto con EmailJS
	const contactForm = document.getElementById('contact-form');
	if (contactForm) {
		contactForm.addEventListener('submit', function(e) {
			e.preventDefault();
			
			// Mostrar loading
			const submitBtn = this.querySelector('button[type="submit"]');
			const originalText = submitBtn.innerHTML;
			submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
			submitBtn.disabled = true;
			
			// Obtener los valores del formulario
			const name = this.querySelector('input[type="text"]').value;
			const email = this.querySelector('input[type="email"]').value;
			const phone = this.querySelector('input[type="tel"]').value;
			const message = this.querySelector('textarea').value;
			
			// Validación básica
			if (!name || !email || !message) {
				mostrarNotificacion('Por favor, completa todos los campos obligatorios.', 'error');
				resetearBoton(submitBtn, originalText);
				return;
			}
			
			// Validación de email
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(email)) {
				mostrarNotificacion('Por favor, ingresa un email válido.', 'error');
				resetearBoton(submitBtn, originalText);
				return;
			}
			
			// Preparar datos para EmailJS
			const templateParams = {
				from_name: name,
				from_email: email,
				from_phone: phone,
				message: message,
				to_name: 'TechSoluciones'
			};
			
			// Enviar email usando EmailJS
			emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
				.then(function(response) {
					console.log('SUCCESS!', response.status, response.text);
					mostrarNotificacion('¡Mensaje enviado con éxito! Te contactaremos pronto.', 'success');
					contactForm.reset();
					
					// Trackear evento en Google Analytics
					if (typeof gtag !== 'undefined') {
						gtag('event', 'form_submit', {
							'event_category': 'Contact',
							'event_label': 'Contact Form'
						});
					}
				}, function(error) {
					console.log('FAILED...', error);
					mostrarNotificacion('Error al enviar el mensaje. Por favor, intenta nuevamente.', 'error');
				})
				.finally(function() {
					resetearBoton(submitBtn, originalText);
				});
		});
	}
	
	// Efecto de scroll para el header
	window.addEventListener('scroll', function() {
		const header = document.querySelector('.header');
		if (window.scrollY > 100) {
			header.style.background = 'rgba(102, 126, 234, 0.95)';
			header.style.backdropFilter = 'blur(10px)';
		} else {
			header.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
			header.style.backdropFilter = 'none';
		}
	});
	
	// Animación de aparición al hacer scroll
	const observerOptions = {
		threshold: 0.1,
		rootMargin: '0px 0px -50px 0px'
	};
	
	const observer = new IntersectionObserver(function(entries) {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.style.opacity = '1';
				entry.target.style.transform = 'translateY(0)';
			}
		});
	}, observerOptions);
	
	// Observar elementos para animación
	const animatedElements = document.querySelectorAll('.section, .service-card, .contact-item');
	animatedElements.forEach(el => {
		el.style.opacity = '0';
		el.style.transform = 'translateY(30px)';
		el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
		observer.observe(el);
	});
	
	// Efecto hover para las tarjetas de servicios
	const serviceCards = document.querySelectorAll('.service-card');
	serviceCards.forEach(card => {
		card.addEventListener('mouseenter', function() {
			this.style.transform = 'translateY(-10px) scale(1.02)';
		});
		
		card.addEventListener('mouseleave', function() {
			this.style.transform = 'translateY(0) scale(1)';
		});
	});
	
	// Agregar WhatsApp flotante
	agregarWhatsAppFlotante();
	
	// Cerrar modal al hacer clic fuera
	document.addEventListener('click', function(e) {
		if (e.target.classList.contains('modal-overlay')) {
			cerrarModal();
		}
	});
	
	// Cerrar modal con ESC
	document.addEventListener('keydown', function(e) {
		if (e.key === 'Escape') {
			cerrarModal();
		}
	});
});

// Función para validar el formulario en tiempo real
function validarCampo(campo) {
	const valor = campo.value.trim();
	const tipo = campo.type;
	
	switch(tipo) {
		case 'email':
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(valor)) {
				campo.style.borderColor = '#ff6b6b';
				return false;
			} else {
				campo.style.borderColor = '#51cf66';
				return true;
			}
			break;
			
		case 'text':
			if (valor.length < 2) {
				campo.style.borderColor = '#ff6b6b';
				return false;
			} else {
				campo.style.borderColor = '#51cf66';
				return true;
			}
			break;
			
		case 'tel':
			const phoneRegex = /^[\+]?[0-9\s\-\(\)]{9,}$/;
			if (valor && !phoneRegex.test(valor)) {
				campo.style.borderColor = '#ff6b6b';
				return false;
			} else if (valor) {
				campo.style.borderColor = '#51cf66';
				return true;
			} else {
				campo.style.borderColor = '#e1e5e9';
				return true;
			}
			break;
			
		default:
			if (valor.length < 10) {
				campo.style.borderColor = '#ff6b6b';
				return false;
			} else {
				campo.style.borderColor = '#51cf66';
				return true;
			}
	}
}

// Agregar validación en tiempo real a los campos del formulario
document.addEventListener('DOMContentLoaded', function() {
	const formInputs = document.querySelectorAll('#contact-form input, #contact-form textarea');
	
	formInputs.forEach(input => {
		input.addEventListener('blur', function() {
			validarCampo(this);
		});
		
		input.addEventListener('input', function() {
			if (this.value.trim() !== '') {
				validarCampo(this);
			} else {
				this.style.borderColor = '#e1e5e9';
			}
		});
	});
});

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje, tipo) {
	const notificacion = document.createElement('div');
	notificacion.className = `notificacion ${tipo}`;
	notificacion.innerHTML = `
		<i class="fas fa-${tipo === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
		<span>${mensaje}</span>
	`;
	
	document.body.appendChild(notificacion);
	
	// Animar entrada
	setTimeout(() => notificacion.classList.add('show'), 10);
	
	// Remover después de 5 segundos
	setTimeout(() => {
		notificacion.classList.remove('show');
		setTimeout(() => notificacion.remove(), 300);
	}, 5000);
}

// Función para resetear botón
function resetearBoton(boton, textoOriginal) {
	boton.innerHTML = textoOriginal;
	boton.disabled = false;
}

// Función para agregar WhatsApp flotante
function agregarWhatsAppFlotante() {
	const whatsappFloat = document.createElement('a');
			whatsappFloat.href = 'https://wa.me/573135771729?text=Hola,%20me%20interesa%20sus%20servicios';
	whatsappFloat.target = '_blank';
	whatsappFloat.className = 'whatsapp-float';
	whatsappFloat.innerHTML = '<i class="fab fa-whatsapp"></i>';
	whatsappFloat.title = 'Contactar por WhatsApp';
	
	document.body.appendChild(whatsappFloat);
	
	// Animar entrada
	setTimeout(() => whatsappFloat.classList.add('show'), 1000);
}

// Función para trackear eventos en Google Analytics
function trackearEvento(categoria, accion, etiqueta) {
	if (typeof gtag !== 'undefined') {
		gtag('event', accion, {
			'event_category': categoria,
			'event_label': etiqueta
		});
	}
}

// Trackear clics en enlaces importantes
document.addEventListener('DOMContentLoaded', function() {
	// Trackear clics en WhatsApp
	const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
	whatsappLinks.forEach(link => {
		link.addEventListener('click', function() {
			trackearEvento('Contact', 'whatsapp_click', 'WhatsApp Link');
		});
	});
	
	// Trackear clics en servicios
	const serviceCards = document.querySelectorAll('.service-card');
	serviceCards.forEach((card, index) => {
		card.addEventListener('click', function() {
			const serviceName = this.querySelector('h3').textContent;
			trackearEvento('Services', 'service_click', serviceName);
		});
	});
});
