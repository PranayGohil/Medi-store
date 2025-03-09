import express from "express";
import {
    addOrder,
    getAllOrders,
    getSingleOrder,
    getUserOrders,
    updateOrderStatus,
} from "../controllers/orderController.js";
import adminAuth from "../middleware/adminAuth.js";

const orderRouter = express.Router();

orderRouter.post("/add", addOrder);
orderRouter.get("/all", getAllOrders);
orderRouter.get("/single/:id", getSingleOrder);
orderRouter.get("/get-user-orders", getUserOrders);
orderRouter.put("/update-status/:id", updateOrderStatus);

export default orderRouter;