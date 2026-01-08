# 🔄 Sincronización de Stock con Firebase

## 🎯 **Problema Solucionado**

**Antes**: Cuando vendías un producto y refrescabas la página, el stock volvía a los valores originales del `config.js`.

**Ahora**: El stock se guarda en Firebase y se mantiene actualizado incluso después de refrescar la página.

## 🔧 **Cómo Funciona**

### **1. Al Cargar la Página**
- Se conecta automáticamente a Firebase
- Carga el stock actual desde Firebase
- Actualiza los productos locales con el stock real
- Si un producto no existe en Firebase, usa el stock del `config.js`

### **2. Al Procesar un Pedido**
- Actualiza el stock localmente (como antes)
- **NUEVO**: Actualiza el stock en Firebase
- Guarda los cambios permanentemente

### **3. Tipos de Productos**

#### **Productos con Sabores** (ej: Cifrut, Jugos)
- Se guardan en: `productos/{categoria}/inventario/{sabor}`
- Ejemplo: `productos/bebidas-frias/inventario/naranja`

#### **Productos sin Sabores** (ej: Tinto, Empanadas)
- Se guardan en: `stock-general/producto-{id}`
- Ejemplo: `stock-general/producto-1`

## 📊 **Estructura en Firebase**

### **Productos con Sabores:**
```
productos/
├── bebidas-frias/
│   └── inventario/
│       ├── naranja: 15
│       ├── manzana: 8
│       └── uva: 12
└── bebidas-calientes/
    └── inventario/
        ├── mango: 20
        └── mora: 5
```

### **Productos sin Sabores:**
```
stock-general/
├── producto-1/
│   ├── id: 1
│   ├── nombre: "Tinto Tradicional"
│   ├── stock: 85
│   └── ultimaActualizacion: "2026-01-08T..."
└── producto-15/
    ├── id: 15
    ├── nombre: "Empanadas"
    ├── stock: 180
    └── ultimaActualizacion: "2026-01-08T..."
```

## 🚀 **Funciones Implementadas**

### **En script.js:**
- `actualizarStockEnFirebase()` - Actualiza stock después de un pedido
- `procesarPedido()` - Modificada para incluir sincronización

### **En index.html (Firebase):**
- `actualizarStockFirebase()` - Actualiza productos con sabores
- `actualizarStockProductoGeneral()` - Actualiza productos sin sabores
- `cargarStockDesdeFirebase()` - Carga stock de productos con sabores
- `cargarStockGeneralDesdeFirebase()` - Carga stock de productos sin sabores

## 🎯 **Flujo Completo**

### **Al Iniciar:**
1. Página se carga con stock del `config.js`
2. Firebase se conecta (3 segundos después)
3. Carga stock real desde Firebase
4. Actualiza la interfaz con stock correcto

### **Al Vender:**
1. Cliente procesa pedido
2. Stock se actualiza localmente
3. Stock se actualiza en Firebase
4. Cambios se guardan permanentemente

### **Al Refrescar:**
1. Página se carga con stock del `config.js`
2. Firebase carga el stock real actualizado
3. Interfaz muestra el stock correcto

## 🧪 **Cómo Probar**

### **Prueba 1: Venta y Refresco**
1. Vende algunos productos
2. Refresca la página
3. ✅ El stock debe mantenerse actualizado

### **Prueba 2: Consola del Navegador**
```javascript
// Ver stock actual en Firebase
await window.cargarStockGeneralDesdeFirebase()

// Actualizar stock manualmente
await window.actualizarStockProductoGeneral(1, "Tinto", -5)
```

### **Prueba 3: Firebase Console**
1. Ve a tu proyecto Firebase
2. Firestore Database
3. Verifica las colecciones `productos` y `stock-general`

## 📝 **Logs en Consola**

Cuando funciona correctamente verás:
```
🔄 Actualizando stock en Firebase...
📦 Actualizando stock en Firebase: Tinto Tradicional - Cantidad vendida: 2
📊 Stock actual: 100, Cambio: -2, Nuevo stock: 98
✅ Stock actualizado en Firebase: Tinto Tradicional = 98
✅ Actualización de stock en Firebase completada
```

## ⚠️ **Notas Importantes**

1. **Conexión a Internet**: Requiere conexión para sincronizar
2. **Tiempo de Carga**: Firebase se conecta 3 segundos después de cargar la página
3. **Fallback**: Si Firebase falla, usa stock local del `config.js`
4. **Stock Negativo**: Nunca permite stock negativo (mínimo 0)

## 🎉 **Beneficios**

- ✅ **Persistencia**: Stock se mantiene entre sesiones
- ✅ **Sincronización**: Múltiples dispositivos ven el mismo stock
- ✅ **Respaldo**: Datos seguros en la nube
- ✅ **Tiempo Real**: Actualizaciones inmediatas
- ✅ **Escalabilidad**: Soporta crecimiento del negocio

¡Ahora tu sistema de inventario es completamente funcional y persistente! 🚀