# 🔄 Guía de Sincronización Firebase

## ¿Cómo funciona la sincronización automática?

Cuando agregas un producto con sabores en `config.js`, el sistema automáticamente:

1. **Detecta productos con sabores** al cargar la página
2. **Crea documentos en Firebase** organizados por categoría
3. **Sincroniza el stock** de cada sabor
4. **Actualiza solo sabores nuevos** (no sobrescribe existentes)

## 📝 Cómo agregar un producto con sabores

### Paso 1: Agregar en config.js

```javascript
{
    id: 18, // ID único
    nombre: 'Malteadas',
    categoria: 'bebidas frias', // Importante: debe coincidir con categorías existentes
    precio: 3500,
    precio_anterior: 4000,
    descripcion: 'Malteadas cremosas y deliciosas.',
    imagen: 'imagen/Malteadas.jpg',
    stock: 30, // Este será el stock inicial para cada sabor
    destacado: true,
    activo: true,
    caracteristicas: ['Cremosas', 'Con helado'],
    sabores: ['Vainilla', 'Chocolate', 'Fresa', 'Oreo'] // ¡Aquí están los sabores!
}
```

### Paso 2: Recargar la página

La sincronización es **automática**:
- Se ejecuta 2 segundos después de cargar la página
- Verás en la consola los mensajes de sincronización
- Aparecerá una notificación de éxito

### Paso 3: Verificar en Firebase

En tu base de datos verás:
```
productos/
├── bebidas-frias/
│   ├── vainilla: 30
│   ├── chocolate: 30
│   ├── fresa: 30
│   └── oreo: 30
```

## 🔧 Funciones disponibles

### 1. Sincronización automática
```javascript
// Se ejecuta automáticamente al cargar la página
window.sincronizarProductosConFirebase()
```

### 2. Sincronización manual
- Botón en el footer: "🔄 Sincronizar con Firebase"
- O desde consola: `window.sincronizarProductosConFirebase()`

### 3. Verificar stock mejorado
```javascript
// Verifica stock de cualquier categoría
await window.revisarStockMejorado('Chocolate', 'bebidas-frias')
```

### 4. Actualizar stock después de compra
```javascript
// Reduce el stock después de una venta
await window.actualizarStockDespuesDeCompra('Chocolate', 2, 'bebidas-frias')
```

## 📊 Estructura en Firebase

```
productos/
├── bebidas-calientes/     (sin sabores, no se sincroniza)
├── bebidas-frias/         
│   ├── naranja: 30        (de Cifrut)
│   ├── manzana: 30        (de Cifrut)
│   ├── uva: 30            (de Cifrut)
│   ├── cola: 30           (de Gaseosa Inn)
│   ├── limón: 30          (de Gaseosa Inn)
│   ├── mango: 40          (de Jugos Naturales)
│   └── maracuyá: 40       (de Jugos Naturales)
├── comida/                (sin sabores, no se sincroniza)
└── postres/               (sin sabores, no se sincroniza)
```

## ⚡ Características importantes

### ✅ Lo que SÍ hace:
- Sincroniza **solo productos con sabores**
- Crea documentos por **categoría**
- **No sobrescribe** stock existente
- Agrega **solo sabores nuevos**
- Funciona **automáticamente**
- Muestra **logs detallados**

### ❌ Lo que NO hace:
- No sincroniza productos sin sabores
- No reduce stock automáticamente (debes usar `actualizarStockDespuesDeCompra`)
- No elimina sabores que quites de config.js

## 🚀 Ejemplo completo

1. **Agregar producto en config.js:**
```javascript
{
    id: 19,
    nombre: 'Smoothies',
    categoria: 'bebidas frias',
    precio: 4000,
    stock: 25,
    sabores: ['Mango-Piña', 'Fresa-Banana', 'Verde Detox']
}
```

2. **Recargar página** → Sincronización automática

3. **Verificar en consola:**
```
🔄 Iniciando sincronización con Firebase...
📦 Encontrados 4 productos con sabores
✅ Smoothies: documento creado con 3 sabores
🎉 Sincronización completada
```

4. **En Firebase aparecerá:**
```
productos/bebidas-frias/
├── mango-piña: 25
├── fresa-banana: 25
└── verde-detox: 25
```

## 🔍 Debugging

### Ver logs en consola:
- Abre DevTools (F12)
- Ve a Console
- Busca mensajes con 🔄, ✅, ❌

### Sincronizar manualmente:
```javascript
// En la consola del navegador
await window.sincronizarProductosConFirebase()
```

### Verificar productos con sabores:
```javascript
// Ver qué productos tienen sabores
CONFIG.productos.filter(p => p.sabores && p.sabores.length > 0)
```

## 🎯 Tips importantes

1. **Categorías deben coincidir** con las existentes en Firebase
2. **Stock inicial** se toma del campo `stock` del producto
3. **Sabores se convierten a minúsculas** en Firebase
4. **Espacios en categorías** se reemplazan por guiones
5. **Solo se agregan sabores nuevos**, no se eliminan existentes

¡Listo! Ahora cada vez que agregues un producto con sabores en `config.js`, se sincronizará automáticamente con Firebase. 🚀