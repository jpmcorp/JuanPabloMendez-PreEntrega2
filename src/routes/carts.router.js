import { Router } from "express";
import { getCart, createCart, addProductToCart, updateProductQuantity, removeProductFromCart, updateAllProducts, clearCart } from "../controllers/carts.controller.js";
import { requireAuth } from "../middleware/requireAuth.middleware.js";

const router = Router();

// Todas las rutas de carritos requieren autenticación
router.get("/carts/:cid", requireAuth, getCart);

router.post("/carts", createCart);

router.post("/carts/:cid/products/:pid", addProductToCart);

// DELETE api/carts/:cid/products/:pid - Eliminar un producto específico del carrito
router.delete("/carts/:cid/products/:pid", removeProductFromCart);

// PUT api/carts/:cid - Actualizar todos los productos del carrito
router.put("/carts/:cid", updateAllProducts);

// PUT api/carts/:cid/products/:pid - Actualizar la cantidad de un producto específico
router.put("/carts/:cid/products/:pid", requireAuth, updateProductQuantity);

// DELETE api/carts/:cid - Eliminar todos los productos del carrito
router.delete("/carts/:cid", requireAuth, clearCart);

export default router;
