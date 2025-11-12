import React, { useContext, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductCard from "./ProductCard";

const RelatedProducts = ({ subCategory, category, currentProductId }) => {
  const { products } = useContext(ShopContext);

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

    // Combine results with priority
    const combined = [...sameSubcategory, ...sameCategory];

    // Limit to 10 products
    return combined.slice(0, 10);
  }, [products, subCategory, category, currentProductId]);

  return (
    <section className="section-deal overflow-hidden py-[50px] max-[1199px]:py-[35px]">
      <div className="max-w-[1320px] mx-auto">
        {/* Title Section */}
        <Title
          title1="Related"
          title2="Products"
          description="Browse The Collection of Top Products."
        />

        {/* Swiper Carousel */}
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={2}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          autoplay={{ delay: 3000 }}
          className=""
        >
          {filteredProducts?.map((product) => (
            <SwiperSlide
              className={`grid
                grid-cols-2 lg:grid-cols-3 gap-6
              `}
            >
              <ProductCard {...product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default RelatedProducts;
