import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import ShopContextProvider from "./context/ShopContext.jsx";
import { AuthContextProvider } from "./context/AuthContext.jsx";
import { CartContextProvider } from "./context/CartContext.jsx";
import { LocationContextProvider } from "./context/LocationContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ShopContextProvider>
      <LocationContextProvider>
        <AuthContextProvider>
          <CartContextProvider>
            <App />
          </CartContextProvider>
        </AuthContextProvider>
      </LocationContextProvider>
    </ShopContextProvider>
  </BrowserRouter>
);
