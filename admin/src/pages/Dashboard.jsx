import React from "react";
import { Link } from "react-router-dom";
const Dashboard = () => {
  // Sample Best Selling Products (with images)
  const bestSellingProducts = [
    {
      id: 1,
      name: "Smartphone X",
      category: "Electronics",
      sales: 150,
      image: "https://picsum.photos/60?random=1", // Replace with actual image URL
    },
    {
      id: 2,
      name: "Wireless Headphones",
      category: "Electronics",
      sales: 120,
      image: "https://picsum.photos/60?random=2",
    },
    {
      id: 3,
      name: "Running Shoes",
      category: "Sports",
      sales: 100,
      image: "https://picsum.photos/60?random=3",
    },
    {
      id: 4,
      name: "Smartwatch Pro",
      category: "Electronics",
      sales: 95,
      image: "https://picsum.photos/60?random=4",
    },
    {
      id: 5,
      name: "Gaming Laptop",
      category: "Electronics",
      sales: 80,
      image: "https://picsum.photos/60?random=5",
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
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
      </div>

      {/* Best Selling Products Table */}
      <div className="bg-white p-6 shadow-lg rounded-lg mt-6">
        <h2 className="text-lg font-semibold mb-4">Best Selling Products</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Sales</th>
            </tr>
          </thead>
          <tbody>
            {bestSellingProducts.map((product, index) => (
              <tr
                key={product.id}
                className="border-t bg-white hover:bg-gray-50 transition"
              >
                <td className="p-3">{index + 1}</td>
                <td className="p-3">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 rounded-md shadow-sm"
                  />
                </td>
                <td className="p-3 font-medium">{product.name}</td>
                <td className="p-3">{product.category}</td>
                <td className="p-3 font-semibold text-blue-600">
                  {product.sales}
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
