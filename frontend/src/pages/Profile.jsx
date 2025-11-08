import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import axios from "axios";
import { Link } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import LoadingSpinner from "../components/LoadingSpinner";

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const { user, login, logout } = useContext(AuthContext);
  const { clearCart } = useContext(CartContext);
  const [profileData, setProfileData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });
  const [existingAddress, setExistingAddress] = useState([]);
  const [newAddress, setNewAddress] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    country: "",
    state: "",
    city: "",
    pincode: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const getAddresses = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/user/get-addresses`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setExistingAddress(response.data.addresses);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAddresses();
    if (localStorage.getItem("user")) {
      setProfileData({
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
      });
    }
  }, [user]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleNewAddressChange = (event) => {
    const { name, value } = event.target;
    setNewAddress({ ...newAddress, [name]: value });
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      await axios
        .put(
          `${import.meta.env.VITE_APP_API_URL}/api/user/update-user`,
          profileData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          setIsEditing(false);
          login(res.data.user);
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAddress = () => {
    setShowAddAddress(true);
  };

  const handleCancelAddAddress = () => {
    setNewAddress({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      address: "",
      country: "",
      state: "",
      city: "",
      pincode: "",
    });
    setShowAddAddress(false);
  };

  const handleSaveAddress = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      console.log("New address:" + newAddress);
      await axios
        .put(
          `${import.meta.env.VITE_APP_API_URL}/api/user/add-address`,
          { address: newAddress },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          console.log(res);
          getAddresses();
          setNewAddress({
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
            address: "",
            country: "",
            state: "",
            city: "",
            pincode: "",
          });
          setShowAddAddress(false);
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.error("Error adding address:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveAddress = async (addressId) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      await axios.delete(
        `${
          import.meta.env.VITE_APP_API_URL
        }/api/user/remove-address/${addressId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      getAddresses();
    } catch (error) {
      console.error("Error removing address:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    clearCart();
    logout();
    setShowLogoutModal(false);
    navigate("/login");
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Breadcrumb title="Profile" destination1="Home" destination2="Profile" />
      <section className="section-profile py-[50px] max-[1199px]:py-[35px]">
        <div className="flex flex-wrap justify-between relative items-center mx-auto min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px]">
          <div className="flex flex-wrap w-full">
            <div className="w-full px-[12px] mb-[24px]">
              <div className="profile-details bg-[#f8f8fb] border-[1px] border-solid border-[#858585] rounded-[20px] p-[20px]">
                <h3 className="font-quicksand tracking-[0.03rem] leading-text-[20px] font-bold text-[#3d4750] mb-[20px]">
                  Profile Details
                </h3>
                {isEditing ? (
                  <form>
                    <div className="grid grid-cols-2 gap-4 mb-[20px]">
                      <div>
                        <label
                          htmlFor="first_name"
                          className="mb-[12px] inline-block text-[14px] font-medium text-[#3d4750] leading-[26px]"
                        >
                          First Name
                        </label>
                        <input
                          type="text"
                          id="first_name"
                          name="first_name"
                          value={profileData.first_name}
                          onChange={handleInputChange}
                          className="w-full py-[10px] px-[15px] leading-[26px] border-[1px] border-solid border-[#858585] outline-[0] rounded-[10px] text-[14px] font-normal text-[#686e7d] bg-[#fff]"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="last_name"
                          className="mb-[12px] inline-block text-[14px] font-medium text-[#3d4750] leading-[26px]"
                        >
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="last_name"
                          name="last_name"
                          value={profileData.last_name}
                          onChange={handleInputChange}
                          className="w-full py-[10px] px-[15px] leading-[26px] border-[1px] border-solid border-[#858585] outline-[0] rounded-[10px] text-[14px] font-normal text-[#686e7d] bg-[#fff]"
                        />
                      </div>
                    </div>
                    <div className="mb-[20px]">
                      <label
                        htmlFor="email"
                        className="mb-[12px] inline-block text-[14px] font-medium text-[#3d4750] leading-[26px]"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                        className="w-full py-[10px] px-[15px] leading-[26px] border-[1px] border-solid border-[#858585] outline-[0] rounded-[10px] text-[14px] font-normal text-[#686e7d] bg-[#fff]"
                      />
                    </div>
                    <div className="mb-[20px]">
                      <label
                        htmlFor="phone"
                        className="mb-[12px] inline-block text-[14px] font-medium text-[#3d4750] leading-[26px]"
                      >
                        Phone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleInputChange}
                        className="w-full py-[10px] px-[15px] leading-[26px] border-[1px] border-solid border-[#858585] outline-[0] rounded-[10px] text-[14px] font-normal text-[#686e7d] bg-[#fff]"
                      />
                    </div>
                  </form>
                ) : (
                  <div>
                    <p className="mb-[10px]">
                      <span className="font-bold">Name:</span>{" "}
                      {profileData.first_name} {profileData.last_name}
                    </p>
                    <p className="mb-[10px]">
                      <span className="font-bold">Email:</span>{" "}
                      {profileData.email}
                    </p>
                    <p>
                      <span className="font-bold">Phone:</span>{" "}
                      {profileData.phone}
                    </p>
                  </div>
                )}
                <div className="mt-[20px]">
                  {isEditing ? (
                    <button
                      onClick={handleSaveProfile}
                      className="bb-btn-2 inline-flex items-center justify-center transition-all duration-[0.3s] ease-in-out font-Poppins leading-[28px] tracking-[0.03rem] py-[8px] px-[20px] text-[14px] font-normal text-[#fff] bg-[#0097b2] rounded-[10px] border-[1px] border-solid border-[#0097b2] hover:bg-transparent hover:border-[#3d4750] hover:text-[#3d4750]"
                    >
                      Save Profile
                    </button>
                  ) : (
                    <button
                      onClick={handleEditProfile}
                      className="bb-btn-2 inline-flex items-center justify-center transition-all duration-[0.3s] ease-in-out font-Poppins leading-[28px] tracking-[0.03rem] py-[8px] px-[20px] text-[14px] font-normal text-[#fff] bg-[#0097b2] rounded-[10px] border-[1px] border-solid border-[#0097b2] hover:bg-transparent hover:border-[#3d4750] hover:text-[#3d4750]"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full px-[12px] mb-[24px]">
              <div className="addresses bg-[#f8f8fb] border-[1px] border-solid border-[#858585] rounded-[20px] p-[20px]">
                <h3 className="font-quicksand tracking-[0.03rem] leading-text-[20px] font-bold text-[#3d4750] mb-[20px]">
                  Addresses
                </h3>
                {existingAddress.length === 0 ? (
                  <p className="mb-[10px]">No addresses found.</p>
                ) : (
                  <ul>
                    {existingAddress.map((address, index) => (
                      <li key={index} className="mb-[10px]">
                        {address.first_name} {address.last_name},
                        {address.address}
                        , <br />
                        {address.city}, {address.state}, {address.country},{" "}
                        {address.pincode} <br />
                        {address.phone}, {address.email}
                        <button
                          onClick={() => handleRemoveAddress(address._id)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                {showAddAddress ? (
                  <form onSubmit={handleSaveAddress} className="mt-[20px]">
                    <div className="flex flex-wrap mx-[-12px]">
                      {/* ... (new address input fields) */}
                      <div className="min-[992px]:w-[50%] w-full px-[12px]">
                        <div className="input-item mb-[24px]">
                          <label className="inline-block font-Poppins leading-[26px] tracking-[0.02rem] mb-[8px] text-[14px] font-medium text-[#3d4750]">
                            First Name *
                          </label>
                          <input
                            type="text"
                            name="first_name"
                            placeholder="Enter your First Name"
                            className="w-full p-[10px] text-[14px] font-normal text-[#686e7d] border-[1px] border-solid border-[#858585] leading-[26px] outline-[0] rounded-[10px]"
                            required=""
                            value={newAddress.first_name}
                            onChange={handleNewAddressChange}
                          />
                        </div>
                      </div>
                      <div className="min-[992px]:w-[50%] w-full px-[12px]">
                        <div className="input-item mb-[24px]">
                          <label className="inline-block font-Poppins leading-[26px] tracking-[0.02rem] mb-[8px] text-[14px] font-medium text-[#3d4750]">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            name="last_name"
                            placeholder="Enter your Last Name"
                            className="w-full p-[10px] text-4px] font-normal text-[#686e7d] border-[1px] border-solid border-[#858585] leading-[26px] outline-[0] rounded-[10px]"
                            required=""
                            value={newAddress.last_name}
                            onChange={handleNewAddressChange}
                          />
                        </div>
                      </div>
                      <div className="min-[992px]:w-[50%] w-full px-[12px]">
                        <div className="input-item mb-[24px]">
                          <label className="inline-block font-Poppins leading-[26px] tracking-[0.02rem] mb-[8px] text-[14px] font-medium text-[#3d4750]">
                            Email Address*
                          </label>
                          <input
                            type="email"
                            name="email"
                            placeholder="Enter your Email Address"
                            className="w-full p-[10px] text-[14px] font-normal text-[#686e7d] border-[1px] border-solid border-[#858585] leading-[26px] outline-[0] rounded-[10px]"
                            required=""
                            value={newAddress.email}
                            onChange={handleNewAddressChange}
                          />
                        </div>
                      </div>
                      <div className="min-[992px]:w-[50%] w-full px-[12px]">
                        <div className="input-item mb-[24px]">
                          <label className="inline-block font-Poppins leading-[26px] tracking-[0.02rem] mb-[8px] text-[14px] font-medium text-[#3d4750]">
                            Phone Number *
                          </label>
                          <input
                            type="text"
                            name="phone"
                            placeholder="Enter your Phone Number"
                            className="w-full p-[10px] text-[14px] font-normal text-[#686e7d] border-[1px] border-solid border-[#858585] leading-[26px] outline-[0] rounded-[10px]"
                            required=""
                            value={newAddress.phone}
                            onChange={handleNewAddressChange}
                          />
                        </div>
                      </div>
                      <div className="w-full px-[12px]">
                        <div className="input-item mb-[24px]">
                          <label className="inline-block font-Poppins leading-[26px] tracking-[0.02rem] mb-[8px] text-[14px] font-medium text-[#3d4750]">
                            Address *
                          </label>
                          <input
                            type="text"
                            name="address"
                            placeholder="Address Line 1"
                            className="w-full p-[10px] text-[14px] font-normal text-[#686e7d] border-[1px] border-solid border-[#858585] leading-[26px] outline-[0] rounded-[10px]"
                            required=""
                            value={newAddress.address}
                            onChange={handleNewAddressChange}
                          />
                        </div>
                      </div>

                      <div className="min-[992px]:w-[50%] w-full px-[12px]">
                        <div className="input-item mb-[24px]">
                          <label className="inline-block font-Poppins leading-[26px] tracking-[0.02rem] mb-[8px] text-[14px] font-medium text-[#3d4750]">
                            Country *
                          </label>
                          <div className="custom-select p-[10px] border-[1px] border-solid border-[#858585] leading-[26px] rounded-[10px] bg-white">
                            <select
                              className="block w-full"
                              name="country"
                              onChange={handleNewAddressChange}
                              value={newAddress.country}
                            >
                              <option value="">Select Country</option>
                              <option value="option1">Country 1</option>
                              <option value="option2">Country 2</option>
                              <option value="option3">Country 3</option>
                              <option value="option4">Country 4</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="min-[992px]:w-[50%] w-full px-[12px]">
                        <div className="input-item mb-[24px]">
                          <label className="inline-block font-Poppins leading-[26px] tracking-[0.02rem] mb-[8px] text-[14px] font-medium text-[#3d4750]">
                            Region State *
                          </label>
                          <div className="custom-select p-[10px] border-[1px] border-solid border-[#858585] leading-[26px] rounded-[10px]  bg-white">
                            <select
                              className="block w-full"
                              name="state"
                              onChange={handleNewAddressChange}
                              value={newAddress.state}
                            >
                              <option value="">Select State</option>
                              <option value="option1">Region/State 1</option>
                              <option value="option2">Region/State 2</option>
                              <option value="option3">Region/State 3</option>
                              <option value="option4">Region/State 4</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="min-[992px]:w-[50%] w-full px-[12px]">
                        <div className="input-item mb-[24px]">
                          <label className="inline-block font-Poppins leading-[26px] tracking-[0.02rem] mb-[8px] text-[14px] font-medium text-[#3d4750]">
                            City *
                          </label>
                          <div className="custom-select p-[10px] border-[1px] border-solid border-[#858585] leading-[26px] rounded-[10px]  bg-white">
                            <select
                              className="block w-full"
                              name="city"
                              onChange={handleNewAddressChange}
                              value={newAddress.city}
                            >
                              <option value="">Select City</option>
                              <option value="option1">City 1</option>
                              <option value="option2">City 2</option>
                              <option value="option3">City 3</option>
                              <option value="option4">City 4</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="min-[992px]:w-[50%] w-full px-[12px]">
                        <div className="input-item mb-[24px]">
                          <label className="inline-block font-Poppins leading-[26px] tracking-[0.02rem] mb-[8px] text-[14px] font-medium text-[#3d4750]">
                            Post Code *
                          </label>
                          <input
                            type="text"
                            name="pincode"
                            placeholder="Post Code"
                            className="w-full p-[10px] text-[14px] font-normal text-[#686e7d] border-[1px] border-solid border-[#858585] leading-[26px] outline-[0] rounded-[10px]"
                            required=""
                            value={newAddress.pincode}
                            onChange={handleNewAddressChange}
                          />
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleSaveAddress}
                      className="bb-btn-2 inline-flex items-center justify-center transition-all duration-[0.3s] ease-in-out font-Poppins leading-[28px] tracking-[0.03rem] py-[8px] px-[20px] text-[14px] font-normal text-[#fff] bg-[#0097b2] rounded-[10px] border-[1px] border-solid border-[#0097b2] hover:bg-transparent hover:border-[#3d4750] hover:text-[#3d4750]"
                    >
                      Save Address
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelAddAddress}
                      className="bb-btn-2 inline-flex items-center justify-center transition-all duration-[0.3s] ease-in-out font-Poppins leading-[28px] tracking-[0.03rem] py-[8px] px-[20px] text-[14px] font-normal text-[#fff] bg-gray-500 rounded-[10px] border-[1px] border-solid hover:bg-transparent hover:border-[#3d4750] hover:text-[#3d4750] ml-[10px]"
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={handleAddAddress}
                    className="bb-btn-2 mt-[20px] inline-flex items-center justify-center transition-all duration-[0.3s] ease-in-out font-Poppins leading-[28px] tracking-[0.03rem] py-[8px] px-[20px] text-[14px] font-normal text-[#fff] bg-[#0097b2] rounded-[10px] border-[1px] border-solid border-[#0097b2] hover:bg-transparent hover:border-[#3d4750] hover:text-[#3d4750]"
                  >
                    Add Address
                  </button>
                )}
              </div>
            </div>
            <div className="w-full px-[12px]">
              <Link
                to="/order-history"
                className="bb-btn-2 inline-flex items-center justify-center transition-all duration-[0.3s] ease-in-out font-Poppins leading-[28px] tracking-[0.03rem] py-[8px] px-[20px] text-[14px] font-normal text-[#fff] bg-[#0097b2] rounded-[10px] border-[1px] border-solid border-[#0097b2] hover:bg-transparent hover:border-[#3d4750] hover:text-[#3d4750]"
              >
                Order History
              </Link>
              <button
                onClick={handleLogout}
                className="bb-btn-2 mt-[20px] inline-flex items-center justify-center transition-all duration-[0.3s] ease-in-out font-Poppins leading-[28px] tracking-[0.03rem] py-[8px] px-[20px] text-[14px] font-normal text-[#fff] bg-[#0097b2] rounded-[10px] border-[1px] border-solid border-[#0097b2] hover:bg-transparent hover:border-[#3d4750] hover:text-[#3d4750] ml-[10px]"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </section>

      {!!showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Confirm Logout
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to logout?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={cancelLogout}
                className="px-4 py-2 text-sm bg-gray-300 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
