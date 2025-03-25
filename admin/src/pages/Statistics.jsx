import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { FaChartBar, FaBox, FaUser, FaDollarSign } from "react-icons/fa";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";
import LoadingSpinner from "../components/LoadingSpinner";

const Statistics = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { currency } = useContext(ShopContext);
  const [stats, setStats] = useState(null);
  const [bestSellingProducts, setBestSellingProducts] = useState([]);
  const [orderStatusInfo, setOrderStatusInfo] = useState([]);
  const [paymentMethodsInfo, setPaymentMethodsInfo] = useState([]);
  const [period, setPeriod] = useState("daily");
  const [report, setReport] = useState({
    users: 0,
    products: 0,
    orders: 0,
    revenue: 0,
  });

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${
            import.meta.env.VITE_APP_API_URL
          }/api/statistics/report?period=${period}`
        );
        setReport(response.data.data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReport();
  }, [period]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/api/statistics`
        );
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching statistics:", error);
        toast.error("Failed to load statistics.");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchBestSellingProducts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/api/statistics/best-sellers`
        );
        setBestSellingProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching best selling products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchOrderStatusInfo = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/api/statistics/order-status-info`
        );
        console.log(response.data);
        setOrderStatusInfo(response.data.orderStatusInfo);
      } catch (error) {
        console.error("Error fetching order status info:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchPaymentMethodsInfo = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${
            import.meta.env.VITE_APP_API_URL
          }/api/statistics/payment-methods-info`
        );
        console.log(response.data);
        setPaymentMethodsInfo(response.data.paymentMethodsInfo);
      } catch (error) {
        console.error("Error fetching payment methods info:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
    fetchBestSellingProducts();
    fetchOrderStatusInfo();
    fetchPaymentMethodsInfo();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-8 bg-gray-100">
      <div className="max-w-8xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Reports</h1>

        {/* Stat Cards */}
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => setPeriod("daily")}
            className={`px-4 py-2 rounded ${
              period === "daily" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setPeriod("weekly")}
            className={`px-4 py-2 rounded ${
              period === "weekly" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            This Week
          </button>
          <button
            onClick={() => setPeriod("monthly")}
            className={`px-4 py-2 rounded ${
              period === "monthly" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setPeriod("yearly")}
            className={`px-4 py-2 rounded ${
              period === "yearly" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            This Year
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md flex items-center">
            <FaUser className="text-4xl mr-4" />
            <div>
              <h2 className="text-2xl font-bold">{report.users}</h2>
              <p>Total Users</p>
            </div>
          </div>

          <div className="bg-green-500 text-white p-6 rounded-lg shadow-md flex items-center">
            <FaBox className="text-4xl mr-4" />
            <div>
              <h2 className="text-2xl font-bold">{report.orders}</h2>
              <p>Total Orders</p>
            </div>
          </div>

          <div className="bg-yellow-500 text-white p-6 rounded-lg shadow-md flex items-center">
            <FaChartBar className="text-4xl mr-4" />
            <div>
              <h2 className="text-2xl font-bold">{report.products}</h2>
              <p>Total Products</p>
            </div>
          </div>

          <div className="bg-purple-500 text-white p-6 rounded-lg shadow-md flex items-center">
            <FaDollarSign className="text-4xl mr-4" />
            <div>
              <h2 className="text-2xl font-bold">
                {currency} {report.revenue.toLocaleString()}
              </h2>
              <p>Total Revenue</p>
            </div>
          </div>
        </div>

        {/* Payment Method Distribution */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Payment Methods</h2>
          <table className="w-full border-collapse bg-white shadow-md rounded-md">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 text-left">Payment Method</th>
                <th className="p-3 text-left">Count</th>
              </tr>
            </thead>
            <tbody>
              {paymentMethodsInfo.map((info, index) => (
                <tr key={index} className="border-b">
                  <td className="p-3">{info.method}</td>
                  <td className="p-3">{info.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Order Status Distribution */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Order Status Distribution
          </h2>
          <table className="w-full border-collapse bg-white shadow-md rounded-md">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Count</th>
              </tr>
            </thead>
            <tbody>
              {orderStatusInfo.map((info, index) => (
                <tr key={index} className="border-b">
                  <td className="p-3">{info.status}</td>
                  <td className="p-3">{info.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Best Selling Products */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Best Selling Products</h2>
          <table className="w-full border-collapse bg-white shadow-md rounded-md">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 text-center">Product Image</th>
                <th className="p-3 text-left">Product Name</th>
                <th className="p-3 text-left">Quantity Sold</th>
                <th className="p-3 text-left">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {bestSellingProducts.map((product) => (
                <tr key={product._id} className="border-b">
                  <td className="p-3 flex justify-center">
                    <img
                      src={product.product_images[0]}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                  </td>
                  <td className="p-3">{product.name}</td>
                  <td className="p-3">{product.quantity_sold}</td>
                  <td className="p-3">
                    {currency} {product.total_revenue.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
