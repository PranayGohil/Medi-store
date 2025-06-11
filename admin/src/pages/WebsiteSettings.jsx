// WebsiteSettings.jsx (Frontend)

import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ShopContext } from "../context/ShopContext";

import LoadingSpinner from "../components/LoadingSpinner";

const WebsiteSettings = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [banners, setBanners] = useState([]);
  const [mobileBanners, setMobileBanners] = useState([]);
  const [newBanner, setNewBanner] = useState({
    image: null,
  });
  const [newMobileBanner, setNewMobileBanner] = useState({
    image: null,
  });
  const [showAddBannerForm, setShowAddBannerForm] = useState(false);
  const [showAddMobileBannerForm, setShowAddMobileBannerForm] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [mobileImagePreview, setMobileImagePreview] = useState(null);
  const [deliveryCharges, setDeliveryCharges] = useState(0);
  const [newDeliveryCharge, setNewDeliveryCharge] = useState("");
  const [changeDeliveryCharge, setChangeDeliveryCharge] = useState(false);

  const { currency } = useContext(ShopContext);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/api/site`
        );
        if (response.data && response.data[0]) {
          if (response.data[0].banners) {
            setBanners(response.data[0].banners);
          }
          if (response.data[0].mobile_banners) {
            setMobileBanners(response.data[0].mobile_banners);
          }
          if (response.data[0].delivery_charge) {
            setDeliveryCharges(response.data[0].delivery_charge);
          }
        }
      } catch (error) {
        toast.error("Failed to fetch settings");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewBanner({ ...newBanner, image: file });
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };
  const handleMobileImageChange = (e) => {
    const file = e.target.files[0];
    setNewMobileBanner({ ...newMobileBanner, image: file });
    if (file) {
      setMobileImagePreview(URL.createObjectURL(file));
    } else {
      setMobileImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", newBanner.image);

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/site/add-banner`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
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
      if (response.data && response.data.success) {
        const settingsResponse = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/api/site`
        );
        if (
          settingsResponse.data &&
          settingsResponse.data[0] &&
          settingsResponse.data[0].banners
        ) {
          setBanners(settingsResponse.data[0].banners);
        }
        toast.success(response.data.message);
        setNewBanner({
          image: null,
        });
        setImagePreview(null); // Reset image preview
      } else {
        toast.error(response.data.message || "Failed to add banner");
      }
    } catch (error) {
      toast.error("Failed to add banner");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMobileBannerSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", newMobileBanner.image);

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/site/add-mobile-banner`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
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
      if (response.data && response.data.success) {
        const settingsResponse = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/api/site`
        );
        if (
          settingsResponse.data &&
          settingsResponse.data[0] &&
          settingsResponse.data[0].mobile_banners
        ) {
          setMobileBanners(settingsResponse.data[0].mobile_banners);
        }
        toast.success(response.data.message);
        setNewMobileBanner({
          image: null,
        });
        setMobileImagePreview(null); // Reset image preview
      } else {
        toast.error(response.data.message || "Failed to add banner");
      }
    } catch (error) {
      toast.error("Failed to add banner");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveBanner = async (bannerId) => {
    try {
      setIsLoading(true);
      const response = await axios.delete(
        `${
          import.meta.env.VITE_APP_API_URL
        }/api/site/remove-banner/${bannerId}`,
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
      if (response.data && response.data.success) {
        const settingsResponse = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/api/site`
        );
        if (
          settingsResponse.data &&
          settingsResponse.data[0] &&
          settingsResponse.data[0].banners
        ) {
          setBanners(settingsResponse.data[0].banners);
        }
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message || "Failed to remove banner");
      }
    } catch (error) {
      toast.error("Failed to remove banner");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMobileBanner = async (bannerId) => {
    try {
      setIsLoading(true);
      const response = await axios.delete(
        `${
          import.meta.env.VITE_APP_API_URL
        }/api/site/remove-mobile-banner/${bannerId}`,
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
      if (response.data && response.data.success) {
        const settingsResponse = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/api/site`
        );
        if (
          settingsResponse.data &&
          settingsResponse.data[0] &&
          settingsResponse.data[0].mobile_banners
        ) {
          setMobileBanners(settingsResponse.data[0].mobile_banners);
        }
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message || "Failed to remove banner");
      }
    } catch (error) {
      toast.error("Failed to remove banner");
    } finally {
      setIsLoading(false);
    }
  };

  const addBannerFormOpen = () => {
    setShowAddBannerForm(true);
  };

  const addBannerFormClose = () => {
    setShowAddBannerForm(false);
  };

  const handleAddDeliveryCharge = async () => {
    console.log(newDeliveryCharge);
    try {
      setIsLoading(true);
      const response = await axios.put(
        `${import.meta.env.VITE_APP_API_URL}/api/site/set-delivery-charge`,
        { delivery_charge: newDeliveryCharge },
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
      if (response.data && response.data.success) {
        toast.success(response.data.message);
        setDeliveryCharges(newDeliveryCharge);
        setNewDeliveryCharge("");
        setChangeDeliveryCharge(false);
      } else {
        toast.error(response.data.message || "Failed to set delivery charge");
      }
    } catch (error) {
      toast.error("Failed to set delivery charge");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-8 bg-gray-100">
      <div className="w-full mx-auto bg-white shadow-md p-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">
          Website Settings
        </h1>

        <div className="flex justify-between">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Banners</h2>
          <div>
            {!showAddBannerForm ? (
              <button
                onClick={() => addBannerFormOpen()}
                className="bg-blue-500 mx-2 hover:bg-blue-600 text-white py-3 px-4 mb-4"
              >
                Add banner
              </button>
            ) : (
              <button
                onClick={() => addBannerFormClose()}
                className="bg-gray-500 mx-2 hover:bg-gray-600 text-white py-3 px-4 mb-4"
              >
                Close
              </button>
            )}
          </div>
        </div>
        {showAddBannerForm && (
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600 font-medium">
                  Banner Image
                </label>
                <label
                  htmlFor="banner-image"
                  className="w-full h-64 object-cover border flex flex-col items-center justify-center cursor-pointer"
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Image Preview"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m0-3-3-3m0 0-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75"
                        />
                      </svg>
                      Upload Banner Image{" "}
                      <small>
                        Suggestion : Add Transparent(without Background) Image
                      </small>
                    </>
                  )}
                  <input
                    type="file"
                    name="image"
                    id="banner-image"
                    onChange={handleImageChange}
                    className="mt-1"
                    accept="image/*"
                    style={{ display: "none" }}
                  />
                </label>
              </div>
            </div>
            <button
              type="submit"
              className="mt-4 bg-blue-400 hover:bg-blue-500 text-white py-2 px-4"
              disabled={isLoading}
            >
              Add Banner
            </button>
          </form>
        )}

        {banners.length === 0 && (
          <p className="text-gray-600 w-full text-center my-5">
            No banners found.
          </p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {banners.map((banner, index) => (
            <div key={index} className="border p-4">
              <img
                src={banner.image}
                alt="Banner"
                className="w-full h-48 object-contain mb-4"
              />
              <button
                className="mt-4 bg-red-400 hover:bg-red-500 text-white py-3 px-4"
                onClick={() => handleRemoveBanner(banner._id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {/* ------------------------------------------------------------------------------------ */}
        <div className="flex justify-between mt-5">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Mobile Banners</h2>
          <div>
            {!showAddMobileBannerForm ? (
              <button
                onClick={() => setShowAddMobileBannerForm(true)}
                className="bg-blue-500 mx-2 hover:bg-blue-600 text-white py-3 px-4 mb-4"
              >
                Add mobile banner
              </button>
            ) : (
              <button
                onClick={() => setShowAddMobileBannerForm(false)}
                className="bg-gray-500 mx-2 hover:bg-gray-600 text-white py-3 px-4 mb-4"
              >
                Close
              </button>
            )}
          </div>
        </div>
        {showAddMobileBannerForm && (
          <form onSubmit={handleMobileBannerSubmit} className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600 font-medium">
                  Mobile Banner Image
                </label>
                <label
                  htmlFor="mobile-banner-image"
                  className="w-full h-64 object-cover border flex flex-col items-center justify-center cursor-pointer"
                >
                  {mobileImagePreview ? (
                    <img
                      src={mobileImagePreview}
                      alt="Image Preview"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m0-3-3-3m0 0-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75"
                        />
                      </svg>
                      Upload Mobile Banner Image
                    </>
                  )}
                  <input
                    type="file"
                    name="mobile_image"
                    id="mobile-banner-image"
                    onChange={handleMobileImageChange}
                    className="mt-1"
                    accept="image/*"
                    style={{ display: "none" }}
                  />
                </label>
              </div>
            </div>
            <button
              type="submit"
              className="mt-4 bg-blue-400 hover:bg-blue-500 text-white py-2 px-4"
              disabled={isLoading}
            >
              Add Mobile Banner
            </button>
          </form>
        )}

        {mobileBanners.length === 0 && (
          <p className="text-gray-600 w-full text-center my-5">
            No mobile banners found.
          </p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mobileBanners.map((banner, index) => (
            <div key={index} className="border p-4">
              <img
                src={banner.image}
                alt="Banner"
                className="w-full h-48 object-contain mb-4"
              />
              <button
                className="mt-4 bg-red-400 hover:bg-red-500 text-white py-3 px-4"
                onClick={() => handleRemoveMobileBanner(banner._id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        {/* ------------------------------------------------------------------------------------ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex justify-between">
            <h2 className="text-2xl mt-10 font-semibold text-gray-800 mb-4">
              Other Settings
            </h2>
          </div>
        </div>
        <div className="mt-4 flex felx-wrap items-center">
          <label className="text-base font-medium text-gray-700 mx-5 flex align-center justify-center">
            Delivery Charge :
          </label>
          {changeDeliveryCharge || deliveryCharges === "" ? (
            <div>
              {currency}{" "}
              <input
                type="number"
                name="delivery_charge"
                value={newDeliveryCharge}
                onChange={(e) => setNewDeliveryCharge(e.target.value)}
                className="p-2 pl-10 border"
              />
              <button
                type="button"
                onClick={handleAddDeliveryCharge}
                className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 mx-3"
              >
                Add Delivery Charge
              </button>
              <button
                type="button"
                onClick={() => setChangeDeliveryCharge(false)}
                className="bg-gray-500 hover:bg-greay-600 text-white py-3 px-4 mx-3"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex items-center align-center">
              <label className="block text-base font-medium text-gray-700 mx-3">
                {currency} {deliveryCharges}
              </label>
              <button
                type="button"
                onClick={() => setChangeDeliveryCharge(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 mx-3"
              >
                Change
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebsiteSettings;
