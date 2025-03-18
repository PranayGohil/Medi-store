import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    feedback: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
});

export default mongoose.model("Feedback", feedbackSchema);