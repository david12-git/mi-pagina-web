# 🐛 Guía de Debugging del Carrito

## Problema Identificado
El botón "Agregar al carrito" no funciona debido a errores en las funciones.

## ✅ Correcciones Realizadas

### 1. Error de función no definida
- **Problema**: `actualizarCarritoUI()` no existía
- **Solución**: Cambiado a `actualizarCarrito()`

### 2. Inicialización de datos
- **Problema**: `productosData` no se inicializaba correctamente
- **Solución**: Agregada función `inicializarProductosData()`

### 3. Logs de debugging
- **Agregados logs detallados** en todas las funciones críticas
- **Función de test** disponible con botón en el footer

## 🧪 Cómo probar el sistema

### Opción 1: Botón de Test
1. Ve al footer de la página
2. Haz clic en "🧪 Test Carrito"
3. Abre la consola del navegador (F12)
4. Revisa los logs detallados

### Opción 2: Página de Test
1. Abre `test-carrito.html` en el navegador
2. Usa los botones de prueba
3. Observa los resultados en tiempo real

### Opción 3: Consola del navegador
```javascript
// Verificar datos
console.log('CONFIG:', typeof CONFIG !== 'undefined');
console.log('productosData:', productosData?.length);
console.log('carrito:', carrito);

// Probar funciones
testCarrito(); // Ejecutar test completo
agregarAlCarrito(1); // Agregar producto específico
mostrarCarrito(); // Mostrar carrito
```

## 🔍 Qué buscar en los logs

### ✅ Logs exitosos:
```
✅ productosData inicializado desde CONFIG: 17 productos
✅ Productos cargados correctamente: 17
=== INICIO agregarAlCarrito ===
ID recibido: 1
Producto encontrado: {id: 1, nombre: "Tinto Tradicional", ...}
✅ Carrito actualizado correctamente
```

### ❌ Logs de error:
```
❌ CONFIG no está disponible
❌ No se pudieron cargar los productos
❌ Elementos del carrito no encontrados
❌ Error agregando producto: [error]
```

## 🛠️ Soluciones por tipo de error

### Error: "CONFIG no está disponible"
- **Causa**: `config.js` no se cargó
- **Solución**: Verificar que `config.js` esté en la misma carpeta

### Error: "Elementos del carrito no encontrados"
- **Causa**: HTML del carrito no existe
- **Solución**: Verificar que existe `<div id="carrito-flotante">`

### Error: "productosData no está disponible"
- **Causa**: Orden de carga de scripts
- **Solución**: Ya corregido con `inicializarProductosData()`

### Error: "agregarAlCarrito is not defined"
- **Causa**: Función no se cargó correctamente
- **Solución**: Verificar que `script.js` se carga después de `config.js`

## 📋 Checklist de verificación

- [ ] `config.js` se carga antes que `script.js`
- [ ] `CONFIG` está definido en la consola
- [ ] `productosData` tiene productos
- [ ] Elementos del carrito existen en el DOM
- [ ] Botones tienen `onclick="agregarAlCarrito(id)"`
- [ ] No hay errores en la consola

## 🚀 Estado actual

Después de las correcciones:
- ✅ Función `inicializarProductosData()` agregada
- ✅ Logs de debugging en todas las funciones
- ✅ Función de test disponible
- ✅ Error `actualizarCarritoUI` corregido
- ✅ Validación de elementos DOM mejorada

## 📞 Próximos pasos

1. **Probar el botón "🧪 Test Carrito"** en el footer
2. **Revisar la consola** para ver los logs
3. **Probar agregar productos** normalmente
4. **Reportar cualquier error** que aparezca en la consola

El sistema debería funcionar correctamente ahora. Si persisten los problemas, usar la función de test para identificar exactamente dónde está fallando.