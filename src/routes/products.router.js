import { Router } from "express";
import ProductManager from "../manager/Product.manager.js";
import productsModel from "../models/products.model.js";

const router = Router();
const productManager = new ProductManager();

router.get("/products", async (req, res) => {
  try {
    // Obtener query params con valores por defecto
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort;
    const query = req.query.query;

    // Construir filtro de búsqueda
    let filter = {};
    if (query) {      
      // Ejemplo: buscar por categoría o status
      filter = {
        $or: [
          { category: { $regex: query, $options: "i" } },
          { status: { $regex: query, $options: "i" } },
          { title: { $regex: query, $options: "i" } }
        ]
      };
    }

    // Construir opciones de ordenamiento
    let sortOption = {};
    if (sort === "asc") sortOption.price = 1;
    if (sort === "desc") sortOption.price = -1;

    // Consulta paginada
    const products = await productsModel
      .find(filter)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit);

    // Total de productos para paginación
    const totalProducts = await productsModel.countDocuments(filter);

    res.json({
      status: "success",
      payload: products,
      totalPages: Math.ceil(totalProducts / limit),
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page * limit < totalProducts ? page + 1 : null,
      page,
      hasPrevPage: page > 1,
      hasNextPage: page * limit < totalProducts
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", message: "Ver consola." });
  }
});

router.post("/products", async (req, res) => {
  try {
    const result = await productManager.addProduct(req.body);
    res.json(result);

    // Emitir evento para actualizar productos en tiempo real
    req.app.get("io").emit("update-products");
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
    
    // Emitir evento para actualizar productos en tiempo real
    req.app.get("io").emit("update-products");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/products/:pid", async (req, res) => {
  try {
    const { pid } = req.params; // Obtener el parámetro pid
    if (!pid) {
      return res.status(400).json({ error: "El ID del producto es requerido." });
    }

    const deletedPid = await productManager.deleteProduct(parseInt(pid, 10));
    res.json({ message: "Producto eliminado exitosamente.", deleted: deletedPid });

    // Emitir evento para actualizar productos en tiempo real
    req.app.get("io").emit("update-products");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;