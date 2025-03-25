import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";

const ViewUserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/api/user/get-user/${id}`
        );
        setUser(response.data.user);

        const cartItems = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/api/cart/get-cart-items/${id}`
        );
        setCartItems(cartItems.data.cartItems);
      } catch (error) {
        console.error("Error fetching user details:", error);
        toast.error("Failed to fetch user details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, [id]);

  if (isLoading) return <LoadingSpinner />;
  if (!user) return <p className="text-center text-red-500">User not found</p>;

  return (
    <div className="p-8 bg-gray-100">
      <div className="max-w-8xl mx-auto bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">User Details</h1>
          <Link
            to="/users"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center"
          >
            <FaArrowLeft className="mr-2" /> Back to Users
          </Link>
        </div>

        {/* User Information */}
        <div className="border-b pb-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            User Info
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <p>
              <strong>First Name:</strong> {user.first_name}
            </p>
            <p>
              <strong>Last Name:</strong> {user.last_name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Phone:</strong> {user.phone}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(user.created_at).toLocaleString()}
            </p>
            <p>
              <strong>Updated At:</strong>{" "}
              {new Date(user.updated_at).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Addresses Section */}
        <div className="border-b pb-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Addresses
          </h2>
          {user.addresses.length > 0 ? (
            user.addresses.map((address, index) => (
              <div
                key={index}
                className="border p-4 rounded-md mb-4 bg-gray-50 shadow-sm"
              >
                <p>
                  <strong>First Name:</strong> {address.first_name}
                </p>
                <p>
                  <strong>Last Name:</strong> {address.last_name}
                </p>
                <p>
                  <strong>Email:</strong> {address.email}
                </p>
                <p>
                  <strong>Phone:</strong> {address.phone}
                </p>
                <p>
                  <strong>Address:</strong> {address.address}
                </p>
                <p>
                  <strong>Country:</strong> {address.country}
                </p>
                <p>
                  <strong>State:</strong> {address.state}
                </p>
                <p>
                  <strong>City:</strong> {address.city}
                </p>
                <p>
                  <strong>Pincode:</strong> {address.pincode}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No addresses found</p>
          )}
        </div>

        {/* Cart Data Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Cart Data
          </h2>
          {cartItems.length > 0 ? (
            <table className="w-full border-collapse bg-white shadow-md rounded-md">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3 text-left">Product Name</th>
                  <th className="p-3 text-left">Net Quantity</th>
                  <th className="p-3 text-left">Price</th>
                  <th className="p-3 text-left">Quantity</th>
                  <th className="p-3 text-left">Total Price</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-3">
                      <Link
                        to={`/product/product-details/${item.id}`}
                        className="text-black-500 hover:underline"
                      >
                        {item.name}
                      </Link>
                    </td>
                    <td className="p-3">{item.net_quantity}</td>
                    <td className="p-3">{item.price}</td>
                    <td className="p-3">{item.quantity}</td>
                    <td className="p-3">{item.total}</td>
                  </tr>
                ))}
                <tr className="border-b">
                  <td className="p-3 font-bold text-right px-10" colSpan="4">
                    Total:
                  </td>
                  <td className="p-3 font-bold">
                    {cartItems.reduce(
                      (total, item) => total + item.price * item.quantity,
                      0
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          ) : (
            <p className="text-gray-600">No cart data available</p>
          )}
        </div>

        <div className="mt-6">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewUserDetails;
