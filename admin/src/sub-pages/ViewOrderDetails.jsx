import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import LoadingSpinner from "../components/LoadingSpinner";

const ViewOrderDetails = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { currency } = useContext(ShopContext);
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    const fetchOrder = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/api/order/single/${id}`
        );
        setOrder(response.data.order);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    fetchOrder();
  }, [id]);

  if (!order || isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold mb-6">Order Details</h1>

        {/* Order Summary */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <strong>Order ID:</strong> {order.order_id}
            </div>
            <div>
              <strong>User ID:</strong> {order.user_id}
            </div>
            <div>
              <strong>Total Amount:</strong>{" "}
              {currency + " " + order.total_amount}
            </div>
            <div>
              <strong>Payment Method:</strong> {order.payment_method}
            </div>
            <div>
              <strong>Order Status:</strong> {order.order_status}
            </div>
            <div>
              <strong>Created At:</strong>{" "}
              {new Date(order.created_at).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Products List */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Products</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="p-3 text-left">Product ID</th>
                <th className="p-3 text-left">Quantity</th>
                <th className="p-3 text-left">Price</th>
              </tr>
            </thead>
            <tbody>
              {order.products.map((product, index) => (
                <tr key={index} className="border-t">
                  <td className="p-3">{product.product_id}</td>
                  <td className="p-3">{product.quantity}</td>
                  <td className="p-3">{currency + " " + product.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewOrderDetails;
