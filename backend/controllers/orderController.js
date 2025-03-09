import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import jwt from "jsonwebtoken";

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({});
    return res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

export const getSingleOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    console.log("Order ID : ", orderId);
    const order = await Order.findById(orderId);
    return res.json({ success: true, order });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    console.log("User Orders");
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.id;
    const orders = await Order.find({ user_id: userId });

    // Fetch product details for each order
    const ordersWithProducts = await Promise.all(
      orders.map(async (order) => {
        const productsWithDetails = await Promise.all(
          order.products.map(async (productItem) => {
            const product = await Product.findById(productItem.product_id);
            return {
              _id: product._id,
              name: product.name,
              dosage_form: product.dosage_form,
              net_quantity: productItem.net_quantity,
              quantity: productItem.quantity,
              price: productItem.price,
              product_images: product.product_images, // Include product_images
            };
          })
        );
        return {
          ...order.toObject(),
          products: productsWithDetails,
        };
      })
    );

    return res.json({ success: true, orders: ordersWithProducts });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

export const addOrder = async (req, res) => {
  try {
    const orderData = req.body;
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.id;

    const order_id = "ORD-" + Date.now() + Math.floor(Math.random() * 1000);
    // const order_id = "ORD-" + Math.floor(Math.random() * 1000000);

    console.log("Order ID : ", order_id);
    console.log("User ID : ", userId);
    console.log("Order Info : ", orderData);

    const order = await Order.create({
      ...orderData,
      user_id: userId,
      order_id,
    });
    return res.json({ success: true, order });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { order_status } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.json({ success: false, message: "Order not found" });
    }
    order.order_status = order_status;
    await order.save();
    return res.json({ success: true, order });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};
