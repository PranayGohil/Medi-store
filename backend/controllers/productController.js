import Product from "../models/productModel.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

const addProduct = async (req, res) => {
  try {
    const productData = req.body;

    const product_images = req.files.product_images;
    const manufacturer_image = req.files.manufacturer_image;

    console.log(productData);

    let productImageUrls = await Promise.all(
      product_images.map(async (image) => {
        let result = await cloudinary.uploader.upload(image.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    let manufacturerImageUrl = await Promise.all(
      manufacturer_image.map(async (image) => {
        let result = await cloudinary.uploader.upload(image.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    let alias = productData.name.split(" ").join("-").toLowerCase();
    let suffix = 1;
    let newAlias = alias;

    // Check if alias already exists
    while (await Product.findOne({ alias: newAlias })) {
      newAlias = `${alias}-${suffix}`;
      suffix++;
    }

    alias = newAlias;

    const product_data = {
      ...productData,
      categories: JSON.parse(productData.categories),
      pricing: JSON.parse(productData.pricing),
      product_images: productImageUrls,
      manufacturer_image: manufacturerImageUrl[0],
      alias: alias,
    };

    const product = new Product(product_data);
    await product.save();
    return res.json({ success: true, product_data });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

const removeProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    return res.json({ success: true, message: "Product removed successfully" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      product_code,
      name,
      generic_name,
      manufacturer,
      country_of_origin,
      dosage_form,
      categories,
      description,
      information,
      pricing,
      stock_quantity,
      prescription_required,
      existingProductImages,
      existingManufacturerImage,
    } = req.body;

    let parsedCategories;
    let parsedPricing;

    try {
      parsedCategories = JSON.parse(categories);
      parsedPricing = JSON.parse(pricing);
    } catch (parseError) {
      console.error("Error parsing categories or pricing:", parseError);
      return res.status(400).json({ message: "Invalid JSON for categories or pricing" });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let updatedProductImages = [];
    let updatedManufacturerImage = null;

    if (existingProductImages) {
      updatedProductImages =
        typeof existingProductImages === "string"
          ? [existingProductImages]
          : existingProductImages;
    }

    if (existingManufacturerImage) {
      updatedManufacturerImage = existingManufacturerImage;
    }

    if (req.files && req.files.product_images) {
      const productImagesFiles = req.files.product_images;
      if (Array.isArray(productImagesFiles)) {
        for (const file of productImagesFiles) {
          const result = await cloudinary.uploader.upload(file.path);
          updatedProductImages.push(result.secure_url);
          fs.unlinkSync(file.path);
        }
      } else {
        const result = await cloudinary.uploader.upload(
          productImagesFiles.path
        );
        updatedProductImages.push(result.secure_url);
        fs.unlinkSync(productImagesFiles.path);
      }
    }

    if (req.files && req.files.manufacturer_image) {
      const manufacturerImageFile = req.files.manufacturer_image[0];
      const result = await cloudinary.uploader.upload(
        manufacturerImageFile.path
      );
      updatedManufacturerImage = result.secure_url;
      fs.unlinkSync(manufacturerImageFile.path);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        product_code,
        name,
        generic_name,
        manufacturer,
        country_of_origin,
        dosage_form,
        categories: parsedCategories,
        product_images: updatedProductImages,
        manufacturer_image: updatedManufacturerImage,
        description,
        information,
        pricing: parsedPricing,
        stock_quantity,
        prescription_required: prescription_required === "true",
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({ product: updatedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    return res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

const getSingleProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    return res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

const getProductByAlias = async (req, res) => {
  try {
    const alias = req.params.alias;
    const product = await Product.findOne({ alias: alias });
    console.log("Product", product);
    return res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

export {
  addProduct,
  removeProduct,
  editProduct,
  getAllProducts,
  getSingleProduct,
  getProductByAlias,
};
