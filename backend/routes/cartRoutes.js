import express from "express";
import {
  addToCart,
  getCartItems,
  getCartItemsById,
  changeCartQuantity,
  removeCartItem,
  clearCart,
} from "../controllers/cartController.js";

const cartRouter = express.Router();

cartRouter.post("/add-to-cart", addToCart);
cartRouter.get("/get-cart-items", getCartItems);
cartRouter.get("/get-cart-items/:id", getCartItemsById);
cartRouter.put("/change-quantity/:productId", changeCartQuantity);
cartRouter.delete("/remove-from-cart/:productId/:netQuantity", removeCartItem);
cartRouter.delete("/clear-cart", clearCart);

export default cartRouter;
