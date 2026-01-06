# 🚀 TechSoluciones - Página Web Profesional

Una página web moderna y profesional para empresas de tecnología, con integraciones avanzadas y diseño responsivo.

## ✨ Características

### 🎨 **Diseño y UX**
- ✅ Diseño moderno y profesional
- ✅ Totalmente responsivo (móvil, tablet, desktop)
- ✅ Animaciones suaves y efectos hover
- ✅ Tipografía optimizada (Poppins)
- ✅ Iconos Font Awesome
- ✅ Gradientes y efectos visuales atractivos

### 📧 **Sistema de Contacto**
- ✅ Formulario de contacto funcional
- ✅ Integración con EmailJS para envío real de emails
- ✅ Validación en tiempo real
- ✅ Notificaciones de éxito/error
- ✅ WhatsApp Business integrado

### 📊 **Analytics y Tracking**
- ✅ Google Analytics integrado
- ✅ Tracking de eventos personalizados
- ✅ Métricas de formularios y clics

### 📱 **Funcionalidades Avanzadas**
- ✅ WhatsApp flotante
- ✅ Modal informativo
- ✅ Navegación suave
- ✅ Efectos de scroll
- ✅ Loading states

## 🛠️ Configuración

### 1. **EmailJS (Para formulario de contacto)**

1. Ve a [EmailJS](https://www.emailjs.com/) y crea una cuenta
2. Crea un nuevo servicio de email (Gmail, Outlook, etc.)
3. Crea una plantilla de email
4. Obtén tus credenciales:
   - User ID
   - Service ID
   - Template ID

5. Actualiza `config.js`:
```javascript
emailjs: {
    user_id: 'TU_USER_ID',
    service_id: 'TU_SERVICE_ID',
    template_id: 'TU_TEMPLATE_ID'
}
```

### 2. **Google Analytics**

1. Ve a [Google Analytics](https://analytics.google.com/)
2. Crea una nueva propiedad
3. Obtén tu Measurement ID
4. Actualiza `config.js`:
```javascript
analytics: {
    measurement_id: 'G-XXXXXXXXXX'
}
```

5. Actualiza `index.html`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
```

### 3. **WhatsApp Business**

1. Actualiza el número de WhatsApp en `config.js`:
```javascript
empresa: {
    whatsapp: 'TU_NUMERO_WHATSAPP'
}
```

2. Reemplaza todas las instancias de `573135771729` con tu número real

### 4. **Información de la Empresa**

Actualiza `config.js` con tu información:
```javascript
empresa: {
    nombre: 'Tu Empresa',
    telefono: '+34 XXX XXX XXX',
    email: 'juandavidd342@gmsil.com',
    ubicacion: 'Tu Ciudad, País'
}
```

## 📁 Estructura de Archivos

```
mi-pagina-web/
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── script.js           # JavaScript principal
├── config.js           # Configuración centralizada
└── README.md           # Documentación
```

## 🎯 Personalización

### **Colores del Tema**
Edita `config.js`:
```javascript
colores: {
    primario: '#667eea',      // Color principal
    secundario: '#764ba2',    // Color secundario
    acento: '#ffd700',        // Color de acento
    whatsapp: '#25d366',      // Color WhatsApp
    exito: '#51cf66',         // Color éxito
    error: '#ff6b6b'          // Color error
}
```

### **Servicios**
Modifica el array de servicios en `config.js`:
```javascript
servicios: [
    {
        nombre: 'Tu Servicio',
        icono: 'fas fa-icono',
        descripcion: 'Descripción del servicio',
        caracteristicas: ['Característica 1', 'Característica 2']
    }
]
```

### **Redes Sociales**
Actualiza los enlaces en `config.js`:
```javascript
redes_sociales: {
    linkedin: 'https://linkedin.com/in/tu-perfil',
    twitter: 'https://twitter.com/tu-usuario',
    github: 'https://github.com/tu-usuario',
    instagram: 'https://instagram.com/tu-usuario'
}
```

## 🚀 Despliegue

### **Opción 1: GitHub Pages (Gratis)**
1. Sube tu código a GitHub
2. Ve a Settings > Pages
3. Selecciona la rama main
4. Tu sitio estará disponible en `https://tu-usuario.github.io/tu-repo`

### **Opción 2: Netlify (Gratis)**
1. Ve a [Netlify](https://netlify.com/)
2. Arrastra tu carpeta del proyecto
3. Tu sitio estará disponible automáticamente

### **Opción 3: Vercel (Gratis)**
1. Ve a [Vercel](https://vercel.com/)
2. Conecta tu repositorio de GitHub
3. Despliega automáticamente

## 📱 Funcionalidades Móviles

- ✅ Diseño adaptativo
- ✅ Menú responsive
- ✅ Botones táctiles optimizados
- ✅ WhatsApp flotante
- ✅ Formulario móvil-friendly

## 🔧 Mantenimiento

### **Actualizar Dependencias**
- Font Awesome: Actualiza el CDN en `index.html`
- EmailJS: Verifica la versión en el CDN
- Google Analytics: Mantén actualizado el código de tracking

### **Backup**
- Guarda copias de seguridad de `config.js`
- Documenta cualquier personalización
- Mantén versiones de los archivos principales

## 🐛 Solución de Problemas

### **Formulario no envía emails**
1. Verifica las credenciales de EmailJS
2. Revisa la consola del navegador
3. Asegúrate de que el servicio esté activo

### **WhatsApp no funciona**
1. Verifica el formato del número (sin espacios ni caracteres especiales)
2. Asegúrate de que el número tenga el código de país

### **Google Analytics no registra**
1. Verifica el Measurement ID
2. Revisa que el código esté correctamente implementado
3. Espera 24-48 horas para ver datos

## 📞 Soporte

Para soporte técnico o personalizaciones adicionales:
- Email: juandavidd342@gmail.com
- WhatsApp: +57 313 577 1729

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Puedes usarlo libremente para proyectos comerciales y personales.

---

**¡Tu página web profesional está lista para conquistar el mundo digital! 🌟**
