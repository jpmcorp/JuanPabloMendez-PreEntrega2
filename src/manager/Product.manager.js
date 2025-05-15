import productsModel from "../models/products.model.js";

class ProductManager {
  async readData() {
    try {
      const products = await productsModel.find({});
      return products;
    } catch (error) {
      console.error("Error al leer los datos de MongoDB:", error);
      return [];
    }
  }

  async getProducts() {
    try {
      const products = await productsModel.find({});
      return products;
    } catch (error) {
      console.error("Error al leer los datos de MongoDB:", error);
      return [];
    }
  }

  async addProduct(product) {
    try {
      const {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnail,
      } = product;

      // Validar campos obligatorios
      if (
        !title ||
        !description ||
        !code ||
        !price ||
        !status ||
        !stock ||
        !category ||
        !thumbnail
      ) {
        throw new Error("Campo faltante o datos inválidos.");
      }

      // Validar tipos de datos
      if (typeof price !== "number" || price <= 0) {
        throw new Error("El precio debe ser un número positivo.");
      }
      if (!Number.isInteger(stock) || stock < 0) {
        throw new Error("El stock debe ser un número entero no negativo.");
      }

      // Validar que el código sea único
      const foundCode = await productsModel.findOne({ code });
      if (foundCode) {
        throw new Error("El código ya existe.");
      }

      // Calcular el pid automáticamente
      const lastPid = await productsModel.findOne().sort({ pid: -1 });

      // Crear y guardar el nuevo producto
      const newProduct = new productsModel({
        pid: lastPid ? lastPid.pid + 1 : 1, // Asignar pid automáticamente
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnail,
      });

      await newProduct.save();
      return newProduct;
    } catch (error) {
      console.error("Error al agregar el producto:", error);
      throw error;
    }
  }

  async getProductById(pid) {
    try {
      // Buscar el producto por el campo pid
      const product = await productsModel.findOne({ pid });
      if (!product) {
        throw new Error("Producto no encontrado.");
      }
      return product;
    } catch (error) {
      console.error("Error al obtener el producto por PID:", error);
      throw error;
    }
  }

  async updateProduct(pid, updates) {    
    try {      
      const socket = io();
      // Buscar y actualizar el producto por el campo pid
      const updatedProduct = await productsModel.findOneAndUpdate(
        { pid },
        updates,
        { new: true, runValidators: true }
      );

      if (!updatedProduct) {
        throw new Error("Producto no encontrado.");
      }

      // Obtener la lista actualizada de productos
      const products = await productsModel.find({});

      // Emitir el evento de actualización a través de sockets
      socket.emit("update-products", products); // Descomentar si se usa sockets

      return updatedProduct;
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      throw error;
    }
  }

  async deleteProduct(pid) {
    try {
      // Buscar y eliminar el producto por el campo pid
      const deletedProduct = await productsModel.findOneAndDelete({ pid });
      if (!deletedProduct) {
        throw new Error("Producto no encontrado.");
      }
      return deletedProduct;
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      throw error;
    }
  }
}

export default ProductManager;
