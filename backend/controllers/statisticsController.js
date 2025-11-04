import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";
import { convertUSDtoIDR } from "../utils/currencyConverter.js";

const getStartOfPeriod = (period) => {
  const now = new Date();
  switch (period) {
    case "daily":
      return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    case "weekly":
      const firstDayOfWeek = now.getDate() - now.getDay();
      return new Date(now.getFullYear(), now.getMonth(), firstDayOfWeek);
    case "monthly":
      return new Date(now.getFullYear(), now.getMonth(), 1);
    case "yearly":
      return new Date(now.getFullYear(), 0, 1);
    default:
      return null;
  }
};

export const getReports = async (req, res) => {
  try {
    const { period } = req.query; // daily, weekly, monthly, yearly
    const startDate = getStartOfPeriod(period);

    if (!startDate) {
      return res.status(400).json({ message: "Invalid period" });
    }

    const userCount = await User.countDocuments({
      created_at: { $gte: startDate },
    });

    const productCount = await Product.countDocuments({
      created_at: { $gte: startDate },
    });

    const orders = await Order.find({
      created_at: { $gte: startDate },
    });

    const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);
    const orderCount = orders.length;

    res.status(200).json({
      success: true,
      message: `${period} report generated successfully`,
      data: {
        period,
        users: userCount,
        products: productCount,
        orders: orderCount,
        revenue: totalRevenue,
      },
    });
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate report",
      error: error.message,
    });
  }
};
export const getStatistics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();

    const orders = await Order.find();

    const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);

    const paymentMethods = {};
    const orderStatus = {};
    const productSales = {};

    // Collect product IDs from orders
    const productIds = new Set();

    orders.forEach((order) => {
      // Payment Methods Count
      paymentMethods[order.payment_method] =
        (paymentMethods[order.payment_method] || 0) + 1;

      // Order Status Count
      orderStatus[order.order_status] =
        (orderStatus[order.order_status] || 0) + 1;

      // Best-Selling Products
      order.products.forEach((product) => {
        productIds.add(product.product_id); // Collect product IDs

        if (!productSales[product.product_id]) {
          productSales[product.product_id] = {
            quantity: 0,
            revenue: 0,
          };
        }
        productSales[product.product_id].quantity += product.quantity;
        productSales[product.product_id].revenue +=
          product.price * product.quantity;
      });
    });

    // Fetch product names based on IDs
    const products = await Product.find({
      _id: { $in: Array.from(productIds) },
    });

    const productMap = products.reduce((acc, product) => {
      acc[product._id] = product.name;
      return acc;
    }, {});

    // Replace product_id with product name
    const bestSellingProducts = Object.entries(productSales)
      .map(([product_id, data]) => ({
        product_name: productMap[product_id] || "Unknown Product", // Use name or fallback to "Unknown Product"
        ...data,
      }))
      .sort((a, b) => b.quantity - a.quantity);

    res.json({
      totalUsers,
      totalOrders,
      totalProducts,
      totalRevenue,
      paymentMethods,
      orderStatus,
      bestSellingProducts,
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).send("Server error");
  }
};

