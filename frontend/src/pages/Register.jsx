import React, { useState, useContext } from "react";
import Breadcrumb from "../components/Breadcrumb";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phonenumber: "",
    password: "",
    confirmpassword: "",
  });
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const notifySuccess = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError("");

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

    if (!/^\d{10}$/.test(formData.phonenumber)) {
      setError("Invalid phone number format.");
      return;
    }

    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(
        formData.password
      )
    ) {
      setError("Please enter a strong password");
      return;
    }

    if (formData.password !== formData.confirmpassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
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
        notifySuccess(response.data.message);
        localStorage.setItem("token", response.data.token);
        login(response.data.user);
        navigate("/");
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("An error occurred during registration.");
      console.error("Registration error:", err);
    }
  };

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
                          className="w-full p-[10px] text-[14px] font-normal text-[#686e7d] border-[1px] border-solid border-[#eee] outline-[0] leading-[26px] rounded-[10px]"
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
                          className="w-full p-[10px] text-[14px] font-normal text-[#686e7d] border-[1px] border-solid border-[#eee] outline-[0] leading-[26px] rounded-[10px]"
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
                          className="w-full p-[10px] text-[14px] font-normal text-[#686e7d] border-[1px] border-solid border-[#eee] outline-[0] leading-[26px] rounded-[10px]"
                          required=""
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="bb-register-wrap w-[50%] max-[575px]:w-full px-[12px] mb-[24px]">
                        <label className="inline-block mb-[6px] text-[14px] leading-[18px] font-medium text-[#3d4750]">
                          Phone Number*
                        </label>
                        <input
                          type="text"
                          name="phonenumber"
                          placeholder="Enter your phone number"
                          className="w-full p-[10px] text-[14px] font-normal text-[#686e7d] border-[1px] border-solid border-[#eee] outline-[0] leading-[26px] rounded-[10px]"
                          required=""
                          value={formData.phonenumber}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="bb-register-wrap w-[50%] max-[575px]:w-full px-[12px] mb-[24px]">
                        <label className="inline-block mb-[6px] text-[14px] leading-[18px] font-medium text-[#3d4750]">
                          Password*
                        </label>
                        <input
                          type="password"
                          name="password"
                          placeholder="Enter Password"
                          className="w-full p-[10px] text-[14px] font-normal text-[#686e7d] border-[1px] border-solid border-[#eee] outline-[0] leading-[26px] rounded-[10px]"
                          required=""
                          value={formData.password}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="bb-register-wrap w-[50%] max-[575px]:w-full px-[12px] mb-[24px]">
                        <label className="inline-block mb-[6px] text-[14px] leading-[18px] font-medium text-[#3d4750]">
                          Confirm Password*
                        </label>
                        <input
                          type="password"
                          name="confirmpassword"
                          placeholder="Confirm Password"
                          className="w-full p-[10px] text-[14px] font-normal text-[#686e7d] border-[1px] border-solid border-[#eee] outline-[0] leading-[26px] rounded-[10px]"
                          required=""
                          value={formData.confirmpassword}
                          onChange={handleChange}
                        />
                      </div>
                      {error && (
                        <div className="w-full px-[12px] mb-[12px] text-red-500">
                          {error}
                        </div>
                      )}
                      <div className="bb-register-button w-full flex justify-center">
                        <button
                          type="button"
                          onClick={handleSubmit}
                          className="bb-btn-2 transition-all duration-[0.3s] ease-in-out font-Poppins leading-[28px] tracking-[0.03rem] py-[4px] px-[20px] text-[14px] font-normal text-[#fff] bg-[#6c7fd8] rounded-[10px] border-[1px] border-solid border-[#6c7fd8] hover:bg-transparent hover:border-[#3d4750] hover:text-[#3d4750]"
                        >
                          Register
                        </button>
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
