import express from "express";
import { createOrder, captureOrder } from "../controllers/paypalController.js";

const paypalRouter = express.Router();

paypalRouter.post("/createorder", createOrder);
paypalRouter.post("/captureorder", captureOrder);

export default paypalRouter;