export const getBestSellers = async (req, res) => {
  try {
    // 1. Get all orders to calculate sales
    const orders = await Order.find();

    const productSales = {};
    const productIdsSet = new Set();

    // 2. Accumulate quantity and revenue per product
    orders.forEach((order) => {
      order.products.forEach((product) => {
        const productId = product.product_id.toString();

        if (!productSales[productId]) {
          productSales[productId] = {
            quantity: 0,
            revenue: 0,
          };
        }

        productSales[productId].quantity += product.quantity;
        productSales[productId].revenue += product.price * product.quantity;
        productIdsSet.add(productId);
      });
    });

    // 3. Fetch manually selected best sellers
    const manualBestSellers = await Product.find({
      best_seller_manual: true,
    });

    const manualProductIds = manualBestSellers.map((p) => p._id.toString());

    // Helper to convert pricing to IDR
    const convertPricingToIDR = async (pricingArray) => {
      return await Promise.all(
        pricingArray.map(async (p) => {
          const totalIDR = await convertUSDtoIDR(p.total_price, false);
          const unitIDR = await convertUSDtoIDR(p.unit_price, false);
          return {
            ...p.toObject(),
            total_price: totalIDR,
            unit_price: unitIDR,
          };
        })
      );
    };

    // 4. Enrich manual best sellers with actual sales + convert pricing
    const enrichedManualBestSellers = await Promise.all(
      manualBestSellers.map(async (product) => {
        const id = product._id.toString();
        const saleData = productSales[id] || { quantity: 0, revenue: 0 };
        const convertedPricing = await convertPricingToIDR(product.pricing);

        return {
          ...product.toObject(),
          pricing: convertedPricing,
          unit_price: convertedPricing[0]?.unit_price_idr || 0,
          quantity_sold: saleData.quantity,
          total_revenue: saleData.revenue,
        };
      })
    );

    // 5. Auto best sellers (based on actual sales)
    const remainingCount = 10 - enrichedManualBestSellers.length;
    const autoProductIds = Array.from(productIdsSet).filter(
      (id) => !manualProductIds.includes(id)
    );
    const autoProducts = await Product.find({ _id: { $in: autoProductIds } });

    const productMap = {};
    autoProducts.forEach((product) => {
      productMap[product._id.toString()] = product;
    });

    const autoBestSellers = await Promise.all(
      Object.entries(productSales)
        .filter(([id]) => !manualProductIds.includes(id))
        .map(async ([id, data]) => {
          const product = productMap[id];
          if (!product) return null;

          const convertedPricing = await convertPricingToIDR(product.pricing);

          return {
            ...product.toObject(),
            pricing: convertedPricing,
            unit_price: convertedPricing[0]?.unit_price_idr || 0,
            quantity_sold: data.quantity,
            total_revenue: data.revenue,
          };
        })
    );

    const filteredAuto = autoBestSellers
      .filter(Boolean)
      .sort((a, b) => b.quantity_sold - a.quantity_sold)
      .slice(0, remainingCount);

    // 6. Combine both and respond
    const finalList = [...enrichedManualBestSellers, ...filteredAuto];

    res.status(200).json({
      success: true,
      message: "Hybrid best-seller products fetched successfully",
      products: finalList,
    });
  } catch (error) {
    console.error("Error fetching hybrid best sellers:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch hybrid best sellers",
      error: error.message,
    });
  }
};

export const getOrderStatusInfo = async (req, res) => {
  try {
    const orders = await Order.find();

    // Aggregate order statuses
    const orderStatusMap = orders.reduce((acc, order) => {
      const status = order.order_status || "Unknown";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    // Convert the object into an array
    const orderStatusInfo = Object.entries(orderStatusMap).map(
      ([status, count]) => ({
        status,
        count,
      })
    );

    res.status(200).json({
      success: true,
      message: "Order status information fetched successfully",
      orderStatusInfo: orderStatusInfo,
    });
  } catch (error) {
    console.error("Error fetching order status info:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order status info",
      error: error.message,
    });
  }
};

export const getPaymentMethodsInfo = async (req, res) => {
  try {
    const orders = await Order.find();

    // Aggregate payment methods
    const paymentMethodMap = orders.reduce((acc, order) => {
      const method = order.payment_method || "Unknown";
      acc[method] = (acc[method] || 0) + 1;
      return acc;
    }, {});

    // Convert the object into an array
    const paymentMethodInfo = Object.entries(paymentMethodMap).map(
      ([method, count]) => ({
        method,
        count,
      })
    );

    res.status(200).json({
      success: true,
      message: "Payment method information fetched successfully",
      paymentMethodsInfo: paymentMethodInfo,
    });
  } catch (error) {
    console.error("Error fetching payment method info:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch payment method info",
      error: error.message,
    });
  }
};
