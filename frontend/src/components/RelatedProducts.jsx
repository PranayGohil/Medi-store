import React, { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductCard from "./ProductCard";

const RelatedProducts = () => {
  const { products } = useContext(ShopContext);
  const [visibleCount, setVisibleCount] = useState(12); // Show 12 initially

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 12); // Load 12 more
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
          {products?.slice(0, visibleCount).map((product) => (
            <ProductCard key={product._id} {...product} />
          ))}
        </div>

        {/* Load More Button */}
        {visibleCount < products.length && (
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