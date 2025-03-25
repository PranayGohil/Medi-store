import express from "express";
import {
  loginUser,
  registerUser,
  getUser,
  getAllUsers,
  updateUser,
  addAddress,
  getAddresses,
  removeAddress,
} from "../controllers/userController.js";
import adminAuth from "../middleware/adminAuth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/get-user/:id", getUser);
userRouter.put("/update-user", updateUser);
userRouter.put("/add-address", addAddress);
userRouter.get("/get-addresses", getAddresses);
userRouter.delete("/remove-address/:addressId", removeAddress);

userRouter.get("/get-all-users", adminAuth, getAllUsers);

export default userRouter;
