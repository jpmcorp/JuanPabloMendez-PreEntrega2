import { Router } from "express";

const router = Router();

router.get("/realtimeproducts", (req, res) => res.render("realTimeProducts", { showTitle: true }));
router.get("/cartView", (req, res) => res.render("cartView", { showTitle: false }));

export default router
