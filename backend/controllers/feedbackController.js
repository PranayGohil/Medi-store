import Feedback from "../models/feedbackModel.js";

export const addFeedback = async (req, res) => {
  console.log("Body : ", req.body);
  try {
    const { first_name, last_name, email, phone, feedback } = req.body;

    if (!first_name || !last_name || !email || !feedback) {
      return res.json({
        success: false,
        message: "All required fields must be filled.",
      });
    }

    const newFeedback = await Feedback.create({
      first_name,
      last_name,
      email,
      phone,
      feedback,
    });
    res.json({
      success: true,
      feedback: newFeedback,
      message: "Feedback submitted successfully.",
    });
  } catch (error) {
    console.error("Feedback submission error:", error);
    res.json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
};

export const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ created_at: -1 });
    res.json({ success: true, feedbacks });
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    res.json({ success: false, message: "Could not retrieve feedbacks." });
  }
};

export const getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }
    res.json({ feedback });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const feedback = await Feedback.findByIdAndDelete(id);

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    res.json({ message: "Feedback deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
