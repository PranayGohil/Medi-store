import React, { useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import axios from "axios";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductCard from "./ProductCard";

const BestSeller = () => {
  const { products } = useContext(ShopContext);

  return (
    <section className="section-deal overflow-hidden py-[50px] max-[1199px]:py-[35px]">
      <div className="max-w-[1320px] mx-auto">
        {/* Title Section */}
        <Title
          title1="Best"
          title2="Seller"
          description="Best Seller Product From Our Shop"
        />

        {/* Swiper Carousel */}
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          autoplay={{ delay: 3000 }}
          className="best-seller-swiper"
        >
          {products?.map((product) => (
            <SwiperSlide key={product._id} className="p-[12px]">
              <ProductCard {...product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default BestSeller;
