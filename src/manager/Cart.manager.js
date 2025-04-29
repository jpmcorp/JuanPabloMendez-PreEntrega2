import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const fsPromise = fs.promises;

class CartManager {
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
      console.log("El archivo no existe. Creando uno nuevo...");
      return [];
    }
  }

  async createCart(products = []) {    
    const carts = await this.readData();

    // Detectar el máximo cid en el array de carritos
    const maxCid = carts.reduce(
      (max, cart) => (cart.cid > max ? cart.cid : max),
      0
    );
  
    // Generar un nuevo cid correlativo
    const newCart = {
      cid: maxCid + 1,
      products: products,
    };
  
    carts.push(newCart);
    // Guardar los cambios en el archivo
    await this.saveData(carts);
    return { message: "Carrito creado exitosamente!!!", cart: newCart };
  }

  async getCartById(cid) {
    // Validar que el cid sea un número válido
    if (!Number.isInteger(cid) || cid <= 0) {
      throw new Error("El CID debe ser un número entero válido y mayor a 0.");
    }

    const carts = await this.readData();
    const cart = carts.find((cart) => cart.cid === cid);

    if (!cart) {
      throw new Error("Carrito no encontrado.");
    }

    return cart;
  }

  async addProductToCart(cid, pid) {
    // Validar que cid y pid sean números válidos
    if (!Number.isInteger(cid) || cid <= 0) {
      throw new Error("El CID debe ser un número entero válido y mayor a 0.");
    }
    if (!Number.isInteger(pid) || pid <= 0) {
      throw new Error("El PID debe ser un número entero válido y mayor a 0.");
    }

    const carts = await this.readData();

    // Verificar si el carrito existe
    const cart = carts.find((cart) => cart.cid === cid);
    if (!cart) {
      throw new Error("Carrito no encontrado.");
    }

    // Validar que el producto exista en products.json
    const productsPath = "./src/manager/data/products.json"; // Ajustar la ruta si es necesario
    const productsData = JSON.parse(await fsPromise.readFile(productsPath, "utf-8"));
    const productExists = productsData.some((product) => product.pid === pid);

    if (!productExists) {
      throw new Error("El producto no existe en la base de datos.");
    }

    // Verificar si el producto ya está en el carrito
    const productIndex = cart.products.findIndex((product) => product.pid === pid);

    if (productIndex !== -1) {
      cart.products[productIndex].quantity += 1;
    } else {
      cart.products.push({ pid, quantity: 1 });
    }

    // Guardar los datos actualizados de los carritos
    await this.saveData(carts);
    return cart;
  }
}

export default CartManager;
