import User from "../models/userModel.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";

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
    const bestSellers = await Order.aggregate([
      { $unwind: "$products" }, // Decompose products array
      {
        $group: {
          _id: "$products.product_id",
          totalQuantity: { $sum: "$products.quantity" },
          totalRevenue: {
            $sum: { $multiply: ["$products.quantity", "$products.price"] },
          },
        },
      },
      { $sort: { totalQuantity: -1 } }, // Sort by quantity sold
      { $limit: 5 }, // Fetch top 5 best sellers
      {
        $lookup: {
          from: "products", // Join with Product collection
          localField: "_id",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      { $unwind: "$productInfo" }, // Decompose the joined array
      {
        $project: {
          _id: 0,
          product_id: "$_id",
          name: "$productInfo.name",
          generic_name: "$productInfo.generic_name",
          manufacturer: "$productInfo.manufacturer",
          country_of_origin: "$productInfo.country_of_origin",
          dosage_form: "$productInfo.dosage_form",
          categories: "$productInfo.categories",
          product_images: "$productInfo.product_images",
          manufacturer_image: "$productInfo.manufacturer_image",
          description: "$productInfo.description",
          information: "$productInfo.information",
          pricing: "$productInfo.pricing",
          prescription_required: "$productInfo.prescription_required",
          rating: "$productInfo.rating",
          totalQuantity: 1,
          totalRevenue: 1,
        },
      },
    ]);

    res.json({ bestSellers });
  } catch (error) {
    console.error("Error fetching best-selling products:", error);
    res.status(500).send("Server error");
  }
};
