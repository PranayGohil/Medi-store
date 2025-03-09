import express from "express";
import { addToCart, getCartItems } from "../controllers/cartController.js";

const cartRouter = express.Router();

cartRouter.post("/add-to-cart", addToCart);
cartRouter.get("/get-cart-items", getCartItems);

export default cartRouter;