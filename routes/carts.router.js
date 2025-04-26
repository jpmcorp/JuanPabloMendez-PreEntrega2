import { Router } from "express";
import CartManager from "../manager/Cart.manager.js"; // Ensure this file exists and contains the required logic

const router = Router();
const cartManager = new CartManager("./manager/data/carts.json"); // Initialize CartManager with the appropriate file path

router.get("/carts/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartManager.getCartById(parseInt(cid, 10));
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado." });
    }
    res.json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/carts", async (req, res) => {
  try {
    const { products } = req.body;

    // Validate that products is an array and not empty
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: "El campo 'products' debe ser un array no vacío." });
    }

    const newCart = await cartManager.createCart(products);
    res.status(201).json(newCart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/carts/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartManager.getCartById(parseInt(cid, 10));
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado." });
    }

    const updatedCart = await cartManager.addProductToCart(parseInt(cid, 10), parseInt(pid, 10));
    res.json(updatedCart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
