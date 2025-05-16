import cartsModel from "../models/carts.model.js";
import productsModel from "../models/products.model.js";

class CartManager {
  async createCart(products = []) {
    // Obtener el último cid
    const lastCart = await cartsModel.findOne().sort({ cid: -1 });
    const newCid = lastCart ? lastCart.cid + 1 : 1;

    // Mapear productos para agregar el _id de MongoDB automáticamente
    const productsWithMongoId = [];
    for (const prod of products) {
      const productDoc = await productsModel.findOne({ pid: prod.pid });
      if (!productDoc) throw new Error(`Producto con pid ${prod.pid} no encontrado.`);
      productsWithMongoId.push({
        _id: productDoc._id, // referencia a Product
        pid: prod.pid,
        quantity: prod.quantity || 1,
      });
    }

    const newCart = await cartsModel.create({
      cid: newCid,
      products: productsWithMongoId,
    });

    return { message: "Carrito creado exitosamente!!!", cart: newCart };
  }

  async getCartById(cid) {
    const cart = await cartsModel.findOne({ cid });
    if (!cart) throw new Error("Carrito no encontrado.");
    return cart;
  }

  async addProductToCart(cid, pid) {
    const cart = await cartsModel.findOne({ cid });
    if (!cart) throw new Error("Carrito no encontrado.");

    // Buscar el producto por pid y obtener su _id de MongoDB
    const product = await productsModel.findOne({ pid });
    if (!product) throw new Error("El producto no existe en la base de datos.");

    // Buscar si el producto ya está en el carrito
    const prodIndex = cart.products.findIndex((p) => p.pid === pid);

    if (prodIndex !== -1) {
      // Si ya existe, aumentar la cantidad
      cart.products[prodIndex].quantity += 1;
    } else {
      // Si no existe, agregarlo con el _id de MongoDB y el pid propio
      cart.products.push({
        _id: product._id, // referencia a Product
        pid: product.pid, // id numérico propio
        quantity: 1,
      });
    }

    await cart.save();
    return { message: "Producto agregado al carrito.", cart };
  }

  // Elimina un producto específico del carrito
  async removeProductFromCart(cid, pid) {
    const cart = await cartsModel.findOne({ cid });
    if (!cart) throw new Error("Carrito no encontrado.");

    const prodIndex = cart.products.findIndex((p) => p.pid === pid);
    if (prodIndex === -1) throw new Error("Producto no encontrado en el carrito.");

    cart.products.splice(prodIndex, 1);
    await cart.save();
    return { message: "Producto eliminado del carrito.", cart };
  }

  // Actualiza todos los productos del carrito con un nuevo arreglo
  async updateCartProducts(cid, products) {
    const cart = await cartsModel.findOne({ cid });
    if (!cart) throw new Error("Carrito no encontrado.");

    cart.products = products;
    await cart.save();
    return { message: "Productos del carrito actualizados.", cart };
  }

  // Actualiza la cantidad de un producto específico en el carrito
  async updateProductQuantity(cid, pid, quantity) {
    const cart = await cartsModel.findOne({ cid });
    if (!cart) throw new Error("Carrito no encontrado.");

    const prodIndex = cart.products.findIndex((p) => p.pid === pid);
    if (prodIndex === -1) throw new Error("Producto no encontrado en el carrito.");

    cart.products[prodIndex].quantity = quantity;
    await cart.save();
    return { message: "Cantidad actualizada.", cart };
  }

  // Elimina todos los productos del carrito
  async clearCart(cid) {
    const cart = await cartsModel.findOne({ cid });
    if (!cart) throw new Error("Carrito no encontrado.");

    cart.products = [];
    await cart.save();
    return { message: "Todos los productos eliminados del carrito.", cart };
  }
}

export default CartManager;
