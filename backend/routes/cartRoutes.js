import express from "express";
import { addToCart, getCartItems, removeCartItem, clearCart } from "../controllers/cartController.js";

const cartRouter = express.Router();

cartRouter.post("/add-to-cart", addToCart);
cartRouter.get("/get-cart-items", getCartItems);
cartRouter.delete("/remove-from-cart/:productId", removeCartItem);
cartRouter.delete("/clear-cart", clearCart);


export default cartRouter;