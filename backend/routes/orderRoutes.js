import express from "express";
import {
    addOrder,
    getAllOrders,
    getSingleOrder,
    updateOrderStatus,
} from "../controllers/orderController.js";
import adminAuth from "../middleware/adminAuth.js";

const orderRouter = express.Router();

orderRouter.post("/add", adminAuth, addOrder);
orderRouter.get("/all", adminAuth, getAllOrders);
orderRouter.get("/single/:id", adminAuth, getSingleOrder);
orderRouter.put("/update-status/:id", adminAuth, updateOrderStatus);

export default orderRouter;