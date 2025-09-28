import { productService } from "../services/product.service.js";

export const getProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort;
    const query = req.query.query;
    
    let filter = {};
    if (req.query.category) {
      filter.category = { $regex: req.query.category, $options: "i" };
    }
    if (req.query.status) {
      filter.status = req.query.status === "true";
    }
    if (req.query.query) {
      filter.$or = [{ title: { $regex: req.query.query, $options: "i" } }];
    }
    
    let sortOption = {};
    if (sort === "asc") sortOption.price = 1;
    if (sort === "desc") sortOption.price = -1;
    
    const options = { page, limit, sort: sortOption };
    const result = await productService.searchProducts(filter, options);
    
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
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink,
      nextLink
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const addProduct = async (req, res) => {
  try {
    const result = await productService.create(req.body);
    res.json(result);
    req.app.get("io").emit("update-products");
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productService.getByPid(parseInt(pid, 10));
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado." });
    }
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { pid } = req.params;
    const updatedProduct = await productService.update(parseInt(pid, 10), req.body);
    if (!updatedProduct) {
      return res.status(404).json({ error: "Producto no encontrado." });
    }
    res.json({ message: "Producto actualizado exitosamente!!!", product: updatedProduct });
    req.app.get("io").emit("update-products");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { pid } = req.params;
    if (!pid) {
      return res.status(400).json({ error: "El ID del producto es requerido." });
    }
    const deleted = await productService.delete(parseInt(pid, 10));
    if (!deleted) {
      return res.status(404).json({ error: "Producto no encontrado." });
    }
    res.json({ message: "Producto eliminado exitosamente.", deleted: pid });
    req.app.get("io").emit("update-products");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
