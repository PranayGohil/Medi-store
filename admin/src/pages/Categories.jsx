import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const { products } = useContext(ShopContext);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/api/product/all`
        );
        console.log("response data products" + response.data.products);
        const allCategories = response.data.products.reduce(
          (acc, product) => {
            product.categories.forEach((cat) => {
              const categoryName = cat.category;
              const subcategoryName = cat.subcategory;

              if (!acc[categoryName]) {
                acc[categoryName] = new Set();
              }
              acc[categoryName].add(subcategoryName);
            });
            return acc;
          },
          {}
        );

        const formattedCategories = Object.entries(allCategories).map(
          ([category, subcategories]) => ({
            category,
            subcategories: Array.from(subcategories),
          })
        );

        setCategories(formattedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, [products]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Categories</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-xl font-semibold mb-2">{cat.category}</h2>
            <ul>
              {cat.subcategories.map((subcat, subIndex) => (
                <li key={subIndex} className="mb-2">
                  <Link
                    to={`/products?category=${cat.category}&subcategory=${subcat}`}
                    className="text-blue-500 hover:underline"
                  >
                    {subcat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;