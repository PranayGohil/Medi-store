import { useState, useEffect, useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import axios from "axios";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductCard from "./ProductCard";
import { Link } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

const BestSeller = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [bestSellingProducts, setBestSellingProducts] = useState([]);

  const fetchBestSellingProducts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/statistics/best-sellers`
      );
      setBestSellingProducts(response.data.products);
    } catch (error) {
      console.error("Error fetching best selling products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBestSellingProducts();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

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
          slidesPerView={2}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          autoplay={{ delay: 3000 }}
          className="best-seller-swiper"
        >
          {bestSellingProducts?.map((product) => (
            <SwiperSlide key={product._id} className="p-[12px]">
              <ProductCard {...product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="flex justify-center text-blue-600 w-full mt-[30px]">
        <Link to={"/products"} className="block text-center mt-2 bb-btn-2 transition-all duration-[0.3s] ease-in-out font-Poppins leading-[28px] tracking-[0.03rem] py-[4px] px-[25px] text-[14px] font-normal text-[#0097b2] bg-[#ffffff] rounded-[10px] border-[1px] border-solid border-[#0097b2] hover:bg-[#0097b2] hover:border-[#ffffff] hover:text-[#ffffff]">View All Products</Link>
      </div>
    </section>
  );
};

export default BestSeller;
