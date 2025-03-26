import { useState, useEffect } from "react";
import { FaSearch, FaSortUp, FaSortDown, FaEdit, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";

const Orders = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    const fetchOrders = async () => {
      setError(null);
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/api/order/all`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (
          response.data.success === false &&
          response.data.message === "Unauthorized"
        ) {
          toast.error(response.data.message);
          navigate("/login");
          return;
        }
        const ordersWithProducts = await Promise.all(
          response.data.orders.map(async (order) => {
            const productsWithDetails = await Promise.all(
              order.products.map(async (productItem) => {
                try {
                  const productResponse = await axios.get(
                    `${import.meta.env.VITE_APP_API_URL}/api/product/single/${
                      productItem.product_id
                    }`
                  );
                  return {
                    ...productResponse.data.product,
                    net_quantity: productItem.net_quantity,
                    quantity: productItem.quantity,
                    price: productItem.price,
                  };
                } catch (productError) {
                  console.error(
                    `Error fetching product ${productItem.product_id}:`,
                    productError
                  );
                  return {
                    _id: productItem.product_id,
                    name: "Product Not Found",
                    net_quantity: productItem.net_quantity,
                    quantity: productItem.quantity,
                    price: productItem.price,
                  };
                }
              })
            );
            return { ...order, products: productsWithDetails };
          })
        );
        // Sort feedbacks by created_at (newest first)
        const sortedOrders = ordersWithProducts.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setOrders(sortedOrders);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Filtered Orders
  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.created_at).toISOString().split("T")[0];
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      order.order_id.toLowerCase().includes(searchLower) ||
      order.delivery_address[0]?.first_name
        .toLowerCase()
        .includes(searchLower) ||
      order.delivery_address[0]?.last_name
        .toLowerCase()
        .includes(searchLower) ||
      order.products.some(
        (product) =>
          product.name?.toLowerCase().includes(searchLower) ||
          product.generic_name?.toLowerCase().includes(searchLower)
      );
    console.log(" Order Date : ", orderDate);
    console.log(" Date Filter : ", dateFilter);

    return (
      matchesSearch &&
      (statusFilter === "" || order.order_status === statusFilter) &&
      (dateFilter === "" || orderDate === dateFilter)
    );
  });

  // Sorting Logic
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (!sortColumn) return 0;

    let aValue, bValue;
    if (sortColumn === "order_id") {
      aValue = a.order_id;
      bValue = b.order_id;
    } else if (sortColumn === "customer") {
      aValue = `${a.delivery_address[0]?.first_name} ${a.delivery_address[0]?.last_name}`;
      bValue = `${b.delivery_address[0]?.first_name} ${b.delivery_address[0]?.last_name}`;
    } else if (sortColumn === "total") {
      aValue = a.total;
      bValue = b.total;
    } else if (sortColumn === "created_at") {
      aValue = new Date(a.created_at);
      bValue = new Date(b.created_at);
    } else if (sortColumn === "order_status") {
      aValue = a.order_status;
      bValue = b.order_status;
    } else {
      return 0;
    }

    if (sortDirection === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleEditStatus = (order) => {
    setSelectedOrder(order);
    setSelectedStatus(order.order_status);
    setShowEditModal(true);
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleSaveStatus = async () => {
    try {
      setIsLoading(true);
      const response = await axios.put(
        `${import.meta.env.VITE_APP_API_URL}/api/order/update-status/${
          selectedOrder._id
        }`,
        {
          order_status: selectedStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (
        response.data.success === false &&
        response.data.message === "Unauthorized"
      ) {
        toast.error(response.data.message);
        navigate("/login");
        return;
      }
      const updatedOrders = orders.map((order) =>
        order._id === selectedOrder._id
          ? { ...order, order_status: selectedStatus }
          : order
      );
      setOrders(updatedOrders);
      setShowEditModal(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    console.log("Date String : ", dateString);
    const date = new Date(dateString);
    console.log("Date : ", date);
    const day = String(date.getDate()).padStart(2, "0");
    console.log("Day : ", day);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    console.log("Month : ", month);
    const year = date.getFullYear();
    console.log("Year : ", year);
    return `${day}-${month}-${year}`;
  };

  // Pagination
  const offset = currentPage * itemsPerPage;
  const currentOrders = sortedOrders.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(sortedOrders.length / itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="p-8 bg-gray-100">Error: {error}</div>;
  }

  return (
    <div className="p-8 bg-gray-100">
      <div className="w-full mx-auto bg-white shadow-md p-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Orders</h1>

        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          {/* Search Bar */}
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Search by Order ID, Customer, Product"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 pl-10 border"
            />
            <FaSearch className="absolute top-3 left-3 text-gray-500" />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-1/4 p-3 border"
          >
            <option value="">All Statuses</option>
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

          {/* Date Filter */}
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full md:w-1/4 p-3 border"
          />
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow-md">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th
                  className="p-3 text-left cursor-pointer"
                  onClick={() => handleSort("order_id")}
                >
                  Order ID
                  {sortColumn === "order_id" &&
                    (sortDirection === "asc" ? (
                      <FaSortUp className="inline ml-1" />
                    ) : (
                      <FaSortDown className="inline ml-1" />
                    ))}
                </th>
                <th
                  className="p-3 text-left cursor-pointer"
                  onClick={() => handleSort("customer")}
                >
                  Customer
                  {sortColumn === "customer" &&
                    (sortDirection === "asc" ? (
                      <FaSortUp className="inline ml-1" />
                    ) : (
                      <FaSortDown className="inline ml-1" />
                    ))}
                </th>
                <th className="p-3 text-left">Products</th>
                <th
                  className="p-3 text-left cursor-pointer"
                  onClick={() => handleSort("total")}
                >
                  Total Amount
                  {sortColumn === "total" &&
                    (sortDirection === "asc" ? (
                      <FaSortUp className="inline ml-1" />
                    ) : (
                      <FaSortDown className="inline ml-1" />
                    ))}
                </th>
                <th
                  className="p-3 text-left cursor-pointer"
                  onClick={() => handleSort("created_at")}
                >
                  Date
                  {sortColumn === "created_at" &&
                    (sortDirection === "asc" ? (
                      <FaSortUp className="inline ml-1" />
                    ) : (
                      <FaSortDown className="inline ml-1" />
                    ))}
                </th>
                <th
                  className="p-3 text-left cursor-pointer"
                  onClick={() => handleSort("order_status")}
                >
                  Status
                  {sortColumn === "order_status" &&
                    (sortDirection === "asc" ? (
                      <FaSortUp className="inline ml-1" />
                    ) : (
                      <FaSortDown className="inline ml-1" />
                    ))}
                </th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.length > 0 ? (
                currentOrders.map((order) => (
                  <tr key={order._id} className="border-b">
                    <td className="p-3">{order.order_id}</td>
                    <td className="p-3">
                      {order.delivery_address[0]?.first_name}{" "}
                      {order.delivery_address[0]?.last_name}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-col">
                        {order.products.map((product, index) => (
                          <span key={index}>{product.name}</span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3">${order.total.toFixed(2)}</td>
                    <td className="p-3">{formatDate(order.created_at)}</td>
                    <td
                      className={`p-3 font-semibold ${
                        order.order_status === "Order Delivered"
                          ? "text-green-600"
                          : order.order_status === "pending"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {order.order_status}
                    </td>
                    <td className="p-3 flex justify-center">
                      <button
                        className="bg-blue-400 hover:bg-blue-500 text-white py-2 px-4"
                        onClick={() =>
                          navigate(`/order/order-details/${order._id}`)
                        }
                      >
                        <FaEye className="inline mr-2" />
                        View
                      </button>
                      <button
                        className="bg-green-400 hover:bg-green-500 text-white py-2 px-4 ml-2"
                        onClick={() => handleEditStatus(order)}
                      >
                        <FaEdit className="inline mr-2" />
                        Edit Status
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-gray-500 p-3">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <ReactPaginate
          previousLabel={"previous"}
          nextLabel={"next"}
          breakLabel={"..."}
          breakClassName={"break-me"}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageClick}
          containerClassName={"pagination flex justify-center mt-4"}
          subContainerClassName={"pages pagination"}
          activeClassName={"active bg-blue-500 text-white"}
          pageClassName={"px-4 py-2 mx-1 border cursor-pointer"}
          previousClassName={"px-4 py-2 mx-1 border cursor-pointer"}
          nextClassName={"px-4 py-2 mx-1 border cursor-pointer"}
          breakLinkClassName={"px-4 py-2 mx-1 border cursor-pointer"}
        />
      </div>
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[100]">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Edit Order Status</h2>
            <p className="mb-4">Order ID: {selectedOrder.order_id}</p>
            <select
              value={selectedStatus}
              onChange={handleStatusChange}
              className="w-full p-3 border mb-4 "
            >
              <option value="" disabled>
                Select Status
              </option>
              <option value="Order Placed">Order Placed</option>
              <option value="Order Processing">Order Processing</option>
              <option value="Dispatched">Dispatched</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Order Delivered">Delivered</option>
              <option value="Order Cancelled">Order Cancelled</option>
              <option value="Return Request">Return Request Confirmed</option>
              <option value="Returned">Returned</option>
            </select>
            <div className="flex justify-end gap-4">
              <button
                className="bg-gray-300 text-gray-700 py-2 px-4 hover:bg-gray-400 transition"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-400 text-white py-2 px-4 hover:bg-blue-500 transition"
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
