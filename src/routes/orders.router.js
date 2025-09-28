import { Router } from "express";
import { 
    getOrders, 
    getOrderById, 
    getOrderByCode,
    getMyOrders,
    createOrderFromCart,
    createOrder,
    updateOrder,
    updateOrderStatus,
    deleteOrder 
} from "../controllers/orders.controller.js";
import { requireAuth, requireRole } from "../middleware/requireAuth.middleware.js";

const router = Router();

// Rutas para usuarios autenticados
router.get("/orders", requireAuth, getOrders);
router.get("/orders/my", requireAuth, getMyOrders);
router.get("/orders/:id", requireAuth, getOrderById);
router.get("/orders/code/:code", requireAuth, getOrderByCode);
router.post("/orders/purchase", requireAuth, createOrderFromCart);
router.post("/orders", requireAuth, createOrder);

// Rutas solo para administradores
router.put("/orders/:id", requireAuth, requireRole("admin"), updateOrder);
router.patch("/orders/:id/status", requireAuth, requireRole("admin"), updateOrderStatus);
router.delete("/orders/:id", requireAuth, requireRole("admin"), deleteOrder);

export default router;