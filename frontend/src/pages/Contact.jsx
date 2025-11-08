import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Breadcrumb from "../components/Breadcrumb";
import { AuthContext } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

const Contact = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    feedback: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        feedback: "",
      });
    }
  }, [user]);
  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit feedback
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    if (
      !formData.first_name ||
      !formData.last_name ||
      !formData.email ||
      !formData.phone ||
      !formData.feedback
    ) {
      setError("All fields are required.");
      return;
    }

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      setError("Invalid email format.");
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      setError("Invalid phone number format.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/feedback/add`,
        formData
      );
      console.log(" response : ", response);

      if (response.data.success) {
        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          feedback: "",
        });
        navigate("/");
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
      console.error("Error submitting feedback:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Breadcrumb title="Contact" destination1="Home" destination2="Contact" />
      <section className="py-[50px] max-[1199px]:py-[35px]">
        <div className="flex flex-wrap justify-center items-center mx-auto max-w-[960px]">
          <div className="w-full px-[12px] mb-[24px]">
            <h2 className="text-center text-[25px] font-bold text-[#3d4750]">
              Get In <span className="text-[#0097b2]">Touch</span>
            </h2>
            <p className="text-center text-[14px] text-[#686e7d]">
              Please select a topic below related to your inquiry. If you don't
              find what you need, fill out our contact form.
            </p>
          </div>

          {/* Feedback Form */}
          <div className="w-full md:w-1/2 border border-[#858585] rounded-[20px] p-[30px]">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="first_name"
                placeholder="Enter Your First Name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full h-[50px] p-[10px] border border-[#858585] rounded-[10px] mb-4"
              />
              <input
                type="text"
                name="last_name"
                placeholder="Enter Your Last Name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full h-[50px] p-[10px] border border-[#858585] rounded-[10px] mb-4"
              />
              <input
                type="email"
                name="email"
                placeholder="Enter Your Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full h-[50px] p-[10px] border border-[#858585] rounded-[10px] mb-4"
              />
              <input
                type="text"
                name="phone"
                placeholder="Enter Your Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full h-[50px] p-[10px] border border-[#858585] rounded-[10px] mb-4"
              />
              <textarea
                name="feedback"
                placeholder="Please leave your comments here.."
                value={formData.feedback}
                onChange={handleChange}
                className="w-full h-[150px] p-[10px] border border-[#858585] rounded-[10px] mb-4"
                style={{ resize: "none" }}
              ></textarea>

              {error && (
                <div className="text-red-500 my-4">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 text-white bg-[#0097b2] rounded-[10px] border border-[#0097b2] hover:bg-transparent hover:border-[#3d4750] hover:text-[#3d4750]"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
