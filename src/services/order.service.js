import { OrderDAO } from "../dao/order.dao.js";
import { CartDAO } from "../dao/cart.dao.js";
import { ProductDAO } from "../dao/product.dao.js";
import { toCreateOrderDTO, toUpdateOrderDTO, toOrderResponseDTO } from "../dto/order.dto.js";
import { v4 as uuidv4 } from "uuid";
import { mailerService } from "./mailer.service.js";
import { messagingService } from "./messaging.service.js";

class OrderService {
    constructor() {
        this.orderDAO = new OrderDAO();
        this.cartDAO = new CartDAO();
        this.productDAO = new ProductDAO();
    }

    async list(params) {
        const result = await this.orderDAO.listPaginated(params);
        return {
            ...result,
            items: result.items.map(order => toOrderResponseDTO(order))
        };
    }

    async get(id) {
        const order = await this.orderDAO.get(id);
        if (!order) {
            throw new Error(`Orden con ID ${id} no encontrada`);
        }
        return toOrderResponseDTO(order);
    }

    async getByCode(code) {
        const order = await this.orderDAO.getByCode(code);
        if (!order) {
            throw new Error(`Orden con código ${code} no encontrada`);
        }
        return toOrderResponseDTO(order);
    }

    async getByUserId(userId) {
        const orders = await this.orderDAO.getByUserId(userId);
        return orders.map(order => toOrderResponseDTO(order));
    }

    async createFromCart(cartId, user) {
        // Obtener el carrito
        const cart = await this.cartDAO.getById(cartId);
        if (!cart) {
            throw new Error(`Carrito con ID ${cartId} no encontrado`);
        }

        if (!cart.products || cart.products.length === 0) {
            throw new Error("El carrito está vacío");
        }

        // Verificar stock y preparar items de la orden
        const orderItems = [];
        let total = 0;

        for (const cartItem of cart.products) {
            const product = await this.productDAO.getById(cartItem._id);
            if (!product) {
                throw new Error(`Producto ${cartItem.pid} no encontrado`);
            }

            if (product.stock < cartItem.quantity) {
                throw new Error(`Stock insuficiente para el producto ${product.title}. Stock disponible: ${product.stock}`);
            }

            const orderItem = {
                productId: product._id,
                title: product.title,
                qty: cartItem.quantity,
                unitPrice: product.price
            };

            orderItems.push(orderItem);
            total += orderItem.qty * orderItem.unitPrice;
        }

        // Generar código único para la orden
        const orderCode = `ORD-${Date.now()}-${uuidv4().slice(0, 8).toUpperCase()}`;

        // Crear la orden
        const orderData = toCreateOrderDTO({
            code: orderCode,
            items: orderItems
        }, user);

        const newOrder = await this.orderDAO.create(orderData);

        // Actualizar stock de productos
        for (const cartItem of cart.products) {
            const product = await this.productDAO.getById(cartItem._id);
            const newStock = product.stock - cartItem.quantity;
            await this.productDAO.updateById(cartItem._id, { stock: newStock });
        }

        // Limpiar el carrito
        await this.cartDAO.updateById(cartId, { products: [] });

        // Enviar confirmación de compra por email (si está configurado)
        try {
            if (mailerService.isConfigured()) {
                await mailerService.sendPurchaseConfirmation({
                    to: user.email,
                    customerName: `${user.first_name} ${user.last_name}`.trim(),
                    code: orderCode,
                    amount: total,
                    products: orderItems.map(item => ({
                        title: item.title,
                        quantity: item.qty,
                        price: item.unitPrice
                    })),
                    purchaser: user.email,
                    purchaseDatetime: new Date().toLocaleString('es-AR'),
                    orderTrackingUrl: `${process.env.PLATFORM_URL || 'http://localhost:8080'}/orders/${orderCode}`
                });
                console.log(`Email de confirmación enviado a: ${user.email}`);
            }
        } catch (emailError) {
            console.error('Error enviando email de confirmación:', emailError.message);
            // No lanzar error para no afectar la creación de la orden
        }

        // Enviar notificación por SMS (si está configurado y el usuario tiene teléfono)
        try {
            if (messagingService.isConfigured() && user.phone) {
                await messagingService.sendPurchaseNotification(user.phone, orderCode, total, user.first_name || 'Cliente');
                console.log(`SMS de notificación enviado a: ${user.phone}`);
            }
        } catch (smsError) {
            console.error('Error enviando SMS de notificación:', smsError.message);
            // No lanzar error para no afectar la creación de la orden
        }

        return toOrderResponseDTO(newOrder);
    }

    async create(data, user) {
        const orderCode = `ORD-${Date.now()}-${uuidv4().slice(0, 8).toUpperCase()}`;
        const orderData = toCreateOrderDTO({
            ...data,
            code: orderCode
        }, user);

        const newOrder = await this.orderDAO.create(orderData);
        return toOrderResponseDTO(newOrder);
    }

    async update(id, data) {
        const updateData = toUpdateOrderDTO(data);
        const updatedOrder = await this.orderDAO.update(id, updateData);
        if (!updatedOrder) {
            throw new Error(`Orden con ID ${id} no encontrada`);
        }
        return toOrderResponseDTO(updatedOrder);
    }

    async updateStatus(id, status) {
        const updatedOrder = await this.orderDAO.updateStatus(id, status);
        if (!updatedOrder) {
            throw new Error(`Orden con ID ${id} no encontrada`);
        }

        // Enviar notificación de cambio de estado por email (si está configurado)
        try {
            if (mailerService.isConfigured() && updatedOrder.purchaser) {
                await mailerService.sendOrderStatus({
                    to: updatedOrder.purchaser,
                    customerName: `${updatedOrder.purchaser}`.split('@')[0], // Usar parte del email como nombre si no hay nombre
                    code: updatedOrder.code,
                    status: status,
                    amount: updatedOrder.amount,
                    products: updatedOrder.items || [],
                    purchaseDatetime: updatedOrder.purchase_datetime?.toLocaleString('es-AR') || new Date().toLocaleString('es-AR')
                });
                console.log(`Email de cambio de estado enviado a: ${updatedOrder.purchaser}`);
            }
        } catch (emailError) {
            console.error('Error enviando email de cambio de estado:', emailError.message);
            // No lanzar error para no afectar la actualización
        }

        // Enviar notificación por SMS (si está configurado)
        try {
            if (messagingService.isConfigured() && updatedOrder.phone) {
                await messagingService.sendOrderStatusNotification(updatedOrder.phone, updatedOrder.code, status, updatedOrder.customerName || 'Cliente');
                console.log(`SMS de cambio de estado enviado a: ${updatedOrder.phone}`);
            }
        } catch (smsError) {
            console.error('Error enviando SMS de cambio de estado:', smsError.message);
            // No lanzar error para no afectar la actualización
        }

        return toOrderResponseDTO(updatedOrder);
    }

    async remove(id) {
        const result = await this.orderDAO.delete(id);
        if (!result.deletedCount) {
            throw new Error(`Orden con ID ${id} no encontrada`);
        }
        return { message: "Orden eliminada exitosamente" };
    }
}

export const orderService = new OrderService();