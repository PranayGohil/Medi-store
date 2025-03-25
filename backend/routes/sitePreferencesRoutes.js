import express from "express";
import {
  getSitePreferences,
  addBanner,
  removeBanner,
  setDeliveryCharge,
} from "../controllers/sitePreferencesController.js";

import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const sitePreferencesRouter = express.Router();

sitePreferencesRouter.get("/", getSitePreferences);
sitePreferencesRouter.post(
  "/add-banner",
  adminAuth,
  upload.fields([{ name: "image", maxCount: 1 }]),
  addBanner
);
sitePreferencesRouter.delete("/remove-banner/:id", adminAuth, removeBanner);
sitePreferencesRouter.put("/set-delivery-charge", adminAuth, setDeliveryCharge);

export default sitePreferencesRouter;
