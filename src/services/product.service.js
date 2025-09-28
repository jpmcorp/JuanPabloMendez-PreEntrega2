import { ProductDAO } from "../dao/product.dao.js";
import { toCreateProductDTO, toUpdateProductDTO, toProductResponseDTO } from "../dto/product.dto.js";

export class ProductService {
    constructor(dao = new ProductDAO()) { 
        this.dao = dao; 
    }

    async list(filter = {}, options = {}) { 
        const products = await this.dao.getAll(filter, options);
        return products.map(product => toProductResponseDTO(product));
    }

    async searchProducts(filter = {}, options = {}) {
        const result = await this.dao.searchProducts(filter, options);
        return {
            ...result,
            docs: result.docs.map(product => toProductResponseDTO(product))
        };
    }

    async getById(id) { 
        const product = await this.dao.getById(id);
        return toProductResponseDTO(product);
    }

    async getByPid(pid) {
        const product = await this.dao.findByPid(pid);
        return toProductResponseDTO(product);
    }

    async getByCode(code) {
        const product = await this.dao.findByCode(code);
        return toProductResponseDTO(product);
    }

    async create(productData) { 
        const dto = toCreateProductDTO(productData);
        
        // Generate new pid
        const lastPid = await this.dao.getLastPid();
        dto.pid = lastPid + 1;
        
        const product = await this.dao.create(dto);
        return toProductResponseDTO(product);
    }

    async update(pid, productData) { 
        const dto = toUpdateProductDTO(productData);
        const product = await this.dao.model.findOneAndUpdate(
            { pid }, 
            dto, 
            { new: true, runValidators: true }
        ).lean();
        return toProductResponseDTO(product);
    }

    async delete(pid) { 
        const result = await this.dao.model.findOneAndDelete({ pid }).lean();
        return !!result;
    }
}

export const productService = new ProductService();