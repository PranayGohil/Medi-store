import { createContext, useState, useEffect } from "react";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const currency = "$";
  const delivery_fee = 100;

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

  useEffect(() => {
    fetchProducts();
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
