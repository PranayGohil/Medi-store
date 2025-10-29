import { Route, Routes } from "react-router-dom";

import PageTitle from "./components/PageTitle";
import ScrollRestoration from "./components/ScrollRestoration";
import InvoicePrintWrapper from "./pages/InvoicePrintWrapper";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import PageNotFound from "./pages/PageNotFound";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Offers from "./pages/Offers";
import OrderDetails from "./pages/OrderDetails";
import OrderHistory from "./pages/OrderHistory";
import Profile from "./pages/Profile";
import SearchResults from "./pages/SearchResults";
import TermsAndConditions from "./pages/TermsAndConditions";
import PrivacyAndPolicy from "./pages/PrivacyAndPolicy";
import AllCategories from "./pages/AllCategories";
import PaymentCompleted from "./pages/PaymentCompleted";
import PaymentCancelled from "./pages/PaymentCancelled";
import PaylabsCallback from "./pages/PaylabsCallback";

function App() {
  return (
    <div>
      <ScrollRestoration />
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <PageTitle title="Foreever Cure - Home" />
              <Home />
            </>
          }
        />
        <Route
          path="/register"
          element={
            <>
              <PageTitle title="Account Register" />
              <Register />
            </>
          }
        />
        <Route
          path="/login"
          element={
            <>
              <PageTitle title="Account Login" />
              <Login />
            </>
          }
        />
        <Route
          path="/products"
          element={
            <>
              <PageTitle title="Products" />
              <Products />
            </>
          }
        />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route
          path="/cart"
          element={
            <>
              <PageTitle title="Shopping Cart" />
              <Cart />
            </>
          }
        />
        <Route
          path="/checkout"
          element={
            <>
              <PageTitle title="Checkout" />
              <Checkout />
            </>
          }
        />
        <Route
          path="/about"
          element={
            <>
              <PageTitle title="About Us" />
              <About />
            </>
          }
        />
        <Route
          path="/contact"
          element={
            <>
              <PageTitle title="Contact Us" />
              <Contact />
            </>
          }
        />
        <Route
          path="/offers"
          element={
            <>
              <PageTitle title="Offers" />
              <Offers />
            </>
          }
        />
        <Route
          path="/order-details/:id"
          element={
            <>
              <PageTitle title="Order Details" />
              <OrderDetails />
            </>
          }
        />
        <Route
          path="/order-history"
          element={
            <>
              <PageTitle title="Order History" />
              <OrderHistory />
            </>
          }
        />
        <Route
          path="/profile"
          element={
            <>
              <PageTitle title="Your Profile" />
              <Profile />
            </>
          }
        />
        <Route path="/search" element={<SearchResults />} />
        <Route
          path="/terms-and-conditions"
          element={
            <>
              <PageTitle title="Terms and Conditions" />
              <TermsAndConditions />
            </>
          }
        />
        <Route
          path="/privacy-policy"
          element={
            <>
              <PageTitle title="Privacy Policy" />
              <PrivacyAndPolicy />
            </>
          }
        />
        <Route
          path="/all-categories"
          element={
            <>
              <PageTitle title="All Categories" />
              <AllCategories />
            </>
          }
        />
        <Route
          path="/payment-completed"
          element={
            <>
              <PageTitle title="Payment Completed" />
              <PaymentCompleted />
            </>
          }
        />
        <Route
          path="/payment-cancelled"
          element={
            <>
              <PageTitle title="Payment Cancelled" />
              <PaymentCancelled />
            </>
          }
        />
        <Route
          path="/paylabs-callback"
          element={
            <>
              <PageTitle title="Paylabs Payment Callback" />
              <PaylabsCallback />
            </>
          }
        />
        <Route
          path="*"
          element={
            <>
              <PageTitle title="404 Page Not Found" />
              <PageNotFound />
            </>
          }
        />
        <Route
          path="/invoice/:orderId"
          element={
            <>
              <PageTitle title="Invoice" />
              <InvoicePrintWrapper />
            </>
          }
        />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
