import React, { useState, useEffect } from "react";
import { FaSearch, FaPlus, FaTrash } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";

const DiscountCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [formData, setFormData] = useState({
    code: "",
    discount_type: "percentage",
    discount_value: 0,
    min_purchase: 0,
    max_discount: 0,
    expiration_date: "",
    usage_limit: 100000,
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedCoupon, setExpandedCoupon] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/coupon`
      );
      setCoupons(res.data);
    } catch (error) {
      toast.error("Failed to fetch coupons");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/coupon`,
        formData
      );
      toast.success("Coupon Created Successfully");
      fetchCoupons();
      setFormData({
        code: "",
        discount_type: "percentage",
        discount_value: 0,
        min_purchase: 0,
        max_discount: 0,
        expiration_date: "",
        usage_limit: 100000,
      });
    } catch (error) {
      toast.error("Failed to create coupon");
    } finally {
      setShowAddModal();
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setIsLoading(true);
      await axios.delete(
        `${import.meta.env.VITE_APP_API_URL}/api/coupon/${id}`
      );
      toast.success("Coupon Deleted");
      fetchCoupons();
    } catch (error) {
      toast.error("Failed to delete coupon");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedCoupon(expandedCoupon === id ? null : id);
  };

  const filteredCoupons = coupons.filter((coupon) =>
    coupon.code.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="w-full mx-auto bg-white shadow-md p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-gray-800">
            Manage Coupons
          </h1>

          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search by code..."
                className="input input-bordered w-full pr-10 rounded-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
            </div>

            {/* Add Coupon Button */}
            <button
              className="flex items-center bg-blue-400 text-white py-3 px-4 hover:bg-blue-500 transition"
              onClick={() => setShowAddModal(true)}
            >
              <FaPlus className="mr-2" /> Add Coupon
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 text-left">Code</th>
                <th className="p-3 text-left">Discount</th>
                {/* <th className="p-3 text-left">Min Purchase</th>
                <th className="p-3 text-left">Max Discount</th> */}
                <th className="p-3 text-left">Expiration</th>
                <th className="p-3 text-left">Used Count</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCoupons.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-3 text-center">
                    No coupons found
                  </td>
                </tr>
              )}
              {filteredCoupons.map((coupon) => (
                <React.Fragment key={coupon._id}>
                  <tr
                    className="border-b hover:bg-gray-100 cursor-pointer"
                    onClick={() => toggleExpand(coupon._id)}
                  >
                    <td className="p-3">{coupon.code}</td>
                    <td className="p-3">
                      {coupon.discount_type === "percentage"
                        ? `${coupon.discount_value}%`
                        : `$${coupon.discount_value}`}
                    </td>
                    {/* <td className="p-3">${coupon.min_purchase}</td>
                    <td className="p-3">
                      {coupon.max_discount ? `$${coupon.max_discount}` : "N/A"}
                    </td> */}
                    <td className="p-3">
                      {new Date(coupon.expiration_date).toLocaleDateString()}
                    </td>
                    <td className="p-3">{coupon.used_count}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-2 ${
                          coupon.status === "active"
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {coupon.status}
                      </span>
                    </td>
                    <td className="p-3 flex gap-2 text-center">
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(coupon._id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                  {/* {expandedCoupon === coupon._id && (
                    <tr className="bg-gray-50">
                      <td colSpan="6" className="p-4">
                        <div className="text-gray-700">
                          <p>
                            <strong>Usage Limit:</strong> {coupon.usage_limit}
                          </p>
                          <p>
                            <strong>Used Count:</strong> {coupon.used_count}
                          </p>
                          <p>
                            <strong>Status:</strong>{" "}
                            <span
                              className={`px-2 py-1 rounded-lg ${
                                coupon.status === "active"
                                  ? "bg-green-500 text-white"
                                  : "bg-red-500 text-white"
                              }`}
                            >
                              {coupon.status}
                            </span>
                          </p>
                        </div>
                      </td>
                    </tr>
                  )} */}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Coupon Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[100]">
          <div className="bg-white p-6 shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Add New Coupon</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="w-full">
                <label className="block text-sm font-medium mb-1">
                  Coupon Type
                </label>
                <select
                  name="discount_type"
                  value={formData.discount_type}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border rounded"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed</option>
                </select>
              </div>
              <div className="w-full">
                <label className="block text-sm font-medium mb-1">
                  Coupon Code
                </label>
                <input
                  type="text"
                  name="code"
                  placeholder="Coupon Code"
                  value={formData.code}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border rounded"
                />
              </div>
              <div className="w-full">
                <label className="block text-sm font-medium mb-1">
                  Discount Value
                </label>
                <input
                  type="number"
                  name="discount_value"
                  placeholder="Discount Value"
                  value={formData.discount_value}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border rounded"
                />
              </div>
              <div className="w-full">
                <label className="block text-sm font-medium mb-1">
                  Expiration Date
                </label>
                <input
                  type="date"
                  name="expiration_date"
                  value={formData.expiration_date}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border rounded"
                />
              </div>
              <div className="flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  className="bg-gray-300 text-gray-700 py-2 px-4 hover:bg-gray-400 transition"
                  onClick={() => setShowAddModal(false)}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 px-6 hover:bg-blue-700 transition"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscountCoupons;
