import { BaseDAO } from "./base.dao.js";
import cartsModel from "../models/carts.model.js";

export class CartDAO extends BaseDAO {
    constructor() {
        super(cartsModel);
    }

    async findByCid(cid) {
        return await this.model.findOne({ cid }).populate("products._id").lean();
    }

    async getLastCid() {
        const lastCart = await this.model.findOne().sort({ cid: -1 }).lean();
        return lastCart ? lastCart.cid : 0;
    }

    async addProductToCart(cid, productData) {
        return await this.model.findOneAndUpdate(
            { cid },
            { $push: { products: productData } },
            { new: true, runValidators: true }
        ).populate("products._id").lean();
    }

    async updateProductQuantity(cid, pid, quantity) {
        return await this.model.findOneAndUpdate(
            { cid, "products.pid": pid },
            { $set: { "products.$.quantity": quantity } },
            { new: true, runValidators: true }
        ).populate("products._id").lean();
    }

    async removeProductFromCart(cid, pid) {
        return await this.model.findOneAndUpdate(
            { cid },
            { $pull: { products: { pid } } },
            { new: true, runValidators: true }
        ).populate("products._id").lean();
    }

    async clearCart(cid) {
        return await this.model.findOneAndUpdate(
            { cid },
            { $set: { products: [] } },
            { new: true, runValidators: true }
        ).lean();
    }
}