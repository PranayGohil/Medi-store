import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";
import { CartContext } from "../context/CartContext";

const PaylabsCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useContext(CartContext);

  const [pendingOrderJSON, setPendingOrderJSON] = useState(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedOrder = localStorage.getItem("pending_paylabs_order");
    setPendingOrderJSON(storedOrder);
  }, []);

  useEffect(() => {
    if (!pendingOrderJSON) return;
    const verifyPayment = async () => {
      try {
        // Get pending order data from localStorage
        // if (!pendingOrderJSON) {
        //   setError("Order information not found");
        //   setIsProcessing(false);
        //   setTimeout(() => navigate("/checkout"), 2000);
        //   return;
        // }

        const pendingOrderData = JSON.parse(pendingOrderJSON);
        const merchantTradeNo = pendingOrderData.merchantTradeNo;

        console.log("🔍 Verifying payment for:", merchantTradeNo);

        // Query payment status from Paylabs
        const response = await axios.post(
          `${import.meta.env.VITE_APP_API_URL}/api/paylabs/query`,
          {
            merchantTradeNo: merchantTradeNo,
          }
        );

        if (response.data.success) {
          const paymentData = response.data.data;
          setPaymentStatus(paymentData.status);

          console.log("💳 Payment Status:", paymentData.status);

          const token = localStorage.getItem("token");

          if (paymentData.status === "02") {
            // Payment successful - NOW create the order
            console.log("✅ Payment successful! Creating order...");

            const orderData = {
              order_id: merchantTradeNo,
              products: pendingOrderData.products,
              sub_total: pendingOrderData.sub_total,
              delivery_charge: pendingOrderData.delivery_charge,
              discount: pendingOrderData.discount || 0,
              discount_code: pendingOrderData.discount_code || "",
              total: pendingOrderData.total,
              delivery_address: pendingOrderData.delivery_address,
              payment_method: "paylabs",
              payment_status: "completed",
              payment_details: {
                ...pendingOrderData.payment_details,
                ...paymentData,
              },
              order_status: "Order Placed",
            };

            // Create order in database
            const addOrder = await axios.post(
              `${import.meta.env.VITE_APP_API_URL}/api/order/add`,
              orderData,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (!addOrder.data.success) {
              setError(addOrder.data.message);
              setIsProcessing(false);
              return;
            }

            console.log(
              "📦 Order created successfully:",
              addOrder.data.order.order_id
            );

            // Clear cart only after successful order creation
            try {
              const deleteCart = await axios.delete(
                `${import.meta.env.VITE_APP_API_URL}/api/cart/clear-cart`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              if (deleteCart.data.success) {
                console.log("🛒 Cart cleared successfully");
                clearCart();
              } else {
                console.warn(
                  "⚠️ Failed to clear cart:",
                  deleteCart.data.message
                );
                // Continue anyway - order was created successfully
              }
            } catch (cartError) {
              console.warn("⚠️ Error clearing cart:", cartError);
              // Continue anyway
            }

            // Clear localStorage
            localStorage.removeItem("pending_paylabs_order");

            console.log("✅ Order process completed successfully");

            // Redirect to success page after 2 seconds
            setTimeout(() => {
              navigate("/payment-completed");
            }, 2000);
          } else if (
            paymentData.status === "03" ||
            paymentData.status === "04"
          ) {
            // Payment failed - DO NOT create order
            console.log("❌ Payment failed or cancelled - Order NOT created");

            // Clear localStorage
            localStorage.removeItem("pending_paylabs_order");

            setTimeout(() => {
              navigate("/payment-cancelled");
            }, 2000);
          } else {
            // Payment still pending
            setPaymentStatus("PENDING");
            console.log("⏳ Payment still pending");

            // Don't clear localStorage yet - user might complete payment
            setTimeout(() => {
              setIsProcessing(false);
            }, 1000);
          }
        } else {
          setError("Failed to verify payment status");
          setIsProcessing(false);
        }
      } catch (error) {
        console.error("❌ Error verifying payment:", error);
        setError(error.response?.data?.error || "Failed to verify payment");
        setIsProcessing(false);
      }
    };

    verifyPayment();
  }, [pendingOrderJSON]);

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8">
          <LoadingSpinner />
          <h2 className="text-2xl font-semibold mt-4 text-gray-800">
            Verifying Payment...
          </h2>
          <p className="text-gray-600 mt-2">
            Please wait while we confirm your payment
          </p>
          <div className="mt-4 text-sm text-gray-500">
            <p>This may take a few moments</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Payment Verification Error
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/checkout")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition w-full"
          >
            Return to Checkout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg">
        {paymentStatus === "SUCCESS" || paymentStatus === "COMPLETED" ? (
          <>
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Payment Successful!
            </h2>
            <p className="text-gray-600 mb-4">
              Your payment has been processed successfully.
            </p>
            <p className="text-sm text-gray-500">
              Creating your order and redirecting...
            </p>
            <div className="mt-6">
              <div className="animate-pulse flex space-x-2 justify-center">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </>
        ) : paymentStatus === "FAILED" || paymentStatus === "CANCELLED" ? (
          <>
            <div className="text-red-500 text-6xl mb-4">✗</div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Payment Failed
            </h2>
            <p className="text-gray-600 mb-4">
              Your payment could not be processed.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              No order has been created. Your cart items are still saved.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/checkout")}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate("/cart")}
                className="w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition"
              >
                View Cart
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="text-yellow-500 text-6xl mb-4">⏳</div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Payment Pending
            </h2>
            <p className="text-gray-600 mb-4">
              Your payment is still being processed.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Please check back in a few minutes or refresh this page.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Check Status Again
              </button>
              <button
                onClick={() => navigate("/checkout")}
                className="w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition"
              >
                Return to Checkout
              </button>
            </div>
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <p className="text-xs text-yellow-800">
                💡 <strong>Note:</strong> If you closed the payment window, your
                order has not been created yet. You can safely return to
                checkout and try again.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaylabsCallback;
