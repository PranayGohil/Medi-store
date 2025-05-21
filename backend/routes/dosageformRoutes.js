import express from "express";
import { addDosageform, getAllDosageform, updateDosageform, deleteDosageform } from "../controllers/dosageformController.js";
import adminAuth from "../middleware/adminAuth.js";

const dosageformRouter = express.Router();

dosageformRouter.get("/all", getAllDosageform);
dosageformRouter.post("/add", adminAuth, addDosageform);
dosageformRouter.put("/update/:id", adminAuth, updateDosageform);
dosageformRouter.delete("/remove/:id", adminAuth, deleteDosageform);

export default dosageformRouter;