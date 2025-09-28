# 🧪 GUÍA COMPLETA DE TESTING CON POSTMAN

[![Postman](https://img.shields.io/badge/Postman-Collection-orange.svg)](https://postman.com)
[![API](https://img.shields.io/badge/API-REST-blue.svg)](http://localhost:8000)
[![JWT](https://img.shields.io/badge/Auth-JWT-green.svg)](https://jwt.io/)

## � Descripción

Guía completa para probar **TODAS** las funcionalidades del E-commerce Backend, incluyendo:
- ✅ **Sistema de autenticación** completo (registro, login, logout)
- ✅ **Gestión de productos** (CRUD con autorización)
- ✅ **Sistema de carritos** (agregar, modificar, eliminar)
- ✅ **Sistema de órdenes/tickets** (compra completa)
- ✅ **Autorización por roles** (user/admin)

## � Configuración Inicial

### **📝 Requisitos Previos**
- ✅ Servidor corriendo en `http://localhost:8000`
- ✅ **Postman** instalado o **cURL** disponible
- ✅ **MongoDB Atlas** conectado
- ✅ Variables de entorno configuradas

### **🌐 URLs Base**
```
API Base URL: http://localhost:8000/api
Web Interface: http://localhost:8000/login
```

### **📦 Configuración de Postman**

#### **Variables de Entorno Recomendadas:**
```json
{
  "baseUrl": "http://localhost:8000/api",
  "userToken": "",
  "adminToken": "",
  "userId": "",
  "cartId": "",
  "productId": "",
  "orderId": ""
}
```

---

## 🔐 **FASE 1: AUTENTICACIÓN COMPLETA**

### **1.1 Registro de Usuario Normal**
```bash
POST {{baseUrl}}/sessions/register
Content-Type: application/json

{
  "first_name": "Juan",
  "last_name": "Pérez",
  "email": "juan.perez@test.com",
  "age": 25,
  "password": "password123"
}
```
**✅ Respuesta esperada:** `201 Created`
```json
{
  "status": "success",
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": "USER_ID",
    "first_name": "Juan",
    "last_name": "Pérez", 
    "email": "juan.perez@test.com",
    "role": "user",
    "cart": "CART_ID"
  }
}
```

### **1.2 Registro de Usuario Administrador**
```bash
POST {{baseUrl}}/sessions/register
Content-Type: application/json

{
  "first_name": "Admin",
  "last_name": "Sistema",
  "email": "admin@test.com",
  "age": 30,
  "password": "admin123",
  "role": "admin"
}
```
**✅ Respuesta esperada:** `201 Created` con `role: "admin"`

### **1.3 Login de Usuario**
```bash
POST {{baseUrl}}/sessions/login
Content-Type: application/json

{
  "email": "juan.perez@test.com",
  "password": "password123"
}
```
**✅ Respuesta esperada:** `200 OK`
```json
{
  "status": "success",
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "USER_ID",
    "email": "juan.perez@test.com",
    "role": "user"
  }
}
```
**🔑 IMPORTANTE:** Guarda el `token` en la variable `userToken`

### **1.4 Login de Administrador**
```bash
POST {{baseUrl}}/sessions/login
Content-Type: application/json

{
  "email": "admin@test.com",
  "password": "admin123"
}
```
**🔑 IMPORTANTE:** Guarda el `token` en la variable `adminToken`

### **1.5 Verificar Usuario Actual**
```bash
GET {{baseUrl}}/sessions/current
Authorization: Bearer {{userToken}}
```
**✅ Respuesta esperada:** `200 OK` con datos del usuario

### **1.6 Listar Usuarios (Dev/Admin)**
```bash
GET {{baseUrl}}/sessions/users
Authorization: Bearer {{userToken}}
```
**✅ En desarrollo:** `200 OK` - Cualquier usuario
**✅ En producción:** `403 Forbidden` - Solo admin

### **1.7 Logout**
```bash
POST {{baseUrl}}/sessions/logout
Authorization: Bearer {{userToken}}
```
**✅ Respuesta esperada:** `200 OK`

---

## 📦 **FASE 2: GESTIÓN DE PRODUCTOS**

### **2.1 Listar Productos (Usuario)**
```bash
GET {{baseUrl}}/products
Authorization: Bearer {{userToken}}
```
**✅ Respuesta esperada:** `200 OK` con lista paginada

### **2.2 Listar Productos con Filtros**
```bash
GET {{baseUrl}}/products?limit=5&page=1&sort=desc&category=smartphones
Authorization: Bearer {{userToken}}
```
**📊 Parámetros disponibles:**
- `limit=10` - Límite de resultados
- `page=1` - Número de página
- `sort=asc|desc` - Ordenar por precio  
- `category=value` - Filtrar por categoría
- `status=true` - Filtrar por estado
- `query=search` - Búsqueda de texto

### **2.3 Crear Producto (Admin)**
```bash
POST {{baseUrl}}/products
Authorization: Bearer {{adminToken}}
Content-Type: application/json

{
  "title": "iPhone 15 Pro",
  "description": "Último modelo de iPhone con chip A17 Pro",
  "code": "IP15PRO-001",
  "price": 999,
  "stock": 50,
  "category": "smartphones",
  "thumbnails": ["https://example.com/iphone15.jpg"]
}
```
**✅ Con admin token:** `201 Created`
**❌ Con user token:** `403 Forbidden`

**💾 Guarda**: `productId` de la respuesta

### **2.4 Obtener Producto por ID**
```bash
GET {{baseUrl}}/products/{{productId}}
Authorization: Bearer {{userToken}}
```

### **2.5 Actualizar Producto (Admin)**
```bash
PUT {{baseUrl}}/products/{{productId}}
Authorization: Bearer {{adminToken}}
Content-Type: application/json

{
  "title": "iPhone 15 Pro Max",
  "price": 1199,
  "stock": 30
}
```

### **2.6 Eliminar Producto (Admin)**
```bash
DELETE {{baseUrl}}/products/{{productId}}
Authorization: Bearer {{adminToken}}
```

---

## 🛒 **FASE 3: GESTIÓN DE CARRITOS**

### **3.1 Crear Carrito**
```bash
POST {{baseUrl}}/carts
Authorization: Bearer {{userToken}}
```
**💾 Guarda**: `cartId` de la respuesta

### **3.2 Ver Carrito**
```bash
GET {{baseUrl}}/carts/{{cartId}}
Authorization: Bearer {{userToken}}
```

### **3.3 Agregar Producto al Carrito**
```bash
POST {{baseUrl}}/carts/{{cartId}}/product/{{productId}}
Authorization: Bearer {{userToken}}
Content-Type: application/json

{
  "quantity": 2
}
```

### **3.4 Actualizar Cantidad de Producto**
```bash
PUT {{baseUrl}}/carts/{{cartId}}/product/{{productId}}
Authorization: Bearer {{userToken}}
Content-Type: application/json

{
  "quantity": 5
}
```

### **3.5 Eliminar Producto del Carrito**
```bash
DELETE {{baseUrl}}/carts/{{cartId}}/product/{{productId}}
Authorization: Bearer {{userToken}}
```

### **3.6 Actualizar Carrito Completo**
```bash
PUT {{baseUrl}}/carts/{{cartId}}
Authorization: Bearer {{userToken}}
Content-Type: application/json

{
  "products": [
    {
      "pid": 1,
      "quantity": 3
    },
    {
      "pid": 2, 
      "quantity": 1
    }
  ]
}
```

### **3.7 Limpiar Carrito**
```bash
DELETE {{baseUrl}}/carts/{{cartId}}
Authorization: Bearer {{userToken}}
```

---

## 🎫 **FASE 4: SISTEMA DE ÓRDENES/TICKETS** ⭐

### **4.1 Comprar desde Carrito (Flujo Principal)**
```bash
POST {{baseUrl}}/orders/purchase
Authorization: Bearer {{userToken}}
Content-Type: application/json

{
  "cartId": "{{cartId}}"
}
```
**✅ Respuesta esperada:** `201 Created`
```json
{
  "id": "ORDER_ID",
  "code": "ORD-1234567890-ABC123",
  "buyerName": "Juan Pérez",
  "buyerEmail": "juan.perez@test.com",
  "items": [
    {
      "productId": "PRODUCT_ID",
      "title": "iPhone 15 Pro",
      "qty": 2,
      "unitPrice": 999,
      "subtotal": 1998
    }
  ],
  "total": 1998,
  "status": "pending",
  "createdAt": "2025-09-27T..."
}
```
**💾 Guarda**: `orderId` y `orderCode`

**🔄 Proceso automático:**
1. ✅ Valida stock disponible
2. ✅ Crea la orden con código único
3. ✅ Actualiza stock de productos
4. ✅ Limpia el carrito automáticamente

### **4.2 Listar Mis Órdenes**
```bash
GET {{baseUrl}}/orders/my
Authorization: Bearer {{userToken}}
```

### **4.3 Listar Todas las Órdenes (Admin)**
```bash
GET {{baseUrl}}/orders
Authorization: Bearer {{adminToken}}
```

### **4.4 Listar Órdenes con Filtros**
```bash
GET {{baseUrl}}/orders?page=1&limit=10&status=pending
Authorization: Bearer {{adminToken}}
```
**📊 Filtros disponibles:**
- `page=1` - Número de página
- `limit=10` - Límite de resultados
- `status=pending|paid|delivered|cancelled` - Filtrar por estado

### **4.5 Obtener Orden por ID**
```bash
GET {{baseUrl}}/orders/{{orderId}}
Authorization: Bearer {{userToken}}
```
**🔒 Autorización:** Solo el propietario o admin pueden ver

### **4.6 Obtener Orden por Código**
```bash
GET {{baseUrl}}/orders/code/{{orderCode}}
Authorization: Bearer {{userToken}}
```

### **4.7 Cambiar Estado de Orden (Admin)**
```bash
PATCH {{baseUrl}}/orders/{{orderId}}/status
Authorization: Bearer {{adminToken}}
Content-Type: application/json

{
  "status": "paid"
}
```
**📋 Estados válidos:**
- `pending` - Pendiente de pago
- `paid` - Pagada
- `delivered` - Entregada
- `cancelled` - Cancelada

### **4.8 Actualizar Orden (Admin)**
```bash
PUT {{baseUrl}}/orders/{{orderId}}
Authorization: Bearer {{adminToken}}
Content-Type: application/json

{
  "status": "delivered"
}
```

### **4.9 Eliminar Orden (Admin)**
```bash
DELETE {{baseUrl}}/orders/{{orderId}}
Authorization: Bearer {{adminToken}}
```

---

## 🔒 **FASE 5: PRUEBAS DE AUTORIZACIÓN**

### **5.1 Acceso Sin Token**
```bash
GET {{baseUrl}}/products
# Sin Authorization header
```
**❌ Esperado:** `401 Unauthorized`

### **5.2 Token Inválido**
```bash
GET {{baseUrl}}/products
Authorization: Bearer token_invalido
```
**❌ Esperado:** `401 Unauthorized`

### **5.3 Usuario Accediendo a Funciones de Admin**
```bash
POST {{baseUrl}}/products
Authorization: Bearer {{userToken}}
Content-Type: application/json

{
  "title": "Test Product",
  "price": 100
}
```
**❌ Esperado:** `403 Forbidden`

### **5.4 Usuario Viendo Orden de Otro Usuario**
```bash
GET {{baseUrl}}/orders/ORDER_ID_DE_OTRO_USUARIO
Authorization: Bearer {{userToken}}
```
**❌ Esperado:** `403 Forbidden`

---

## 🧪 **FASE 6: FLUJO COMPLETO DE E-COMMERCE**

### **Escenario: Compra Completa**

1. **📝 Registrar usuario**
2. **🔑 Hacer login** (obtener token)
3. **📦 Ver productos** disponibles
4. **🛒 Crear carrito**
5. **➕ Agregar productos** al carrito
6. **👀 Ver carrito** con productos
7. **💳 Realizar compra** (crear orden)
8. **📋 Ver mis órdenes**
9. **🔍 Ver detalle** de orden específica

### **Test de Stock**
1. **📦 Crear producto** con stock limitado (ej: 5 unidades)
2. **🛒 Agregar al carrito** 3 unidades
3. **💳 Comprar** (debe actualizar stock a 2)
4. **🛒 Intentar agregar** 4 unidades más
5. **❌ Debe fallar** por stock insuficiente

---

## ✅ **CHECKLIST COMPLETO DE VERIFICACIÓN**

### **🔐 Autenticación**
- [ ] Registro de usuario normal exitoso
- [ ] Registro de admin exitoso  
- [ ] Login usuario exitoso (token obtenido)
- [ ] Login admin exitoso (token obtenido)
- [ ] Verificar usuario actual funciona
- [ ] Logout funciona
- [ ] Acceso sin token es bloqueado

### **📦 Productos**
- [ ] Listar productos como usuario
- [ ] Ver producto específico
- [ ] Crear producto como admin
- [ ] Usuario normal NO puede crear productos
- [ ] Actualizar producto como admin
- [ ] Eliminar producto como admin
- [ ] Filtros y paginación funcionan

### **🛒 Carritos**
- [ ] Crear carrito
- [ ] Agregar productos al carrito
- [ ] Ver carrito con productos
- [ ] Actualizar cantidades
- [ ] Eliminar productos del carrito
- [ ] Limpiar carrito completo

### **🎫 Órdenes/Tickets**
- [ ] Crear orden desde carrito (compra)
- [ ] Stock se actualiza automáticamente
- [ ] Carrito se limpia después de compra
- [ ] Ver mis órdenes
- [ ] Admin puede ver todas las órdenes
- [ ] Cambiar estado de orden (admin)
- [ ] Usuario solo ve sus propias órdenes
- [ ] Búsqueda por código de orden funciona

### **🔒 Autorización**
- [ ] Rutas protegidas requieren autenticación
- [ ] Funciones de admin bloqueadas para usuarios
- [ ] Propietario puede ver sus recursos
- [ ] Admin puede gestionar todos los recursos

---

## 📊 **VARIABLES DE POSTMAN RECOMENDADAS**

```json
{
  "baseUrl": "http://localhost:8000/api",
  "webUrl": "http://localhost:8000",
  "userEmail": "juan.perez@test.com",
  "userPassword": "password123",
  "adminEmail": "admin@test.com", 
  "adminPassword": "admin123",
  "userToken": "",
  "adminToken": "",
  "userId": "",
  "cartId": "",
  "productId": "",
  "orderId": "",
  "orderCode": ""
}
```

## 🌐 **Interfaces Web**

- **Login:** http://localhost:8000/login
- **Registro:** http://localhost:8000/register
- **Productos:** http://localhost:8000/realtimeproducts
- **Carrito:** http://localhost:8000/cartView

---

## 🚨 **Solución de Problemas Comunes**

### **Token Expirado**
- Síntoma: `401 Unauthorized` después de tiempo
- Solución: Hacer login nuevamente

### **Producto Sin Stock**
- Síntoma: Error al comprar
- Solución: Verificar stock disponible primero

### **Carrito Vacío**
- Síntoma: Error al crear orden
- Solución: Agregar productos al carrito antes de comprar

### **Permisos Insuficientes**
- Síntoma: `403 Forbidden`
- Solución: Verificar que el usuario tenga el rol correcto

---

🎉 **¡Happy Testing!** 🎉

Para dudas o problemas, revisa la documentación completa en el `README.md`.

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

## 📧 **FASE 8: SISTEMA DE MAILING Y MENSAJERÍA** ⭐ **NUEVO**

### **8.1 Configuración de Estado del Sistema**
```bash
# Verificar estado del servicio de mailing
curl -X GET http://localhost:8000/api/v1/mailer/status \
  -H "Authorization: Bearer TOKEN_ADMIN"
```
**Esperado:** Estado de configuración SMTP y Twilio

### **8.2 Email de Bienvenida (Manual)**
```bash
# Enviar email de bienvenida manualmente
curl -X POST http://localhost:8000/api/v1/mailer/welcome \
  -H "Authorization: Bearer TOKEN_USER" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@test.com",
    "firstName": "Juan",
    "lastName": "Pérez"
  }'
```
**Esperado:** Confirmación de envío de email + email recibido

### **8.3 Email de Estado de Orden**
```bash
# Notificar cambio de estado de orden
curl -X POST http://localhost:8000/api/v1/mailer/order-status \
  -H "Authorization: Bearer TOKEN_ADMIN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@test.com",
    "customerName": "Juan Pérez",
    "code": "ORD-1234567890-ABC12345",
    "status": "paid",
    "amount": 299.99,
    "products": [
      {
        "title": "iPhone 15",
        "quantity": 1,
        "price": 299.99
      }
    ]
  }'
```
**Esperado:** Email de notificación de estado enviado

### **8.4 Email de Recuperación de Contraseña**
```bash
# Solicitar recuperación de contraseña
curl -X POST http://localhost:8000/api/v1/mailer/password-reset \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@test.com",
    "firstName": "Juan",
    "resetToken": "abc123def456",
    "resetUrl": "http://localhost:8080/reset-password?token=abc123def456"
  }'
```
**Esperado:** Email de recuperación con token enviado

### **8.5 Email de Confirmación de Compra**
```bash
# Confirmación de compra completa
curl -X POST http://localhost:8000/api/v1/mailer/purchase-confirmation \
  -H "Authorization: Bearer TOKEN_ADMIN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@test.com",
    "customerName": "Juan Pérez",
    "code": "ORD-1234567890-ABC12345",
    "amount": 299.99,
    "products": [
      {
        "title": "iPhone 15",
        "quantity": 1,
        "price": 299.99
      }
    ],
    "purchaser": "usuario@test.com",
    "orderTrackingUrl": "http://localhost:8080/orders/ORD-1234567890-ABC12345"
  }'
```
**Esperado:** Email de confirmación profesional enviado

### **8.6 Mensajería SMS (si Twilio está configurado)**
```bash
# Enviar SMS manual
curl -X POST http://localhost:8000/api/v1/messaging/sms \
  -H "Authorization: Bearer TOKEN_ADMIN" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+5491155555555",
    "body": "Tu orden ORD-123 ha sido creada exitosamente!"
  }'
```
**Esperado:** SMS enviado exitosamente

### **8.7 Mensajería WhatsApp (si Twilio está configurado)**
```bash
# Enviar WhatsApp manual
curl -X POST http://localhost:8000/api/v1/messaging/whatsapp \
  -H "Authorization: Bearer TOKEN_ADMIN" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+5491155555555",
    "body": "¡Gracias por tu compra! Tu orden ORD-123 está siendo procesada."
  }'
```
**Esperado:** Mensaje WhatsApp enviado

### **🔄 Funcionalidades Automáticas**

**Email de Bienvenida Automático:**
- Se envía automáticamente al registrar un nuevo usuario
- No requiere llamada manual

**Confirmación de Compra Automática:**
- Se envía automáticamente al crear una orden desde carrito
- Incluye resumen completo de la compra

**Notificación SMS Automática:**
- Se envía automáticamente al crear orden (si usuario tiene teléfono)
- Solo si Twilio está configurado

---

## ✅ **CHECKLIST DE VERIFICACIÓN COMPLETO**

### **Autenticación:**
- [ ] Registro exitoso + email de bienvenida automático
- [ ] Login exitoso (token obtenido)
- [ ] Acceso autenticado funciona
- [ ] Logout funciona
- [ ] Token invalidado después del logout
- [ ] Acceso sin token bloqueado
- [ ] Rutas de admin bloqueadas para usuarios normales

### **Productos:**
- [ ] Listar productos con paginación
- [ ] Filtros y búsqueda funcionan
- [ ] Crear producto (solo admin)
- [ ] Actualizar producto (solo admin)
- [ ] Eliminar producto (solo admin)

### **Carritos:**
- [ ] Crear carrito vacío
- [ ] Agregar productos al carrito
- [ ] Actualizar cantidades
- [ ] Eliminar productos del carrito
- [ ] Limpiar carrito completo

### **Órdenes:**
- [ ] Compra desde carrito exitosa
- [ ] Email de confirmación automático
- [ ] SMS de notificación automático (si configurado)
- [ ] Listar órdenes del usuario
- [ ] Cambiar estado de orden (admin)
- [ ] Email de cambio de estado automático

### **Mailing:**
- [ ] Verificar estado de configuración
- [ ] Email de bienvenida manual
- [ ] Email de estado de orden
- [ ] Email de recuperación de contraseña
- [ ] Email de confirmación de compra

### **Mensajería:**
- [ ] SMS manual
- [ ] WhatsApp manual
- [ ] Notificaciones automáticas de orden

---

**🌐 Interfaz web:** http://localhost:8000/login
