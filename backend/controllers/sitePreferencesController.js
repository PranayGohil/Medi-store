// sitePreferencesController.js (Backend)

import SitePreferences from "../models/sitePreferencesModel.js";
import { v2 as cloudinary } from "cloudinary";

export const getSitePreferences = async (req, res) => {
  try {
    const sitePreferences = await SitePreferences.find();
    res.status(200).json(sitePreferences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addBanner = async (req, res) => {
  try {
    const { discription, title1, title2, title3 } = req.body;
    const banner_image = req.files && req.files.image;

    if (!banner_image) {
      return res.json({ success: false, message: "Please upload an image" });
    }

    let result = await cloudinary.uploader.upload(banner_image[0].path, {
      resource_type: "image",
    });

    let settings = await SitePreferences.findOne();
    if (!settings) {
      settings = new SitePreferences({ banners: [] });
      await settings.save();
    }
    settings.banners.push({
      discription,
      title1,
      title2,
      title3,
      image: result.secure_url,
    });
    await settings.save();
    res.json({ success: true, message: "Banner added successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const removeBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const settings = await SitePreferences.findOne();
    settings.banners = settings.banners.filter(
      (banner) => banner._id.toString() !== id
    );
    await settings.save();
    res.json({ success: true, message: "Banner removed successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const setDeliveryCharge = async (req, res) => {
  try {
    const { delivery_charge } = req.body;
    const settings = await SitePreferences.findOne();
    settings.delivery_charge = delivery_charge;
    await settings.save();
    res.json({ success: true, message: "Delivery charge updated successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
