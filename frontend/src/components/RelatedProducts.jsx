import React, { useContext, useState, useMemo } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductCard from "./ProductCard";

const RelatedProducts = ({ subCategory, category, currentProductId }) => {
  const { products } = useContext(ShopContext);
  const [visibleCount, setVisibleCount] = useState(4); // Show 12 initially

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    // Filter out the current product
    const otherProducts = products.filter((p) => p._id !== currentProductId);

    // 1️⃣ Products with the same subcategory
    const sameSubcategory = otherProducts.filter((p) =>
      p.categories?.some(
        (cat) => cat.subcategory?.toLowerCase() === subCategory?.toLowerCase()
      )
    );

    // 2️⃣ Products with the same category but different subcategory
    const sameCategory = otherProducts.filter(
      (p) =>
        !sameSubcategory.includes(p) &&
        p.categories?.some(
          (cat) => cat.category?.toLowerCase() === category?.toLowerCase()
        )
    );

    const combined = [...sameSubcategory, ...sameCategory];

    return combined.slice(0, 12);
  }, [products, subCategory, category, currentProductId]);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 4); 
  };

  return (
    <section className="section-deal overflow-hidden py-[50px] max-[1199px]:py-[35px]">
      <div className="max-w-[1320px] mx-auto">
        {/* Title Section */}
        <Title
          title1="Related"
          title2="Products"
          description="Browse The Collection of Top Products."
        />

        {/* Grid Layout */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 p-3">
          {filteredProducts?.slice(0, visibleCount).map((product) => (
            <ProductCard key={product._id} {...product} />
          ))}
        </div>

        {/* Load More Button */}
        {visibleCount < filteredProducts.length && (
          <div className="flex justify-center text-blue-600 w-full mt-[30px]">
            <button
              onClick={handleLoadMore}
              className="block text-center mt-2 bb-btn-2 transition-all duration-[0.3s] ease-in-out font-Poppins leading-[28px] tracking-[0.03rem] py-[4px] px-[25px] text-[14px] font-normal text-[#0097b2] bg-[#ffffff] rounded-[10px] border-[1px] border-solid border-[#0097b2] hover:bg-[#0097b2] hover:border-[#ffffff] hover:text-[#ffffff]"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default RelatedProducts;
