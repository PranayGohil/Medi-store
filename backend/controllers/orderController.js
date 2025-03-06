import Order from "../models/orderModel.js";

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
        const order = await Order.findById(orderId);
        return res.json({ success: true, order });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
};

export const addOrder = async (req, res) => {
    try {
        const order = await Order.create(req.body);
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