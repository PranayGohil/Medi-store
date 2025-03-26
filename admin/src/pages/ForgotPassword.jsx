import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (location.state && location.state.email) {
      setEmail(location.state.email);
    }
  }, [location]);

  const handleSendOtp = async () => {
    try {
      setIsLoading(true);
      await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/admin/send-otp`,
        { email }
      );
      toast.success("OTP sent to your email");
      setStep(2);
    } catch (error) {
      toast.error("Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setIsLoading(true);
      await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/admin/verify-otp`,
        { email, otp }
      );
      toast.success("OTP verified");
      setStep(3);
    } catch (error) {
      toast.error("Invalid or expired OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      setIsLoading(true);
      await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/admin/reset-password`,
        { email, otp, newPassword }
      );
      toast.success("Password reset successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Forgot Password</h1>

        {step === 1 && (
          <>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              readOnly
              className="w-full p-3 border  mb-4 bg-gray-100 cursor-not-allowed"
            />
            <button
              onClick={handleSendOtp}
              className="w-full bg-blue-500 text-white py-3 hover:bg-blue-600"
            >
              Send OTP
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <label>Enter OTP:</label>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 border mb-4"
            />
            <button
              onClick={handleVerifyOtp}
              className="w-full bg-blue-500 text-white py-3 hover:bg-blue-600"
            >
              Verify OTP
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <label>New Password:</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 border mb-4"
            />
            <button
              onClick={handleResetPassword}
              className="w-full bg-green-500 text-white py-3 hover:bg-green-600"
            >
              Reset Password
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
