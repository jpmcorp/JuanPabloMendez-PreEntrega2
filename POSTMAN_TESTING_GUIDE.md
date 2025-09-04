# 📋 GUÍA DE PRUEBAS DE AUTENTICACIÓN Y AUTORIZACIÓN

## 🚀 Pruebas paso a paso del sistema de autenticación JWT

### 📝 **REQUISITOS PREVIOS**
- Servidor corriendo en `http://localhost:8000`
- Postman o terminal con cURL

---

## 🔐 **PRUEBAS DE AUTENTICACIÓN**

### **PASO 1: Registro de Usuario**
```bash
curl -X POST http://localhost:8000/api/sessions/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Juan",
    "last_name": "Pérez",
    "email": "juan.perez@test.com",
    "age": 25,
    "password": "password123"
  }'
```

### **PASO 1b: Registro de Usuario Administrador**
```bash
curl -X POST http://localhost:8000/api/sessions/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Admin",
    "last_name": "Sistema",
    "email": "admin@test.com",
    "age": 30,
    "password": "admin123",
    "role": "admin"
  }'
```
**⚠️ IMPORTANTE:** El campo `role` es opcional. Si no se especifica, se asigna automáticamente `"user"`.

### **PASO 2: Login de Usuario**
```bash
curl -X POST http://localhost:8000/api/sessions/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan.perez@test.com",
    "password": "password123"
  }'
```
**⚠️ IMPORTANTE:** Guarda el `token` de la respuesta para los siguientes pasos.

### **PASO 3: Usuario Actual (con token)**
```bash
curl -X GET http://localhost:8000/api/sessions/current \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

### **PASO 4: Logout**
```bash
curl -X POST http://localhost:8000/api/sessions/logout \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

### **PASO 5: Verificar token inválido después del logout**
```bash
curl -X GET http://localhost:8000/api/sessions/current \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```
**Esperado:** Error 401 - Token inválido

---

## � **PRUEBAS DE AUTORIZACIÓN**

### **PASO 6: Acceso sin token (debe fallar)**
```bash
curl -X GET http://localhost:8000/api/products
```
**Esperado:** Error 401 - No auth token

### **PASO 7: Acceso con token válido**
```bash
curl -X GET http://localhost:8000/api/products \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```
**Esperado:** Lista de productos (200)

---

## 👨‍💼 **RUTAS DE EJEMPLO OPCIONALES**

### **Rutas de Usuario (acceso normal)**
```bash
# Ver carrito del usuario (requiere autenticación)
curl -X GET http://localhost:8000/api/carts/CART_ID \
  -H "Authorization: Bearer TU_TOKEN_AQUI"

# Consultar todos los usuarios (en desarrollo: cualquier usuario | en producción: solo admin)
curl -X GET http://localhost:8000/api/sessions/users \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```
**Esperado en desarrollo:** ✅ Éxito (200) - cualquier usuario autenticado puede ver la lista
**Esperado en producción:** ❌ Error 403 - solo administradores pueden acceder

### **Ruta de Admin (acceso restringido)**
```bash
# Crear producto (requiere rol admin - debería fallar con usuario normal)
curl -X POST http://localhost:8000/api/products \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Producto Test",
    "description": "Test",
    "price": 99.99,
    "code": "TEST001",
    "stock": 10,
    "category": "test"
  }'
```
**Esperado:** Error 403 - Acceso denegado (requiere rol admin)

### **Rutas de Admin (con token de administrador)**
```bash
# Consultar todos los usuarios (solo admin en producción, cualquier usuario en desarrollo)
curl -X GET http://localhost:8000/api/sessions/users \
  -H "Authorization: Bearer TOKEN_ADMIN"

# Actualizar producto (solo admin)
curl -X PUT http://localhost:8000/api/products/PRODUCT_ID \
  -H "Authorization: Bearer TOKEN_ADMIN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Producto Actualizado",
    "price": 149.99,
    "stock": 20
  }'

# Eliminar producto (solo admin)
curl -X DELETE http://localhost:8000/api/products/PRODUCT_ID \
  -H "Authorization: Bearer TOKEN_ADMIN"
```
**Esperado:** Éxito (200) solo si el token pertenece a un admin (o cualquier usuario en desarrollo)

---

## ✅ **CHECKLIST DE VERIFICACIÓN**

- [ ] Registro exitoso
- [ ] Login exitoso (token obtenido)
- [ ] Acceso autenticado funciona
- [ ] Logout funciona
- [ ] Token invalidado después del logout
- [ ] Acceso sin token bloqueado
- [ ] Rutas de admin bloqueadas para usuarios normales

---

**🌐 Interfaz web:** http://localhost:8000/login
