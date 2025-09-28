import { Router } from "express";
import { getProducts, addProduct, getProductById, updateProduct, deleteProduct } from "../controllers/products.controller.js";
import { requireAuth, requireRole } from "../middleware/requireAuth.middleware.js";

const router = Router();

// Rutas que requieren autenticación
router.get("/products", requireAuth, getProducts);

// Solo administradores pueden crear productos
router.post("/products", requireAuth, requireRole(['admin']), addProduct);

router.get("/products/:pid", requireAuth, getProductById);

// Solo administradores pueden actualizar productos
router.put("/products/:pid", requireAuth, requireRole(['admin']), updateProduct);

// Solo administradores pueden eliminar productos
router.delete("/products/:pid", requireAuth, requireRole(['admin']), deleteProduct);

export default router;