import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import sendEmail from "../config/emailService.js";
import { generateInvoicePDF } from "../utils/generateInvoice.js";
import path from "path";
import fs from "fs";

const addOrderEmail = async (order) => {
  const { order_id, user_id, total } = order;
  const user = await User.findById(user_id);
  const email = user.email;
  const subject = "Order Placed Successfully";
  const html = `<p>Dear ${user.first_name},</p><p>Thank you for your order! Your order number is ${order_id} and the total amount is $${total}.</p>`;
  await sendEmail({ to: email, subject, html });
};

const updateOrderStatusEmail = async (order, status) => {
  const { order_id, user_id } = order;
  const user = await User.findById(user_id);
  const email = user.email;
  const subject = "Order Status Updated";
  const html = `<p>Dear ${user.first_name},</p><p>Your Order Status is ${status} for order number ${order_id}.</p>`;
  console.log("Email Info", email, subject, html);
  await sendEmail({ to: email, subject, html });
};

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

export const getSingleOrderByOrderId = async (req, res) => {
  try {
    const orderId = req.params.id;
    console.log("Order ID : ", orderId);
    const order = await Order.findOne({ order_id: orderId });
    return res.json({ success: true, order });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    console.log("Token:", token); // Check if token is received

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.id;

    const orders = await Order.find({ user_id: userId });

    const ordersWithProducts = await Promise.all(
      orders.map(async (order) => {
        const productsWithDetails = await Promise.all(
          order.products.map(async (productItem) => {
            const product = await Product.findById(productItem.product_id);

            if (!product) {
              console.warn(
                `Product not found for ID: ${productItem.product_id}`
              );
              return {
                _id: productItem.product_id, // Return only ID if product not found
                name: "Product not available",
                dosage_form: "N/A",
                net_quantity: productItem.net_quantity,
                quantity: productItem.quantity,
                price: productItem.price,
                product_images: [], // Empty array if product missing
              };
            }

            return {
              _id: product._id,
              name: product.name,
              dosage_form: product.dosage_form,
              net_quantity: productItem.net_quantity,
              quantity: productItem.quantity,
              price: productItem.price,
              product_images: product.product_images,
            };
          })
        );
        return {
          ...order.toObject(),
          products: productsWithDetails,
        };
      })
    );

    console.log("Orders with products:", ordersWithProducts);

    return res.json({ success: true, orders: ordersWithProducts });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ success: false, message: error.message });
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

    // Use provided order_id or generate new one
    const order_id =
      orderData.order_id ||
      "ORD-" + Date.now() + Math.floor(Math.random() * 1000);

    const order = await Order.create({
      ...orderData,
      user_id: userId,
      order_id,
      status_history: [
        {
          status: orderData.order_status,
          changed_at: new Date(),
        },
      ],
    });

    // Send order confirmation email
    try {
      await addOrderEmail(order);
    } catch (emailError) {
      console.error("Error sending order email:", emailError);
      // Continue even if email fails
    }

    return res.json({ success: true, order });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const { order_id, payment_status, payment_details, order_status } = req.body;
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decoded.id;

    // Find the order
    const order = await Order.findOne({ order_id, user_id: userId });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Update order
    order.payment_status = payment_status;
    order.order_status = order_status;
    order.payment_details = payment_details;

    // Add to status history
    order.status_history.push({
      status: order_status,
      changed_at: new Date(),
    });

    await order.save();

    return res.json({ success: true, order });
  } catch (error) {
    console.error("Error updating payment status:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const removeOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);
    return res.json({ success: true, message: "Order removed successfully" });
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
    order.status_history.push({
      status: order_status,
      changed_at: new Date(),
    });
    order.order_status = order_status;
    await order.save();
    await updateOrderStatusEmail(order, order_status);
    return res.json({ success: true, order });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

export const downloadInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    const productIds = order.products.map((p) => p.product_id);
    const products = await Product.find({ _id: { $in: productIds } });

    const filePath = path.join("invoices", `invoice-${order.order_id}.pdf`);

    // Generate the invoice and wait for write to finish
    await new Promise((resolve, reject) => {
      generateInvoicePDF(order, products, filePath);
      const interval = setInterval(() => {
        if (fs.existsSync(filePath)) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
      setTimeout(() => {
        reject(new Error("Timeout while waiting for PDF to be created."));
      }, 3000);
    });

    res.download(filePath, `Invoice-${order.order_id}.pdf`);
  } catch (err) {
    console.error("Error generating invoice:", err);
    res
      .status(500)
      .json({ error: "Failed to generate invoice", message: err.message });
  }
};
