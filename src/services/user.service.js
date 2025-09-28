import { UserDAO } from "../dao/user.dao.js";
import { toCreateUserDTO, toUpdateUserDTO, toUserResponseDTO } from "../dto/user.dto.js";
import { createHash } from "../middleware/auth.middleware.js";
import { mailerService } from "./mailer.service.js";

export class UserService {
    constructor(dao = new UserDAO()) { 
        this.dao = dao; 
    }

    async list() { 
        const users = await this.dao.getAllUsersWithoutPassword();
        return users.map(user => toUserResponseDTO(user));
    }

    async getById(id) { 
        const user = await this.dao.getById(id);
        return toUserResponseDTO(user);
    }

    async getByEmail(email) {
        const user = await this.dao.findByEmail(email);
        return toUserResponseDTO(user);
    }

    async getByEmailWithPassword(email) {
        return await this.dao.findByEmailWithPassword(email);
    }

    async create(userData) { 
        const dto = toCreateUserDTO(userData);
        dto.password = createHash(dto.password); // Hash password before saving
        const user = await this.dao.create(dto);
        const responseUser = toUserResponseDTO(user);

        // Enviar email de bienvenida (si está configurado)
        try {
            if (mailerService.isConfigured()) {
                await mailerService.sendWelcome({
                    to: user.email,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    platformUrl: process.env.PLATFORM_URL || 'http://localhost:8080'
                });
                console.log(`Email de bienvenida enviado a: ${user.email}`);
            }
        } catch (emailError) {
            console.error('Error enviando email de bienvenida:', emailError.message);
            // No lanzar error para no afectar la creación del usuario
        }

        return responseUser;
    }

    async update(id, userData) { 
        const dto = toUpdateUserDTO(userData);
        if (dto.password) {
            dto.password = createHash(dto.password);
        }
        const user = await this.dao.updateById(id, dto);
        return toUserResponseDTO(user);
    }

    async delete(id) { 
        const result = await this.dao.deleteById(id);
        return !!result;
    }
}

export const userService = new UserService();