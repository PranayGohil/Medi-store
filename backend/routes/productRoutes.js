import express from "express";
import {
  addProduct,
  removeProduct,
  editProduct,
  getAllProducts,
  getSingleProduct,
  getProductByAlias,
  productSuggestions,
  changeAvailableStatus,
  addReview,
  deleteReview,
  changeReviewStatus,
  getUserReviews,
  getProductReviews,
  getAllReviews,
} from "../controllers/productController.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const productRouter = express.Router();

productRouter.post(
  "/add",
  adminAuth,
  upload.fields([
    { name: "product_images", maxCount: 500 },
    { name: "manufacturer_image", maxCount: 1 },
  ]),
  addProduct
);
productRouter.delete("/remove/:id", adminAuth, removeProduct);
productRouter.put(
  "/edit/:id",
  adminAuth,
  upload.fields([
    { name: "product_images", maxCount: 10 },
    { name: "manufacturer_image", maxCount: 1 },
  ]),
  editProduct
);
productRouter.get("/all", getAllProducts);
productRouter.get("/single/:id", getSingleProduct);
productRouter.get("/single-by-alias/:alias", getProductByAlias);
productRouter.get("/suggestions", productSuggestions);
productRouter.put("/change-available-status/:id", adminAuth, changeAvailableStatus);

productRouter.post("/add-review/:productId", addReview);
productRouter.delete("/delete-review/:productId/:reviewId", deleteReview);
productRouter.put(
  "/change-review-status/:productId/:reviewId",
  adminAuth,
  changeReviewStatus
);
productRouter.get("/get-review/:productId/:userId", getUserReviews);
productRouter.get("/get-review/:productId", getProductReviews);
productRouter.get("/all-reviews", adminAuth, getAllReviews);

export default productRouter;
