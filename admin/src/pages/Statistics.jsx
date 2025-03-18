import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { FaChartBar, FaBox, FaUser, FaDollarSign } from "react-icons/fa";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";

const Statistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currency } = useContext(ShopContext);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/api/statistics`
        );
        setStats(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching statistics:", error);
        toast.error("Failed to load statistics.");
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p className="text-center">Loading...</p>;
  if (!stats)
    return <p className="text-center text-red-500">No statistics available</p>;

  return (
    <div className="p-8 bg-gray-100">
      <div className="max-w-8xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Store Statistics
        </h1>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md flex items-center">
            <FaUser className="text-4xl mr-4" />
            <div>
              <h2 className="text-2xl font-bold">{stats.totalUsers}</h2>
              <p>Total Users</p>
            </div>
          </div>

          <div className="bg-green-500 text-white p-6 rounded-lg shadow-md flex items-center">
            <FaBox className="text-4xl mr-4" />
            <div>
              <h2 className="text-2xl font-bold">{stats.totalOrders}</h2>
              <p>Total Orders</p>
            </div>
          </div>

          <div className="bg-yellow-500 text-white p-6 rounded-lg shadow-md flex items-center">
            <FaChartBar className="text-4xl mr-4" />
            <div>
              <h2 className="text-2xl font-bold">{stats.totalProducts}</h2>
              <p>Total Products</p>
            </div>
          </div>

          <div className="bg-purple-500 text-white p-6 rounded-lg shadow-md flex items-center">
            <FaDollarSign className="text-4xl mr-4" />
            <div>
              <h2 className="text-2xl font-bold">
                {currency} {stats.totalRevenue.toFixed(2)}
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
              {Object.entries(stats.paymentMethods).map(([method, count]) => (
                <tr key={method} className="border-b">
                  <td className="p-3">{method}</td>
                  <td className="p-3">{count}</td>
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
              {Object.entries(stats.orderStatus).map(([status, count]) => (
                <tr key={status} className="border-b">
                  <td className="p-3">{status}</td>
                  <td className="p-3">{count}</td>
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
                <th className="p-3 text-left">Product ID</th>
                <th className="p-3 text-left">Quantity Sold</th>
                <th className="p-3 text-left">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {stats.bestSellingProducts.map((product) => (
                <tr key={product.product_id} className="border-b">
                  <td className="p-3">{product.product_name}</td>
                  <td className="p-3">{product.quantity}</td>
                  <td className="p-3">
                    {currency} {product.revenue.toFixed(2)}
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
