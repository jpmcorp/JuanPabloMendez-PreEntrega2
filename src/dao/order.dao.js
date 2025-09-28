import { BaseDAO } from "./base.dao.js";
import { Order } from "../models/orders.model.js";

export class OrderDAO extends BaseDAO {
    constructor() { 
        super(Order); 
    }

    async getByCode(code) {
        return await this.model.findOne({ code }).populate('items.productId').lean();
    }

    async getByUserId(userId) {
        return await this.model.find({ buyerId: userId }).sort({ createdAt: -1 }).populate('items.productId').lean();
    }

    async listPaginated({ page = 1, limit = 10, status, userId } = {}) {
        const filter = {};
        if (status) filter.status = status;
        if (userId) filter.buyerId = userId;
        
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            this.model.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('items.productId')
                .lean(),
            this.model.countDocuments(filter)
        ]);
        
        return { 
            items, 
            page, 
            limit, 
            total, 
            pages: Math.ceil(total / limit) 
        };
    }

    async updateStatus(orderId, status) {
        return await this.model.findByIdAndUpdate(
            orderId, 
            { status }, 
            { new: true }
        ).populate('items.productId').lean();
    }
}

export const orderDAO = new OrderDAO();