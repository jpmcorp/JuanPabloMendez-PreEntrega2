# 🛒 E-commerce Backend - Entrega Final

[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.1.0-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://mongodb.com/)
[![JWT](https://img.shields.io/badge/JWT-Auth-orange.svg)](https://jwt.io/)

## 📋 Descripción

Sistema de e-commerce backend **profesional** desarrollado con **arquitectura en capas**, que incluye:
- ✅ **Autenticación JWT completa**
- ✅ **Sistema de órdenes/tickets**
- ✅ **Arquitectura MVC con servicios**
- ✅ **DTOs y validaciones**
- ✅ **Middleware de autorización avanzado**
- ✅ **WebSockets para tiempo real**

## 🏗️ Arquitectura del Sistema

### 🎯 **Patrón de Capas Implementado**

```
┌─────────────────────────────────────────────────────────────┐
│                    🌐 HTTP REQUESTS                         │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│             📝 CONTROLLERS (HTTP Layer)                     │
│  ├── products.controller.js                                 │
│  ├── carts.controller.js                                    │
│  ├── orders.controller.js                                   │
│  └── sessions.controller.js                                 │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│             🔧 SERVICES (Business Logic Layer)              │
│  ├── product.service.js                                     │
│  ├── cart.service.js                                        │
│  ├── order.service.js                                       │
│  └── user.service.js                                        │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│             🗄️ DAOs (Data Access Layer)                     │
│  ├── base.dao.js (Generic CRUD)                             │
│  ├── product.dao.js                                         │
│  ├── cart.dao.js                                            │
│  ├── order.dao.js                                           │
│  └── user.dao.js                                            │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│             🗃️ MODELS (Database Schema Layer)               │
│  ├── products.model.js                                      │
│  ├── carts.model.js                                         │
│  ├── orders.model.js                                        │
│  └── users.model.js                                         │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                  🍃 MONGODB ATLAS                           │
└─────────────────────────────────────────────────────────────┘
```

### 📁 **Estructura del Proyecto**

```bash
JuanPabloMendez-PreEntrega2/
├── 📄 package.json                   # Dependencias y scripts
├── 📄 .env                          # Variables de entorno
├── 📄 README.md                     # Documentación principal
├── 📄 POSTMAN_TESTING_GUIDE.md      # Guía de testing
│
└── 📁 src/                          # 🎯 CÓDIGO PRINCIPAL
    ├── 📄 app.js                    # Aplicación principal
    ├── 📄 websockets.js             # WebSocket config
    │
    ├── 📁 config/                   # ⚙️ CONFIGURACIONES
    │   ├── environment.config.js    # Variables de entorno
    │   └── passport.config.js       # Autenticación Passport
    │
    ├── 📁 controllers/              # 🎮 CONTROLADORES (HTTP)
    │   ├── products.controller.js   # Gestión de productos
    │   ├── carts.controller.js      # Gestión de carritos
    │   ├── orders.controller.js     # Gestión de órdenes
    │   └── sessions.controller.js   # Autenticación
    │
    ├── 📁 services/                 # 🔧 SERVICIOS (Lógica de Negocio)
    │   ├── product.service.js       # Lógica de productos
    │   ├── cart.service.js          # Lógica de carritos
    │   ├── order.service.js         # Lógica de órdenes
    │   └── user.service.js          # Lógica de usuarios
    │
    ├── 📁 dao/                      # 🗄️ DATA ACCESS OBJECTS
    │   ├── base.dao.js              # CRUD genérico
    │   ├── product.dao.js           # Acceso a datos de productos
    │   ├── cart.dao.js              # Acceso a datos de carritos
    │   ├── order.dao.js             # Acceso a datos de órdenes
    │   └── user.dao.js              # Acceso a datos de usuarios
    │
    ├── 📁 dto/                      # 📝 DATA TRANSFER OBJECTS
    │   ├── product.dto.js           # Validación de productos
    │   ├── cart.dto.js              # Validación de carritos
    │   ├── order.dto.js             # Validación de órdenes
    │   └── user.dto.js              # Validación de usuarios
    │
    ├── 📁 models/                   # 🗃️ ESQUEMAS MONGODB
    │   ├── products.model.js        # Modelo de productos
    │   ├── carts.model.js           # Modelo de carritos
    │   ├── orders.model.js          # Modelo de órdenes
    │   └── users.model.js           # Modelo de usuarios
    │
    ├── 📁 middleware/               # 🛡️ MIDDLEWARES
    │   ├── auth.middleware.js       # Autenticación (bcrypt)
    │   ├── authorization.middleware.js # Autorización básica
    │   ├── policies.middleware.js   # Políticas avanzadas
    │   ├── requireAuth.middleware.js # Auth requerido
    │   └── logger.middleware.js     # Logging personalizado
    │
    ├── 📁 routes/                   # 🛣️ RUTAS
    │   ├── CustomRouter.js          # Router con manejo de errores
    │   ├── products.router.js       # Endpoints de productos
    │   ├── carts.router.js          # Endpoints de carritos
    │   ├── orders.router.js         # Endpoints de órdenes
    │   ├── sessions.router.js       # Endpoints de auth
    │   └── views.router.js          # Vistas web
    │
    ├── 📁 views/                    # 👁️ VISTAS HANDLEBARS
    │   ├── login.handlebars         # Formulario de login
    │   ├── register.handlebars      # Formulario de registro
    │   ├── cartView.handlebars      # Vista del carrito
    │   ├── realTimeProducts.handlebars # Productos tiempo real
    │   └── layouts/main.handlebars  # Layout principal
    │
    ├── 📁 public/                   # 🌐 ARCHIVOS ESTÁTICOS
    │   ├── main.js                  # JavaScript principal
    │   ├── cartView.js              # JavaScript del carrito
    │   ├── styles.css               # Estilos CSS
    │   └── iphone.jpg               # Imagen de ejemplo
    │
    └── 📁 utils/                    # 🛠️ UTILIDADES
        └── endpoints.util.js        # Documentación de endpoints
```

## 🚀 Características Principales

### 🔐 **Sistema de Autenticación Completo**
- ✅ **Registro de usuarios** con validación robusta
- ✅ **Login con JWT** (JSON Web Tokens)
- ✅ **Middleware de protección** para rutas privadas
- ✅ **Roles de usuario** (user/admin) con autorización granular
- ✅ **Encriptación de contraseñas** con bcrypt
- ✅ **Estrategias de Passport** (Local y JWT)
- ✅ **Políticas de autorización avanzadas** (ownership, combinaciones lógicas)

### 📦 **Gestión de Productos Avanzada**
- ✅ **CRUD completo** con arquitectura en capas
- ✅ **Paginación avanzada** y filtros múltiples
- ✅ **Validación de permisos** por rol (admin/user)
- ✅ **DTOs para validación** de datos de entrada/salida
- ✅ **Actualización en tiempo real** con WebSockets
- ✅ **Control de stock** automático

### 🛒 **Sistema de Carritos Inteligente**
- ✅ **Creación y gestión** de carritos por usuario
- ✅ **Agregar/eliminar/actualizar** productos y cantidades
- ✅ **Validación de stock** antes de agregar
- ✅ **Limpieza automática** después de compra
- ✅ **Protección por usuario** autenticado

### 🎫 **Sistema de Órdenes/Tickets Completo**
- ✅ **Compra desde carrito** con validación de stock
- ✅ **Generación de códigos únicos** para cada orden
- ✅ **Actualización automática de stock** al comprar
- ✅ **Estados de orden** (pending, paid, delivered, cancelled)
- ✅ **Gestión de órdenes por usuario** y admin
- ✅ **Cálculo automático de totales**
- ✅ **Paginación y filtros** de órdenes

### 📧 **Sistema de Mailing y Mensajería Integral**
- ✅ **Envío de emails automático** con Nodemailer
- ✅ **Plantillas HTML profesionales** con Handlebars
- ✅ **Email de bienvenida** al registrar usuario
- ✅ **Confirmación de compra** automática
- ✅ **Notificaciones de cambio de estado** de órdenes
- ✅ **Recuperación de contraseña** por email
- ✅ **SMS y WhatsApp** con integración Twilio
- ✅ **Notificaciones móviles** de órdenes por SMS
- ✅ **Configuración flexible** SMTP y servicios de email

### 🌐 **Interfaz Web Moderna**
- ✅ **Vistas dinámicas** con Handlebars
- ✅ **Formularios responsivos** de autenticación
- ✅ **Feedback visual** para acciones del usuario
- ✅ **Actualizaciones en tiempo real** con Socket.IO
- ✅ **Vista de carrito** interactiva

### ⚡ **Arquitectura Profesional**
- ✅ **Patrón Repository** con DAOs
- ✅ **DTOs para validación** y transformación
- ✅ **Servicios para lógica de negocio**
- ✅ **Controladores ligeros** (solo HTTP)
- ✅ **Middleware avanzado** de autorización
- ✅ **Router personalizado** con manejo de errores
- ✅ **Separación de responsabilidades** clara

## 🛠️ Stack Tecnológico

### 🔧 **Backend Core**
- **Node.js v16+** - Runtime de JavaScript
- **Express.js v5.1.0** - Framework web minimalista
- **MongoDB Atlas** - Base de datos NoSQL en la nube
- **Mongoose v8.14.2** - ODM para MongoDB con validaciones

### 🔐 **Autenticación & Seguridad**
- **Passport.js v0.7.0** - Middleware de autenticación
- **JSON Web Tokens v9.0.2** - Tokens de acceso seguros
- **bcryptjs v2.4.3** - Hash de contraseñas
- **cookie-parser v1.4.6** - Manejo de cookies

### 🏗️ **Arquitectura & Patrones**
- **Repository Pattern** - DAOs para acceso a datos
- **DTO Pattern** - Validación y transformación de datos
- **Service Layer** - Lógica de negocio centralizada
- **MVC Pattern** - Separación de responsabilidades
- **Middleware Chain** - Autorización por capas

### 🌐 **Frontend & UI**
- **Handlebars v8.0.3** - Motor de plantillas
- **Socket.IO v4.8.1** - WebSockets en tiempo real
- **CSS3** - Estilos responsivos modernos
- **Vanilla JavaScript** - Interactividad del cliente

### 📦 **Utilidades & Herramientas**
- **UUID v13.0.0** - Generación de IDs únicos
- **Winston v3.17.0** - Sistema de logging profesional
- **Nodemailer v7.0.6** - Envío de emails
- **Mongoose Paginate v2 v1.9.0** - Paginación avanzada
- **dotenv v16.5.0** - Variables de entorno

### 🧪 **Desarrollo & Testing**
- **Nodemon v3.1.10** - Desarrollo con auto-reload
- **ESModules** - Sistema de módulos moderno
- **Express Session v1.18.2** - Manejo de sesiones
- **Connect Mongo v5.1.0** - Almacenamiento de sesiones

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

## 🌐 API Endpoints Completa

### 🔐 **Autenticación** (`/api/sessions`)
| Método | Endpoint | Descripción | Acceso | Respuesta |
|--------|----------|-------------|---------|-----------|
| `POST` | `/register` | Registro de usuario | 🌐 Público | Usuario + JWT |
| `POST` | `/login` | Inicio de sesión | 🌐 Público | JWT Token |
| `GET` | `/current` | Usuario actual | 🔒 Privado | Datos usuario |
| `GET` | `/users` | Listar usuarios | 🔒 Dev/Admin | Lista usuarios |
| `POST` | `/logout` | Cerrar sesión | 🔒 Privado | Confirmación |

### 📦 **Productos** (`/api/products`)
| Método | Endpoint | Descripción | Acceso | Características |
|--------|----------|-------------|---------|-----------------|
| `GET` | `/` | Listar productos | 👤 Usuario | Paginación, filtros, búsqueda |
| `GET` | `/:pid` | Producto por ID | 👤 Usuario | Detalles completos |
| `POST` | `/` | Crear producto | 👑 Admin | Validación DTO |
| `PUT` | `/:pid` | Actualizar producto | 👑 Admin | Validación DTO |
| `DELETE` | `/:pid` | Eliminar producto | 👑 Admin | Soft/Hard delete |

**Parámetros de consulta disponibles:**
- `?limit=10` - Límite de resultados
- `?page=1` - Número de página  
- `?sort=asc|desc` - Ordenar por precio
- `?category=value` - Filtrar por categoría
- `?status=true` - Filtrar por estado
- `?query=search` - Búsqueda de texto

### 🛒 **Carritos** (`/api/carts`)
| Método | Endpoint | Descripción | Acceso | Características |
|--------|----------|-------------|---------|-----------------|
| `GET` | `/:cid` | Ver carrito | 👤 Usuario | Populate productos |
| `POST` | `/` | Crear carrito | 👤 Usuario | Carrito vacío |
| `POST` | `/:cid/product/:pid` | Agregar producto | 👤 Usuario | Validación stock |
| `PUT` | `/:cid/product/:pid` | Actualizar cantidad | 👤 Usuario | Validación stock |
| `DELETE` | `/:cid/product/:pid` | Eliminar producto | 👤 Usuario | Confirmación |
| `PUT` | `/:cid` | Actualizar carrito completo | 👤 Usuario | Múltiples productos |
| `DELETE` | `/:cid` | Limpiar carrito | 👤 Usuario | Vaciar carrito |

### 🎫 **Órdenes/Tickets** (`/api/orders`) ⭐ **NUEVO**
| Método | Endpoint | Descripción | Acceso | Características |
|--------|----------|-------------|---------|-----------------|
| `GET` | `/` | Listar órdenes | 👤 Usuario/👑 Admin | Paginación + filtros |
| `GET` | `/my` | Mis órdenes | 👤 Usuario | Solo del usuario actual |
| `GET` | `/:id` | Orden por ID | 👤 Usuario/👑 Admin | Autorización por propiedad |
| `GET` | `/code/:code` | Orden por código | 👤 Usuario/👑 Admin | Búsqueda por código único |
| `POST` | `/purchase` | **Comprar desde carrito** | 👤 Usuario | ⚡ Procesamiento completo |
| `POST` | `/` | Crear orden manual | 👤 Usuario | Orden personalizada |
| `PUT` | `/:id` | Actualizar orden | 👑 Admin | Solo administradores |
| `PATCH` | `/:id/status` | Cambiar estado | 👑 Admin | Estados: pending, paid, delivered, cancelled |
| `DELETE` | `/:id` | Eliminar orden | 👑 Admin | Solo administradores |

**Estados de orden disponibles:**
- `pending` - Pendiente de pago
- `paid` - Pagada
- `delivered` - Entregada
- `cancelled` - Cancelada

### 📧 **Mailing** (`/api/v1/mailer`) ⭐ **NUEVO**
| Método | Endpoint | Descripción | Acceso | Características |
|--------|----------|-------------|---------|-----------------|
| `POST` | `/welcome` | Email de bienvenida | 👤 Usuario | Plantilla personalizada |
| `POST` | `/order-status` | Notificación de orden | 👑 Admin | Estado de compra |
| `POST` | `/password-reset` | Recuperar contraseña | 🌐 Público | Token seguro |
| `POST` | `/purchase-confirmation` | Confirmación de compra | 👑 Admin | Resumen completo |
| `GET` | `/status` | Estado del servicio | 👑 Admin | Configuración SMTP |

### 📱 **Mensajería** (`/api/v1/messaging`) ⭐ **NUEVO**
| Método | Endpoint | Descripción | Acceso | Características |
|--------|----------|-------------|---------|-----------------|
| `POST` | `/sms` | Enviar SMS | 👑 Admin | Integración Twilio |
| `POST` | `/whatsapp` | Enviar WhatsApp | 👑 Admin | Mensajes empresariales |
| `POST` | `/order-notification` | Notificación de orden SMS | 👑 Admin | Automático en compras |

**Funcionalidades automáticas de mailing:**
- ✅ **Email de bienvenida** al registrar usuario
- ✅ **Confirmación de compra** automática al crear orden
- ✅ **Notificación de cambio de estado** de órdenes
- ✅ **SMS de notificación** de órdenes (si está configurado)

## 🚀 Instalación y Configuración

### 📋 **Requisitos Previos**
- **Node.js** v16 o superior
- **MongoDB Atlas** (cuenta gratuita)
- **npm** o **yarn**
- **Git** para clonar el repositorio

### 🛠️ **Pasos de Instalación**

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
# Crear archivo .env en la raíz del proyecto
cp .env.example .env
```

**Contenido del archivo `.env`:**
```env
# Configuración del servidor
PORT=8000
NODE_ENV=development

# Base de datos MongoDB Atlas
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/ecommerce

# JWT Configuration
JWT_SECRET=tu_clave_secreta_muy_segura_aqui
JWT_EXPIRES_IN=24h

# Configuración de cookies
COOKIE_SECRET=tu_clave_para_cookies_aqui

# 📧 Email Configuration (Nodemailer)
MAIL_SERVICE=gmail
MAIL_USER=tu_email@gmail.com
MAIL_PASSWORD=tu_password_de_aplicacion
MAIL_FROM=tu_email@gmail.com

# Configuración SMTP alternativa (opcional)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_SECURE=false

# 📱 Twilio Configuration (SMS/WhatsApp)
TWILIO_ACCOUNT_SID=tu_twilio_account_sid
TWILIO_AUTH_TOKEN=tu_twilio_auth_token
TWILIO_FROM_SMS=+1234567890
TWILIO_FROM_WHATSAPP=whatsapp:+1234567890

# 🌐 Platform URL
PLATFORM_URL=http://localhost:8080
```

4. **Iniciar el servidor**
```bash
# Desarrollo (con auto-reload)
npm run dev

# Producción
npm start
```

5. **Verificar la instalación**
- Servidor: `http://localhost:8000`
- API: `http://localhost:8000/api/products`
- Interface Web: `http://localhost:8000/login`

## 🎨 **Vistas Web Disponibles**

| Ruta | Descripción | Acceso | Características |
|------|-------------|---------|-----------------|
| `/` | Página principal | 🌐 Público | Redirección a login |
| `/login` | Formulario de login | 🌐 Público | Autenticación JWT |
| `/register` | Formulario de registro | 🌐 Público | Validación client/server |
| `/realtimeproducts` | Productos tiempo real | 👤 Usuario | WebSockets + CRUD |
| `/cartView` | Vista del carrito | 👤 Usuario | Gestión interactiva |

## 🔐 **Sistema de Autorización Avanzado**

### **Roles y Permisos**
- 🌐 **Público**: Registro y login únicamente
- 👤 **Usuario**: Ver productos, gestionar carrito, crear órdenes
- 👑 **Admin**: CRUD productos, gestionar todas las órdenes

### **Middleware de Autorización**
```javascript
// Ejemplos de uso
router.get('/products', requireAuth, getProducts);                    // Solo usuarios autenticados
router.post('/products', requireAuth, requireRole('admin'), createProduct);  // Solo admins
router.get('/orders/:id', requireAuth, checkOwnership, getOrder);     // Solo propietario o admin
```

### **Políticas Avanzadas**
- ✅ **Verificación de propiedad** de recursos
- ✅ **Combinaciones lógicas** (anyOf, allOf)  
- ✅ **Inyección automática** de recursos
- ✅ **Mensajes de error** descriptivos

## 📊 **Ejemplos de Uso de la API**

### **1. Registro de Usuario**
```bash
curl -X POST http://localhost:8000/api/sessions/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Juan",
    "last_name": "Pérez", 
    "email": "juan@email.com",
    "age": 25,
    "password": "123456"
  }'
```

### **2. Login y Obtener Token**
```bash
curl -X POST http://localhost:8000/api/sessions/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@email.com",
    "password": "123456"
  }'
```

### **3. Crear Producto (Admin)**
```bash
curl -X POST http://localhost:8000/api/products \
  -H "Authorization: Bearer TU_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "iPhone 15",
    "description": "Último modelo de iPhone",
    "code": "IP15-001",
    "price": 999,
    "stock": 50,
    "category": "smartphones"
  }'
```

### **4. Agregar Producto al Carrito**
```bash
curl -X POST http://localhost:8000/api/carts/CART_ID/product/PRODUCT_ID \
  -H "Authorization: Bearer TU_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"quantity": 2}'
```

### **5. Realizar Compra (Crear Orden)**
```bash
curl -X POST http://localhost:8000/api/orders/purchase \
  -H "Authorization: Bearer TU_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"cartId": "CART_ID"}'
```

## 📝 **Modelos de Datos**

### **👤 Usuario**
```javascript
{
  _id: ObjectId,
  first_name: String (requerido),
  last_name: String (requerido), 
  email: String (único, requerido),
  age: Number (requerido),
  password: String (hash bcrypt),
  cart: ObjectId (ref: Cart),
  role: String (enum: ['user', 'admin'], default: 'user'),
  createdAt: Date,
  updatedAt: Date
}
```

### **📦 Producto**
```javascript
{
  _id: ObjectId,
  title: String (requerido),
  description: String (requerido),
  code: String (único, requerido),
  price: Number (requerido, min: 0),
  status: Boolean (default: true),
  stock: Number (requerido, min: 0),
  category: String (requerido),
  thumbnails: [String] (URLs de imágenes),
  createdAt: Date,
  updatedAt: Date
}
```

### **🛒 Carrito**
```javascript
{
  _id: ObjectId,
  products: [{
    _id: ObjectId (ref: Product),
    pid: Number (ID personalizado),
    quantity: Number (min: 1)
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### **🎫 Orden/Ticket** ⭐ **NUEVO**
```javascript
{
  _id: ObjectId,
  code: String (único, ej: "ORD-1234567890-ABC123"),
  buyerName: String (nombre completo),
  buyerEmail: String,
  buyerId: ObjectId (ref: User),
  items: [{
    productId: ObjectId (ref: Product),
    title: String,
    qty: Number,
    unitPrice: Number
  }],
  total: Number (calculado automáticamente),
  status: String (enum: ['pending', 'paid', 'delivered', 'cancelled']),
  createdAt: Date,
  updatedAt: Date
}
```

## 🚦 **Códigos de Estado HTTP**

| Código | Descripción | Cuándo se usa |
|--------|-------------|---------------|
| `200` | ✅ OK | Operación exitosa |
| `201` | ✅ Created | Recurso creado exitosamente |
| `400` | ❌ Bad Request | Datos inválidos o faltantes |
| `401` | 🔒 Unauthorized | Token inválido o faltante |
| `403` | 🚫 Forbidden | Sin permisos para la operación |
| `404` | 🔍 Not Found | Recurso no encontrado |
| `409` | ⚡ Conflict | Conflicto (ej: email duplicado) |
| `500` | 💥 Internal Server Error | Error interno del servidor |

## 🧪 **Testing**

### **Herramientas Recomendadas**
- **Postman** - Para testing manual de API
- **Thunder Client (VSCode)** - Cliente HTTP integrado
- **curl** - Línea de comandos

### **Colección de Postman**
📄 Ver archivo: `POSTMAN_TESTING_GUIDE.md`

### **Flujo de Testing Recomendado**
1. ✅ Registrar usuario
2. ✅ Hacer login (obtener JWT)
3. ✅ Crear productos (admin)
4. ✅ Agregar productos al carrito
5. ✅ Realizar compra (crear orden)
6. ✅ Verificar orden creada

## 📚 **Documentación Adicional**

- 🧪 **[Guía de Testing](POSTMAN_TESTING_GUIDE.md)** - Testing con Postman

## 🤝 **Contribución**

Este proyecto fue desarrollado como parte del curso de **Backend en Coderhouse**.

### **Autor**
👨‍💻 **Juan Pablo Méndez**
- GitHub: [@jpmcorp](https://github.com/jpmcorp)
- Email: juan.pablo@email.com

---

⭐ **¡Gracias por revisar este proyecto!** Si tienes preguntas o sugerencias, no dudes en abrir un issue.

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
