import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  product_code: { type: String, required: true },
  name: { type: String, required: true },
  generic_name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  country_of_origin: { type: String, required: true },
  dosage_form: { type: String, required: true },
  categories: [
    {
      category: { type: String, required: true },
      subcategory: { type: String, required: true },
    },
  ],
  product_images: { type: Array, required: true },
  manufacturer_image: { type: String, required: true },
  description: { type: String, required: true },
  information: { type: String, required: true },
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
  best_seller: { type: Boolean, default: false },
  alias: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export default mongoose.model("Product", productSchema);
