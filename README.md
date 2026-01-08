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

## 🧪 Sistema de Pruebas Completo

El proyecto incluye un conjunto completo de pruebas para verificar todas las funcionalidades:

### 🍹 **Pruebas del Sistema de Sabores:**
- `test-sabores.html` - Prueba completa con interfaz avanzada
- `test-sabores-simple.html` - Prueba básica y rápida
- `test-limite-sabores.html` - Verificación de límites de stock por sabor
- `ejemplo-stock-sabores.html` - Demostración del funcionamiento

### 🛒 **Pruebas del Carrito:**
- `test-carrito.html` - Prueba completa del carrito de compras
- `verificacion-final.html` - Verificación integral del sistema

### 📦 **Pruebas de Stock:**
- `test-stock-simple.html` - Prueba básica del sistema de inventario
- `test-stock-fix.html` - Verificación de correcciones de stock

### 🔥 **Pruebas de Firebase:**
- `test-firebase-sync.html` - Sincronización con Firebase
- `test-categorias-firebase.html` - Sistema de categorías
- `test-persistencia-ventas.html` - Persistencia de ventas
- `test-velocidad-sync.html` - Velocidad de sincronización
- `firebase-diagnostico.html` - Diagnóstico completo de Firebase

### 🔧 **Herramientas de Verificación:**
- `verificar-sistema.js` - Script de verificación automática

## 🚀 Cómo Probar el Sistema

1. **Prueba Rápida:** Abre `test-sabores-simple.html`
2. **Prueba Completa:** Abre `test-sabores.html`
3. **Verificar Límites:** Abre `test-limite-sabores.html`
4. **Diagnóstico Firebase:** Abre `firebase-diagnostico.html`

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/las-delicias-abuela.git
   cd las-delicias-abuela
   ```

2. **Abrir en navegador:**
   ```bash
   # Simplemente abre index.html en tu navegador
   # O usa un servidor local como Live Server
   ```

3. **Configurar Firebase (opcional):**
   - Crear proyecto en Firebase Console
   - Actualizar credenciales en `firebase-setup.js`
   - Habilitar Firestore Database

## 🔧 Instalación y Uso

## 📊 Estructura del Proyecto

```
las-delicias-abuela/
├── 🏠 index.html                 # Página principal
├── ⚙️ config.js                  # Configuración de productos
├── 🔧 script.js                  # Lógica principal
├── 🎨 styles.css                 # Estilos principales
├── 🍹 sabores-manager.js         # Sistema de sabores
├── 📦 stock-manager.js           # Gestión de inventario
├── 🔥 firebase-setup.js          # Configuración Firebase
├── 🔥 firebase-categorias.js     # Sistema de categorías
├── 🖼️ imagen/                    # Imágenes de productos
├── 🧪 tests/                     # Archivos de prueba
│   ├── test-sabores.html         # Prueba completa de sabores
│   ├── test-limite-sabores.html  # Prueba de límites
│   ├── test-carrito.html         # Prueba del carrito
│   ├── firebase-diagnostico.html # Diagnóstico Firebase
│   └── ... (más pruebas)
└── 📚 docs/                      # Documentación completa
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