import { useContext, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./Hero.css";
import { SitePreferencesContext } from "../context/SitePreferencesContext";

const Hero = () => {
  const { banners } = useContext(SitePreferencesContext);
  return (
    <section className="section-hero py-[10px] relative overflow-hidden">
      <div className="flex flex-wrap justify-between relative items-center">
        <div className="flex flex-wrap w-full">
          <div className="w-full">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={50}
              slidesPerView={1}
              pagination={{ clickable: true, el: ".custom-pagination" }}
              autoplay={{ delay: 5000 }}
              className="w-full"
            >
              {banners.map((slide, index) => (
                <SwiperSlide
                  key={index}
                  className="flex flex-wrap w-full mb-[-24px]"
                >
                  <div className="flex flex-wrap w-full ">
                    <div className="w-full min-[992px]:order-2 order-1">
                      <div className="hero-image relative flex justify-center">
                        <div className="w-full flex justify-center items-center">
                          <img
                            src={slide.image}
                            alt="hero"
                            className="w-full drop-shadow-xl"
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
