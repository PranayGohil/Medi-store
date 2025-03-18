import express from "express";
import { getStatistics } from "../controllers/statisticsController.js";

const statisticsRouter = express.Router();

statisticsRouter.get("/", getStatistics);

export default statisticsRouter;