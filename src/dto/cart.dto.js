export function toCreateCartDTO(body) {
    const { products } = body ?? {};
    
    if (!Array.isArray(products)) {
        throw new Error('Products debe ser un array');
    }

    const validProducts = products.map(product => {
        const { pid, quantity } = product;
        if (!pid || typeof quantity !== 'number' || quantity < 1) {
            throw new Error('Cada producto debe tener pid y quantity válidos');
        }
        return { pid, quantity };
    });

    return { products: validProducts };
}

export function toUpdateCartProductDTO(body) {
    const { quantity } = body ?? {};
    
    if (typeof quantity !== 'number' || quantity < 1) {
        throw new Error('La cantidad debe ser un número mayor a 0');
    }

    return { quantity };
}

export function toCartResponseDTO(cart) {
    if (!cart) return null;
    
    return {
        id: cart._id || cart.id,
        cid: cart.cid,
        products: cart.products?.map(product => ({
            _id: product._id,
            pid: product.pid,
            quantity: product.quantity,
            product: product._id ? {
                id: product._id._id,
                title: product._id.title,
                price: product._id.price,
                thumbnail: product._id.thumbnail
            } : null
        })) || [],
        createdAt: cart.createdAt,
        updatedAt: cart.updatedAt
    };
}