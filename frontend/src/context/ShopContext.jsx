import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { SitePreferencesContext } from "./SitePreferencesContext";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const [products, setProducts] = useState([]);
  const currency = "₹";
  const [delivery_fee, set_delivery_charge] = useState(0);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/product/all`
      );
      setProducts(response.data.products);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSitePreferences = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/site`
      );
      if (response.data && response.data[0]) {
        set_delivery_charge(response.data[0].delivery_charge);
      }
    } catch (error) {
      toast.error("Failed to fetch settings");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchSitePreferences();
  }, []);

  const value = {
    products,
    setProducts,
    currency,
    delivery_fee,
    fetchProducts,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
