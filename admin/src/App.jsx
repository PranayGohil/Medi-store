import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import CategoryManagement from "./pages/Categories";
import Products from "./pages/Products";
import Reviews from "./pages/Reviews";
import Feedbacks from "./pages/Feedbacks";
import Statistics from "./pages/Statistics";
import Users from "./pages/Users";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import DiscountCoupons from "./pages/DiscountCoupons";

import AddProduct from "./sub-pages/AddProduct";
import EditProducts from "./sub-pages/EditProducts";
import ViewProductDetails from "./sub-pages/ViewProductDetails";
import ViewOrderDetails from "./sub-pages/ViewOrderDetails";
import WebsiteSettings from "./pages/WebsiteSettings";
import ViewFeedbackDetail from "./sub-pages/ViewFeedbackDetail";
import ViewUserDetails from "./sub-pages/ViewUserDetails";

import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";

import PageNotFound from "./pages/PageNotFound";

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="h-screen flex bg-gray-100">
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isOpen ? "ml-72" : "ml-0"
        } lg:ml-72`}
      >
        <Navbar pageTitle="Dashboard" toggleSidebar={toggleSidebar} />

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/categories" element={<CategoryManagement />} />
          <Route path="/products" element={<Products />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/feedbacks" element={<Feedbacks />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/users" element={<Users />} />
          <Route path="/user/user-details/:id" element={<ViewUserDetails />} />

          <Route path="/website-settings" element={<WebsiteSettings />} />
          <Route path="/discount-coupons" element={<DiscountCoupons />} />

          <Route path="/product/add-product" element={<AddProduct />} />
          <Route path="/product/edit-product/:id" element={<EditProducts />} />
          <Route
            path="/product/product-details/:id"
            element={<ViewProductDetails />}
          />

          <Route
            path="/order/order-details/:id"
            element={<ViewOrderDetails />}
          />

          <Route
            path="/feedback-details/:id"
            element={<ViewFeedbackDetail />}
          />

          <Route path="/profile" element={<Profile />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
