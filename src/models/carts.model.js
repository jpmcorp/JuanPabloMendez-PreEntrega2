import mongoose from "mongoose";
import productsModel from "./products.model.js"; // Esto registra el modelo "Product"

const cartSchema = new mongoose.Schema({
  cid: { type: Number, unique: true },
  products: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }, // referencia al producto
      pid: { type: Number, required: true }, // id numérico propio
      quantity: { type: Number, default: 1 },
    },
  ],
});

const cartsModel = mongoose.model("Cart", cartSchema);
export default cartsModel;
