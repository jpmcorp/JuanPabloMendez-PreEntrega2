import passport from "passport";

export const authenticateJWT = passport.authenticate('jwt', { session: false });

export const authorizeRole = (roles) => {
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
