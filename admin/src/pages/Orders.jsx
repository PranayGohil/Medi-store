import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");

  const orders = [
    {
      id: "ORD12345",
      customer: "John Doe",
      total: 120,
      status: "Pending",
      date: "2025-02-25",
      products: ["Paracetamol", "Ibuprofen"],
    },
    {
      id: "ORD67890",
      customer: "Jane Smith",
      total: 250,
      status: "Completed",
      date: "2025-02-24",
      products: ["Aspirin"],
    },
    {
      id: "ORD54321",
      customer: "Alice Brown",
      total: 90,
      status: "Canceled",
      date: "2025-02-23",
      products: ["Cough Syrup", "Vitamin C", "Antibiotic"],
    },
  ];

  // Filtered Orders
  const filteredOrders = orders.filter((order) => {
    return (
      (order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (statusFilter === "" || order.status === statusFilter) &&
      (dateFilter === "" || order.date === dateFilter)
    );
  });

  const handleEditStatus = (order) => {
    setSelectedOrder(order);
    setSelectedStatus(order.status); // Set initial status in modal
    setShowEditModal(true);
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleSaveStatus = () => {
    // TODO: Update order status in your backend/data store
    console.log(
      "Updating order",
      selectedOrder.id,
      "to status:",
      selectedStatus
    );

    // Update the order status in the local state (for now)
    const updatedOrders = orders.map((order) =>
      order.id === selectedOrder.id
        ? { ...order, status: selectedStatus }
        : order
    );

    // Update the orders state (replace this with your actual state update logic)
    // setOrders(updatedOrders);

    setShowEditModal(false);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="w-full mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Orders</h1>

        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          {/* Search Bar */}
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Search by Order ID or Customer"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 pl-10 border rounded-md"
            />
            <FaSearch className="absolute top-3 left-3 text-gray-500" />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-1/4 p-3 border rounded-md"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Canceled">Canceled</option>
          </select>

          {/* Date Filter */}
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full md:w-1/4 p-3 border rounded-md"
          />
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow-md rounded-md">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="p-3 text-left">Order ID</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Products</th>
                <th className="p-3 text-left">Total Amount</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b">
                    <td className="p-3">{order.id}</td>
                    <td className="p-3">{order.customer}</td>
                    <td className="p-3">
                      <div className="flex flex-col">
                        {order.products.map((product, index) => (
                          <span key={index}>{product}</span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3">${order.total}</td>
                    <td className="p-3">{order.date}</td>
                    <td
                      className={`p-3 font-semibold ${
                        order.status === "Completed"
                          ? "text-green-600"
                          : order.status === "Pending"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {order.status}
                    </td>
                    <td className="p-3 flex justify-center">
                      <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                        onClick={() => navigate(`/order/order-details/67c9ad59a985b5e536c7b051`)}>
                        View
                      </button>
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded ml-2"
                        onClick={() => handleEditStatus(order)}
                      >
                        Edit Status
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-gray-500 p-3">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[100]">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Edit Order Status</h2>
            <p className="mb-4">Order ID: {selectedOrder.id}</p>
            <select
              value={selectedStatus}
              onChange={handleStatusChange}
              className="w-full p-3 border rounded-md mb-4"
            >
              <option value="Order Placed">Order Placed</option>
              <option value="Order Confirmed">Order Confirmed</option>
              <option value="Order Processing">Order Processing</option>
              <option value="Dispatched">Dispatched</option>
              <option value="In Transmit">In Transmit</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Order Delivered">Order Delivered</option>
              <option value="Order Cancelled">Order Cancelled</option>
              <option value="Return Request">Return Request</option>
              <option value="Returned">Returned</option>
            </select>
            <div className="flex justify-end gap-4">
              <button
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
                onClick={handleSaveStatus}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
