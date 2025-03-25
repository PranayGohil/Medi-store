import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discount_type: {
    type: String,
    enum: ["percentage", "fixed"],
    required: true,
  },
  discount_value: { type: Number, required: true },
  min_purchase: { type: Number, default: 0 }, // Minimum purchase amount
  max_discount: { type: Number }, // Max discount for percentage coupons
  expiration_date: { type: Date, required: true },
  usage_limit: { type: Number, default: 100000 }, // Max usage per coupon
  used_count: { type: Number, default: 0 },
  status: { type: String, enum: ["active", "expired"], default: "active" },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export default mongoose.model("Coupon", couponSchema);
