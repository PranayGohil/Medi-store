import express from "express";
import { addCategory, getAllCategories, updateCategory, deleteCategory } from "../controllers/categoryController.js";
import adminAuth from "../middleware/adminAuth.js";

const categoryRouter = express.Router();

categoryRouter.get("/all", getAllCategories);
categoryRouter.post("/add", adminAuth, addCategory);
categoryRouter.put("/update/:id", adminAuth, updateCategory);
categoryRouter.delete("/remove/:id", adminAuth, deleteCategory);

export default categoryRouter;