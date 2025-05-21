// AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import LoadingSpinner from "../components/LoadingSpinner";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate(); // ✅ used for redirection

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
          console.warn("Token expired");
          handleLogout(); // logout and redirect
        } else {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Invalid token", error);
        handleLogout();
      }
    }

    setIsLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("cartItems");
    navigate("/login");
  };

  const value = {
    user,
    isLoading,
    login,
    logout: handleLogout,
  };

  return (
    <AuthContext.Provider value={value}>
      {isLoading ? <LoadingSpinner /> : children}
    </AuthContext.Provider>
  );
};
