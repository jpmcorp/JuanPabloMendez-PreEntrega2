import { Router } from "express";
import ProductManager from "../manager/Product.manager.js";

const router = Router();
const productManager = new ProductManager("./data/products.json");

router.get("/products", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", message: "Ver consola." });
  }
});

router.post("/products", async (req, res) => {
  try {
    const result = await productManager.addProduct(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
});

router.get("/products/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productManager.getProductById(parseInt(pid, 10));
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/products/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const updates = req.body;

    const updatedProduct = await productManager.updateProduct(parseInt(pid, 10), updates);
    res.json({ message: "Producto actualizado exitosamente!!!", product: updatedProduct });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/products/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const deletedPid = await productManager.deleteProduct(parseInt(pid, 10));
    res.json({ message: "Producto eliminado exitosamente.", deleted: deletedPid });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;