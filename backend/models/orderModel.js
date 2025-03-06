import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    order_id: { type: String, required: true },
    user_id: { type: String, required: true },
    products: [{
        product_id: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
    }],
    total_amount: { type: Number, required: true },
    payment_method: { type: String, required: true },
    order_status: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
});

export default mongoose.model("Order", orderSchema);