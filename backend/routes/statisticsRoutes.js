import express from "express";
import {
  getStatistics,
  getReports,
  getBestSellers,
  getOrderStatusInfo,
  getPaymentMethodsInfo,
} from "../controllers/statisticsController.js";

const statisticsRouter = express.Router();

statisticsRouter.get("/", getStatistics);
statisticsRouter.get("/report", getReports);
statisticsRouter.get("/best-sellers", getBestSellers);
statisticsRouter.get("/order-status-info", getOrderStatusInfo);
statisticsRouter.get("/payment-methods-info", getPaymentMethodsInfo);

export default statisticsRouter;
