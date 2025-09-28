import passport from "passport";
import jwt from "jsonwebtoken";
import { userService } from "../services/user.service.js";
import { toUserResponseDTO } from "../dto/user.dto.js";

export const register = (req, res, next) => {
  passport.authenticate('register', { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({ status: 'error', error: 'Error interno del servidor', message: err });
    }
    if (!user) {
      return res.status(400).json({ status: 'error', error: 'Error en el registro', message: info?.message || 'No se pudo crear el usuario' });
    }
    res.status(201).json({ status: 'success', message: 'Usuario registrado exitosamente', user: toUserResponseDTO(user) });
  })(req, res, next);
};

export const login = (req, res, next) => {
  passport.authenticate('login', { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
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
        user: toUserResponseDTO(user)
      });
    } catch (error) {
      res.status(500).json({ status: 'error', error: 'Error generando token' });
    }
  })(req, res, next);
};

export const current = (req, res, next) => {
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

    res.json({
      status: 'success',
      user: toUserResponseDTO(user)
    });
  })(req, res, next);
};

export const logout = (req, res) => {
  res.clearCookie('jwt');
  res.json({ status: 'success', message: 'Logout exitoso' });
};

export const getUsers = async (req, res) => {
  try {
    const users = await userService.list();
    res.json({ 
      status: 'success', 
      currentUser: {
        id: req.user._id,
        email: req.user.email,
        role: req.user.role
      },
      users 
    });
  } catch (error) {
    res.status(500).json({ status: 'error', error: 'Error obteniendo usuarios' });
  }
};
