import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    category: { type: String, required: true },
    subcategory: { type: Array},
    special_subcategory: { type: Array },
    navbar_active: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

export default mongoose.model("Category", categorySchema);