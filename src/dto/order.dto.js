// DTO para crear una nueva orden
export const toCreateOrderDTO = (data, user) => {
    return {
        code: data.code,
        buyerName: user.firstName + ' ' + user.lastName,
        buyerEmail: user.email,
        buyerId: user._id,
        items: data.items || [],
        status: 'pending'
    };
};

// DTO para actualizar una orden
export const toUpdateOrderDTO = (data) => {
    const updateData = {};
    
    if (data.status !== undefined) updateData.status = data.status;
    if (data.items !== undefined) updateData.items = data.items;
    
    return updateData;
};

// DTO para respuesta de orden
export const toOrderResponseDTO = (order) => {
    return {
        id: order._id,
        code: order.code,
        buyerName: order.buyerName,
        buyerEmail: order.buyerEmail,
        buyerId: order.buyerId,
        items: order.items.map(item => ({
            productId: item.productId,
            title: item.title,
            qty: item.qty,
            unitPrice: item.unitPrice,
            subtotal: item.qty * item.unitPrice
        })),
        total: order.total,
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
    };
};

// DTO para lista de órdenes
export const toOrderListDTO = (orders) => {
    return orders.map(order => toOrderResponseDTO(order));
};