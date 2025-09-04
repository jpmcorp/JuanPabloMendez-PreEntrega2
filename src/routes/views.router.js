import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.middleware.js";

const router = Router();

router.get("/", (req, res) => res.redirect("/login"));
router.get("/login", (req, res) => res.render("login"));
router.get("/register", (req, res) => res.render("register"));

// Rutas protegidas que requieren autenticación
router.get("/realtimeproducts", requireAuth, (req, res) => {
  res.render("realTimeProducts", { 
    showTitle: true,
    user: req.user
  });
});

router.get("/cartView", requireAuth, (req, res) => {
  res.render("cartView", { 
    showTitle: false,
    user: req.user
  });
});

export default router
