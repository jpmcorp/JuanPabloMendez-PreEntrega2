import { config } from "../config/environment.config.js";

export const showEndpoints = (compact = false) => {
  const baseUrl = `http://localhost:${config.server.port}`;
  
  if (compact) {
    console.log(`\n🚀 Servidor iniciado: ${baseUrl}`);
    console.log(`📋 Endpoints: Authentication(4) | Products(5) | Carts(4) | Views(5)`);
    console.log(`📄 Documentación: README.md | TESTING_GUIDE.md`);
    console.log(`🌐 Inicio: ${baseUrl}/login\n`);
    return;
  }
  
  console.log('\n🌐 ===== ENDPOINTS DISPONIBLES =====');
  
  console.log('\n🔐 AUTENTICACIÓN (/api/sessions):');
  console.log(`   POST   ${baseUrl}/api/sessions/register    - Registro de usuario`);
  console.log(`   POST   ${baseUrl}/api/sessions/login       - Iniciar sesión`);
  console.log(`   GET    ${baseUrl}/api/sessions/current     - Usuario actual (🔒 Privado)`);
  console.log(`   POST   ${baseUrl}/api/sessions/logout      - Cerrar sesión`);
  
  console.log('\n📦 PRODUCTOS (/api/products):');
  console.log(`   GET    ${baseUrl}/api/products             - Listar productos (🔒 Usuario)`);
  console.log(`   GET    ${baseUrl}/api/products/:pid        - Producto por ID (🔒 Usuario)`);
  console.log(`   POST   ${baseUrl}/api/products             - Crear producto (🔒 Admin)`);
  console.log(`   PUT    ${baseUrl}/api/products/:pid        - Actualizar producto (🔒 Admin)`);
  console.log(`   DELETE ${baseUrl}/api/products/:pid        - Eliminar producto (🔒 Admin)`);
  
  console.log('\n🛒 CARRITOS (/api/carts):');
  console.log(`   GET    ${baseUrl}/api/carts/:cid           - Ver carrito (🔒 Usuario)`);
  console.log(`   POST   ${baseUrl}/api/carts                - Crear carrito (🔒 Usuario)`);
  console.log(`   POST   ${baseUrl}/api/carts/:cid/product/:pid - Agregar producto (🔒 Usuario)`);
  console.log(`   DELETE ${baseUrl}/api/carts/:cid/product/:pid - Eliminar producto (🔒 Usuario)`);
  
  console.log('\n🎨 VISTAS WEB:');
  console.log(`   GET    ${baseUrl}/                         - Página principal (→ login)`);
  console.log(`   GET    ${baseUrl}/login                    - Formulario de login`);
  console.log(`   GET    ${baseUrl}/register                 - Formulario de registro`);
  console.log(`   GET    ${baseUrl}/realtimeproducts         - Productos tiempo real (🔒 Usuario)`);
  console.log(`   GET    ${baseUrl}/cartView                 - Vista del carrito (🔒 Usuario)`);
  
  console.log('\n📊 PARÁMETROS DE CONSULTA PRODUCTOS:');
  console.log(`   ?limit=10          - Límite de resultados (default: 10)`);
  console.log(`   ?page=1            - Página (default: 1)`);
  console.log(`   ?sort=asc|desc     - Ordenar por precio`);
  console.log(`   ?category=value    - Filtrar por categoría`);
  console.log(`   ?status=true       - Filtrar por estado`);
  console.log(`   ?query=search      - Búsqueda de texto`);
  
  console.log('\n🔑 ROLES DE USUARIO:');
  console.log(`   👤 user     - Puede ver productos y gestionar su carrito`);
  console.log(`   👑 admin    - Puede gestionar productos (CRUD completo)`);
  
  console.log('\n📝 EJEMPLO DE USO:');
  console.log(`   1. Registrarse: POST ${baseUrl}/api/sessions/register`);
  console.log(`   2. Hacer login: POST ${baseUrl}/api/sessions/login`);
  console.log(`   3. Ver productos: GET ${baseUrl}/api/products`);
  console.log(`   4. Ver perfil: GET ${baseUrl}/api/sessions/current`);
  
  console.log('\n🧪 TESTING:');
  console.log(`   📄 Documentación completa: README.md`);
  console.log(`   🔬 Guía de pruebas: TESTING_GUIDE.md`);
  console.log(`   🌐 Navegador: ${baseUrl}`);
  
  console.log('\n' + '='.repeat(50));
  console.log(`🚀 Servidor iniciado en: ${baseUrl}`);
  console.log(`📅 ${new Date().toLocaleString()}`);
  console.log('='.repeat(50) + '\n');
};

export const showEndpointsTable = () => {
  const baseUrl = `http://localhost:${config.server.port}`;
  
  console.log('\n📋 TABLA DE ENDPOINTS:');
  console.log('┌─────────┬───────────────────────────────────────┬─────────────────────┬─────────┐');
  console.log('│ MÉTODO  │ ENDPOINT                              │ DESCRIPCIÓN         │ ACCESO  │');
  console.log('├─────────┼───────────────────────────────────────┼─────────────────────┼─────────┤');
  console.log('│ POST    │ /api/sessions/register                │ Registro usuario    │ Público │');
  console.log('│ POST    │ /api/sessions/login                   │ Iniciar sesión      │ Público │');
  console.log('│ GET     │ /api/sessions/current                 │ Usuario actual      │ Privado │');
  console.log('│ POST    │ /api/sessions/logout                  │ Cerrar sesión       │ Privado │');
  console.log('├─────────┼───────────────────────────────────────┼─────────────────────┼─────────┤');
  console.log('│ GET     │ /api/products                         │ Listar productos    │ Usuario │');
  console.log('│ GET     │ /api/products/:pid                    │ Producto por ID     │ Usuario │');
  console.log('│ POST    │ /api/products                         │ Crear producto      │ Admin   │');
  console.log('│ PUT     │ /api/products/:pid                    │ Actualizar producto │ Admin   │');
  console.log('│ DELETE  │ /api/products/:pid                    │ Eliminar producto   │ Admin   │');
  console.log('├─────────┼───────────────────────────────────────┼─────────────────────┼─────────┤');
  console.log('│ GET     │ /api/carts/:cid                       │ Ver carrito         │ Usuario │');
  console.log('│ POST    │ /api/carts                            │ Crear carrito       │ Usuario │');
  console.log('│ POST    │ /api/carts/:cid/product/:pid          │ Agregar producto    │ Usuario │');
  console.log('│ DELETE  │ /api/carts/:cid/product/:pid          │ Eliminar producto   │ Usuario │');
  console.log('└─────────┴───────────────────────────────────────┴─────────────────────┴─────────┘');
  console.log(`\n🌐 Base URL: ${baseUrl}`);
  console.log(`📱 Web App: ${baseUrl}/login\n`);
};
