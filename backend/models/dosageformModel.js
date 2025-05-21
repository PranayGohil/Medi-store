import mongoose from "mongoose";

const dosageformSchema = new mongoose.Schema({
    dosageform: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

export default mongoose.model("Dosageform", dosageformSchema);