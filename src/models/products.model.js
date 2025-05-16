import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema(
  {
    pid: { type: Number, unique: true },
    title: String,
    description: String,
    code: String,
    price: Number,
    status: Boolean,
    stock: Number,
    category: String,
    thumbnail: String,
  },
  { versionKey: false }
);

productSchema.plugin(mongoosePaginate);

const productsModel = mongoose.model("Product", productSchema);
export default productsModel;