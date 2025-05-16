import { Router } from "express";
import ProductManager from "../manager/Product.manager.js";
import productsModel from "../models/products.model.js";

const router = Router();
const productManager = new ProductManager();

router.get("/products", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort;
    const query = req.query.query;

    // Construir filtro de búsqueda
    let filter = {};
    if (req.query.category) {
      filter.category = { $regex: req.query.category, $options: "i" };
    }
    if (req.query.status) {
      filter.status = req.query.status === "true";
    }
    if (req.query.query) {
      filter.$or = [
        { title: { $regex: req.query.query, $options: "i" } }
      ];
    }

    // Opciones de paginado y ordenamiento
    let sortOption = {};
    if (sort === "asc") sortOption.price = 1;
    if (sort === "desc") sortOption.price = -1;

    const options = {
      page,
      limit,
      sort: sortOption
    };

    // Usar paginate
    const result = await productsModel.paginate(filter, options);

    // Construir links
    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}${req.path}`;
    const prevLink = result.hasPrevPage
      ? `${baseUrl}?page=${result.prevPage}&limit=${limit}${sort ? `&sort=${sort}` : ""}${query ? `&query=${query}` : ""}${req.query.category ? `&category=${req.query.category}` : ""}${req.query.status ? `&status=${req.query.status}` : ""}`
      : null;
    const nextLink = result.hasNextPage
      ? `${baseUrl}?page=${result.nextPage}&limit=${limit}${sort ? `&sort=${sort}` : ""}${query ? `&query=${query}` : ""}${req.query.category ? `&category=${req.query.category}` : ""}${req.query.status ? `&status=${req.query.status}` : ""}`
      : null;

    res.json({
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.hasPrevPage ? result.prevPage : null,
      nextPage: result.hasNextPage ? result.nextPage : null,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink,
      nextLink
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