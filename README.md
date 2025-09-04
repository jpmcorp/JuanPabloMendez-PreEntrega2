# 🛒 E-commerce Backend - PreEntrega 2

## 📋 Descripción
Sistema de e-commerce backend desarrollado con Node.js, Express.js y MongoDB que incluye autenticación JWT, gestión de productos, carritos de compra y WebSockets para actualizaciones en tiempo real.

## 🏗️ Estructura del Proyecto

```js
JuanPabloMendez-PreEntrega2/
├── package.json
├── .env
├── src/
│   ├── app.js
│   ├── websockets.js
│   ├── /config
│   │   └── passport.config.js
│   ├── /middleware
│   │   ├── auth.middleware.js
│   │   ├── authorization.middleware.js
│   │   └── requireAuth.middleware.js
│   ├── /models
│   │   ├── products.model.js
│   │   ├── carts.model.js
│   │   └── users.model.js
│   ├── /manager
│   │   ├── Product.manager.js
│   │   ├── Cart.manager.js
│   │   └── data/
│   │       ├── products.json
│   │       └── carts.json
│   ├── /routes
│   │   ├── products.router.js
│   │   ├── carts.router.js
│   │   ├── sessions.router.js
│   │   └── views.router.js
│   ├── /views
│   │   ├── layouts/
│   │   │   └── main.handlebars
│   │   ├── login.handlebars
│   │   ├── register.handlebars
│   │   ├── realTimeProducts.handlebars
│   │   └── cartView.handlebars
│   └── /public
│       ├── styles.css
│       ├── main.js
│       ├── cartView.js
│       └── iphone.jpg
```

## 🚀 Características Principales

### 🔐 Sistema de Autenticación
- **Registro de usuarios** con validación de datos
- **Login con JWT** (JSON Web Tokens)
- **Middleware de protección** para rutas privadas
- **Roles de usuario** (user/admin)
- **Encriptación de contraseñas** con bcrypt
- **Estrategias de Passport** (Local y JWT)

### 📦 Gestión de Productos
- **CRUD completo** de productos
- **Paginación** y filtros de búsqueda
- **Validación** de permisos por rol
- **Actualización en tiempo real** con WebSockets

### 🛒 Carritos de Compra
- **Creación y gestión** de carritos
- **Agregar/eliminar productos**
- **Protección por usuario** autenticado

### 🌐 Interfaz Web
- **Vistas dinámicas** con Handlebars
- **Formularios de autenticación** responsivos
- **Feedback visual** para acciones del usuario
- **Actualizaciones en tiempo real**

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB

### Autenticación
- **Passport.js** - Middleware de autenticación
- **JSON Web Tokens** - Tokens de acceso
- **bcryptjs** - Encriptación de contraseñas

### Frontend
- **Handlebars** - Motor de plantillas
- **Socket.IO** - WebSockets en tiempo real
- **CSS3** - Estilos responsivos

## 📋 Requisitos Previos

- **Node.js** v16 o superior
- **MongoDB** (local o Atlas)
- **npm** o **yarn**

## ⚙️ Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/jpmcorp/JuanPabloMendez-PreEntrega2.git
cd JuanPabloMendez-PreEntrega2
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
# Crear archivo .env con:
MONGODB_URI=tu_conexion_mongodb
JWT_SECRET=tu_clave_secreta_jwt
```

4. **Iniciar el servidor**
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## 🌐 Endpoints de la API

### 🔐 Autenticación (`/api/sessions`)
| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|---------|
| POST | `/register` | Registro de usuario | Público |
| POST | `/login` | Inicio de sesión | Público |
| GET | `/current` | Usuario actual | Privado |
| POST | `/logout` | Cerrar sesión | Privado |

### 📦 Productos (`/api/products`)
| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|---------|
| GET | `/` | Listar productos | Usuario |
| GET | `/:pid` | Producto por ID | Usuario |
| POST | `/` | Crear producto | Admin |
| PUT | `/:pid` | Actualizar producto | Admin |
| DELETE | `/:pid` | Eliminar producto | Admin |

### 🛒 Carritos (`/api/carts`)
| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|---------|
| GET | `/:cid` | Ver carrito | Usuario |
| POST | `/` | Crear carrito | Usuario |
| POST | `/:cid/product/:pid` | Agregar producto | Usuario |
| DELETE | `/:cid/product/:pid` | Eliminar producto | Usuario |

## 🎨 Vistas Disponibles

| Ruta | Descripción | Acceso |
|------|-------------|---------|
| `/` | Redirección al login | Público |
| `/login` | Formulario de login | Público |
| `/register` | Formulario de registro | Público |
| `/realtimeproducts` | Productos en tiempo real | Privado |
| `/cartView` | Vista del carrito | Privado |

## 🔧 Uso

### 1. **Registro de Usuario**
```bash
POST /api/sessions/register
Content-Type: application/json

{
  "first_name": "Juan",
  "last_name": "Pérez",
  "email": "juan@example.com",
  "age": 25,
  "password": "123456"
}
```

### 2. **Login**
```bash
POST /api/sessions/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "123456"
}
```

### 3. **Verificar Usuario Actual**
```bash
GET /api/sessions/current
# Cookie JWT se incluye automáticamente
```

## 🛡️ Seguridad

- **Contraseñas encriptadas** con bcrypt
- **Tokens JWT** con expiración de 24h
- **Cookies httpOnly** para almacenar tokens
- **Middleware de autenticación** en rutas protegidas
- **Validación de roles** para operaciones administrativas

## 🚦 Estados de Respuesta

| Código | Descripción |
|--------|-------------|
| 200 | Operación exitosa |
| 201 | Recurso creado |
| 400 | Datos inválidos |
| 401 | No autorizado |
| 403 | Sin permisos |
| 404 | Recurso no encontrado |
| 500 | Error del servidor |

## 📝 Modelo de Datos

### Usuario
```javascript
{
  first_name: String (requerido),
  last_name: String (requerido),
  email: String (único, requerido),
  age: Number (requerido),
  password: String (hash, requerido),
  cart: ObjectId (referencia a Cart),
  role: String (default: 'user')
}
```

### Producto
```javascript
{
  title: String,
  description: String,
  code: String,
  price: Number,
  status: Boolean,
  stock: Number,
  category: String,
  thumbnails: [String]
}
```

### Carrito
```javascript
{
  products: [{
    product: ObjectId (referencia a Product),
    quantity: Number
  }]
}
```

## 🧪 Testing

Para probar la aplicación:

1. **Navegador**: http://localhost:8000
2. **Postman/Thunder Client**: Usar endpoints de API
3. **WebSocket**: Conexión automática en las vistas

Consulta `TESTING_GUIDE.md` para ejemplos detallados.

## 👨‍💻 Autor

**Juan Pablo Méndez**
- GitHub: [@jpmcorp](https://github.com/jpmcorp)
- Proyecto: Comisión Coder House

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.

---

## 🔄 Actualizaciones Recientes

- ✅ Sistema completo de autenticación JWT
- ✅ Protección de rutas por middleware
- ✅ Roles de usuario (user/admin)
- ✅ Interfaz mejorada con feedback visual
- ✅ WebSockets para actualizaciones en tiempo real
- ✅ Validaciones y manejo de errores
