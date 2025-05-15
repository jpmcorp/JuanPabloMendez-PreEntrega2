import { Schema, model } from "mongoose";

const productsCollection = "products";

const productSchema = new Schema(
  {
    pid: { type: Number, required: true, unique: true }, // Campo pid único
    title: { type: String, required: true },
    description: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    status: { type: String, required: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    thumbnail: { type: String, required: true },
  },
  { versionKey: false }
);

const productsModel = model(productsCollection, productSchema);

export default productsModel;