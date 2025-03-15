import express from "express";
import {
  loginUser,
  registerUser,
  adminLogin,
  getUser,
  updateUser,
  addAddress,
  getAddresses,
  removeAddress,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/get-user/:id", getUser);
userRouter.put("/update-user", updateUser);
userRouter.put("/add-address", addAddress);
userRouter.get("/get-addresses", getAddresses);
userRouter.delete("/remove-address/:addressId", removeAddress);
userRouter.post("/admin/login", adminLogin);

export default userRouter;
