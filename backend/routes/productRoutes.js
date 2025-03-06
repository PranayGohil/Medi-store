import express from "express";
import {
  addProduct,
  removeProduct,
  editProduct,
  getAllProducts,
  getSingleProduct,
} from "../controllers/productController.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const productRouter = express.Router();

productRouter.post(
  "/add",
  upload.fields([
    { name: "product_images", maxCount: 500 },
    { name: "manufacturer_image", maxCount: 1 },
  ]),
  addProduct
);
productRouter.delete("/remove/:id", removeProduct);
productRouter.put(
  "/edit/:id",
  upload.fields([
    { name: "product_images", maxCount: 10 },
    { name: "manufacturer_image", maxCount: 1 },
  ]),
  editProduct
);
productRouter.get("/all", getAllProducts);
productRouter.get("/single/:id", getSingleProduct);

export default productRouter;
