# 📚 Instrucciones del Panel de Administración

## 🎯 Características Principales

Tu sistema de administración ahora incluye:

✅ **Gestión Completa de Productos**
- Agregar nuevos productos
- Editar precios y stock
- Eliminar productos
- Búsqueda y filtrado por categoría

✅ **Gestión de Sabores**
- Control individual de stock por sabor (ej: Gaseosas)
- Actualización independiente de cada sabor
- Vista clara del stock de cada variante

✅ **Sincronización en Tiempo Real con Firebase**
- Los cambios se reflejan instantáneamente en la página web
- Actualización automática sin necesidad de recargar
- Sistema bidireccional entre admin y web

✅ **Dashboard con Estadísticas**
- Total de productos
- Productos con stock disponible
- Productos agotados
- Productos con sabores

---

## 🚀 Cómo Usar el Panel de Administración

### 1️⃣ Acceder al Panel

**Opción A: Desde la página web**
1. Abre tu página web: `index.html`
2. Desplázate al footer (parte inferior)
3. Haz clic en el botón **"Ingresar"**

**Opción B: Directamente**
1. Abre el archivo: `admin-panel.html`

---

### 2️⃣ Editar Productos Existentes

1. **Busca el producto** que deseas editar
   - Usa la barra de búsqueda
   - Filtra por categoría

2. **Modifica los valores**:
   - **Precio**: Cambia el valor en el campo de precio
   - **Stock**: Actualiza la cantidad disponible
   - **Sabores** (si aplica): Edita el stock de cada sabor individual

3. **Guarda los cambios**:
   - Haz clic en el botón verde **"Guardar"**
   - Los cambios se sincronizarán automáticamente con Firebase
   - La página web se actualizará en tiempo real

---

### 3️⃣ Agregar Nuevo Producto

1. Haz clic en **"+ Nuevo Producto"** (esquina superior derecha)

2. Completa el formulario:
   - **Nombre**: Nombre del producto
   - **Categoría**: Selecciona la categoría apropiada
     - Bebidas Calientes
     - Bebidas Frías
     - Comida
     - Postres
   - **Precio**: Precio en pesos colombianos
   - **Stock Inicial**: Cantidad disponible
   - **Descripción**: Descripción del producto (opcional)
   - **URL de Imagen**: Ruta de la imagen (ej: `imagen/producto.jpg`)

3. **Para productos con sabores** (como gaseosas):
   - ✅ Marca la casilla **"Este producto tiene sabores"**
   - Escribe los sabores separados por coma
   - Ejemplo: `Cola, Naranja, Limón, Manzana`

4. Haz clic en **"Guardar Producto"**

---

### 4️⃣ Gestionar Productos con Sabores

**Ejemplo: Gaseosa Inn**

Cuando editas una gaseosa que tiene sabores, verás:

```
🍹 Gestión de Sabores
Cola         [10] unidades
Naranja      [8]  unidades
Limón        [12] unidades
Manzana      [5]  unidades
Uva          [3]  unidades
Piña         [7]  unidades
```

**Para actualizar un sabor específico**:
1. Cambia el número en el campo del sabor
2. Haz clic en **"Guardar"**
3. Solo ese sabor se actualizará en Firebase

**Beneficio**: Si se agota "Cola" pero tienes "Naranja", los clientes aún pueden comprar Naranja sin problemas.

---

### 5️⃣ Eliminar Productos

1. Busca el producto que deseas eliminar
2. Haz clic en el botón rojo **"Eliminar"**
3. Confirma la eliminación
4. El producto se eliminará de Firebase y de la página web

---

### 6️⃣ Sincronizar con Firebase

**¿Cuándo usar?**
- Primera vez que usas el panel
- Si los productos de Firebase están desactualizados
- Para forzar una sincronización completa

**Cómo hacerlo**:
1. Haz clic en el botón amarillo **"Sincronizar Firebase"**
2. Todos los productos se subirán/actualizarán en Firebase
3. La página web se actualizará automáticamente

---

## 🔥 Configuración de Firebase

### Credenciales Actuales

El sistema ya está configurado con Firebase:

```javascript
Project ID: my-pagina-web-3aca7
Auth Domain: my-pagina-web-3aca7.firebaseapp.com
Storage: my-pagina-web-3aca7.firebasestorage.app
```

### Estructura de Datos en Firebase

**Colección: `productos`**

Cada producto se guarda con esta estructura:

