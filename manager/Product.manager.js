import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const fsPromise = fs.promises;

class ProductManager {
  constructor(relativePath) {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    this.path = path.join(__dirname, relativePath);
  }

  async saveData(doc) {
    const docToString = JSON.stringify(doc, null, 2);
    await fsPromise.writeFile(this.path, docToString);
  }

  async readData() {
    try {
      const json = await fsPromise.readFile(this.path, "utf-8");
      const data = JSON.parse(json);
      return data;
    } catch (error) {
      console.log("El archivo no existe. Creando nuevo archivo...") 
      return []
    }
  }

  async addProduct(product) {
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

    const products = await this.readData();

    // Validar que el código sea único
    const foundCode = products.find((p) => p.code === code);
    if (foundCode) {
      throw new Error("El código ya existe.");
    }

    // Calcular el nuevo PID autoincremental
    const newPid =
      products.length > 0
        ? Math.max(...products.map((p) => p.pid || 0)) + 1
        : 1;

    // Crear nuevo producto
    const newProduct = {
      pid: newPid,
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail,
    };

    products.push(newProduct);
    await this.saveData(products);

    return newProduct;
  }

  async getProducts() {
    return await this.readData()
  }

  async getProductById(pid) {
    if (!Number.isInteger(pid) || pid <= 0) {
      throw new Error("El PID debe ser un número entero válido y mayor a 0.");
    }

    const products = await this.readData();
    const found = products.find((product) => product.pid === pid);

    if (!found) {
      throw new Error("Producto no encontrado.");
    }

    return found;
  }

  async updateProduct(pid, updates) {
    if (!Number.isInteger(pid) || pid <= 0) {
      throw new Error("El PID debe ser un número entero válido y mayor a 0.");
    }

    const products = await this.readData();
    const productIndex = products.findIndex((product) => product.pid === pid);

    if (productIndex === -1) {
      throw new Error("Producto no encontrado.");
    }

    const product = products[productIndex];

    const {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail,
    } = updates;

    if (title !== undefined) product.title = title;
    if (description !== undefined) product.description = description;
    if (code !== undefined) product.code = code;
    if (price !== undefined) {
      if (isNaN(price) || price < 0) {
        throw new Error("El precio debe ser un número positivo.");
      }
      product.price = parseFloat(price);
    }
    if (status !== undefined) product.status = status;
    if (stock !== undefined) {
      if (!Number.isInteger(stock) || stock < 0) {
        throw new Error("El stock debe ser un número entero no negativo.");
      }
      product.stock = stock;
    }
    if (category !== undefined) product.category = category;
    if (thumbnail !== undefined) product.thumbnail = thumbnail;

    // Guardar los cambios
    products[productIndex] = product;
    await this.saveData(products);

    return product;
  }

  async deleteProduct(pid) {
    if (!Number.isInteger(pid) || pid <= 0) {
      throw new Error("El PID debe ser un número entero válido y mayor a 0.");
    }

    const products = await this.readData();
    const index = products.findIndex((product) => product.pid === pid);

    if (index === -1) {
      throw new Error("Producto no encontrado.");
    }
    
    const deletedProduct = products[index];
    products.splice(index, 1);
    await this.saveData(products);
    return deletedProduct;
  }
}

export default ProductManager;
