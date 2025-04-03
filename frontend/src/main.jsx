import { createRoot } from "react-dom/client";
import "./index.css";
import "./assets/css/vendor/quill.snow.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ShopContextProvider from "./context/ShopContext.jsx";
import { AuthContextProvider } from "./context/AuthContext.jsx";
import { CartContextProvider } from "./context/CartContext.jsx";
import { LocationContextProvider } from "./context/LocationContext.jsx";
import { SitePreferencesContextProvider } from "./context/SitePreferencesContext.jsx";

import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const customIcons = {
  success: <FaCheckCircle color="blue" />,
  error: <FaTimesCircle color="yellow" />,
};

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <SitePreferencesContextProvider>
      <ShopContextProvider>
        <LocationContextProvider>
          <AuthContextProvider>
            <CartContextProvider>
              <App />
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick={true}
                rtl={false}
                icon={(type) => customIcons[type] || undefined}
                draggable
                toastClassName="custom-toast"
                progressClassName="custom-progress-bar"
              />
            </CartContextProvider>
          </AuthContextProvider>
        </LocationContextProvider>
      </ShopContextProvider>
    </SitePreferencesContextProvider>
  </BrowserRouter>
);
