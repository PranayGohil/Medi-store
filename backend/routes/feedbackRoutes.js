import express from "express";
import { addFeedback, getAllFeedbacks, getFeedbackById, deleteFeedback } from "../controllers/feedbackController.js";
const feedbackRouter = express.Router();

feedbackRouter.post("/add", addFeedback);
feedbackRouter.get("/all", getAllFeedbacks);
feedbackRouter.get("/single/:id", getFeedbackById);
feedbackRouter.delete("/delete/:id", deleteFeedback);

export default feedbackRouter;