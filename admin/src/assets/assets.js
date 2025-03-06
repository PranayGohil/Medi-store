import axios from "axios";

const fetchProducts = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/product/all`);
    return response.data.products;
  } catch (error) {
    console.error(error);
  }
}

export const products = await fetchProducts();


