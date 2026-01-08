# 🧪 Cómo Probar el Sistema de Sabores

## 🚀 Archivos Abiertos en el Navegador

Se han abierto automáticamente los siguientes archivos:

1. **`test-sabores-simple.html`** - Prueba básica y rápida
2. **`test-sabores.html`** - Prueba completa con interfaz avanzada  
3. **`index.html`** - Sitio principal con sistema integrado

## 🔍 Verificaciones Rápidas

### En `test-sabores-simple.html`:
1. **Clic en "🧪 Ejecutar Pruebas"** - Verifica que todo esté funcionando
2. **Clic en "🛒 Probar Venta"** - Simula una venta de sabor aleatorio
3. **Clic en "📦 Ver Stock"** - Muestra el stock actual por sabores
4. **Clic en "🔄 Restaurar"** - Restaura el stock original

### En `test-sabores.html`:
- **Interfaz completa** con todos los productos con sabores
- **Controles avanzados** para cada producto
- **Simulaciones masivas** de ventas y reabastecimiento
- **Log en tiempo real** de todas las operaciones

### En `index.html`:
- **Sitio principal** con el sistema integrado
- **Productos con selectores de sabores** (Gaseosa Inn, Cifrut, Jugos Naturales)
- **Carrito funcional** que valida sabores seleccionados

## 🍹 Productos Configurados con Sabores

### 1. **Gaseosa Inn** (ID: 9) - $2,000
- **Sabores:** Cola, Naranja, Limón, Manzana, Uva, Piña
- **Stock Total:** 60 unidades (10 por sabor aprox.)

### 2. **Cifrut** (ID: 6) - $1,100  
- **Sabores:** Naranja, Manzana, Uva, Tropical, Limón
- **Stock Total:** 50 unidades (10 por sabor aprox.)

### 3. **Jugos Naturales** (ID: 17) - $2,500
- **Sabores:** Mango, Maracuyá, Lulo, Mora, Guayaba, Tomate de árbol
- **Stock Total:** 48 unidades (8 por sabor aprox.)

## 🧪 Pruebas Recomendadas

### Prueba 1: Funcionamiento Básico
1. Abrir `test-sabores-simple.html`
2. Clic en "Ejecutar Pruebas"
3. Verificar que aparezcan ✅ verdes
4. Revisar el log para ver la inicialización

### Prueba 2: Venta de Sabores
1. En el sitio principal (`index.html`)
2. Buscar "Gaseosa Inn" 
3. Seleccionar un sabor del dropdown
4. Agregar al carrito
5. Verificar que se agregue correctamente

### Prueba 3: Validación de Stock
1. En `test-sabores.html`
2. Hacer varias ventas del mismo sabor
3. Observar cómo disminuye el stock
4. Intentar vender cuando se agote
5. Verificar que no permita overselling

### Prueba 4: Persistencia
1. Realizar algunas ventas
2. Refrescar la página (F5)
3. Verificar que el stock se mantiene
4. Revisar localStorage en DevTools

## 🔧 Comandos de Consola

Abrir DevTools (F12) y ejecutar en la consola:

```javascript
// Ver stock de un sabor específico
window.getStockSabor(9, 'Cola');

// Procesar venta de un sabor
window.procesarVentaSabor(9, 'Cola', 2);

// Ver resumen completo de un producto
window.saboresManager.getResumenStockSabores(9);

// Restaurar todo el stock
window.restaurarStockSabores();

// Verificar sistema completo
// (Copiar y pegar el contenido de verificar-sistema.js)
```

## 📊 Indicadores de Éxito

### ✅ Sistema Funcionando Correctamente:
- Los selectores de sabores aparecen en productos configurados
- El stock se actualiza individualmente por sabor
- Las ventas se procesan correctamente
- El localStorage guarda los cambios
- Los mensajes de validación funcionan

### ❌ Posibles Problemas:
- **Error de CONFIG**: Verificar que config.js se carga correctamente
- **SaboresManager undefined**: Verificar que sabores-manager.js se incluye
- **Selectores no aparecen**: Verificar la propiedad `stockPorSabor: true`
- **Stock no persiste**: Verificar localStorage en DevTools

## 🎯 Flujo de Prueba Completo

1. **Abrir `test-sabores-simple.html`**
   - Ejecutar pruebas básicas
   - Verificar que todo esté verde ✅

2. **Abrir `index.html`**
   - Navegar a la sección de productos
   - Probar agregar Gaseosa Inn al carrito
   - Seleccionar diferentes sabores

3. **Abrir `test-sabores.html`**
   - Explorar la interfaz completa
   - Simular ventas masivas
   - Probar reabastecimiento

4. **Verificar Persistencia**
   - Realizar cambios en cualquier página
   - Refrescar y verificar que se mantienen
   - Probar en diferentes pestañas

## 🚨 Solución de Problemas

### Si no funciona algo:
1. **Abrir DevTools (F12)**
2. **Ir a la pestaña Console**
3. **Buscar errores en rojo**
4. **Verificar que aparezcan los mensajes de inicialización:**
   - "🍹 Inicializando gestor de sabores..."
   - "🍹 Gestor de Sabores inicializado correctamente"

### Errores Comunes:
- **"CONFIG is not defined"**: config.js no se cargó
- **"saboresManager is not defined"**: sabores-manager.js no se cargó  
- **Selectores vacíos**: Verificar que los productos tengan `stockPorSabor: true`

## 📱 Compatibilidad

El sistema funciona en:
- ✅ Chrome/Edge (recomendado)
- ✅ Firefox  
- ✅ Safari
- ✅ Móviles (responsive)

## 🎉 ¡Listo para Usar!

El sistema está completamente funcional y listo para producción. Los archivos abiertos te permitirán probar todas las funcionalidades y verificar que todo funcione correctamente.

**¡Disfruta probando tu nuevo sistema de sabores!** 🍹