import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import CategoryManagement from "./pages/Categories";
import Products from "./pages/Products";
import Stocks from "./pages/Stocks";
import Reviews from "./pages/Reviews";
import Feedbacks from "./pages/Feedbacks";
import Statistics from "./pages/Statistics";
import Users from "./pages/Users";
import Login from "./pages/Login";

import AddProduct from "./sub-pages/AddProduct";
import EditProducts from "./sub-pages/EditProducts";
import ViewProductDetails from "./sub-pages/ViewProductDetails";
import ViewOrderDetails from "./sub-pages/ViewOrderDetails";

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
          <Route path='/login' element={<Login />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/categories" element={<CategoryManagement />} />
          <Route path="/products" element={<Products />} />
          <Route path="/stocks" element={<Stocks />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/feedbacks" element={<Feedbacks />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/users" element={<Users />} />
          
          <Route path="/product/add-product" element={<AddProduct />} />
          <Route path="/product/edit-product/:id" element={<EditProducts />} />
          <Route path="/product/product-details/:id" element={<ViewProductDetails />} />
          <Route path="/order/order-details/:id" element={<ViewOrderDetails />} />

        </Routes>
      </div>
    </div>
  );
}

export default App;
