import express from "express";
import { addFeedback, getAllFeedbacks, getFeedbackById, deleteFeedback } from "../controllers/feedbackController.js";
import adminAuth from "../middleware/adminAuth.js";
const feedbackRouter = express.Router();

feedbackRouter.post("/add", addFeedback);
feedbackRouter.get("/all", adminAuth, getAllFeedbacks);
feedbackRouter.get("/single/:id", getFeedbackById);
feedbackRouter.delete("/delete/:id", adminAuth, deleteFeedback);

export default feedbackRouter;