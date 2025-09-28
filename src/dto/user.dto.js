export function toCreateUserDTO(body) {
    const { first_name, last_name, email, age, password, role } = body ?? {};
    
    if (!first_name || !last_name || !email || !password) {
        throw new Error('Campos requeridos faltantes: first_name, last_name, email, password');
    }
    
    if (typeof age !== 'number' || age < 1) {
        throw new Error('La edad debe ser un número mayor a 0');
    }

    return { 
        first_name: first_name.trim(), 
        last_name: last_name.trim(), 
        email: email.toLowerCase().trim(), 
        age, 
        password, 
        role: role && ['user', 'admin'].includes(role) ? role : 'user' 
    };
}

export function toUpdateUserDTO(body) {
    const out = {};
    if (body?.first_name) out.first_name = body.first_name.trim();
    if (body?.last_name) out.last_name = body.last_name.trim();
    if (body?.email) out.email = body.email.toLowerCase().trim();
    if (typeof body?.age === 'number' && body.age > 0) out.age = body.age;
    if (body?.role && ['user', 'admin'].includes(body.role)) out.role = body.role;
    return out;
}

export function toUserResponseDTO(user) {
    if (!user) return null;
    
    return {
        id: user._id || user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: user.age,
        role: user.role,
        cart: user.cart,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    };
}