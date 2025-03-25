import express from "express";
import {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  applyCoupon,
} from "../controllers/couponController.js";

const couponRouter = express.Router();

couponRouter.post("/", createCoupon);
couponRouter.get("/", getAllCoupons);
couponRouter.get("/:id", getCouponById);
couponRouter.put("/:id", updateCoupon);
couponRouter.delete("/:id", deleteCoupon);

couponRouter.post("/apply", applyCoupon);

export default couponRouter;
