import { Router } from "express";

export default class CustomRouter {
    constructor({ mergeParams = true, base = '' } = {}) {
        this.base = base;
        this.router = Router({ mergeParams });
        this.params = this.router.param.bind(this.router);
    }

    // Wrapper para manejo automático de errores async
    _wrap(fn) {
        if (typeof fn !== 'function') return fn;
        
        return function wrapped(req, res, next) {
            try {
                const result = fn(req, res, next);
                if (result && typeof result.then === 'function') {
                    result.catch(next);
                }
            } catch (error) {
                next(error);
            }
        };
    }

    // Métodos HTTP con manejo de errores automático
    use(...args) { 
        this.router.use(...args); 
    }

    get(path, ...handlers) { 
        this.router.get(path, ...handlers.map(h => this._wrap(h)));
    }

    post(path, ...handlers) { 
        this.router.post(path, ...handlers.map(h => this._wrap(h)));
    }

    put(path, ...handlers) { 
        this.router.put(path, ...handlers.map(h => this._wrap(h)));
    }

    patch(path, ...handlers) { 
        this.router.patch(path, ...handlers.map(h => this._wrap(h)));
    }

    delete(path, ...handlers) { 
        this.router.delete(path, ...handlers.map(h => this._wrap(h)));
    }

    // Helper para agrupar rutas con prefijo (subrouter)
    group(prefix, buildFn) {
        const sub = new CustomRouter();
        buildFn(sub);
        this.router.use(prefix, sub.router);
    }

    // Middleware de manejo de errores centralizado
    errorHandler() {
        return (error, req, res, next) => {
            console.error(`🔴 [ERROR] ${req.method} ${req.originalUrl}:`, error);
            
            // Error de validación de MongoDB
            if (error.name === 'ValidationError') {
                const errors = Object.values(error.errors).map(err => err.message);
                return res.status(400).json({
                    error: 'Error de validación',
                    details: errors
                });
            }
            
            // Error de cast de MongoDB (ID inválido)
            if (error.name === 'CastError') {
                return res.status(400).json({
                    error: 'ID inválido'
                });
            }
            
            // Error de duplicado (E11000)
            if (error.code === 11000) {
                const field = Object.keys(error.keyPattern)[0];
                return res.status(400).json({
                    error: `El ${field} ya existe`
                });
            }
            
            // Error personalizado con status
            if (error.status) {
                return res.status(error.status).json({
                    error: error.message
                });
            }
            
            // Error genérico
            res.status(500).json({
                error: 'Error interno del servidor'
            });
        };
    }

    // Middleware para rutas no encontradas
    notFound() {
        return (req, res) => {
            res.status(404).json({
                error: `Ruta ${req.method} ${req.originalUrl} no encontrada`
            });
        };
    }

    // Obtener el router de Express
    getRouter() {
        return this.router;
    }
}