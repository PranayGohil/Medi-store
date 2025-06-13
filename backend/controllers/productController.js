import Product from "../models/productModel.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

export const addProduct = async (req, res) => {
  try {
    const productData = req.body;

    const product_images = req.files.product_images;
    const manufacturer_image = req.files.manufacturer_image;

    console.log(productData);

    let productImageUrls = await Promise.all(
      product_images
        ? product_images.map(async (image) => {
            let result = await cloudinary.uploader.upload(image.path, {
              resource_type: "image",
            });
            return result.secure_url;
          })
        : []
    );

    let manufacturerImageUrl = await Promise.all(
      manufacturer_image
        ? manufacturer_image.map(async (image) => {
            let result = await cloudinary.uploader.upload(image.path, {
              resource_type: "image",
            });
            return result.secure_url;
          })
        : ""
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

export const removeProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    return res.json({ success: true, message: "Product removed successfully" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

export const editProduct = async (req, res) => {
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
      return res
        .status(400)
        .json({ message: "Invalid JSON for categories or pricing" });
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

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    return res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

export const getSingleProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    return res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

export const getProductByAlias = async (req, res) => {
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

export const getProductsByIds = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid product ID list" });
    }

    const products = await Product.find({ _id: { $in: ids } });

    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("Error fetching products by IDs:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const productSuggestions = async (req, res) => {
  try {
    console.log("suggestions");
    const suggestions = await Product.find({}).limit(5);
    return res.json({ success: true, suggestions });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

export const changeAvailableStatus = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    product.available = !product.available;
    await product.save();
    return res.json({ success: true, product, message: "Product updated." });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

export const toggleBestSeller = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    product.best_seller_manual = !product.best_seller_manual;
    await product.save();
    res.json({ success: true, message: "Updated best seller status" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Update failed" });
  }
};

export const addReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { user_id, comment, rating } = req.body;

    if (!user_id || !comment || rating === undefined) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    const newReview = { user_id, comment, rating, status: "pending" };
    product.reviews.push(newReview);

    // Update product rating
    const totalRating = product.reviews.reduce(
      (acc, review) => acc + review.rating,
      0
    );
    product.rating = totalRating / product.reviews.length;

    await product.save();
    res
      .status(201)
      .json({ message: "Review added successfully.", review: newReview });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { productId, reviewId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    const reviewIndex = product.reviews.findIndex(
      (review) => review._id.toString() === reviewId
    );
    if (reviewIndex === -1) {
      return res.status(404).json({ message: "Review not found." });
    }

    product.reviews.splice(reviewIndex, 1);

    // Update product rating
    if (product.reviews.length > 0) {
      const totalRating = product.reviews.reduce(
        (acc, review) => acc + review.rating,
        0
      );
      product.rating = totalRating / product.reviews.length;
    } else {
      product.rating = 0;
    }

    await product.save();
    res.status(200).json({ message: "Review deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

export const changeReviewStatus = async (req, res) => {
  try {
    const { productId, reviewId } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status." });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    const review = product.reviews.id(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found." });
    }

    review.status = status;
    await product.save();
    res
      .status(200)
      .json({ message: "Review status updated successfully.", review });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

export const getUserReviews = async (req, res) => {
  try {
    const { productId, userId } = req.params;

    // Find the product by ID
    const product = await Product.findById(productId);

    if (!product) {
      console.log("Product not found");
      return res.json({ message: "Product not found" });
    }

    // Find the review of the specific user
    const review = product.reviews.find((r) => r.user_id === userId);

    if (!review) {
      console.log("Review not found");
      return res.json({ message: "Review not found", found: false });
    }
    console.log("Review found", review);
    res.json({ review, found: true });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    res.json({ success: true, reviews: product.reviews });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const products = await Product.find({}, "name reviews");
    const allReviews = products.flatMap((product) =>
      product.reviews.map((review) => ({
        product_id: product._id,
        product_name: product.name,
        ...review.toObject(),
      }))
    );

    res.json({ success: true, reviews: allReviews });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
