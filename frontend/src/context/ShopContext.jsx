import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const currency = "$";
  const [delivery_fee, set_delivery_charge] = useState(0);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/product/all`
      );
      setProducts(response.data.products);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSitePreferences = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/site`
      );
      console.log("Site Preferences : ", response.data);
      if (response.data && response.data[0]) {
        set_delivery_charge(response.data[0].delivery_charge);
      }
    } catch (error) {
      console.log("Site Preferences : ", error);
    } finally {
      setIsLoading(false);
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

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
