import { cartService } from "../services/cart.service.js";

export const getCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartService.getByCid(parseInt(cid, 10));
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado." });
    }
    res.json(cart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const createCart = async (req, res) => {
  try {
    const newCart = await cartService.create(req.body);
    res.status(201).json(newCart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const addProductToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const updatedCart = await cartService.addProduct(parseInt(cid, 10), parseInt(pid, 10));
    res.json(updatedCart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateProductQuantity = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const updatedCart = await cartService.updateProductQuantity(parseInt(cid, 10), parseInt(pid, 10), req.body);
    res.json(updatedCart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const removeProductFromCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const updatedCart = await cartService.removeProduct(parseInt(cid, 10), parseInt(pid, 10));
    res.json(updatedCart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateCartProducts = async (req, res) => {
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

    const updatedCart = await cartService.updateAllProducts(parseInt(cid, 10), productsWithMongoId);
    res.json(updatedCart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateAllProducts = async (req, res) => {
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

    const updatedCart = await cartService.updateAllProducts(parseInt(cid, 10), productsWithMongoId);
    res.json(updatedCart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const clearedCart = await cartService.clear(parseInt(cid, 10));
    res.json(clearedCart);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
