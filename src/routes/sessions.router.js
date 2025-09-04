import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { User } from "../models/users.model.js";
import { requireAuth, requireRole } from "../middleware/requireAuth.middleware.js";

const router = Router();

router.post('/register', (req, res, next) => {
  passport.authenticate('register', { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({ 
        status: 'error', 
        error: 'Error interno del servidor',
        message: err 
      });
    }
    
    if (!user) {
      return res.status(400).json({ 
        status: 'error', 
        error: 'Error en el registro',
        message: info?.message || 'No se pudo crear el usuario'
      });
    }
    
    res.status(201).json({ 
      status: 'success', 
      message: 'Usuario registrado exitosamente',
      user: {
        id: user._id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name
      }
    });
  })(req, res, next);
});

router.post('/login', (req, res, next) => {
  passport.authenticate('login', { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({ 
        status: 'error', 
        error: 'Error interno del servidor' 
      });
    }
    
    if (!user) {
      return res.status(401).json({ 
        status: 'error', 
        error: 'Credenciales inválidas',
        message: info?.message || 'Email o contraseña incorrectos'
      });
    }
    
    try {
      const token = jwt.sign(
        { sub: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000
      });

      res.json({
        status: 'success',
        message: 'Login exitoso',
        user: {
          id: user._id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          age: user.age,
          role: user.role
        }
      });
    } catch (error) {
      res.status(500).json({ status: 'error', error: 'Error generando token' });
    }
  })(req, res, next);
});

router.get('/current', (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
    }
    
    if (!user) {
      return res.status(401).json({ 
        status: 'error', 
        error: 'Token inválido o inexistente',
        message: info ? info.message : 'No autorizado'
      });
    }
    
    try {
      const userData = {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: user.age,
        role: user.role,
        cart: user.cart
      };
      
      res.json({
        status: 'success',
        user: userData
      });
    } catch (error) {
      res.status(500).json({ status: 'error', error: error.message });
    }
  })(req, res, next);
});

// Obtener todos los usuarios (solo administradores en producción, cualquier usuario en desarrollo)
router.get('/users', requireAuth, (req, res, next) => {
  // En entorno de desarrollo, cualquier usuario autenticado puede acceder
  // En producción, solo administradores
  if (process.env.NODE_ENV === 'production' && req.user.role !== 'admin') {
    return res.status(403).json({ 
      status: 'error', 
      message: 'Sin permisos suficientes. Solo administradores pueden acceder a esta información.' 
    });
  }
  
  next();
}, async (req, res) => {
  try {
    const users = await User.find({}, {
      password: 0  // Excluir la contraseña del resultado
    }).sort({ createdAt: -1 });

    const environmentInfo = process.env.NODE_ENV === 'development' 
      ? ' (acceso de desarrollo habilitado)' 
      : '';

    res.json({
      status: 'success',
      message: `Se encontraron ${users.length} usuarios${environmentInfo}`,
      environment: process.env.NODE_ENV || 'development',
      requester: {
        id: req.user._id,
        email: req.user.email,
        role: req.user.role
      },
      users: users.map(user => ({
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: user.age,
        role: user.role,
        cart: user.cart,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }))
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      error: 'Error al obtener usuarios',
      message: error.message 
    });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('jwt');
  res.json({ status: 'success', message: 'Logout exitoso' });
});

export default router;
