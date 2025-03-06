import express from "express";
import { addFeedback, getAllFeedbacks } from "../controllers/feedbackController.js";
const feedbackRouter = express.Router();

feedbackRouter.post("/add", addFeedback);
feedbackRouter.get("/all", getAllFeedbacks);

export default feedbackRouter;