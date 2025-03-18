import { useContext, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./Hero.css";
import { SitePreferencesContext } from "../context/SitePreferencesContext";

const slides = [
  {
    discount: "",
    title1: "Genuine",
    title2: "Medicines,",
    title3: "Trusted by Doctors!",
    image: "../assets/img/hero/hero-1.png",
  },
  {
    discount: "Flat 20% Off",
    title1: "Bringing ",
    title2: "Quality",
    title3: "Healthcare to Your Doorstep!",
    image: "../assets/img/hero/hero-2.png",
  },
  {
    discount: "Flat 30% Off",
    title1: "Best,",
    title2: "Prices",
    title3: "Shop Smart, Stay Healthy!",
    image: "../assets/img/hero/hero-3.png",
  },
];

const Hero = () => {
  const { banners } = useContext(SitePreferencesContext);
  return (
    <section className="section-hero mb-[50px] max-[1199px]:mb-[35px] py-[50px] relative bg-[#f8f8fb] overflow-hidden">
      <div className="flex flex-wrap justify-between relative items-center mx-auto min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px]">
        <div className="flex flex-wrap w-full">
          <div className="w-full">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={50}
              slidesPerView={1}
              pagination={{ clickable: true, el: ".custom-pagination" }}
              autoplay={{ delay: 5000 }}
              className="w-full max-w-[90rem] mx-auto"
            >
              {banners.map((slide, index) => (
                <SwiperSlide
                  key={index}
                  className="flex flex-wrap w-full mb-[-24px]"
                >
                  <div className="flex flex-wrap w-full mb-[24px]">
                    <div className="min-[992px]:w-[50%] w-full px-[12px] min-[992px]:order-1 order-2 mb-[24px]">
                      <div className="hero-contact h-full flex flex-col items-start justify-center max-[991px]:items-center">
                        <p className="mb-[20px] font-Poppins text-[18px] text-[#777] font-light leading-[28px] tracking-[0.03rem] max-[1199px]:mb-[10px] max-[1199px]:text-[16px]">
                          {slide.discription}
                        </p>
                        <h1 className="mb-[20px] font-quicksand text-[50px] text-[#3d4750] font-bold tracking-[0.03rem] leading-[1.2] max-[1199px]:mb-[10px] max-[1199px]:text-[38px] max-[991px]:text-center max-[991px]:text-[45px] max-[767px]:text-[40px] max-[575px]:text-[35px] max-[420px]:text-[30px] max-[360px]:text-[28px]">
                          {slide.title1}{" "}
                          <span className="relative text-[#6c7fd8]">
                            {slide.title2}
                          </span>
                          <br /> {slide.title3}
                        </h1>
                        {/* <a
                          href="shop-left-sidebar-col-3.html"
                          className="bb-btn-1 transition-all duration-[0.3s] ease-in-out font-Poppins leading-[28px] tracking-[0.03rem] py-[8px] px-[20px] text-[14px] font-normal text-[#3d4750] bg-transparent rounded-[10px] border-[1px] border-solid border-[#3d4750] max-[1199px]:py-[3px] max-[1199px]:px-[15px] hover:bg-[#6c7fd8] hover:border-[#6c7fd8] hover:text-[#fff]"
                        >
                          Shop Now
                        </a> */}
                      </div>
                    </div>
                    <div className="min-[992px]:w-[50%] w-full px-[12px] min-[992px]:order-2 order-1 mb-[24px]">
                      <div className="hero-image pr-[50px] relative max-[991px]:px-[50px] max-[575px]:px-[30px] flex justify-center max-[420px]:p-[0]">
                        <div style={{ width: "600px", height: "600px" }}>
                          <img
                            src={slide.image}
                            alt="hero"
                            className="w-full pb-[50px] opacity-[1] max-[1199px]:pr-[30px] max-[991px]:pr-[0] max-[575px]:pb-[30px] max-[420px]:pb-[15px] drop-shadow-xl"
                            
                          />
                        </div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 300 300"
                          className="animate-shape w-[120%] absolute top-[-50px] right-[-50px] z-[-1] max-[1399px]:right-[-30px] max-[1199px]:w-[125%] max-[991px]:w-[100%] max-[991px]:top-[0] max-[575px]:right-[0] max-[420px]:w-[110%] max-[420px]:right-[-30px]"
                        >
                          <linearGradient
                            id="shape_1"
                            x1="100%"
                            x2="0%"
                            y1="100%"
                            y2="0%"
                          ></linearGradient>
                          <path d="">
                            <animate
                              repeatCount="indefinite"
                              attributeName="d"
                              dur="15s"
                              values=""
                            />
                          </path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
      <div className="custom-pagination"></div>
    </section>
  );
};

export default Hero;
