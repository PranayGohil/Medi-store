import express from "express";
import { createPaylabsPayment, queryPaylabsPayment, paylabsCallback } from "../controllers/paylabsController.js";

const paylabsRouter = express.Router();

paylabsRouter.post("/create", createPaylabsPayment);
paylabsRouter.post("/query", queryPaylabsPayment);
paylabsRouter.post("/callback", paylabsCallback);

export default paylabsRouter;