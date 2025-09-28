import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    title: { type: String, required: true },
    qty: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
}, { _id: false });

const orderSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true, index: true },
    buyerName: { type: String, required: true },
    buyerEmail: { type: String, required: true },
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: { type: [orderItemSchema], default: [] },
    total: { type: Number, min: 0, default: 0 },
    status: { 
        type: String, 
        enum: ["pending", "paid", "delivered", "cancelled"], 
        default: "pending", 
        index: true 
    },
}, { timestamps: true });

// Calcular total ANTES de validar (cubre create)
orderSchema.pre("validate", function (next) {
    const items = Array.isArray(this.items) ? this.items : [];
    this.total = items.reduce((acc, item) => acc + (Number(item.qty || 0) * Number(item.unitPrice || 0)), 0);
    next();
});

// Calcular total en updates cuando cambian items (cubre update)
orderSchema.pre("findOneAndUpdate", function (next) {
    const update = this.getUpdate() || {};
    if (update.items) {
        const items = Array.isArray(update.items) ? update.items : [];
        update.total = items.reduce((acc, item) => acc + (Number(item.qty || 0) * Number(item.unitPrice || 0)), 0);
        this.setUpdate(update);
    }
    next();
});

export const Order = mongoose.model("Order", orderSchema);
export default Order;