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
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";

const Checkout = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { user } = useContext(AuthContext);
  const { currency, delivery_fee } = useContext(ShopContext);
  const { locationData, updateLocationData } = useContext(LocationContext);
  const { clearCart } = useContext(CartContext);

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
          toast.error("Some Cart Product is Not Available");
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
    // Update LocationContext when local states change
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

  const confirmOrder = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      let deliveryAddress = isNewAddress ? [newAddress] : [selectedAddress];

      setShowModal(false);

      if (!isNewAddress && !selectedAddress) {
        toast.error("Please select or add an address.");
        setShowModal(false);
        return;
      }

      const orderData = {
        products: cartItems.map((item) => ({
          product_id: item.id,
          net_quantity: item.net_quantity,
          quantity: item.quantity,
          price: item.price,
        })),
        sub_total: subtotal,
        delivery_charge: delivery_fee,
        discount: discount,
        total: total,
        delivery_address: deliveryAddress,
        payment_method: paymentMethod,
        payment_status: "pending",
        order_status: "pending",
      };

      console.log("Order data:", orderData);

      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/order/add`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (isNewAddress) {
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
          .then(() => {
            toast.success("Address Saved Successfully.");
          })
          .catch((error) => {
            console.error("Error adding address:", error);
            toast.error("Failed to add address.");
          });
      }

      toast.success("Order placed successfully!");
      navigate("/order-history");
      // Clear cart or redirect as needed
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to create order.");
    } finally {
      setIsLoading(false);
    }
  };

  const [paymentMethod, setPaymentMethod] = useState("paypal");
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);

  const totalAmount = (subtotal + delivery_fee - discount).toFixed(2);

  // const handlePlaceOrder = () => {
  //   if (!isNewAddress && !selectedAddress) {
  //     toast.error("Please select or add an address.");
  //     setShowModal(false);
  //     return;
  //   }
  //   if (isNewAddress) {
  //     if (
  //       newAddress.first_name === "" ||
  //       newAddress.last_name === "" ||
  //       newAddress.email === "" ||
  //       newAddress.phone === "" ||
  //       newAddress.address === "" ||
  //       newAddress.country === "" ||
  //       newAddress.state === "" ||
  //       newAddress.city === "" ||
  //       newAddress.pincode === ""
  //     ) {
  //       toast.error("Please fill all the details.");
  //       return;
  //     }
  //   }
  //   setShowPaymentOptions(true);
  // };

  const handleApprove = async (orderID) => {
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
          payment_method: paymentMethod,
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
          toast.error(addOrder.data.message);
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
          toast.error(deleteCart.data.message);
          return;
        }

        clearCart();

        console.log("Order created:", addOrder.data);
      } else {
        toast.error("Payment Capturing Failed.");
      }

      navigate("/payment-completed");
    } catch (error) {
      console.error("Error capturing order:", error);
      navigate("/payment-cancelled");
    } finally {
      setIsLoading(false);
    }
  };

  const createOrder = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!isNewAddress && !selectedAddress) {
        toast.error("Please select or add an address.");
        setShowModal(false);
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
          toast.error("Please fill all the details.");
          return;
        }
      }

      if (isNewAddress) {
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
          .then(() => {
            toast.success("Address Saved Successfully.");
          })
          .catch((error) => {
            console.error("Error adding address:", error);
            toast.error("Failed to add address.");
          });
      }
      console.log("Total Amount:" + totalAmount);
      let product_id = "";
      cartItems.map((item) => (product_id = product_id + item.id + ","));

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
      console.error("Error creating order:", error);
      setError("Failed to create order");
    }
  };

  const handleApplyCoupon = async () => {
    console.log("Coupon Code:", couponCode);
    if (!couponCode) {
      toast.error("Please enter a coupon code");
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
      toast.success(`Coupon applied! You saved $${discount.toFixed(2)}`);
    } catch (error) {
      console.error("Error verifying coupon:", error);
      toast.error(
        error.response?.data?.error || "Invalid or expired coupon code"
      );
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemoveCoupon = () => {
    setDiscount(0);
    setCouponCode("");
    toast.success("Coupon removed!");
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
                      summary
                    </h4>
                  </div>
                  <div className="checkout-summary mb-[20px] border-b-[1px] border-solid border-[#eee]">
                    <ul className="mb-[20px]">
                      <li className="flex justify-between leading-[28px] mb-[8px]">
                        <span className="left-item font-Poppins leading-[28px] tracking-[0.03rem] text-[14px] font-medium text-[#686e7d]">
                          sub-total
                        </span>
                        <span className="font-Poppins leading-[28px] tracking-[0.03rem] text-[14px] font-medium text-[#686e7d]">
                          {currency}
                          {subtotal.toFixed(2)}
                        </span>
                      </li>
                      <li className="flex justify-between leading-[28px] mb-[8px]">
                        <span className="left-item font-Poppins leading-[28px] tracking-[0.03rem] text-[14px] font-medium text-[#686e7d]">
                          Delivery Charges
                        </span>
                        <span className="font-Poppins leading-[28px] tracking-[0.03rem] text-[14px] font-medium text-[#686e7d]">
                          {currency}
                          {delivery_fee.toFixed(2)}
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
                              - {currency}
                              {discount.toFixed(2)}
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
                        <div className="items-contact">
                          <h4 className="text-[16px]">
                            <a
                              href="javascript:void(0)"
                              className="font-Poppins tracking-[0.03rem] text-[15px] font-medium leading-[18px] text-[#3d4750]"
                            >
                              {item.name}
                            </a>
                          </h4>
                          <div className="bb-pro-variation my-2">
                            <ul className="flex flex-wrap m-[-2px]">
                              <li className="h-[22px] m-[2px] py-[2px] px-[8px] border-[1px] border-solid border-[#eee] text-[#777] flex items-center justify-center text-[12px] leading-[22px] rounded-[20px] active">
                                {item.net_quantity} {item.dosage_form}/s
                              </li>
                            </ul>
                          </div>
                          <div className="inner-price flex items-center justify-left mb-[2px]">
                            <span className="new-price font-Poppins text-[#3d4750] font-semibold leading-[26px] tracking-[0.02rem] text-[12px]">
                              {currency}
                              {item.price.toFixed(2)} x {item.quantity}
                            </span>
                          </div>
                          <div className="inner-price flex items-center justify-left mb-[2px]">
                            <span className="new-price font-Poppins text-[#3d4750] font-semibold leading-[26px] tracking-[0.02rem] text-[15px]">
                              Total : {currency}
                              {item.price.toFixed(2) * item.quantity.toFixed(2)}
                            </span>
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
                <div className="checkout-radio flex mb-[10px] max-[480px]:flex-col">
                  <div className="radio-itens mr-[20px]">
                    <input
                      type="radio"
                      id="address1"
                      name="address"
                      className="w-auto mr-[2px] p-[10px]"
                      onClick={() => setIsNewAddress(false)}
                      defaultChecked={true}
                    />
                    <label
                      htmlFor="address1"
                      className="relative font-normal text-[14px] text-[#686e7d] pl-[26px] cursor-pointer leading-[16px] inline-block tracking-[0]"
                    >
                      I want to use an existing address
                    </label>
                  </div>
                  <div className="radio-itens">
                    <input
                      type="radio"
                      id="address2"
                      name="address"
                      className="w-auto mr-[2px] p-[10px]"
                      onClick={() => setIsNewAddress(true)}
                    />
                    <label
                      htmlFor="address2"
                      className="relative font-normal text-[14px] text-[#686e7d] pl-[26px] cursor-pointer leading-[16px] inline-block tracking-[0]"
                    >
                      I want to use new address
                    </label>
                  </div>
                </div>
                {isNewAddress ? (
                  <div className="input-box-form py-[20px] border-b-[1px] border-solid border-[#eee]">
                    <form>
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
                              className="w-full p-[10px] text-4px] font-normal text-[#686e7d] border-[1px] border-solid border-[#eee] leading-[26px] outline-[0] rounded-[10px]"
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
                      <ul>
                        {addresses.map((address, index) => (
                          <li key={index} className="mb-[10px]">
                            <div className="flex flex-col">
                              <input
                                type="radio"
                                id={`existing-address-${index}`}
                                name="existing-address"
                                className="w-auto mr-[2px] p-[10px]"
                                onClick={() => handleAddressSelect(address)}
                              />
                              <label
                                htmlFor={`existing-address-${index}`}
                                className="mt-[4px] relative font-normal text-[14px] text-[#686e7d] pl-[26px] cursor-pointer leading-[16px] inline-block tracking-[0]"
                              >
                                {address.first_name} {address.last_name},
                                {address.address}, <br />
                              </label>
                              <label
                                htmlFor={`existing-address-${index}`}
                                className="mt-[4px] relative font-normal text-[14px] text-[#686e7d] pl-[26px] cursor-pointer leading-[16px] inline-block tracking-[0]"
                              >
                                {address.city}, {address.state},{" "}
                                {address.country}, {address.pincode} <br />
                              </label>
                              <label
                                htmlFor={`existing-address-${index}`}
                                className="mt-[4px] relative font-normal text-[14px] text-[#686e7d] pl-[26px] cursor-pointer leading-[16px] inline-block tracking-[0]"
                              >
                                {address.phone}, {address.email}
                              </label>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>You have not saved any addresses yet.</p>
                    )}
                  </div>
                )}

                <div className="checkout-container">
                  <div className="checkout-summary mb-6 border-b border-gray-300 py-4">
                    <ul>
                      <li className="flex justify-between mb-2">
                        <span className="text-gray-600">Sub-total:</span>
                        <span>
                          {currency}
                          {subtotal.toFixed(2)}
                        </span>
                      </li>
                      <li className="flex justify-between mb-2">
                        <span className="text-gray-600">Delivery Charges:</span>
                        <span>
                          {currency}
                          {delivery_fee.toFixed(2)}
                        </span>
                      </li>
                      {discount > 0 && (
                        <li className="flex justify-between mb-2">
                          <span className="text-gray-600">
                            Coupon Discount:
                          </span>
                          <span>
                            - {currency}
                            {discount.toFixed(2)}
                          </span>
                        </li>
                      )}
                    </ul>
                  </div>
                  <h2 className="text-xl font-semibold text-right mb-3">
                    Total: ${totalAmount}
                  </h2>

                  {/* <div className="w-full">
                    <button
                      className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
                      onClick={handlePlaceOrder}
                    >
                      Place Order
                    </button>
                  </div> */}
                  <h4 className="mt-5 font-quicksand tracking-[0.03rem] leading-[1.2] text-[20px] font-bold text-[#3d4750]">
                    Place Order
                  </h4>
                  <div className="my-5 mx-8">
                    <PayPalScriptProvider
                      options={{
                        "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
                      }}
                      className="w-full"
                    >
                      <div>
                        {error && <p style={{ color: "red" }}>{error}</p>}

                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={(data) => handleApprove(data.orderID)}
                          fundingSource="paypal"
                          className="flex justify-center w-[100%]"
                        />
                      </div>
                    </PayPalScriptProvider>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <h2>Confirm Order</h2>
          <p>Are you sure you want to place this order?</p>
          <div className="modal-buttons">
            <button onClick={confirmOrder} className="m-2">
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
