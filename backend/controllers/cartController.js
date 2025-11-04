import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import jwt from "jsonwebtoken";
import { convertUSDtoIDR } from "../utils/currencyConverter.js";

export const addToCart = async (req, res) => {
  try {
    const { userId, product_id, net_quantity, price, quantity } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const cartItem = {
      product_id,
      net_quantity,
      quantity,
    };

    user.cartData.push(cartItem);
    await user.save();

    res.json({ success: true, message: "Product added to cart" });
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getCartItems = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const cartItems = [];
    let totalCartPrice = 0;
    let allAvailable = true;
    for (const cartItem of user.cartData) {
      const product = await Product.findById(cartItem.product_id);

      if (product) {

        const convertedPricing = await Promise.all(
          product.pricing.map(async (priceItem) => {
            const convertedTotal = await convertUSDtoIDR(priceItem.total_price, false); // false → use static rate for speed
            const convertedUnit = await convertUSDtoIDR(priceItem.unit_price, false);
            return {
              ...priceItem.toObject(),
              total_price: convertedTotal,
              unit_price: convertedUnit,
            };
          })
        );

        const convertedProduct = {
          ...product.toObject(),
          pricing: convertedPricing,
        };

        // Find the correct pricing based on the net quantity
        const pricing = convertedProduct.pricing.find(
          (p) => p.net_quantity === cartItem.net_quantity
        );

        if (pricing) {
          const itemTotal = pricing.total_price * cartItem.quantity;
          if (convertedProduct.available) {
            totalCartPrice += itemTotal;
          } else {
            allAvailable = false;
          }

          cartItems.push({
            id: convertedProduct._id,
            name: convertedProduct.name,
            available: convertedProduct.available,
            generic_name: convertedProduct.generic_name,
            dosage_form: convertedProduct.dosage_form,
            price: pricing.total_price,
            quantity: cartItem.quantity,
            net_quantity: cartItem.net_quantity,
            image: convertedProduct.product_images[0], // Assuming the first image is the main image
            total: itemTotal,
          });
        }
      }
    }

    res.json({ success: true, cartItems, totalCartPrice, allAvailable });
  } catch (error) {
    console.error("Error fetching cart data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCartItemsById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const cartItems = [];
    let totalCartPrice = 0;

    for (const cartItem of user.cartData) {
      const product = await Product.findById(cartItem.product_id);

      if (product) {

        // Convert product pricing from USD to IDR
        const convertedPricing = await Promise.all(
          product.pricing.map(async (priceItem) => {
            const convertedTotal = await convertUSDtoIDR(priceItem.total_price, false); // false → use static rate for speed
            const convertedUnit = await convertUSDtoIDR(priceItem.unit_price, false);
            return {
              ...priceItem.toObject(),
              total_price: convertedTotal,
              unit_price: convertedUnit,
            };
          })
        );

        const convertedProduct = {
          ...product.toObject(),
          pricing: convertedPricing,
        };

        // Find the correct pricing based on the net quantity
        const pricing = convertedProduct.pricing.find(
          (p) => p.net_quantity === cartItem.net_quantity
        );

        if (pricing) {
          const itemTotal = pricing.total_price * cartItem.quantity;
          totalCartPrice += itemTotal;

          cartItems.push({
            id: convertedProduct._id,
            name: convertedProduct.name,
            generic_name: convertedProduct.generic_name,
            dosage_form: convertedProduct.dosage_form,
            price: pricing.total_price,
            quantity: cartItem.quantity,
            net_quantity: cartItem.net_quantity,
            image: convertedProduct.product_images[0], // Assuming the first image is the main image
            total: itemTotal,
          });
        }
      }
    }
    console.log(cartItems);

    res.json({ success: true, cartItems, totalCartPrice });
  } catch (error) {
    console.error("Error fetching cart data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const changeCartQuantity = async (req, res) => {
  try {
    console.log(req.body);
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.json({ success: false, message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    } else {
      const productId = req.params.productId;
      const cartItemIndex = user.cartData.findIndex(
        (item) => item.product_id.toString() === productId
      );
      if (cartItemIndex === -1) {
        return res.json({
          success: false,
          message: "Product not found in cart",
        });
      }
      user.cartData[cartItemIndex].quantity = req.body.quantity;
      await user.save();
      res.json({ success: true, message: "Quantity updated successfully" });
    }
  } catch (error) {
    console.error("Error updating cart quantity:", error);
    res.json({ success: false, message: "Internal server error" });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.json({ success: false, message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const productId = req.params.productId;
    const netQuantity = req.params.netQuantity;
    console.log("Product : ", productId, netQuantity);
    console.log(user.cartData);
    const cartItemIndex = user.cartData.findIndex(
      (item) => (item.product_id.toString() === productId && item.net_quantity.toString() === netQuantity)
    );

    console.log(cartItemIndex);

    if (cartItemIndex === -1) {
      return res.json({ success: false, message: "Product not found in cart" });
    }

    user.cartData.splice(cartItemIndex, 1);
    await user.save();

    res.json({ success: true, message: "Product removed from cart" });
  } catch (error) {
    console.error("Error removing product from cart:", error);
    res.json({ success: false, message: "Internal server error" });
  }
};

export const clearCart = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.json({ success: false, message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    user.cartData = [];
    await user.save();

    res.json({ success: true, message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.json({ success: false, message: "Internal server error" });
  }
};
