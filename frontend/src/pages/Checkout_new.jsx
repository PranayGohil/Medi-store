import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { LocationContext } from "../context/LocationContext";
import { Country, State, City } from "country-state-city";
import Modal from "../components/Modal";
import LoadingSpinner from "../components/LoadingSpinner";

const Checkout = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { user } = useContext(AuthContext);
  const { currency, delivery_fee } = useContext(ShopContext);
  const { locationData, updateLocationData } = useContext(LocationContext);
  const { clearCart, updateCartItemQuantity, removeItemFromCart } =
    useContext(CartContext);

  const [selectedCountry, setSelectedCountry] = useState(
    locationData.country || ""
  );
  const [selectedState, setSelectedState] = useState(locationData.state || "");
  const [selectedCity, setSelectedCity] = useState(locationData.city || "");
  const [pincode, setPincode] = useState(locationData.pincode || "");

  const [cartItems, setCartItems] = useState([]);
  const [totalCartPrice, setTotalCartPrice] = useState(0);
  const [isNewAddress, setIsNewAddress] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    country: locationData.country || "",
    state: locationData.state || "",
    city: locationData.city || "",
    pincode: locationData.pincode || "",
  });
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [isApplying, setIsApplying] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState({
    id: null,
    net_quantity: null,
  });

  const countries = Country.getAllCountries();
  const states = selectedCountry
    ? State.getStatesOfCountry(selectedCountry)
    : [];
  const cities = selectedState
    ? City.getCitiesOfState(selectedCountry, selectedState)
    : [];

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/api/cart/get-cart-items`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.allAvailable === false) {
          setError("Some Cart Product is Not Available");
          navigate("/cart");
        }
        setCartItems(response.data.cartItems);
        setTotalCartPrice(response.data.totalCartPrice);
      } catch (error) {
        console.error("Error fetching cart data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    const fetchAddresses = async () => {
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
        setAddresses(response.data.addresses);
        if (response.data.addresses.length > 0) {
          setIsNewAddress(false);
          // Auto-select the last address (most recently added)
          const lastAddress =
            response.data.addresses[response.data.addresses.length - 1];
          setSelectedAddress(lastAddress);
        } else {
          setIsNewAddress(true);
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (user) {
      fetchCartData();
      fetchAddresses();
    }
  }, [user]);

  useEffect(() => {
    updateLocationData({
      country: selectedCountry,
      state: selectedState,
      city: selectedCity,
      pincode: pincode,
    });
  }, [selectedCountry, selectedState, selectedCity, pincode]);

  const subtotal = totalCartPrice;
  const total = subtotal + delivery_fee - discount;

  const handleInputChange = (e) => {
    setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
  };

  const totalAmount = (subtotal + delivery_fee - discount).toFixed(2);

  // Handle quantity change
  const handleQuantityChange = async (productId, netQuantity, newQuantity) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      // Update via API for logged-in users
      await axios.put(
        `${
          import.meta.env.VITE_APP_API_URL
        }/api/cart/change-quantity/${productId}`,
        {
          quantity: newQuantity,
          net_quantity: netQuantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update local context
      updateCartItemQuantity(productId, netQuantity, newQuantity);

      // Refresh cart data
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/cart/get-cart-items`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCartItems(response.data.cartItems);
      setTotalCartPrice(response.data.totalCartPrice);
    } catch (error) {
      console.error("Error updating quantity:", error);
      setError("Failed to update quantity");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle remove item
  const handleRemove = (id, net_quantity) => {
    setItemToRemove({ id, net_quantity });
    setShowRemoveModal(true);
  };

  const confirmRemove = async () => {
    const { id, net_quantity } = itemToRemove;
    if (!id || !net_quantity) return;

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      // Remove via API
      await axios.delete(
        `${
          import.meta.env.VITE_APP_API_URL
        }/api/cart/remove-from-cart/${id}/${net_quantity}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Remove from local context
      removeItemFromCart(id, net_quantity);

      // Refresh cart data
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/cart/get-cart-items`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCartItems(response.data.cartItems);
      setTotalCartPrice(response.data.totalCartPrice);

      // If cart becomes empty, redirect to products page
      if (response.data.cartItems.length === 0) {
        navigate("/all-categories");
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
      setError("Failed to remove item.");
    } finally {
      setShowRemoveModal(false);
      setItemToRemove({ id: null, net_quantity: null });
      setIsLoading(false);
    }
  };

  // PayPal Handlers
  const handlePayPalApprove = async (orderID) => {
    try {
      setIsLoading(true);

      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/paypal/captureorder`,
        {
          orderID,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        const token = localStorage.getItem("token");
        let deliveryAddress = isNewAddress ? [newAddress] : [selectedAddress];

        const orderData = {
          order_id: orderID,
          products: cartItems.map((item) => ({
            product_id: item.id,
            net_quantity: item.net_quantity,
            quantity: item.quantity,
            price: item.price,
          })),
          sub_total: subtotal,
          delivery_charge: delivery_fee,
          discount: discount,
          discount_code: couponCode,
          total: total,
          delivery_address: deliveryAddress,
          payment_method: "paypal",
          payment_status: "completed",
          payment_details: response.data.data,
          order_status: "Order Placed",
        };

        const addOrder = await axios.post(
          `${import.meta.env.VITE_APP_API_URL}/api/order/add`,
          orderData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!addOrder.data.success) {
          setError(addOrder.data.message);
          return;
        }

        const deleteCart = await axios.delete(
          `${import.meta.env.VITE_APP_API_URL}/api/cart/clear-cart`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!deleteCart.data.success) {
          setError(deleteCart.data.message);
          return;
        }

        clearCart();
        navigate("/payment-completed");
      } else {
        setError("Payment Capturing Failed.");
      }
    } catch (error) {
      console.error("Error capturing order:", error);
      navigate("/payment-cancelled");
    } finally {
      setIsLoading(false);
    }
  };

  const createPayPalOrder = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!isNewAddress && !selectedAddress) {
        setError("Please select or add an address.");
        return;
      }
      if (isNewAddress) {
        if (
          newAddress.first_name === "" ||
          newAddress.last_name === "" ||
          newAddress.email === "" ||
          newAddress.phone === "" ||
          newAddress.address === "" ||
          newAddress.country === "" ||
          newAddress.state === "" ||
          newAddress.city === "" ||
          newAddress.pincode === ""
        ) {
          setError("Please fill all the details.");
          return;
        }
      }

      if (isNewAddress) {
        await axios.put(
          `${import.meta.env.VITE_APP_API_URL}/api/user/add-address`,
          { address: newAddress },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/paypal/createorder`,
        {
          total: totalAmount,
          products: [
            {
              product_id: "product_id",
              quantity: "1",
              price: totalAmount,
            },
          ],
        }
      );

      return response.data.id;
    } catch (error) {
      console.error("Error creating PayPal order:", error);
      setError("Failed to create order");
    }
  };

  // Paylabs Handlers
  const handlePaylabsPayment = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem("token");

      // Validate address
      if (!isNewAddress && !selectedAddress) {
        setError("Please select or add an address.");
        setIsLoading(false);
        return;
      }

      if (isNewAddress) {
        if (
          newAddress.first_name === "" ||
          newAddress.last_name === "" ||
          newAddress.email === "" ||
          newAddress.phone === "" ||
          newAddress.address === "" ||
          newAddress.country === "" ||
          newAddress.state === "" ||
          newAddress.city === "" ||
          newAddress.pincode === ""
        ) {
          setError("Please fill all the details.");
          setIsLoading(false);
          return;
        }

        // Save new address
        await axios.put(
          `${import.meta.env.VITE_APP_API_URL}/api/user/add-address`,
          { address: newAddress },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      // Create Paylabs payment with currency conversion
      const paylabsResponse = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/paylabs/create`,
        {
          amount: totalAmount,
          currency: "USD",
          productName: `Order from ${cartItems.length} products`,
          redirectUrl: `${window.location.origin}/paylabs-callback`,
        }
      );

      if (paylabsResponse.data.success) {
        const paylabsData = paylabsResponse.data.data;

        console.log("💰 Payment Details:", {
          originalAmount: `${paylabsData.originalAmount} ${paylabsData.originalCurrency}`,
          convertedAmount: `${paylabsData.convertedAmount} ${paylabsData.convertedCurrency}`,
        });

        // Store payment and order data in localStorage
        const pendingOrderData = {
          merchantTradeNo: paylabsData.merchantTradeNo,
          products: cartItems.map((item) => ({
            product_id: item.id,
            net_quantity: item.net_quantity,
            quantity: item.quantity,
            price: item.price,
          })),
          sub_total: subtotal,
          delivery_charge: delivery_fee,
          discount: discount,
          discount_code: couponCode,
          total: total,
          delivery_address: isNewAddress ? [newAddress] : [selectedAddress],
          payment_details: {
            merchantTradeNo: paylabsData.merchantTradeNo,
            platformTradeNo: paylabsData.platformTradeNo,
            requestId: paylabsData.requestId,
            originalAmount: paylabsData.originalAmount,
            originalCurrency: paylabsData.originalCurrency,
            convertedAmount: paylabsData.convertedAmount,
            convertedCurrency: paylabsData.convertedCurrency,
          },
        };

        localStorage.setItem(
          "pending_paylabs_order",
          JSON.stringify(pendingOrderData)
        );

        console.log(`Redirecting to Paylabs payment page...`);
        console.log(`Amount in IDR: ${paylabsData.convertedAmount} IDR`);

        // Redirect to Paylabs payment page
        window.location.href = paylabsData.payUrl;
      } else {
        setError("Failed to create Paylabs payment");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error creating Paylabs payment:", error);
      setError(
        error.response?.data?.error || "Failed to create Paylabs payment"
      );
      setIsLoading(false);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) {
      setError("Please enter a coupon code");
      return;
    }

    setIsApplying(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/coupon/apply`,
        {
          code: couponCode,
          total: totalAmount,
        }
      );
      const { discount, discountedTotal } = response.data;
      setDiscount(discount);
    } catch (error) {
      console.error("Error verifying coupon:", error);
      setError(error.response?.data?.error || "Invalid or expired coupon code");
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemoveCoupon = () => {
    setDiscount(0);
    setCouponCode("");
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Breadcrumb
        title="Checkout"
        destination1="Home"
        destination2="Checkout"
      />
      <section className="section-checkout py-[50px] max-[1199px]:py-[35px]">
        <div className="flex flex-wrap justify-between relative items-center mx-auto min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px]">
          <div className="flex flex-wrap w-full mb-[-24px]">
            <div className="min-[992px]:w-[33.33%] w-full px-[12px] mb-[24px]">
              <div className="bb-checkout-sidebar mb-[-24px]">
                <div className="checkout-items border-[1px] border-solid border-[#eee] p-[20px] rounded-[20px] mb-[24px]">
                  <div className="sub-title mb-[12px]">
                    <h4 className="font-quicksand tracking-[0.03rem] leading-[1.2] text-[20px] font-bold text-[#3d4750]">
                      Order Summary
                    </h4>
                  </div>
                  <div className="checkout-summary mb-[20px] border-b-[1px] border-solid border-[#eee]">
                    <ul className="mb-[20px]">
                      <li className="flex justify-between leading-[28px] mb-[8px]">
                        <span className="left-item font-Poppins leading-[28px] tracking-[0.03rem] text-[14px] font-medium text-[#686e7d]">
                          sub-total
                        </span>
                        <span className="font-Poppins leading-[28px] tracking-[0.03rem] text-[14px] font-medium text-[#686e7d]">
                          {currency} {subtotal.toFixed(2)}
                        </span>
                      </li>
                      <li className="flex justify-between leading-[28px] mb-[8px]">
                        <span className="left-item font-Poppins leading-[28px] tracking-[0.03rem] text-[14px] font-medium text-[#686e7d]">
                          Delivery Charges
                        </span>
                        <span className="font-Poppins leading-[28px] tracking-[0.03rem] text-[14px] font-medium text-[#686e7d]">
                          {currency} {delivery_fee.toFixed(2)}
                        </span>
                      </li>
                      {discount > 0 && (
                        <>
                          <li className="flex justify-between leading-[28px] mb-[8px] border-b-[1px] border-solid border-[#eee]">
                            <span className="left-item font-Poppins leading-[28px] tracking-[0.03rem] text-[14px] font-medium text-[#686e7d]">
                              Coupon Code Applied
                            </span>
                          </li>
                          <li className="flex justify-between leading-[28px] mb-[8px] pb-1 border-b-[1px] border-solid border-[#eee]">
                            <span className="left-item font-Poppins leading-[28px] tracking-[0.03rem] text-[14px] font-medium text-[#686e7d]">
                              {couponCode}
                            </span>
                            <span className="font-Poppins leading-[28px] tracking-[0.03rem] text-[14px] font-medium text-[#686e7d]">
                              - {currency} {discount.toFixed(2)}
                            </span>
                          </li>
                        </>
                      )}

                      <li className="flex justify-between leading-[28px] mb-[8px]">
                        <span className="left-item font-Poppins leading-[28px] tracking-[0.03rem] text-[14px] font-medium text-[#686e7d]">
                          Coupon Discount
                        </span>
                      </li>
                      <li className="flex justify-between leading-[28px]">
                        <div className="coupon-down-box w-full">
                          <div className="relative">
                            <input
                              className="bb-coupon w-full p-[10px] text-[14px] font-normal text-[#686e7d] border-[1px] border-solid border-[#eee] outline-[0] rounded-[10px]"
                              type="text"
                              placeholder="Enter Your coupon Code"
                              value={couponCode}
                              onChange={(e) => setCouponCode(e.target.value)}
                              disabled={discount > 0}
                            />

                            {discount > 0 ? (
                              <button
                                className="bb-btn-2 transition-all duration-[0.3s] ease-in-out my-[8px] mr-[8px] flex justify-center items-center absolute right-[0] top-[0] bottom-[0] font-Poppins leading-[28px] tracking-[0.03rem] py-[2px] px-[12px] text-[13px] font-normal text-[#fff] bg-[#d86c6c] rounded-[10px] border-[1px] border-solid border-[#e76d6d] hover:bg-[#f15a5a] hover:border-[#e64848] hover:text-[#ffffff]"
                                onClick={handleRemoveCoupon}
                              >
                                Remove
                              </button>
                            ) : (
                              <button
                                className="bb-btn-2 transition-all duration-[0.3s] ease-in-out my-[8px] mr-[8px] flex justify-center items-center absolute right-[0] top-[0] bottom-[0] font-Poppins leading-[28px] tracking-[0.03rem] py-[2px] px-[12px] text-[13px] font-normal text-[#fff] bg-[#0097b2] rounded-[10px] border-[1px] border-solid border-[#0097b2] hover:bg-transparent hover:border-[#3d4750] hover:text-[#3d4750]"
                                onClick={handleApplyCoupon}
                                disabled={isApplying}
                              >
                                {isApplying ? "Applying..." : "Apply"}
                              </button>
                            )}
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className="bb-checkout-pro mb-[-24px]">
                    {cartItems.map((item) => (
                      <div
                        key={item.id + item.net_quantity}
                        className="pro-items p-[15px] bg-[#f8f8fb] border-[1px] border-solid border-[#eee] rounded-[20px] flex mb-[24px] max-[420px]:flex-col"
                      >
                        <div className="image mr-[15px] max-[420px]:mr-[0] max-[420px]:mb-[15px]">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="max-w-max w-[100px] h-[100px] border-[1px] border-solid border-[#eee] rounded-[20px] max-[1399px]:h-[80px] max-[1399px]:w-[80px]"
                          />
                        </div>
                        <div className="items-contact flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-[16px] flex-1">
                              <a
                                href="javascript:void(0)"
                                className="font-Poppins tracking-[0.03rem] text-[15px] font-medium leading-[18px] text-[#3d4750]"
                              >
                                {item.name}
                              </a>
                            </h4>
                            <button
                              onClick={() =>
                                handleRemove(item.id, item.net_quantity)
                              }
                              className="text-red-500 hover:text-red-700 ml-2"
                              title="Remove item"
                            >
                              <i className="ri-delete-bin-line text-[16px]"></i>
                            </button>
                          </div>
                          <div className="bb-pro-variation my-2">
                            <ul className="flex flex-wrap m-[-2px]">
                              <li className="h-[22px] m-[2px] py-[2px] px-[8px] border-[1px] border-solid border-[#eee] text-[#777] flex items-center justify-center text-[12px] leading-[22px] rounded-[20px] active">
                                {item.net_quantity} {item.dosage_form}/s
                              </li>
                            </ul>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center">
                              <span className="font-Poppins text-[14px] font-medium text-[#3d4750] mr-3">
                                Quantity:
                              </span>
                              <div className="qty-plus-minus w-[100px] h-[35px] border-[1px] border-solid border-[#eee] overflow-hidden relative flex items-center justify-between bg-[#fff] rounded-[5px]">
                                <button
                                  type="button"
                                  className="bb-qtybtn w-8 h-full flex items-center justify-center text-sm hover:bg-gray-100 transition-colors"
                                  onClick={() => {
                                    if (item.quantity === 1) {
                                      handleRemove(item.id, item.net_quantity);
                                    } else {
                                      handleQuantityChange(
                                        item.id,
                                        item.net_quantity,
                                        item.quantity - 1
                                      );
                                    }
                                  }}
                                  disabled={isLoading}
                                >
                                  -
                                </button>
                                <span className="text-sm font-medium mx-2 min-w-[20px] text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  className="bb-qtybtn w-8 h-full flex items-center justify-center text-sm hover:bg-gray-100 transition-colors"
                                  onClick={() =>
                                    handleQuantityChange(
                                      item.id,
                                      item.net_quantity,
                                      item.quantity + 1
                                    )
                                  }
                                  disabled={isLoading}
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="inner-price flex items-center justify-left mb-[2px]">
                                <span className="new-price font-Poppins text-[#3d4750] font-semibold leading-[26px] tracking-[0.02rem] text-[12px]">
                                  {currency} {item.price.toFixed(2)} each
                                </span>
                              </div>
                              <div className="inner-price flex items-center justify-left">
                                <span className="new-price font-Poppins text-[#3d4750] font-semibold leading-[26px] tracking-[0.02rem] text-[15px]">
                                  Total: {currency}{" "}
                                  {(item.price * item.quantity).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="min-[992px]:w-[66.66%] w-full px-[12px] mb-[24px]">
              <div className="bb-checkout-contact border-[1px] border-solid border-[#eee] p-[20px] rounded-[20px]">
                <div className="main-title mb-[20px]">
                  <h4 className="font-quicksand tracking-[0.03rem] leading-[1.2] text-[20px] font-bold text-[#3d4750]">
                    Billing Details
                  </h4>
                </div>

                {/* Address Type Selection */}
                <div className="checkout-radio flex gap-[15px] mb-[20px] max-[480px]:flex-col">
                  <label
                    className={`flex-1 flex items-center p-[15px] border-[2px] border-solid rounded-[10px] cursor-pointer transition-all ${
                      !isNewAddress
                        ? "border-[#0097b2] bg-[#f0f9fb]"
                        : "border-[#eee] bg-white hover:border-[#d4d4d4]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      className="w-[18px] h-[18px] mr-[10px] cursor-pointer accent-[#0097b2]"
                      checked={!isNewAddress}
                      onChange={() => setIsNewAddress(false)}
                    />
                    <span className="font-Poppins text-[14px] font-medium text-[#3d4750]">
                      Use Existing Address
                    </span>
                  </label>
                  <label
                    className={`flex-1 flex items-center p-[15px] border-[2px] border-solid rounded-[10px] cursor-pointer transition-all ${
                      isNewAddress
                        ? "border-[#0097b2] bg-[#f0f9fb]"
                        : "border-[#eee] bg-white hover:border-[#d4d4d4]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      className="w-[18px] h-[18px] mr-[10px] cursor-pointer accent-[#0097b2]"
                      checked={isNewAddress}
                      onChange={() => setIsNewAddress(true)}
                    />
                    <span className="font-Poppins text-[14px] font-medium text-[#3d4750]">
                      Add New Address
                    </span>
                  </label>
                </div>

                {isNewAddress ? (
                  <div className="input-box-form py-[20px] border-b-[1px] border-solid border-[#eee]">
                    <form>
                      <div className="flex flex-wrap mx-[-12px]">
                        <div className="min-[992px]:w-[50%] w-full px-[12px]">
                          <div className="input-item mb-[24px]">
                            <label className="inline-block font-Poppins leading-[26px] tracking-[0.02rem] mb-[8px] text-[14px] font-medium text-[#3d4750]">
                              First Name *
                            </label>
                            <input
                              type="text"
                              name="first_name"
                              placeholder="Enter your First Name"
                              className="w-full p-[10px] text-[14px] font-normal text-[#686e7d] border-[1px] border-solid border-[#eee] leading-[26px] outline-[0] rounded-[10px]"
                              required=""
                              value={newAddress.first_name}
                              onChange={handleInputChange}
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
                              className="w-full p-[10px] text-[14px] font-normal text-[#686e7d] border-[1px] border-solid border-[#eee] leading-[26px] outline-[0] rounded-[10px]"
                              required=""
                              value={newAddress.last_name}
                              onChange={handleInputChange}
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
                              className="w-full p-[10px] text-[14px] font-normal text-[#686e7d] border-[1px] border-solid border-[#eee] leading-[26px] outline-[0] rounded-[10px]"
                              required=""
                              value={newAddress.email}
                              onChange={handleInputChange}
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
                              className="w-full p-[10px] text-[14px] font-normal text-[#686e7d] border-[1px] border-solid border-[#eee] leading-[26px] outline-[0] rounded-[10px]"
                              required=""
                              value={newAddress.phone}
                              onChange={handleInputChange}
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
                              className="w-full p-[10px] text-[14px] font-normal text-[#686e7d] border-[1px] border-solid border-[#eee] leading-[26px] outline-[0] rounded-[10px]"
                              required=""
                              value={newAddress.address}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>

                        <div className="min-[992px]:w-[50%] w-full px-[12px]">
                          <div className="input-item mb-[24px]">
                            <label className="inline-block font-Poppins leading-[26px] tracking-[0.02rem] mb-[8px] text-[14px] font-medium text-[#3d4750]">
                              Country *
                            </label>
                            <div className="custom-select p-[10px] border-[1px] border-solid border-[#eee] leading-[26px] rounded-[10px]">
                              <select
                                className="block w-full"
                                name="country"
                                onChange={(e) => {
                                  setSelectedCountry(e.target.value);
                                  handleInputChange(e);
                                }}
                                value={newAddress.country}
                              >
                                <option value="">Select a Country</option>
                                {countries.map((country) => (
                                  <option
                                    key={country.isoCode}
                                    value={country.isoCode}
                                  >
                                    {country.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className="min-[992px]:w-[50%] w-full px-[12px]">
                          <div className="input-item mb-[24px]">
                            <label className="inline-block font-Poppins leading-[26px] tracking-[0.02rem] mb-[8px] text-[14px] font-medium text-[#3d4750]">
                              Region State *
                            </label>
                            <div className="custom-select p-[10px] border-[1px] border-solid border-[#eee] leading-[26px] rounded-[10px]">
                              <select
                                className="block w-full"
                                name="state"
                                onChange={(e) => {
                                  handleInputChange(e);
                                  setSelectedState(e.target.value);
                                }}
                                value={newAddress.state}
                              >
                                <option value="">
                                  Please Select a region, state
                                </option>
                                {states.map((state) => (
                                  <option
                                    key={state.isoCode}
                                    value={state.isoCode}
                                  >
                                    {state.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                        <div className="min-[992px]:w-[50%] w-full px-[12px]">
                          <div className="input-item mb-[24px]">
                            <label className="inline-block font-Poppins leading-[26px] tracking-[0.02rem] mb-[8px] text-[14px] font-medium text-[#3d4750]">
                              City *
                            </label>
                            <div className="custom-select p-[10px] border-[1px] border-solid border-[#eee] leading-[26px] rounded-[10px]">
                              <select
                                className="block w-full"
                                name="city"
                                onChange={(e) => {
                                  handleInputChange(e);
                                  setSelectedCity(e.target.value);
                                }}
                                value={newAddress.city}
                              >
                                <option value="">Please Select a city</option>
                                {cities.map((city) => (
                                  <option key={city.name} value={city.name}>
                                    {city.name}
                                  </option>
                                ))}
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
                              className="w-full p-[10px] text-[14px] font-normal text-[#686e7d] border-[1px] border-solid border-[#eee] leading-[26px] outline-[0] rounded-[10px]"
                              required=""
                              value={newAddress.pincode}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="input-box-form py-[20px] border-b-[1px] border-solid border-[#eee]">
                    {addresses.length > 0 ? (
                      <div className="space-y-[15px]">
                        {addresses.map((address, index) => (
                          <label
                            key={index}
                            className={`block p-[20px] border-[2px] border-solid rounded-[15px] cursor-pointer transition-all ${
                              selectedAddress === address
                                ? "border-[#0097b2] bg-[#f0f9fb] shadow-md"
                                : "border-[#eee] bg-white hover:border-[#d4d4d4] hover:shadow-sm"
                            }`}
                          >
                            <div className="flex items-start">
                              <input
                                type="radio"
                                name="existing-address"
                                className="w-[20px] h-[20px] mt-[2px] mr-[15px] cursor-pointer accent-[#0097b2]"
                                checked={selectedAddress === address}
                                onChange={() => handleAddressSelect(address)}
                              />
                              <div className="flex-1">
                                <div className="font-Poppins text-[16px] font-semibold text-[#3d4750] mb-[8px]">
                                  {address.first_name} {address.last_name}
                                </div>
                                <div className="font-Poppins text-[14px] text-[#686e7d] leading-[22px] mb-[6px]">
                                  {address.address}
                                </div>
                                <div className="font-Poppins text-[14px] text-[#686e7d] leading-[22px] mb-[6px]">
                                  {address.city}, {address.state},{" "}
                                  {address.country} - {address.pincode}
                                </div>
                                <div className="font-Poppins text-[14px] text-[#686e7d] leading-[22px]">
                                  <span className="font-medium">Phone:</span>{" "}
                                  {address.phone}
                                  {address.email && (
                                    <>
                                      {" | "}
                                      <span className="font-medium">
                                        Email:
                                      </span>{" "}
                                      {address.email}
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-[40px]">
                        <p className="font-Poppins text-[16px] text-[#686e7d] mb-[15px]">
                          You have not saved any addresses yet.
                        </p>
                        <button
                          onClick={() => setIsNewAddress(true)}
                          className="font-Poppins text-[14px] text-[#0097b2] font-medium hover:underline"
                        >
                          Add a new address
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <div className="checkout-container">
                  <div className="checkout-summary mb-6 border-b border-gray-300 py-4">
                    <ul>
                      <li className="flex justify-between mb-2">
                        <span className="text-gray-600">Sub-total:</span>
                        <span>
                          {currency} {subtotal.toFixed(2)}
                        </span>
                      </li>
                      <li className="flex justify-between mb-2">
                        <span className="text-gray-600">Delivery Charges:</span>
                        <span>
                          {currency} {delivery_fee.toFixed(2)}
                        </span>
                      </li>
                      {discount > 0 && (
                        <li className="flex justify-between mb-2">
                          <span className="text-gray-600">
                            Coupon Discount:
                          </span>
                          <span>
                            - {currency} {discount.toFixed(2)}
                          </span>
                        </li>
                      )}
                    </ul>
                  </div>
                  <h2 className="text-xl font-semibold text-right mb-3">
                    Total: ${totalAmount}
                  </h2>

                  {error && (
                    <p className="text-red-500 my-3 font-semibold">{error}</p>
                  )}

                  {/* Paylabs Payment */}

                  <div className="my-5">
                    <button
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-all font-semibold text-lg shadow-lg"
                      onClick={handlePaylabsPayment}
                      disabled={isLoading || cartItems.length === 0}
                    >
                      {isLoading
                        ? "Processing..."
                        : cartItems.length === 0
                        ? "Cart is Empty"
                        : "Pay with Paylabs Credit Card"}
                    </button>
                    <p className="text-sm text-gray-600 mt-2 text-center">
                      You will be redirected to Paylabs secure payment page
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Remove Confirmation Modal */}
      {showRemoveModal && (
        <div className="fixed inset-0 z-[200] bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md w-full max-w-sm mx-4">
            <h2 className="text-lg font-semibold mb-4">Confirm Removal</h2>
            <p className="mb-6 text-gray-700">
              Are you sure you want to remove this item from your cart?
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
                onClick={() => setShowRemoveModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                onClick={confirmRemove}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <h2>Confirm Order</h2>
          <p>Are you sure you want to place this order?</p>
          <div className="modal-buttons">
            <button onClick={() => setShowModal(false)} className="m-2">
              Confirm
            </button>
            <button onClick={() => setShowModal(false)} className="m-2">
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </>
  );
};

export default Checkout;
