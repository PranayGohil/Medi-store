import { Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";

const Dashboard = () => {
  // Sample data for Bar Chart (Monthly Sales)
  const barData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Monthly Sales ($)",
        data: [5000, 7000, 8000, 6500, 9000, 11000],
        backgroundColor: "rgba(54, 162, 235, 0.7)",
        borderRadius: 5,
      },
    ],
  };

  // Sample data for Pie Chart (Category Distribution)
  const pieData = {
    labels: ["Electronics", "Clothing", "Home", "Beauty", "Sports"],
    datasets: [
      {
        data: [30, 20, 25, 15, 10], // Percentages
        backgroundColor: [
          "#4CAF50",
          "#FF9800",
          "#2196F3",
          "#E91E63",
          "#9C27B0",
        ],
      },
    ],
  };

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

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white p-6 shadow-lg rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Monthly Sales</h2>
          <div className="h-52">
            <Bar data={barData} />
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 shadow-lg rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Category Distribution</h2>
          <div className="h-52 flex justify-center">
            <Pie data={pieData} />
          </div>
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
