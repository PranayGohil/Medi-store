import React, { useState, useContext } from "react";
import Breadcrumb from "../components/Breadcrumb";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import LoadingSpinner from "../components/LoadingSpinner";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import ReCAPTCHA from "react-google-recaptcha";

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phonenumber: "",
    password: "",
    confirmpassword: "",
  });

  const { login } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🛒 Sync local cart with server (copied from Login.jsx)
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

      // Merge local and server carts - prioritize local items
      const mergedCart = [...localCart];
      serverCart.forEach((serverItem) => {
        const key = `${serverItem.product_id}-${serverItem.net_quantity}`;
        if (!localCartMap.has(key)) {
          mergedCart.push(serverItem);
        }
      });

      localStorage.setItem("cartItems", JSON.stringify(mergedCart));
      return mergedCart;
    } catch (error) {
      console.error("Error syncing cart:", error);
      localStorage.setItem(
        "cartItems",
        JSON.stringify([...localCart, ...serverCart])
      );
      return [...localCart, ...serverCart];
    }
  };

  // 🧾 Handle Register Submit
  const handleSubmit = async () => {
    setError("");

    // Validation checks
    if (
      formData.firstname === "" ||
      formData.lastname === "" ||
      formData.email === "" ||
      formData.phonenumber === "" ||
      formData.password === "" ||
      formData.confirmpassword === ""
    ) {
      setError("All fields are required.");
      return;
    }

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      setError("Invalid email format.");
      return;
    }

    const sanitizedPhone = formData.phonenumber.replace(/\s+/g, "");
    if (!/^\+\d{7,15}$/.test(sanitizedPhone)) {
      setError("Invalid phone number format.");
      return;
    }

    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(
        formData.password
      )
    ) {
      setError("Please enter a strong password.");
      return;
    }

    if (formData.password !== formData.confirmpassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!isCaptchaVerified) {
      setError("Please complete the CAPTCHA verification.");
      return;
    }

    try {
      setIsLoading(true);

      // Register API
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/user/register`,
        {
          first_name: formData.firstname,
          last_name: formData.lastname,
          email: formData.email,
          phone: formData.phonenumber,
          password: formData.password,
        }
      );

      if (response.data.success) {
        // Save token and login user
        localStorage.setItem("token", response.data.token);
        login(response.data.user);

        // 🛒 Merge local + server cart just like Login.jsx
        const localCartItems = [...cartItems];
        const serverCartItems = response.data.cartData || [];

        const mergedCartItems = await syncCartWithServer(
          response.data.user._id,
          localCartItems,
          serverCartItems
        );

        console.log(
          "Cart merged successfully after registration:",
          mergedCartItems.length
        );

        // Reload to refresh cart context
        window.location.href = "/";
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("An error occurred during registration.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Breadcrumb
        title="Register"
        destination1="Home"
        destination2="Register"
      />
      <section className="section-register py-[50px] max-[1199px]:py-[35px]">
        <div className="flex flex-wrap justify-between relative items-center mx-auto min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px]">
          <div className="flex flex-wrap w-full">
            <div className="w-full">
              <div className="bb-register border-[1px] border-solid p-[30px] rounded-[20px]">
                <div className="flex flex-wrap">
                  <div className="w-full px-[12px]">
                    <div className="section-title mb-[20px] pb-[20px] z-[5] relative flex flex-col items-center text-center max-[991px]:pb-[0]">
                      <div className="section-detail max-[991px]:mb-[12px]">
                        <h2 className="bb-title font-quicksand mb-[0] p-[0] text-[25px] font-bold text-[#3d4750] relative inline capitalize leading-[1] tracking-[0.03rem] max-[767px]:text-[23px]">
                          Register
                        </h2>
                        <p className="font-Poppins max-w-[400px] mt-[10px] text-[14px] text-[#686e7d] leading-[18px] font-light tracking-[0.03rem] max-[991px]:mx-[auto]">
                          Best place to buy and sell digital products
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full px-[12px]">
                    <form className="flex flex-wrap mx-[-12px]">
                      <div className="bb-register-wrap w-[50%] max-[575px]:w-full px-[12px] mb-[24px]">
                        <label className="inline-block mb-[6px] text-[14px] leading-[18px] font-medium text-[#3d4750]">
                          First Name*
                        </label>
                        <input
                          type="text"
                          name="firstname"
                          placeholder="Enter your first name"
                          className="w-full p-[10px] text-[14px] font-normal text-[#686e7d] border-[1px] border-solid border-[#858585] outline-[0] leading-[26px] rounded-[10px]"
                          required=""
                          value={formData.firstname}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="bb-register-wrap w-[50%] max-[575px]:w-full px-[12px] mb-[24px]">
                        <label className="inline-block mb-[6px] text-[14px] leading-[18px] font-medium text-[#3d4750]">
                          Last Name*
                        </label>
                        <input
                          type="text"
                          name="lastname"
                          placeholder="Enter your Last name"
                          className="w-full p-[10px] text-[14px] font-normal text-[#686e7d] border-[1px] border-solid border-[#858585] outline-[0] leading-[26px] rounded-[10px]"
                          required=""
                          value={formData.lastname}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="bb-register-wrap w-[50%] max-[575px]:w-full px-[12px] mb-[24px]">
                        <label className="inline-block mb-[6px] text-[14px] leading-[18px] font-medium text-[#3d4750]">
                          Email*
                        </label>
                        <input
                          type="email"
                          name="email"
                          placeholder="Enter your Email"
                          className="w-full p-[10px] text-[14px] font-normal text-[#686e7d] border-[1px] border-solid border-[#858585] outline-[0] leading-[26px] rounded-[10px]"
                          required=""
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="bb-register-wrap w-[50%] max-[575px]:w-full px-[12px] mb-[24px]">
                        <label className="inline-block mb-[6px] text-[14px] leading-[18px] font-medium text-[#3d4750]">
                          Phone Number*
                        </label>
                        <PhoneInput
                          country={"in"}
                          value={formData.phonenumber}
                          onChange={(phone) =>
                            setFormData({
                              ...formData,
                              phonenumber: "+" + phone,
                            })
                          }
                          inputClass="w-full p-[10px] text-[14px] font-normal text-[#686e7d] border-[1px] border-solid border-[#858585] outline-[0] leading-[26px] rounded-[10px]"
                        />
                      </div>

                      <div className="bb-register-wrap w-[50%] max-[575px]:w-full px-[12px] mb-[24px]">
                        <label className="inline-block mb-[6px] text-[14px] leading-[18px] font-medium text-[#3d4750]">
                          Password*
                        </label>
                        <div className="relative">
                          <input
                            type={`${showPassword ? "text" : "password"}`}
                            name="password"
                            placeholder="Enter Password"
                            className="w-full p-[10px] text-[14px] font-normal text-[#686e7d] border-[1px] border-solid border-[#858585] outline-[0] leading-[26px] rounded-[10px]"
                            required=""
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
                      <div className="bb-register-wrap w-[50%] max-[575px]:w-full px-[12px] mb-[24px]">
                        <label className="inline-block mb-[6px] text-[14px] leading-[18px] font-medium text-[#3d4750]">
                          Confirm Password*
                        </label>
                        <div className="relative">
                          <input
                            type={`${
                              showConfirmPassword ? "text" : "password"
                            }`}
                            name="confirmpassword"
                            placeholder="Confirm Password"
                            className="w-full p-[10px] text-[14px] font-normal text-[#686e7d] border-[1px] border-solid border-[#858585] outline-[0] leading-[26px] rounded-[10px]"
                            required=""
                            value={formData.confirmpassword}
                            onChange={handleChange}
                          />
                          <span
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                            onClick={toggleConfirmPasswordVisibility}
                          >
                            {showPassword ? (
                              <i className="ri-eye-fill"></i>
                            ) : (
                              <i className="ri-eye-off-fill"></i>
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="bb-register-wrap w-full px-[12px] mb-[24px]">
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
                      <div className="bb-register-button w-full md:flex md:justify-between px-[12px]">
                        <button
                          type="button"
                          onClick={handleSubmit}
                          className="bb-btn-2 transition-all duration-[0.3s] ease-in-out font-Poppins leading-[28px] tracking-[0.03rem] py-[4px] px-[20px] text-[14px] font-normal text-[#fff] bg-[#0097b2] rounded-[10px] border-[1px] border-solid border-[#0097b2] hover:bg-transparent hover:border-[#3d4750] hover:text-[#3d4750]"
                        >
                          Register
                        </button>
                        <Link
                          to="/login"
                          className="h-[36px] m-[5px] flex items-center font-Poppins text-[15px] text-[#686e7d] font-light leading-[28px] tracking-[0.03rem]"
                        >
                          Already have an account? Login
                        </Link>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Register;
