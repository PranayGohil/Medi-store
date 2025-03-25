import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Admin login function
  const login = async (userid, password) => {
    try {
      setIsLoading(true);
      console.log("Login ", userid, password);
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/admin/login`,
        {
          userid: userid, // Admin can use either username or email
          password: password,
        }
      );

      const { success, token, user } = response.data;

      if (success) {
        localStorage.setItem("token", token);
        setToken(token);
        setAdmin(user);
        toast.success("Logged in successfully!");
        navigate("/admin/dashboard");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Admin logout function
  const logout = () => {
    localStorage.removeItem("token");
    setAdmin(null);
    setToken(null);
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <AuthContext.Provider value={{ admin, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom Hook to use Auth Context
export const useAuth = () => useContext(AuthContext);
