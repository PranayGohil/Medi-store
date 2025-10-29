import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";
import { CartContext } from "../context/CartContext";

const PaylabsCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useContext(CartContext);

  const [merchantTradeNo, setMerchantTradeNo] = useState(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedOrder = localStorage.getItem("pending_paylabs_order");
    setMerchantTradeNo(storedOrder);
  }, []);

  useEffect(() => {
    if (!merchantTradeNo) return;

    const verifyPayment = async () => {
      try {
        console.log("Verifying Paylabs payment for order:", merchantTradeNo);
        // if (!merchantTradeNo) {
        //   setError("Order information not found");
        //   setIsProcessing(false);
        //   return;
        // }

        // Query payment status from Paylabs
        const response = await axios.post(
          `${import.meta.env.VITE_APP_API_URL}/api/paylabs/query`,
          {
            merchantTradeNo: merchantTradeNo,
          }
        );
        console.log("Paylabs query response:", response.data);

        if (response.data.success) {
          const paymentData = response.data.data;
          setPaymentStatus(paymentData.status);

          // Update order in database
          const token = localStorage.getItem("token");

          if (paymentData.status === "02") {
            // Payment successful - update order status
            await axios.put(
              `${
                import.meta.env.VITE_APP_API_URL
              }/api/order/update-payment-status`,
              {
                order_id: merchantTradeNo,
                payment_status: "completed",
                payment_details: paymentData,
                order_status: "Order Placed",
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            // Clear cart
            await axios.delete(
              `${import.meta.env.VITE_APP_API_URL}/api/cart/clear-cart`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            clearCart();

            // Clear localStorage
            localStorage.removeItem("pending_paylabs_order");

            // Redirect to success page after 2 seconds
            setTimeout(() => {
              navigate("/payment-completed");
            }, 2000);
          } else if (
            paymentData.status === "03" ||
            paymentData.status === "04"
          ) {
            // Payment failed
            await axios.put(
              `${
                import.meta.env.VITE_APP_API_URL
              }/api/order/update-payment-status`,
              {
                order_id: merchantTradeNo,
                payment_status: "failed",
                payment_details: paymentData,
                order_status: "Payment Failed",
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            localStorage.removeItem("pending_paylabs_order");

            setTimeout(() => {
              navigate("/payment-cancelled");
            }, 2000);
          } else {
            // Payment still pending
            setPaymentStatus("PENDING");
          }
        } else {
          setError("Failed to verify payment status");
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
        setError(error.response?.data?.error || "Failed to verify payment");
      } finally {
        setIsProcessing(false);
      }
    };

    verifyPayment();
  }, [merchantTradeNo]);

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <h2 className="text-2xl font-semibold mt-4">Verifying Payment...</h2>
          <p className="text-gray-600 mt-2">
            Please wait while we confirm your payment
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-semibold mb-4">
            Payment Verification Error
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/order-history")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            View Order History
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8">
        {paymentStatus === "SUCCESS" || paymentStatus === "COMPLETED" ? (
          <>
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <h2 className="text-2xl font-semibold mb-4">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">
              Your payment has been processed successfully.
            </p>
            <p className="text-sm text-gray-500">Redirecting...</p>
          </>
        ) : paymentStatus === "FAILED" || paymentStatus === "CANCELLED" ? (
          <>
            <div className="text-red-500 text-6xl mb-4">✗</div>
            <h2 className="text-2xl font-semibold mb-4">Payment Failed</h2>
            <p className="text-gray-600 mb-6">
              Your payment could not be processed.
            </p>
            <p className="text-sm text-gray-500">Redirecting...</p>
          </>
        ) : (
          <>
            <div className="text-yellow-500 text-6xl mb-4">⏳</div>
            <h2 className="text-2xl font-semibold mb-4">Payment Pending</h2>
            <p className="text-gray-600 mb-6">
              Your payment is still being processed.
            </p>
            <button
              onClick={() => navigate("/order-history")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              View Order History
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaylabsCallback;
