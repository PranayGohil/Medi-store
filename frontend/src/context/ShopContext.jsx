import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const [products, setProducts] = useState([]);
  const currency = "₹";
  const delivery_fee = 100;

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

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
