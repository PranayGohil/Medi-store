import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import PageTitle from "./components/PageTitle";

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
          <Route
            path="/"
            element={
              <>
                <PageTitle title="Admin | Dashboard" />
                <Dashboard />
              </>
            }
          />
          <Route
            path="/dashboard"
            element={
              <>
                <PageTitle title="Admin | Dashboard" />
                <Dashboard />
              </>
            }
          />
          <Route
            path="/login"
            element={
              <>
                <PageTitle title="Admin | Login" />
                <Login />
              </>
            }
          />
          <Route
            path="/orders"
            element={
              <>
                <PageTitle title="Admin | Orders" />
                <Orders />
              </>
            }
          />
          <Route
            path="/categories"
            element={
              <>
                <PageTitle title="Admin | Category" />
                <CategoryManagement />
              </>
            }
          />
          <Route
            path="/products"
            element={
              <>
                <PageTitle title="Admin | Products" />
                <Products />
              </>
            }
          />
          <Route
            path="/reviews"
            element={
              <>
                <PageTitle title="Admin | Reviews" />
                <Reviews />
              </>
            }
          />
          <Route
            path="/feedbacks"
            element={
              <>
                <PageTitle title="Admin | Feedbacks" />
                <Feedbacks />
              </>
            }
          />
          <Route
            path="/statistics"
            element={
              <>
                <PageTitle title="Admin | Statistics" />
                <Statistics />
              </>
            }
          />
          <Route
            path="/users"
            element={
              <>
                <PageTitle title="Admin | Users" />
                <Users />
              </>
            }
          />
          <Route
            path="/user/user-details/:id"
            element={
              <>
                <PageTitle title="Admin | User Details" />
                <ViewUserDetails />
              </>
            }
          />

          <Route
            path="/website-settings"
            element={
              <>
                <PageTitle title="Admin | Website Settings" />
                <WebsiteSettings />
              </>
            }
          />
          <Route
            path="/discount-coupons"
            element={
              <>
                <PageTitle title="Admin | Discount Coupons" />
                <DiscountCoupons />
              </>
            }
          />

          <Route
            path="/product/add-product"
            element={
              <>
                <PageTitle title="Admin | Add Product" />
                <AddProduct />
              </>
            }
          />
          <Route
            path="/product/edit-product/:id"
            element={
              <>
                <PageTitle title="Admin | Edit Product" />
                <EditProducts />
              </>
            }
          />
          <Route
            path="/product/product-details/:id"
            element={
              <>
                <PageTitle title="Admin | Product Details" />
                <ViewProductDetails />
              </>
            }
          />

          <Route
            path="/order/order-details/:id"
            element={
              <>
                <PageTitle title="Admin | Order Details" />
                <ViewOrderDetails />
              </>
            }
          />

          <Route
            path="/feedback-details/:id"
            element={
              <>
                <PageTitle title="Admin | Feedback Details" />
                <ViewFeedbackDetail />
              </>
            }
          />

          <Route
            path="/profile"
            element={
              <>
                <PageTitle title="Admin | Profile" />
                <Profile />
              </>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <>
                <PageTitle title="Admin | Forgot Password" />
                <ForgotPassword />
              </>
            }
          />

          <Route
            path="*"
            element={
              <>
                <PageTitle title="Admin | 404 Not Found" />
                <PageNotFound />
              </>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
