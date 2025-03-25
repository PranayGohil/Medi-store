import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Breadcrumb from "../components/Breadcrumb";
import LoadingSpinner from "../components/LoadingSpinner";

const AllCategories = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/category/all`
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ✅ Navigate with state (no query params)
  const handleSubCategoryClick = (category, subcategory) => {
    navigate("/products", {
      state: { category, subcategory }, // Passing selected values through state
    });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Breadcrumb
        title="All Categories"
        destination1="Home"
        destination2="All Categories"
      />

      <section className="section-shop pb-[50px] max-[1199px]:pb-[35px]">
        <div className="flex flex-wrap justify-between relative items-center mx-auto min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px]">
          <div className="w-full mb-[-24px] columns-3">
            {categories.map((category) => (
              <div
                key={category._id}
                className="w-full px-[12px] mb-[24px] object-contain"
              >
                <div className="bb-product-item h-full flex flex-col">
                  <div className="section-title pb-[12px] px-[12px] flex justify-start max-[991px]:flex-col max-[991px]:justify-center max-[991px]:text-center">
                    <div className="section-detail max-[991px]:mb-[12px]">
                      <h2
                        className="bb-title font-quicksand tracking-[0.03rem] mb-[0] p-[0] text-[25px] font-bold text-[#4682b6] inline capitalize leading-[1] max-[767px]:text-[23px] cursor-pointer"
                        onClick={() =>
                          handleSubCategoryClick(category.category, "")
                        }
                      >
                        {category.category}
                      </h2>
                    </div>
                  </div>
                  <div className="product-item-inner px-[12px] mb-[14px]">
                    {category.subcategory.map((subCategory, index) => (
                      <p
                        key={index}
                        className="font-Poppins mb-[4px] ml-[20px] text-[14px] text-[#080909] font-light leading-[28px] tracking-[0.03rem] cursor-pointer"
                        onClick={() =>
                          handleSubCategoryClick(category.category, subCategory)
                        }
                      >
                        {subCategory}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default AllCategories;
