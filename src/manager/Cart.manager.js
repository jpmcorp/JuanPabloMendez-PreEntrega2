import cartsModel from "../models/carts.model.js";
import productsModel from "../models/products.model.js";

class CartManager {
  async createCart(products = []) {
    // Obtener el último cid
    const lastCart = await cartsModel.findOne().sort({ cid: -1 });
    const newCid = lastCart ? lastCart.cid + 1 : 1;

    const newCart = await cartsModel.create({
      cid: newCid,
      products,
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

    // Verifica que el producto exista
    const productExists = await productsModel.findOne({ pid });
    if (!productExists)
      throw new Error("El producto no existe en la base de datos.");

    // Busca el producto en el carrito
    const prodIndex = cart.products.findIndex((p) => p.pid === pid);
    if (prodIndex !== -1) {
      cart.products[prodIndex].quantity += 1;
    } else {
      cart.products.push({ pid, quantity: 1 });
    }

    await cart.save();
    return cart;
  }
}

export default CartManager;
