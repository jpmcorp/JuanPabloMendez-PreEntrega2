import { CartDAO } from "../dao/cart.dao.js";
import { ProductDAO } from "../dao/product.dao.js";
import { toCreateCartDTO, toUpdateCartProductDTO, toCartResponseDTO } from "../dto/cart.dto.js";

export class CartService {
    constructor(dao = new CartDAO(), productDao = new ProductDAO()) { 
        this.dao = dao;
        this.productDao = productDao;
    }

    async list() { 
        const carts = await this.dao.getAll({}, { populate: "products._id" });
        return carts.map(cart => toCartResponseDTO(cart));
    }

    async getById(id) { 
        const cart = await this.dao.getById(id);
        return toCartResponseDTO(cart);
    }

    async getByCid(cid) {
        const cart = await this.dao.findByCid(cid);
        return toCartResponseDTO(cart);
    }

    async create(cartData) { 
        const dto = toCreateCartDTO(cartData);
        
        // Generate new cid
        const lastCid = await this.dao.getLastCid();
        const newCid = lastCid + 1;
        
        // Validate products and get MongoDB references
        const productsWithMongoId = [];
        for (const prodData of dto.products) {
            const productDoc = await this.productDao.findByPid(prodData.pid);
            if (!productDoc) {
                throw new Error(`Producto con pid ${prodData.pid} no encontrado.`);
            }
            productsWithMongoId.push({
                _id: productDoc._id,
                pid: prodData.pid,
                quantity: prodData.quantity,
            });
        }

        const cartToCreate = {
            cid: newCid,
            products: productsWithMongoId
        };

        const cart = await this.dao.create(cartToCreate);
        return toCartResponseDTO(cart);
    }

    async addProduct(cid, pid, quantity = 1) {
        // Validate product exists
        const productDoc = await this.productDao.findByPid(pid);
        if (!productDoc) {
            throw new Error(`Producto con pid ${pid} no encontrado.`);
        }

        // Check if cart exists
        const existingCart = await this.dao.findByCid(cid);
        if (!existingCart) {
            throw new Error(`Carrito con cid ${cid} no encontrado.`);
        }

        // Check if product already exists in cart
        const existingProduct = existingCart.products.find(p => p.pid === pid);
        
        if (existingProduct) {
            // Update quantity
            const newQuantity = existingProduct.quantity + quantity;
            const cart = await this.dao.updateProductQuantity(cid, pid, newQuantity);
            return toCartResponseDTO(cart);
        } else {
            // Add new product
            const productData = {
                _id: productDoc._id,
                pid: pid,
                quantity: quantity
            };
            const cart = await this.dao.addProductToCart(cid, productData);
            return toCartResponseDTO(cart);
        }
    }

    async updateProductQuantity(cid, pid, quantityData) {
        const dto = toUpdateCartProductDTO(quantityData);
        const cart = await this.dao.updateProductQuantity(cid, pid, dto.quantity);
        if (!cart) {
            throw new Error(`No se pudo actualizar el producto ${pid} en el carrito ${cid}.`);
        }
        return toCartResponseDTO(cart);
    }

    async removeProduct(cid, pid) {
        const cart = await this.dao.removeProductFromCart(cid, pid);
        if (!cart) {
            throw new Error(`No se pudo eliminar el producto ${pid} del carrito ${cid}.`);
        }
        return toCartResponseDTO(cart);
    }

    async clear(cartId) {
    const cart = await this.cartDAO.get(cartId);
    if (!cart) {
      throw new Error(`Carrito con ID ${cartId} no encontrado`);
    }
    
    cart.products = [];
    const updatedCart = await this.cartDAO.update(cartId, cart);
    return updatedCart;
  }

  async updateAllProducts(cartId, products) {
    const cart = await this.cartDAO.get(cartId);
    if (!cart) {
      throw new Error(`Carrito con ID ${cartId} no encontrado`);
    }
    
    cart.products = products;
    const updatedCart = await this.cartDAO.update(cartId, cart);
    return updatedCart;
  }
}

export const cartService = new CartService();