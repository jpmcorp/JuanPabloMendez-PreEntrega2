import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  cid: { type: Number, unique: true }, // Puedes usar ObjectId si prefieres
  products: [
    {
      pid: { type: Number, required: true },
      quantity: { type: Number, default: 1 },
    },
  ],
});

const cartsModel = mongoose.model("Cart", cartSchema);
export default cartsModel;
