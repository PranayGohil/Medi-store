import express from "express";
import {
    addOrder,
    removeOrder,
    getAllOrders,
    getSingleOrder,
    getSingleOrderByOrderId,
    getUserOrders,
    updateOrderStatus,
} from "../controllers/orderController.js";
import adminAuth from "../middleware/adminAuth.js";

const orderRouter = express.Router();

orderRouter.post("/add", addOrder);
orderRouter.delete("/remove/:id", removeOrder);
orderRouter.get("/all", getAllOrders);
orderRouter.get("/single/:id", getSingleOrder);
orderRouter.get("/single-by-order-id/:id", getSingleOrderByOrderId);
orderRouter.get("/get-user-orders", getUserOrders);
orderRouter.put("/update-status/:id", updateOrderStatus);

export default orderRouter;