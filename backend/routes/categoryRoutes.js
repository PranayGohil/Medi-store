import express from "express";
import { addCategory, getAllCategories, updateCategory } from "../controllers/categoryController.js";
import adminAuth from "../middleware/adminAuth.js";

const categoryRouter = express.Router();

categoryRouter.get("/all", getAllCategories);
categoryRouter.post("/add", addCategory);
categoryRouter.put("/update/:id", updateCategory);

export default categoryRouter;