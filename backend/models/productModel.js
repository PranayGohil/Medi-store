import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  product_code: { type: String },
  name: { type: String, required: true },
  generic_name: { type: String },
  manufacturer: { type: String },
  country_of_origin: { type: String },
  dosage_form: { type: String, required: true },
  categories: [
    {
      category: { type: String },
      subcategory: { type: String },
    },
  ],
  product_images: { type: Array, required: true },
  manufacturer_image: { type: String },
  description: { type: String },
  information: { type: String },
  pricing: [
    {
      net_quantity: { type: Number, required: true },
      total_price: { type: Number, required: true },
      unit_price: { type: Number, required: true },
    },
  ],
  prescription_required: { type: Boolean, required: true },
  available: { type: Boolean, default: true },
  rating: { type: Number, default: 0 },
  reviews: [
    {
      user_id: { type: String },
      comment: { type: String },
      rating: { type: Number },
      status: { type: String },
      created_at: { type: Date, default: Date.now },
    },
  ],
  best_seller_manual: { type: Boolean, default: false },
  alias: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export default mongoose.model("Product", productSchema);
