# 🍽️ Las Delicias de la Abuela

**El sabor tradicional de Aguadas en tu mesa**

## 📖 Descripción

Sitio web para "Las Delicias de la Abuela", un negocio de comida típica y bebidas tradicionales de Aguadas, Colombia. El sitio incluye un sistema completo de carrito de compras con gestión de inventario y sabores individuales.

## ✨ Características Principales

- 🛒 **Carrito de Compras Inteligente** - Sistema completo con validación de stock
- 🍹 **Gestión de Sabores Individual** - Stock independiente para cada sabor (Gaseosas, Jugos, etc.)
- 📦 **Inventario en Tiempo Real** - Control preciso de stock con persistencia
- 🔥 **Integración Firebase** - Base de datos en tiempo real
- 📱 **Diseño Responsive** - Optimizado para móviles y desktop
- 💬 **Pedidos por WhatsApp** - Integración directa para pedidos
- ⚡ **Carga Rápida** - Optimizado para velocidad

## 🍹 Sistema de Sabores Único

Nuestro sistema permite manejar productos con múltiples sabores de forma independiente:

### Productos con Sabores:
- **🥤 Gaseosa Inn** - Cola, Naranja, Limón, Manzana, Uva, Piña
- **🧃 Cifrut** - Naranja, Manzana, Uva, Tropical, Limón  
- **🧃 Jugos Naturales** - Mango, Maracuyá, Lulo, Mora, Guayaba, Tomate de árbol

Cada sabor tiene su propio stock independiente, evitando problemas de overselling.

## 🚀 Productos Destacados

### ☕ Bebidas Calientes
- Tinto Tradicional - $1,000
- Pintaito - $1,500
- Chocolate Espumoso - $1,000
- Milo Caliente - $1,600
- Aromática de Frutas - $1,000

### 🥤 Bebidas Frías
- Gaseosa Inn (6 sabores) - $2,000
- Cifrut (5 sabores) - $1,100
- Jugos Naturales (6 sabores) - $2,500
- Coca-Cola - $2,400
- Pony Malta - $1,600

### 🍽️ Comida Típica
- Empanadas Caseras - $1,200
- Aborrajados - $2,000
- Carne Desmechada con Arepa - $4,000
- Papa Rellena - $3,800
- Pastel de Pollo - $2,800

## 🛠️ Tecnologías Utilizadas

- **Frontend:** HTML5, CSS3, JavaScript ES6+
- **Base de Datos:** Firebase Firestore
- **Autenticación:** Firebase Auth
- **Comunicación:** EmailJS, WhatsApp API
- **Almacenamiento:** LocalStorage + Firebase
- **Estilos:** CSS Grid, Flexbox, Responsive Design

## 📱 Funcionalidades del Carrito

- ✅ Selección de sabores obligatoria
- ✅ Validación de stock en tiempo real
- ✅ Límites por sabor individual
- ✅ Persistencia entre sesiones
- ✅ Cálculo automático de totales
- ✅ Integración con WhatsApp para pedidos

## 🔧 Instalación y Uso

### 1. **Clonar el repositorio:**
```bash
git clone https://github.com/tu-usuario/las-delicias-abuela.git
cd las-delicias-abuela
```

### 2. **Configurar archivos sensibles:**

**⚠️ IMPORTANTE:** Este proyecto requiere configuración de credenciales privadas que NO están incluidas en el repositorio por seguridad.

#### 🔥 **Configurar Firebase:**

El proyecto ya incluye la configuración de Firebase lista para usar. Las credenciales de Firebase Web están diseñadas para ser públicas y la seguridad se maneja mediante las reglas de Firestore.

**Archivo incluido:** `firebase-config.js` - Configuración completa y funcional

**Para usar tu propio proyecto Firebase:**
1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilita Firestore Database
3. Reemplaza las credenciales en `firebase-config.js` con las tuyas
4. Configura las reglas de seguridad de Firestore

#### 📧 **Configurar EmailJS (opcional):**
Si ya tienes `config.js`, actualiza las credenciales de EmailJS:
```javascript
emailjs: {
    user_id: 'tu_user_id_real',
    service_id: 'tu_service_id_real',
    template_id: 'tu_template_id_real'
}
```

Si no tienes `config.js`, copia el archivo de ejemplo:
```bash
cp config-example.js config.js
```

### 3. **Abrir en navegador:**
```bash
# Simplemente abre index.html en tu navegador
# O usa un servidor local como Live Server
```

### 4. **Configurar Firebase Console:**
- Crear proyecto en [Firebase Console](https://console.firebase.google.com/)
- Habilitar Firestore Database
- Configurar reglas de seguridad
- Las credenciales ya están incluidas en `firebase-config.js`

## 🔒 Seguridad y Archivos Sensibles

### ✅ **Configuración de Firebase incluida:**
- `firebase-config.js` - Configuración pública y segura (incluida en el repo)
- Las claves de Firebase Web están diseñadas para ser públicas
- La seguridad se maneja en las reglas de Firestore, no ocultando las claves

### ⚠️ **Archivos sensibles (NO incluidos):**
- `config.js` - Puede contener credenciales de EmailJS (si están configuradas)
- Archivos de prueba con credenciales privadas

### ✅ **Archivos de ejemplo incluidos:**
- `firebase-config-example.js` - Plantilla para otros proyectos
- `config-example.js` - Plantilla para configurar EmailJS

### 🛡️ **Buenas prácticas:**
- Las credenciales de Firebase Web son públicas por diseño
- Configura correctamente las reglas de seguridad en Firestore
- Usa variables de entorno para credenciales realmente sensibles (como EmailJS)
- Revisa el `.gitignore` antes de hacer commits

## 📊 Estructura del Proyecto

```
las-delicias-abuela/
├── 🏠 index.html                 # Página principal
├── ⚙️ config.js                  # Configuración de productos
├── 🔧 script.js                  # Lógica principal
├── 🎨 styles.css                 # Estilos principales
├── 🍹 sabores-manager.js         # Sistema de sabores
├── 📦 stock-manager.js           # Gestión de inventario
├── 🔥 firebase-config.js         # Configuración Firebase (incluida)
├── 🔥 firebase-setup.js          # Configuración Firebase
├── 🔥 firebase-categorias.js     # Sistema de categorías
├── 🛠️ admin.html                 # Panel de administración (opcional)
├── ⚙️ config-generator.js        # Generador de config (opcional)
├── 📄 firebase-config-example.js # Plantilla Firebase
├── 📄 config-example.js          # Plantilla configuración
└── 📚 README.md                  # Documentación
```

## 🎯 Demo en Vivo

[🌐 Ver sitio web](https://tu-usuario.github.io/las-delicias-abuela/)

## 📱 Contacto del Negocio

- 📞 **Teléfono:** +57 313 577 1729
- 📧 **Email:** juandavidd342@gmail.com
- 💬 **WhatsApp:** +57 313 577 1729
- 📍 **Ubicación:** Carrera 6 #14-10, Aguadas, Colombia

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🙏 Agradecimientos

- A la comunidad de Aguadas por inspirar este proyecto
- A todos los que han probado y dado feedback
- A las familias que mantienen vivas las tradiciones culinarias

---

**Desarrollado con ❤️ para preservar el sabor tradicional de Aguadas, Colombia**

*"Donde cada bocado cuenta una historia"*