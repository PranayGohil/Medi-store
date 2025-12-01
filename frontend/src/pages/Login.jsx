import React, { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import LoadingSpinner from "../components/LoadingSpinner";
import ReCAPTCHA from "react-google-recaptcha";
import { useFormik } from "formik";
import * as Yup from "yup";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const { cartItems, addItemToCart, clearCart, syncCartFromStorage } =
    useContext(CartContext);
  const [showPassword, setShowPassword] = useState(false);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

  // Yup validation schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required")
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid email address"
      ),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters")
      .max(50, "Password must not exceed 50 characters"),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
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
            email: values.email,
            password: values.password,
          }
        );

        if (response.data.success) {
          // Store token
          localStorage.setItem("token", response.data.token);

          // Login user
          login(response.data.user);

          // Get local cart items before they might be modified
          const localCartItems = [...cartItems];

          // Get server cart items
          const serverCartItems = response.data.cartData || [];

          // Sync carts
          const mergedCartItems = await syncCartWithServer(
            response.data.user._id,
            localCartItems,
            serverCartItems
          );

          console.log(
            "Cart synced successfully. Total items:",
            mergedCartItems.length
          );

          // Force a page reload to update cart context from localStorage
          // This ensures CartContext reads the updated localStorage
          window.location.href = from;
        } else {
          // Login failed
          setError(response.data.message);
          setIsCaptchaVerified(false);
        }
      } catch (err) {
        setError(
          err.response?.data?.message || "An error occurred during login."
        );
        console.error("Login error:", err);
        setIsCaptchaVerified(false);
      } finally {
        setIsLoading(false);
      }
    },
  });

  // Function to sync local cart with server
  const syncCartWithServer = async (userId, localCart, serverCart) => {
    try {
      // Create a map of server cart items for easy lookup
      const serverCartMap = new Map();
      serverCart.forEach((item) => {
        const key = `${item.product_id}-${item.net_quantity}`;
        serverCartMap.set(key, item);
      });

      // Create a map of local cart items
      const localCartMap = new Map();
      localCart.forEach((item) => {
        const key = `${item.product_id}-${item.net_quantity}`;
        localCartMap.set(key, item);
      });

      // Items to add to server (items in local cart but not in server cart)
      const itemsToAddToServer = [];

      localCart.forEach((localItem) => {
        const key = `${localItem.product_id}-${localItem.net_quantity}`;
        const serverItem = serverCartMap.get(key);

        if (!serverItem) {
          // Item exists in local cart but not in server cart
          itemsToAddToServer.push(localItem);
        }
      });

      // Add local cart items to server
      if (itemsToAddToServer.length > 0) {
        const token = localStorage.getItem("token");

        for (const item of itemsToAddToServer) {
          try {
            await axios.post(
              `${import.meta.env.VITE_APP_API_URL}/api/cart/add-to-cart`,
              {
                userId: userId,
                product_id: item.product_id,
                net_quantity: item.net_quantity,
                price: item.price,
                quantity: item.quantity,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
          } catch (err) {
            console.error("Error syncing cart item:", err);
          }
        }
      }

      // Merge local and server carts - prioritize local cart items
      const mergedCart = [...localCart];

      // Add server items that don't exist in local cart
      serverCart.forEach((serverItem) => {
        const key = `${serverItem.product_id}-${serverItem.net_quantity}`;
        if (!localCartMap.has(key)) {
          mergedCart.push(serverItem);
        }
      });

      // Update localStorage directly with merged cart
      localStorage.setItem("cartItems", JSON.stringify(mergedCart));

      return mergedCart;
    } catch (error) {
      console.error("Error syncing cart:", error);
      // If sync fails, at least keep the local cart
      localStorage.setItem(
        "cartItems",
        JSON.stringify([...localCart, ...serverCart])
      );
      return [...localCart, ...serverCart];
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
        <div className="flex flex-wrap justify-between relative items-center mx-auto min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px]">
          <div className="flex flex-wrap w-full">
            <div className="w-full px-[12px]">
              <div className="section-title mb-[20px] pb-[20px] z-[5] relative flex flex-col items-center text-center max-[991px]:pb-[0]">
                <div className="section-detail max-[991px]:mb-[12px]">
                  <h2 className="bb-title font-quicksand mb-[0] p-[0] text-[25px] font-bold text-[#3d4750] relative inline capitalize leading-[1] tracking-[0.03rem] max-[767px]:text-[23px]">
                    Login
                  </h2>
                  <p className="font-Poppins max-w-[400px] mt-[10px] text-[14px] text-[#686e7d] leading-[18px] font-light tracking-[0.03rem] max-[991px]:mx-[auto]">
                    Best place to buy and sell digital products
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full px-[12px]">
              <div className="bb-login-contact max-w-[500px] m-[auto] border-[1px] border-solid border-[#858585] p-[30px] rounded-[20px]">
                <form onSubmit={formik.handleSubmit}>
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
                      className={`w-full p-[10px] text-[14px] font-normal text-[#686e7d] border-[1px] border-solid outline-[0] leading-[26px] rounded-[10px] ${
                        formik.touched.email && formik.errors.email
                          ? "border-red-500"
                          : "border-[#858585]"
                      }`}
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.email && formik.errors.email && (
                      <div className="text-red-500 text-[12px] mt-[5px] font-Poppins">
                        {formik.errors.email}
                      </div>
                    )}
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
                        className={`w-full p-[10px] text-[14px] font-normal text-[#686e7d] border-[1px] border-solid outline-[0] leading-[26px] rounded-[10px] ${
                          formik.touched.password && formik.errors.password
                            ? "border-red-500"
                            : "border-[#858585]"
                        }`}
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      <span
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <i className="ri-eye-fill text-[18px] text-[#686e7d]"></i>
                        ) : (
                          <i className="ri-eye-off-fill text-[18px] text-[#686e7d]"></i>
                        )}
                      </span>
                    </div>
                    {formik.touched.password && formik.errors.password && (
                      <div className="text-red-500 text-[12px] mt-[5px] font-Poppins">
                        {formik.errors.password}
                      </div>
                    )}
                  </div>
                  <div className="bb-login-wrap mb-[24px]">
                    <Link
                      to="/forgot-password"
                      className="font-Poppins leading-[28px] tracking-[0.03rem] text-[14px] font-medium text-[#0097b2] hover:text-[#3d4750]"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="bb-login-wrap mb-[24px] flex justify-center">
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
                    <div className="w-full mb-[12px] p-[10px] text-center text-[14px] text-red-600 bg-red-50 border border-red-200 rounded-[10px]">
                      {error}
                    </div>
                  )}
                  <div className="bb-login-button m-[-5px] flex justify-between items-center">
                    <button
                      className="bb-btn-2 transition-all duration-[0.3s] ease-in-out font-Poppins leading-[28px] tracking-[0.03rem] m-[5px] py-[8px] px-[25px] text-[14px] font-medium text-[#fff] bg-[#0097b2] rounded-[10px] border-[1px] border-solid border-[#0097b2] hover:bg-transparent hover:border-[#3d4750] hover:text-[#3d4750] disabled:opacity-50 disabled:cursor-not-allowed"
                      type="submit"
                      disabled={!isCaptchaVerified || formik.isSubmitting}
                    >
                      Login
                    </button>
                    <Link
                      to="/register"
                      className="h-[36px] m-[5px] flex items-center font-Poppins text-[15px] text-[#0097b2] font-medium leading-[28px] tracking-[0.03rem] hover:text-[#3d4750]"
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
