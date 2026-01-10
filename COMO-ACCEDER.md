# 🌐 Cómo Acceder a Tu Página Web

## ✅ Servidor Web Iniciado

Tu servidor web está corriendo en el **puerto 8080**.

---

## 🔗 URLs de Acceso

### 📱 Página Principal (Tienda)
```
http://localhost:8080/index.html
```

### 🔧 Panel de Administración
```
http://localhost:8080/admin-panel.html
```

### 🧪 Test de Firebase
```
http://localhost:8080/test-firebase.html
```

---

## 🚀 Pasos para Empezar

### 1️⃣ **Primera Vez - Sincronizar Productos**

1. Abre en tu navegador:
   ```
   http://localhost:8080/test-firebase.html
   ```

2. Haz clic en el botón: **"🔄 Sincronizar con Config"**

3. Verás un mensaje: "✅ X productos sincronizados correctamente"

4. ¡Listo! Tus productos están en Firebase.

---

### 2️⃣ **Usar el Panel de Administración**

1. Abre en tu navegador:
   ```
   http://localhost:8080/admin-panel.html
   ```

2. Verás el dashboard con estadísticas

3. Puedes:
   - ✏️ Editar productos
   - ➕ Agregar nuevos productos
   - 🗑️ Eliminar productos
   - 🍹 Gestionar sabores individuales
   - 💰 Cambiar precios
   - 📦 Actualizar stock

---

### 3️⃣ **Ver la Tienda (Página Web)**

1. Abre en tu navegador:
   ```
   http://localhost:8080/index.html
   ```

2. Verás tu tienda funcionando

3. Los cambios que hagas en el admin se reflejarán aquí **automáticamente**

---

## 🔄 Flujo de Trabajo Completo

```
1. Abres admin-panel.html
2. Cambias el precio de "Coca-Cola" de $2400 a $2200
3. Haces clic en "Guardar"
4. ¡El cambio se guarda en Firebase!
5. index.html se actualiza automáticamente
6. Los clientes ven el nuevo precio SIN recargar
```

---

## 🛑 Detener el Servidor

Si necesitas detener el servidor:

```bash
pkill -f "python3 -m http.server"
```

---

## 🔄 Reiniciar el Servidor

Si necesitas reiniciar el servidor:

```bash
cd /app
pkill -f "python3 -m http.server"
python3 -m http.server 8080 &
```

---

## 🐛 Solución de Problemas

### ❓ No puedo acceder a las URLs

**Solución:**
1. Verifica que el servidor esté corriendo:
   ```bash
   ps aux | grep "python3 -m http.server"
   ```

2. Si no está corriendo, inícialo:
   ```bash
   cd /app
   python3 -m http.server 8080 &
   ```

### ❓ Firebase no funciona

**Solución:**
1. Abre `test-firebase.html`
2. Haz clic en "Test Conexión"
3. Si hay error, verifica tu conexión a Internet
4. Revisa la consola del navegador (F12)

### ❓ Los cambios no se reflejan

**Solución:**
1. Verifica que guardaste en el admin
2. Revisa la consola (F12) en index.html
3. Recarga la página (F5)

---

## 📱 URLs Rápidas

**Copiar y pegar en el navegador:**

```
Tienda:      http://localhost:8080/index.html
Admin:       http://localhost:8080/admin-panel.html
Test:        http://localhost:8080/test-firebase.html
```

---

## 🎯 Próximos Pasos

1. ✅ Abre `test-firebase.html` → Sincroniza productos
2. ✅ Abre `admin-panel.html` → Familiarízate con el panel
3. ✅ Edita un producto → Verifica que funciona
4. ✅ Abre `index.html` → Ve los cambios en tiempo real

---

¡Todo listo para usar! 🎉
