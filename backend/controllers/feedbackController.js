import Feedback from "../models/feedbackModel.js";

export const addFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.create(req.body);
        return res.json({ success: true, feedback });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
};

export const getAllFeedbacks = async (req, res) => {
    try {
        const feedbacks = await Feedback.find({});
        return res.json({ success: true, feedbacks });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
};