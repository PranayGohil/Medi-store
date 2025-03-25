import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  order_id: { type: String, required: true },
  user_id: { type: String, required: true },
  products: [
    {
      product_id: { type: String, required: true },
      net_quantity: { type: Number, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  sub_total: { type: Number, required: true },
  delivery_charge: { type: Number, required: true },
  discount: { type: Number, required: true },
  total: { type: Number, required: true },
  delivery_address: [
    {
      first_name: { type: String },
      last_name: { type: String },
      email: { type: String },
      phone: { type: String },
      address: { type: String },
      country: { type: String },
      state: { type: String },
      city: { type: String },
      pincode: { type: String },
    },
  ],
  payment_method: { type: String, required: true },
  payment_status: { type: String, required: true },
  payment_details: { type: Object },
  order_status: { type: String, required: true },

  // New status history field
  status_history: [
    {
      status: { type: String },
      changed_at: { type: Date, default: Date.now },
    },
  ],

  created_at: { type: Date, default: Date.now },
});

export default mongoose.model("Order", orderSchema);
