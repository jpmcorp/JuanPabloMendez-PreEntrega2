import { Router } from "express";
import CartManager from "../manager/Cart.manager.js";
import cartsModel from "../models/carts.model.js";

const router = Router();
const cartManager = new CartManager(); // Inicializa CartManager con la ruta de archivo adecuada

router.get("/carts/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    // Trae el carrito y desglosa los productos asociados
    const cart = await cartsModel
      .findOne({ cid: parseInt(cid, 10) })
      .populate("products._id");
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

    // Validar que products sea un array y no esté vacío
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

// DELETE api/carts/:cid/products/:pid - Eliminar un producto específico del carrito
router.delete("/carts/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const updatedCart = await cartManager.removeProductFromCart(parseInt(cid, 10), parseInt(pid, 10));
    res.json(updatedCart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT api/carts/:cid - Actualizar todos los productos del carrito
router.put("/carts/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;
    if (!Array.isArray(products)) {
      return res.status(400).json({ error: "El campo 'products' debe ser un array." });
    }

    // Buscar el _id de cada producto por su pid
    const productsModel = (await import("../models/products.model.js")).default;
    const productsWithMongoId = [];
    for (const prod of products) {
      const productDoc = await productsModel.findOne({ pid: prod.pid });
      if (!productDoc) {
        return res.status(400).json({ error: `Producto con pid ${prod.pid} no encontrado.` });
      }
      productsWithMongoId.push({
        _id: productDoc._id,
        pid: prod.pid,
        quantity: prod.quantity || 1,
      });
    }

    const updatedCart = await cartManager.updateCartProducts(parseInt(cid, 10), productsWithMongoId);
    res.json(updatedCart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT api/carts/:cid/products/:pid - Actualizar la cantidad de un producto específico
router.put("/carts/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    if (typeof quantity !== "number" || quantity < 1) {
      return res.status(400).json({ error: "La cantidad debe ser un número mayor a 0." });
    }
    const updatedCart = await cartManager.updateProductQuantity(parseInt(cid, 10), parseInt(pid, 10), quantity);
    res.json(updatedCart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE api/carts/:cid - Eliminar todos los productos del carrito
router.delete("/carts/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const clearedCart = await cartManager.clearCart(parseInt(cid, 10));
    res.json(clearedCart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
