import { BaseDAO } from "./base.dao.js";
import productsModel from "../models/products.model.js";

export class ProductDAO extends BaseDAO {
    constructor() {
        super(productsModel);
    }

    async findByPid(pid) {
        return await this.model.findOne({ pid }).lean();
    }

    async findByCode(code) {
        return await this.model.findOne({ code }).lean();
    }

    async getLastPid() {
        const lastProduct = await this.model.findOne().sort({ pid: -1 }).lean();
        return lastProduct ? lastProduct.pid : 0;
    }

    async searchProducts(filter, options) {
        return await this.model.paginate(filter, options);
    }
}