```json
{
  "id": 1,
  "nombre": "Gaseosa Inn",
  "categoria": "bebidas frias",
  "precio": 2000,
  "stock": 60,
  "descripcion": "Variedad de sabores locales",
  "imagen": "imagen/Gaseosas.jpg",
  "sabores": ["Cola", "Naranja", "Limón", "Manzana", "Uva", "Piña"],
  "stockPorSabor": {
    "Cola": 10,
    "Naranja": 10,
    "Limón": 10,
    "Manzana": 10,
    "Uva": 10,
    "Piña": 10
  },
  "ultimaActualizacion": "timestamp"
}
```

---

## 🔄 Cómo Funciona la Sincronización en Tiempo Real

### Flujo de Actualización

1. **Admin hace un cambio**:
   - Editas un precio o stock
   - Haces clic en "Guardar"

2. **Se guarda en Firebase**:
   - El cambio se envía a Firebase Firestore
   - Se marca con timestamp de actualización

3. **La web detecta el cambio**:
   - El sistema escucha cambios en Firebase
   - Detecta automáticamente la modificación

4. **La web se actualiza**:
   - Los productos se recargan automáticamente
   - Los clientes ven los cambios instantáneamente
   - Aparece una notificación de actualización

**¡No es necesario recargar la página!** ✨

---

## 🎨 Características de la Interfaz

### Dashboard de Estadísticas

En la parte superior verás 4 tarjetas con:

- 📦 **Total Productos**: Cantidad total de productos
- ✅ **Con Stock**: Productos disponibles
- ❌ **Agotados**: Productos sin stock
- 🍹 **Con Sabores**: Productos que tienen sabores

### Búsqueda y Filtros

- **Barra de búsqueda**: Busca por nombre de producto
- **Filtro por categoría**: Filtra por tipo de producto

### Diseño Responsivo

El panel funciona perfectamente en:
- 💻 Computadoras de escritorio
- 📱 Tablets
- 📱 Móviles

---

## ⚠️ Notas Importantes

### 1. Primera Sincronización

**La primera vez que uses el panel**:
1. Abre `admin-panel.html`
2. Haz clic en **"Sincronizar Firebase"**
3. Esto subirá todos los productos de `config.js` a Firebase

### 2. Stock por Sabores

**Para productos con sabores**:
- El stock total es la suma de todos los sabores
- Cada sabor tiene stock independiente
- Si un sabor se agota, los demás siguen disponibles

### 3. Imágenes

**Rutas de imágenes**:
- Usa rutas relativas: `imagen/producto.jpg`
- Las imágenes deben estar en la carpeta `imagen/`
- Formatos soportados: JPG, PNG, WEBP

### 4. Precios

**Formato de precios**:
- En pesos colombianos (COP)
- Sin decimales (ej: 2000, no 2000.00)
- Incrementos de 100 pesos

---

## 🐛 Solución de Problemas

### ❓ No se cargan los productos

**Solución**:
1. Verifica la consola del navegador (F12)
2. Revisa que Firebase esté configurado
3. Haz clic en "Sincronizar Firebase"

### ❓ Los cambios no se reflejan en la web

**Solución**:
1. Verifica que guardaste los cambios
2. Revisa la consola de la página web
3. Recarga la página web (F5)

### ❓ Error al guardar

**Solución**:
1. Verifica tu conexión a Internet
2. Revisa que todos los campos estén completos
3. Verifica las credenciales de Firebase

---

## 📞 Soporte

Si tienes problemas o preguntas:

1. Revisa la consola del navegador (F12)
2. Verifica los mensajes de error
3. Consulta este archivo de instrucciones

---

## 🎯 Mejores Prácticas

### ✅ Hacer

- ✅ Sincroniza con Firebase regularmente
- ✅ Mantén los precios actualizados
- ✅ Revisa el stock frecuentemente
- ✅ Usa nombres descriptivos para productos
- ✅ Mantén las categorías organizadas

### ❌ Evitar

- ❌ Eliminar productos sin confirmar
- ❌ Dejar campos en blanco
- ❌ Usar caracteres especiales en IDs
- ❌ Modificar múltiples productos sin guardar

---

## 🚀 Próximos Pasos

Ahora que tienes el panel configurado:

1. ✅ Sincroniza tus productos con Firebase
2. ✅ Prueba editar un producto
3. ✅ Verifica que los cambios se reflejen en la web
4. ✅ Agrega un producto nuevo de prueba
5. ✅ Configura los stock de sabores

---

¡Listo! Ahora tienes un sistema de administración completo y profesional. 🎉

**Recuerda**: Todos los cambios se sincronizan en tiempo real con Firebase y se reflejan automáticamente en tu página web.
