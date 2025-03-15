import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    category: { type: String, required: true },
    subcategory: { type: Array},
});

export default mongoose.model("Category", categorySchema);