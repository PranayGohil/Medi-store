import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    addresses: [{
        first_name: { type: String },
        last_name: { type: String },
        email: { type: String },
        phone: { type: String },
        address: { type: String },
        country: { type: String },
        state: { type: String },
        city: { type: String },
        pincode: { type: String },
    }],
    cartData: [{
        product_id: { type: String},
        net_quantity: { type: Number},
        quantity: { type: Number},
    }],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
}, { minimize: false });

export default mongoose.model("User", userSchema);