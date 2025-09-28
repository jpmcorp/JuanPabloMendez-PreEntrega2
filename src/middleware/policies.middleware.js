// Middleware de autorización por roles más flexible
export const policies = (...roles) => (req, res, next) => {
    // Verificar que el usuario esté autenticado
    if (!req.user) {
        return res.status(401).json({ 
            error: 'Usuario no autenticado',
            code: 'UNAUTHORIZED' 
        });
    }
    
    // Verificar que el usuario tenga uno de los roles permitidos
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ 
            error: 'No tienes permisos para acceder a este recurso',
            code: 'FORBIDDEN',
            requiredRoles: roles,
            userRole: req.user.role
        });
    }
    
    next();
};

// Middleware para verificar propiedad de recursos
export const checkOwnership = (resourceField = 'userId') => (req, res, next) => {
    return async (req, res, next) => {
        try {
            // Si es admin, puede acceder a cualquier recurso
            if (req.user.role === 'admin') {
                return next();
            }
            
            // Obtener el recurso usando el servicio correspondiente
            const resourceId = req.params.id;
            const resource = req.resource; // El resource debe ser inyectado previamente
            
            if (!resource) {
                return res.status(404).json({ 
                    error: 'Recurso no encontrado',
                    code: 'NOT_FOUND' 
                });
            }
            
            // Verificar propiedad
            if (resource[resourceField].toString() !== req.user._id.toString()) {
                return res.status(403).json({ 
                    error: 'No tienes permisos para acceder a este recurso',
                    code: 'FORBIDDEN' 
                });
            }
            
            next();
        } catch (error) {
            res.status(500).json({ 
                error: 'Error verificando permisos',
                code: 'INTERNAL_ERROR' 
            });
        }
    };
};

// Middleware para inyectar recursos
export const injectResource = (service, idParam = 'id') => async (req, res, next) => {
    try {
        const resourceId = req.params[idParam];
        const resource = await service.get(resourceId);
        
        if (!resource) {
            return res.status(404).json({ 
                error: 'Recurso no encontrado',
                code: 'NOT_FOUND' 
            });
        }
        
        req.resource = resource;
        next();
    } catch (error) {
        res.status(500).json({ 
            error: 'Error cargando recurso',
            code: 'INTERNAL_ERROR' 
        });
    }
};

// Combinación de políticas con OR lógico
export const anyOf = (...policyFunctions) => (req, res, next) => {
    let lastError = null;
    
    const tryNext = (index) => {
        if (index >= policyFunctions.length) {
            return next(lastError || new Error('Acceso denegado'));
        }
        
        const policy = policyFunctions[index];
        
        policy(req, res, (error) => {
            if (error) {
                lastError = error;
                tryNext(index + 1);
            } else {
                next();
            }
        });
    };
    
    tryNext(0);
};

// Combinación de políticas con AND lógico
export const allOf = (...policyFunctions) => (req, res, next) => {
    const runNext = (index) => {
        if (index >= policyFunctions.length) {
            return next();
        }
        
        const policy = policyFunctions[index];
        
        policy(req, res, (error) => {
            if (error) {
                next(error);
            } else {
                runNext(index + 1);
            }
        });
    };
    
    runNext(0);
};