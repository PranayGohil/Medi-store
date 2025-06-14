import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";

import ReCAPTCHA from "react-google-recaptcha";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const { cartItems, addItemToCart } = useContext(CartContext);
  const [showPassword, setShowPassword] = useState(false);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

  const notifySuccess = (message) => toast.success(message);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setError("");
    if (!isCaptchaVerified) {
      setError("Please complete the CAPTCHA verification.");
      return;
    }
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/user/login`,
        {
          email: formData.email,
          password: formData.password,
        }
      );

      if (response.data.success) {
        notifySuccess(response.data.message);
        localStorage.setItem("token", response.data.token);
        login(response.data.user);
        response.data.cartData.forEach((item) => {
          const isDuplicate = cartItems.some(
            (cartItem) =>
              cartItem.product_id === item.product_id &&
              cartItem.net_quantity === item.net_quantity
          );

          if (!isDuplicate) {
            addItemToCart(item);
          } else {
            console.log("Duplicate item found, not adding to cart:", item);
          }
        });
        navigate("/");
      } else {
        // Login failed
        setError(response.data.message);
        setIsCaptchaVerified(false); 
      }
    } catch (err) {
      setError("An error occurred during login.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Breadcrumb title="Login" destination1="Home" destination2="Login" />
      <section className="section-login py-[50px] max-[1199px]:py-[35px]">
        {/* ... (rest of your component) */}
        <div className="flex flex-wrap justify-between relative items-center mx-auto min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px]">
          <div className="flex flex-wrap w-full">
            {/* ... (heading and description) */}
            <div className="w-full px-[12px]">
              <div className="bb-login-contact max-w-[500px] m-[auto] border-[1px] border-solid border-[#eee] p-[30px] rounded-[20px]">
                <form onSubmit={handleSubmit}>
                  {/* ... (input fields) */}
                  <div className="bb-login-wrap mb-[24px]">
                    <label
                      htmlFor="email"
                      className="inline-block font-Poppins text-[15px] font-normal text-[#686e7d] leading-[26px] tracking-[0.02rem]"
                    >
                      Email*
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Enter Your Email"
                      className="w-full p-[10px] text-[14px] font-normal text-[#686e7d] border-[1px] border-solid border-[#eee] outline-[0] leading-[26px] rounded-[10px]"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="bb-login-wrap mb-[24px]">
                    <label
                      htmlFor="password"
                      className="inline-block font-Poppins text-[15px] font-normal text-[#686e7d] leading-[26px] tracking-[0.02rem]"
                    >
                      Password*
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        placeholder="Enter Your Password"
                        className="w-full p-[10px] text-[14px] font-normal text-[#686e7d] border-[1px] border-solid border-[#eee] outline-[0] leading-[26px] rounded-[10px]"
                        value={formData.password}
                        onChange={handleChange}
                      />
                      <span
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <i className="ri-eye-fill"></i>
                        ) : (
                          <i className="ri-eye-off-fill"></i>
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="bb-login-wrap mb-[24px]">
                    <Link
                      to="/forgot-password"
                      className="font-Poppins leading-[28px] tracking-[0.03rem] text-[14px] font-medium text-[#777]"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="bb-login-wrap mb-[24px]">
                    <ReCAPTCHA
                      sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                      onChange={(value) => {
                        setIsCaptchaVerified(true);
                      }}
                      onExpired={() => {
                        setIsCaptchaVerified(false);
                      }}
                    />
                  </div>
                  {error && (
                    <div className="w-full px-[12px] mb-[12px] text-red-500">
                      {error}
                    </div>
                  )}
                  <div className="bb-login-button m-[-5px] flex justify-between">
                    <button
                      className="bb-btn-2 transition-all duration-[0.3s] ease-in-out font-Poppins leading-[28px] tracking-[0.03rem] m-[5px] py-[4px] px-[20px] text-[14px] font-normal text-[#fff] bg-[#0097b2] rounded-[10px] border-[1px] border-solid border-[#0097b2] hover:bg-transparent hover:border-[#3d4750] hover:text-[#3d4750]"
                      type="submit"
                    >
                      Login
                    </button>
                    <Link
                      to="/register"
                      className="h-[36px] m-[5px] flex items-center font-Poppins text-[15px] text-[#686e7d] font-light leading-[28px] tracking-[0.03rem]"
                    >
                      Register
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
