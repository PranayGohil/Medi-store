import express from "express";
import {
  adminLogin,
  adminRegister,
  getAdminProfile,
  updateAdminProfile,
  sendOtp,
  verifyOtp,
  resetPassword,
} from "../controllers/adminController.js";
import adminAuth from "../middleware/adminAuth.js";

const adminRouter = express.Router();

adminRouter.post("/login", adminLogin);
adminRouter.post("/register", adminRegister);
adminRouter.get("/profile", adminAuth, getAdminProfile);
adminRouter.put("/profile", adminAuth, updateAdminProfile);
adminRouter.post("/send-otp", sendOtp);
adminRouter.post("/verify-otp", verifyOtp);
adminRouter.post("/reset-password", resetPassword);

export default adminRouter;
