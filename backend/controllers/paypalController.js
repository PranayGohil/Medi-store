import got from "got";
import Order from "../models/orderModel.js";

const getAccessToken = async () => {
  try {
    const response = await got.post(
      `${process.env.PAYPAL_BASE_URL}/v1/oauth2/token`,
      {
        form: {
          grant_type: "client_credentials",
        },
        username: process.env.PAYPAL_CLIENT_ID,
        password: process.env.PAYPAL_SECRET,
        responseType: "json",
      }
    );

    return response.body.access_token;
  } catch (error) {
    console.error("Error getting PayPal access token:", error.message);
    throw error;
  }
};

export const createOrder = async (req, res) => {
  try {
    const { total, products } = req.body;


    const accessToken = await getAccessToken();

    const response = await got.post(
      `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        json: {
          intent: "CAPTURE",
          purchase_units: [
            {
              items: [
                {
                  name: "Pranay ki Company",
                  description: "Pranay ki Company",
                  quantity: "1",
                  unit_amount: {
                    currency_code: "USD",
                    value: total,
                  },
                },
              ],
              amount: {
                currency_code: "USD",
                value: total,
                breakdown: {
                  item_total: {
                    currency_code: "USD",
                    value: total,
                  },
                },
              },
            },
          ],
          application_context: {
            brand_name: "Medi-Store",
            shipping_preference: "NO_SHIPPING",
            user_action: "PAY_NOW",
            return_url: `${process.env.PAYPAL_REDIRECT_URL}/complete`,
            cancel_url: `${process.env.PAYPAL_REDIRECT_URL}/cancel`,
          },
        },
        responseType: "json",
      }
    );

    console.log("Order created:", response.body);
    res.json({ id: response.body.id, message: "Order created successfully" });
  } catch (error) {
    console.error("Error creating order:", error.message);
    res.status(500).json({ error: "Failed to create PayPal order" });
  }
};

// Capture PayPal Order
export const captureOrder = async (req, res) => {
  const accessToken = await getAccessToken();
  const { orderID } = req.body;

  console.log("*************************", req.body);

  if (!orderID) {
    return res.status(400).json({ error: "Order ID is required" });
  }

  try {
    const response = await got.get(
      `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders/${orderID}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        responseType: "json",
      }
    );

    console.log("Order captured:", response.body);

    // Check if PayPal responded with a successful status
    if (response.statusCode === 201 || response.statusCode === 200) {
      const captureData = response.body;

      // Update MongoDB order status
      await Order.findOneAndUpdate(
        { order_id: orderID },
        {
          payment_status: "completed",
          paypal_order_id: orderID,
          payment_details: captureData,
        }
      );

      res.json({
        message: "Payment captured successfully",
        data: captureData,
      });
    } else {
      console.error("Failed to capture PayPal order:", response.body);
      res.status(500).json({ error: "Failed to capture PayPal order" });
    }
  } catch (error) {
    console.error(
      "Error capturing order:",
      error.response?.body || error.message
    );
    res.status(500).json({ error: "Failed to capture PayPal order" });
  }
};
