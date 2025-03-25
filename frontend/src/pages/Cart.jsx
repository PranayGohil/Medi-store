import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import axios from "axios";
import { Country, State, City } from "country-state-city";
import { toast } from "react-toastify";
import { ShopContext } from "../context/ShopContext";
import { AuthContext } from "../context/AuthContext";
import { LocationContext } from "../context/LocationContext";
import { CartContext } from "../context/CartContext";
import LoadingSpinner from "../components/LoadingSpinner";

const Cart = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [totalCartPrice, setTotalCartPrice] = useState(0);
  const { currency, delivery_fee } = useContext(ShopContext);
  const { user } = useContext(AuthContext);
  const { updateLocationData } = useContext(LocationContext);
  const { removeItemFromCart } = useContext(CartContext);

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

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
      setCartItems(response.data.cartItems);
      setTotalCartPrice(response.data.totalCartPrice);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCartData();
    } else {
      notifyError("Please login to view your cart.");
      navigate("/login");
    }
  }, [user]);

  const handleQuantityChange = (id, value) => {
    const updatedCart = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: Math.max(1, value) } : item
    );
    setCartItems(updatedCart);
    // You'll need to update the backend here
  };

  const handleRemove = async (id) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${import.meta.env.VITE_APP_API_URL}/api/cart/remove-from-cart/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      if (response.data.success) {
        notifySuccess(response.data.message);
        removeItemFromCart(id);
        fetchCartData();
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const handleLocationChange = () => {
    updateLocationData({
      country: selectedCountry,
      state: selectedState,
      city: selectedCity,
      pincode: document.getElementById("Zip-code").value, // Get pincode from input
    });
  };

  const countries = Country.getAllCountries();
  const states = selectedCountry
    ? State.getStatesOfCountry(selectedCountry)
    : [];
  const cities = selectedState
    ? City.getCitiesOfState(selectedCountry, selectedState)
    : [];

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Breadcrumb title="Cart" destination1="Home" destination2="Cart" />
      <section className="ection-cart py-[50px] max-[1199px]:py-[35px]">
        <div className="flex flex-wrap justify-between relative items-center mx-auto min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px]">
          <div className="flex flex-wrap w-full mb-[-24px]">
            <div className="min-[992px]:w-[33.33%] w-full px-[12px] mb-[24px]">
              <div className="bb-cart-sidebar-block p-[20px] bg-[#f8f8fb] border-[1px] border-solid border-[#eee] rounded-[20px]">
                <div className="bb-sb-title mb-[20px]">
                  <h3 className="font-quicksand tracking-[0.03rem] leading-[1.2] text-[20px] font-bold text-[#3d4750]">
                    Summary
                  </h3>
                </div>
                <div className="bb-sb-blok-contact">
                  <div className="bb-cart-summary">
                    <div className="inner-summary">
                      <ul>
                        <li className="mb-[12px] flex justify-between leading-[28px]">
                          <span className="text-left font-Poppins leading-[28px] tracking-[0.03rem] text-[14px] text-[#686e7d] font-medium">
                            Sub-Total
                          </span>
                          <span className="text-right font-Poppins leading-[28px] tracking-[0.03rem] text-[14px] text-[#686e7d] font-semibold">
                            {currency}
                            {calculateTotal().toFixed(2)}
                          </span>
                        </li>
                        <li className="mb-[12px] flex justify-between leading-[28px]">
                          <span className="text-left font-Poppins leading-[28px] tracking-[0.03rem] text-[14px] text-[#686e7d] font-medium">
                            Delivery Charges
                          </span>
                          <span className="text-right font-Poppins leading-[28px] tracking-[0.03rem] text-[14px] text-[#686e7d] font-semibold">
                            {currency}
                            {delivery_fee}
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div className="summary-total border-t-[1px] border-solid border-[#eee] pt-[15px]">
                      <ul className="mb-[0]">
                        <li className="mb-[6px] flex justify-between">
                          <span className="text-left font-Poppins text-[16px] leading-[28px] tracking-[0.03rem] font-semibold text-[#686e7d]">
                            Total Amount
                          </span>
                          <span className="text-right font-Poppins text-[16px] leading-[28px] tracking-[0.03rem] font-semibold text-[#686e7d]">
                            {currency}
                            {(calculateTotal() + delivery_fee).toFixed(2)}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="min-[992px]:w-[66.66%] w-full px-[12px] mb-[24px]">
              <div className="bb-cart-table border-[1px] border-solid border-[#eee] rounded-[20px] overflow-hidden max-[1399px]:overflow-y-auto">
                <table className="w-full max-[1399px]:w-[780px]">
                  <thead>
                    <tr className="border-b-[1px] border-solid border-[#eee]">
                      <th className="font-Poppins p-[12px] text-left text-[16px] font-medium text-[#3d4750] leading-[26px] tracking-[0.02rem] capitalize">
                        Product
                      </th>
                      <th className="font-Poppins p-[12px] text-left text-[16px] font-medium text-[#3d4750] leading-[26px] tracking-[0.02rem] capitalize">
                        Price
                      </th>
                      <th className="font-Poppins p-[12px] text-left text-[16px] font-medium text-[#3d4750] leading-[26px] tracking-[0.02rem] capitalize">
                        quality
                      </th>
                      <th className="font-Poppins p-[12px] text-left text-[16px] font-medium text-[#3d4750] leading-[26px] tracking-[0.02rem] capitalize">
                        Total
                      </th>
                      <th className="font-Poppins p-[12px] text-left text-[16px] font-medium text-[#3d4750] leading-[26px] tracking-[0.02rem] capitalize"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr
                        key={item.id + item.net_quantity}
                        className="border-b-[1px] border-solid border-[#eee]"
                      >
                        <td className="p-[12px]">
                          <div className="Product-cart flex items-center">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-[70px] border-[1px] border-solid border-[#eee] rounded-[10px]"
                            />
                            <span className="ml-[10px] font-Poppins text-[14px] font-normal leading-[28px] tracking-[0.03rem] text-[#686e7d]">
                              {item.name}({item.generic_name})
                              <br />
                              {item.net_quantity} {item.dosage_form}/s
                            </span>
                          </div>
                        </td>
                        <td className="p-[12px]">
                          <span className="price font-Poppins text-[15px] font-medium leading-[26px] tracking-[0.02rem] text-[#686e7d]">
                            {currency}
                            {item.price}
                          </span>
                        </td>
                        <td className="p-[12px]">
                          <div className="qty-plus-minus w-[85px] h-[45px] py-[7px] border-[1px] border-solid border-[#eee] overflow-hidden relative flex items-center justify-between bg-[#fff] rounded-[10px]">
                            <input
                              type="number"
                              value={item.quantity}
                              min="1"
                              className="qty-input text-[#777] float-left text-[14px] h-[auto] m-[0] p-[0] text-center w-[32px] outline-[0] font-normal leading-[35px] rounded-[10px]"
                              onChange={(e) =>
                                handleQuantityChange(
                                  item.id,
                                  parseInt(e.target.value) || 1
                                )
                              }
                            />
                          </div>
                        </td>
                        <td className="p-[12px]">
                          <span className="price font-Poppins text-[15px] font-medium leading-[26px] tracking-[0.02rem] text-[#686e7d]">
                            {currency}
                            {item.total.toFixed(2)}
                          </span>
                        </td>
                        <td className="p-[12px]">
                          <div className="pro-remove">
                            <button onClick={() => handleRemove(item.id)}>
                              <i className="ri-delete-bin-line transition-all duration-[0.3s] ease-in-out text-[20px] text-[#686e7d] hover:text-[#ff0000]"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {cartItems.length === 0 && (
                      <tr>
                        <td colSpan="5" className="text-center py-4">
                          Your cart is empty
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {cartItems.length > 0 && (
                <Link
                  to="/checkout"
                  className="bb-btn-2 mt-[24px] inline-flex items-center justify-center check-btn transition-all duration-[0.3s] ease-in-out font-Poppins leading-[28px] tracking-[0.03rem] py-[8px] px-[20px] text-[14px] font-normal text-[#fff] bg-[#6c7fd8] rounded-[10px] border-[1px] border-solid border-[#6c7fd8] hover:bg-transparent hover:border-[#3d4750] hover:text-[#3d4750]"
                >
                  Check Out
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Cart;
