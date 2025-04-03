import mongoose, { disconnect } from "mongoose";

const sitePreferencesModel = new mongoose.Schema({
  banners: [
    {
      image: { type: String },
    },
  ],
  delivery_charge: { type: Number, default: 0 },
  currency: { type: String },
});

export default mongoose.model("SitePreferences", sitePreferencesModel);
