import { BaseDAO } from "./base.dao.js";
import { User } from "../models/users.model.js";

export class UserDAO extends BaseDAO {
    constructor() {
        super(User);
    }

    async findByEmail(email) {
        return await this.model.findOne({ email }).lean();
    }

    async findByEmailWithPassword(email) {
        return await this.model.findOne({ email }).select('+password');
    }

    async getAllUsersWithoutPassword() {
        return await this.model.find({}, { password: 0 }).lean();
    }
}