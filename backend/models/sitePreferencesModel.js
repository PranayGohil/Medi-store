import mongoose, { disconnect } from "mongoose";

const sitePreferencesModel = new mongoose.Schema({
  banners: [
    {
      discription: { type: String },
      title1: { type: String },
      title2: { type: String },
      title3: { type: String },
      image: { type: String },
    },
  ],
  delivery_charge: { type: Number, default: 0 },
  currency: { type: String },
});

export default mongoose.model("SitePreferences", sitePreferencesModel);
