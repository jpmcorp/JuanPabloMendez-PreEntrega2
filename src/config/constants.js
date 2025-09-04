export const AUTH_MESSAGES = {
  REQUIRED_FIELDS: 'Todos los campos son requeridos',
  INVALID_AGE: 'La edad debe estar entre 13 y 120 años',
  WEAK_PASSWORD: 'La contraseña debe tener al menos 6 caracteres',
  EMAIL_EXISTS: 'El email ya está registrado',
  USER_NOT_FOUND: 'Usuario no encontrado',
  INVALID_CREDENTIALS: 'Email o contraseña incorrectos',
  REGISTRATION_SUCCESS: 'Usuario registrado exitosamente',
  LOGIN_SUCCESS: 'Login exitoso',
  LOGOUT_SUCCESS: 'Logout exitoso',
  UNAUTHORIZED: 'No autorizado',
  INSUFFICIENT_PERMISSIONS: 'Sin permisos suficientes',
  TOKEN_INVALID: 'Token inválido o inexistente',
  INTERNAL_ERROR: 'Error interno del servidor'
};

export const PRODUCT_MESSAGES = {
  NOT_FOUND: 'Producto no encontrado',
  CREATED_SUCCESS: 'Producto creado exitosamente',
  UPDATED_SUCCESS: 'Producto actualizado exitosamente',
  DELETED_SUCCESS: 'Producto eliminado exitosamente',
  INVALID_ID: 'ID de producto inválido'
};

export const CART_MESSAGES = {
  NOT_FOUND: 'Carrito no encontrado',
  CREATED_SUCCESS: 'Carrito creado exitosamente',
  PRODUCT_ADDED: 'Producto agregado al carrito',
  PRODUCT_REMOVED: 'Producto eliminado del carrito',
  INVALID_ID: 'ID de carrito inválido'
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};
