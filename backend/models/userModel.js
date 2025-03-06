import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartData: [{
        product_id: { type: String, required: true },
        quantity: { type: Number, required: true },
    }],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
}, { minimize: false });

export default mongoose.model("User", userSchema);