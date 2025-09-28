import { orderService } from "../services/order.service.js";

export const getOrders = async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        const userId = req.user.role === 'admin' ? undefined : req.user._id;
        
        const params = {
            page: parseInt(page),
            limit: parseInt(limit),
            status,
            userId
        };

        const result = await orderService.list(params);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await orderService.get(id);
        
        // Verificar que el usuario puede ver esta orden
        if (req.user.role !== 'admin' && order.buyerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "No tienes permisos para ver esta orden" });
        }
        
        res.json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getOrderByCode = async (req, res) => {
    try {
        const { code } = req.params;
        const order = await orderService.getByCode(code);
        
        // Verificar que el usuario puede ver esta orden
        if (req.user.role !== 'admin' && order.buyerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "No tienes permisos para ver esta orden" });
        }
        
        res.json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getMyOrders = async (req, res) => {
    try {
        const orders = await orderService.getByUserId(req.user._id);
        res.json(orders);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const createOrderFromCart = async (req, res) => {
    try {
        const { cartId } = req.body;
        
        if (!cartId) {
            return res.status(400).json({ error: "ID del carrito es requerido" });
        }

        const order = await orderService.createFromCart(cartId, req.user);
        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const createOrder = async (req, res) => {
    try {
        const order = await orderService.create(req.body, req.user);
        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await orderService.update(id, req.body);
        res.json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        if (!status) {
            return res.status(400).json({ error: "Status es requerido" });
        }

        const order = await orderService.updateStatus(id, status);
        res.json(order);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await orderService.remove(id);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};