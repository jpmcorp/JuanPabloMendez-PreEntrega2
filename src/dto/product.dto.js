export function toCreateProductDTO(body) {
    const { title, description, code, price, status, stock, category, thumbnail } = body ?? {};
    
    if (!title || !description || !code || typeof price !== 'number' || typeof stock !== 'number' || !category) {
        throw new Error('Campos requeridos faltantes o inválidos: title, description, code, price, stock, category');
    }
    
    if (price <= 0 || stock < 0) {
        throw new Error('El precio debe ser mayor a 0 y el stock no puede ser negativo');
    }

    return { 
        title: title.trim(), 
        description: description.trim(), 
        code: code.trim(), 
        price, 
        status: status !== undefined ? Boolean(status) : true,
        stock, 
        category: category.trim(),
        thumbnail: thumbnail || []
    };
}

export function toUpdateProductDTO(body) {
    const out = {};
    if (body?.title) out.title = body.title.trim();
    if (body?.description) out.description = body.description.trim();
    if (body?.code) out.code = body.code.trim();
    if (typeof body?.price === 'number' && body.price > 0) out.price = body.price;
    if (body?.status !== undefined) out.status = Boolean(body.status);
    if (typeof body?.stock === 'number' && body.stock >= 0) out.stock = body.stock;
    if (body?.category) out.category = body.category.trim();
    if (body?.thumbnail) out.thumbnail = Array.isArray(body.thumbnail) ? body.thumbnail : [body.thumbnail];
    return out;
}

export function toProductResponseDTO(product) {
    if (!product) return null;
    
    return {
        id: product._id || product.id,
        pid: product.pid,
        title: product.title,
        description: product.description,
        code: product.code,
        price: product.price,
        status: product.status,
        stock: product.stock,
        category: product.category,
        thumbnail: product.thumbnail,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
    };
}