# 🔐 Guía de Pruebas del Sistema de Autenticación

## 📋 URLs Disponibles:
- **Página Principal**: http://localhost:8000/ (redirige a login)
- **Login**: http://localhost:8000/login
- **Registro**: http://localhost:8000/register
- **Productos**: http://localhost:8000/realtimeproducts

## 🧪 Pruebas a Realizar:

### 1. **Prueba de Registro de Usuario**
**URL**: http://localhost:8000/register

**Datos de prueba**:
```json
{
  "first_name": "Juan",
  "last_name": "Pérez",
  "email": "juan.perez@test.com",
  "age": 25,
  "password": "123456"
}
```

### 2. **Prueba de Login**
**URL**: http://localhost:8000/login

**Datos de prueba**:
```json
{
  "email": "juan.perez@test.com",
  "password": "123456"
}
```

### 3. **Pruebas de API con Postman/Thunder Client**

#### **A. Registro via API**
```
POST http://localhost:8000/api/sessions/register
Content-Type: application/json

{
  "first_name": "María",
  "last_name": "García",
  "email": "maria.garcia@test.com",
  "age": 30,
  "password": "password123"
}
```

#### **B. Login via API**
```
POST http://localhost:8000/api/sessions/login
Content-Type: application/json

{
  "email": "maria.garcia@test.com",
  "password": "password123"
}
```

#### **C. Verificar Usuario Actual (Current)**
```
GET http://localhost:8000/api/sessions/current
```
*Nota: Debe incluir la cookie JWT del login*

#### **D. Logout**
```
POST http://localhost:8000/api/sessions/logout
```

### 4. **Pruebas de Validación**

#### **A. Login con credenciales incorrectas**
```
POST http://localhost:8000/api/sessions/login
Content-Type: application/json

{
  "email": "usuario@inexistente.com",
  "password": "wrong_password"
}
```

#### **B. Acceso sin token**
```
GET http://localhost:8000/api/sessions/current
```
*Sin cookies JWT*

#### **C. Registro con email duplicado**
Intenta registrar el mismo email dos veces.

## 🎯 Resultados Esperados:

### ✅ **Registro Exitoso:**
```json
{
  "status": "success",
  "message": "Usuario registrado exitosamente"
}
```

### ✅ **Login Exitoso:**
```json
{
  "status": "success",
  "message": "Login exitoso",
  "user": {
    "id": "...",
    "first_name": "...",
    "last_name": "...",
    "email": "...",
    "age": ...,
    "role": "user"
  }
}
```

### ✅ **Current User:**
```json
{
  "status": "success",
  "user": {
    "id": "...",
    "first_name": "...",
    "last_name": "...",
    "email": "...",
    "age": ...,
    "role": "user",
    "cart": null
  }
}
```

### ❌ **Token Inválido:**
```json
{
  "status": "error",
  "error": "Token inválido o inexistente",
  "message": "No autorizado"
}
```

## 🔧 **Herramientas de Prueba Recomendadas:**
1. **Navegador**: Para probar las vistas de login/register
2. **Postman**: Para probar las APIs
3. **Thunder Client** (VS Code): Extensión para probar APIs
4. **cURL**: Para pruebas desde terminal

## 📝 **Comandos cURL de Ejemplo:**

### Registro:
```bash
curl -X POST http://localhost:8000/api/sessions/register \
  -H "Content-Type: application/json" \
  -d '{"first_name":"Test","last_name":"User","email":"test@example.com","age":25,"password":"123456"}'
```

### Login:
```bash
curl -X POST http://localhost:8000/api/sessions/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email":"test@example.com","password":"123456"}'
```

### Current:
```bash
curl -X GET http://localhost:8000/api/sessions/current \
  -b cookies.txt
```
