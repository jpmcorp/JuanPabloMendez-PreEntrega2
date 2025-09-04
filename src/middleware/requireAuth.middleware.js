import passport from "passport";

export const requireAuth = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
    }
    
    if (!user) {
      // Si es una petición AJAX/API, devolver JSON
      if (req.headers.accept && req.headers.accept.includes('application/json')) {
        return res.status(401).json({ 
          status: 'error', 
          error: 'No autorizado',
          message: 'Debes iniciar sesión para acceder a este recurso'
        });
      }
      
      // Si es una petición de vista, redirigir al login
      return res.redirect('/login');
    }
    
    req.user = user;
    next();
  })(req, res, next);
};

export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ status: 'error', message: 'No autorizado' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ status: 'error', message: 'Sin permisos suficientes' });
    }
    
    next();
  };
};
