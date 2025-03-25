import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import LoadingSpinner from "../components/LoadingSpinner";
const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [bestSellingProducts, setBestSellingProducts] = useState([]);

  const { currency } = useContext(ShopContext);
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
  useEffect(() => {
    fetchBestSellingProducts();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="w-full flex flex-wrap">
        <div className="w-full md:w-1/3 lg:w-1/4 sm:w-1/2 p-3">
          <Link
            to={"/orders"}
            className="bg-white flex justify-center align-center p-6 shadow-lg rounded-lg mt-6"
          >
            <h2 className="text-lg font-semibold">Manage Orders</h2>
          </Link>
        </div>
        <div className="w-full md:w-1/3 lg:w-1/4 sm:w-1/2 p-3">
          <Link
            to={"/categories"}
            className="bg-white flex justify-center align-center p-6 shadow-lg rounded-lg mt-6"
          >
            <h2 className="text-lg font-semibold">Manage Categories</h2>
          </Link>
        </div>
        <div className="w-full md:w-1/3 lg:w-1/4 sm:w-1/2 p-3">
          <Link
            to={"/products"}
            className="bg-white flex justify-center align-center p-6 shadow-lg rounded-lg mt-6"
          >
            <h2 className="text-lg font-semibold">Manage Products</h2>
          </Link>
        </div>
        <div className="w-full md:w-1/3 lg:w-1/4 sm:w-1/2 p-3">
          <Link
            to={"/reviews"}
            className="bg-white flex justify-center align-center p-6 shadow-lg rounded-lg mt-6"
          >
            <h2 className="text-lg font-semibold">Manage Reviews</h2>
          </Link>
        </div>
        <div className="w-full md:w-1/3 lg:w-1/4 sm:w-1/2 p-3">
          <Link
            to={"/users"}
            className="bg-white flex justify-center align-center p-6 shadow-lg rounded-lg mt-6"
          >
            <h2 className="text-lg font-semibold">Manage User</h2>
          </Link>
        </div>
        <div className="w-full md:w-1/3 lg:w-1/4 sm:w-1/2 p-3">
          <Link
            to={"/feedbacks"}
            className="bg-white flex justify-center align-center p-6 shadow-lg rounded-lg mt-6"
          >
            <h2 className="text-lg font-semibold">Manage Feedback</h2>
          </Link>
        </div>
        <div className="w-full md:w-1/3 lg:w-1/4 sm:w-1/2 p-3">
          <Link
            to={"/statistics"}
            className="bg-white flex justify-center align-center p-6 shadow-lg rounded-lg mt-6"
          >
            <h2 className="text-lg font-semibold">Watch Statistics</h2>
          </Link>
        </div>
        <div className="w-full md:w-1/3 lg:w-1/4 sm:w-1/2 p-3">
          <Link
            to={"/discount-coupons"}
            className="bg-white flex justify-center align-center p-6 shadow-lg rounded-lg mt-6"
          >
            <h2 className="text-lg font-semibold">Manage Coupons</h2>
          </Link>
        </div>
      </div>

      {/* Best Selling Products */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4 py-4">
          Best Selling Products
        </h2>
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
  );
};

export default Dashboard;
