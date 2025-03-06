import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const categories = [
  {
    id: 1,
    name: "Vegetables",
    items: 485,
    imgSrc: "../assets/img/category/1.svg",
    bgColor: "bg-[#fef1f1]",
  },
  {
    id: 2,
    name: "Fruits",
    items: 291,
    imgSrc: "../assets/img/category/2.svg",
    bgColor: "bg-[#e1fcf2]",
  },
  {
    id: 3,
    name: "Cold Drinks",
    items: 49,
    imgSrc: "../assets/img/category/3.svg",
    bgColor: "bg-[#f4f1fe]",
  },
  {
    id: 4,
    name: "Bakery",
    items: 8,
    imgSrc: "../assets/img/category/4.svg",
    bgColor: "bg-[#fbf9e4]",
  },
  {
    id: 5,
    name: "Meat",
    items: 4,
    imgSrc: "../assets/img/category/5.svg",
    bgColor: "bg-[#f4f1fe]",
  },
  {
    id: 6,
    name: "Dairy",
    items: 2,
    imgSrc: "../assets/img/category/6.svg",
    bgColor: "bg-[#f4f1fe]",
  },
];

const ExploreCategories = () => {
  return (
    <section className="section-category overflow-hidden py-[50px] max-[1199px]:py-[35px]">
      <div className="flex flex-wrap justify-between relative items-center mx-auto min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px]">
        <div className="flex flex-wrap w-full mb-[-24px]">
          {/* Left Side Image */}
          <div className="min-[992px]:w-[41.66%] w-full px-[12px] mb-[24px]">
            <div className="bb-category-img relative max-[991px]:hidden">
              <img
                src="../assets/img/category/category.jpg"
                alt="category"
                className="w-full rounded-[30px]"
              />
              <div className="bb-offers py-[5px] px-[15px] absolute top-[20px] right-[20px] bg-[#000] opacity-[0.8] rounded-[15px]">
                <span className="text-[14px] font-normal text-[#fff]">
                  50% Off
                </span>
              </div>
            </div>
          </div>

          {/* Right Side - Categories */}
          <div className="min-[992px]:w-[58.33%] w-full px-[12px] mb-[24px]">
            <div className="bb-category-contact max-[991px]:mt-[-24px]">
              <div
                className="category-title mb-[30px] max-[991px]:hidden"
              >
                <h2 className="font-quicksand text-[124px] text-[#fff] opacity-[0.15] font-bold leading-[1.2] tracking-[0.03rem] max-[1399px]:text-[95px] max-[1199px]:text-[70px] max-[767px]:text-[42px]">
                  Explore Categories
                </h2>
              </div>

              {/* Swiper Slider */}
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={20}
                slidesPerView={1}
                breakpoints={{
                  600: { slidesPerView: 2 },
                  1000: { slidesPerView: 3 },
                }}
                autoplay={{ delay: 3000 }}
                className="bb-category-block owl-carousel ml-[-150px] w-[calc(100%)] pt-[30px] pl-[30px] bg-[#fff] rounded-tl-[30px] relative max-[991px]:ml-[0] max-[991px]:w-full max-[991px]:p-[0]"
              >
                {categories.map((category) => (
                  <SwiperSlide key={category.id}>
                    <div
                      className={`p-[30px] rounded-[20px] flex flex-col items-center text-center ${category.bgColor}`}
                    >
                      <img
                        src={category.imgSrc}
                        alt={category.name}
                        className="w-[50px] h-[50px]"
                      />
                      <h5 className="text-[16px] font-semibold text-[#3d4750] mt-3">
                        {category.name}
                      </h5>
                      <p className="text-[13px] text-[#686e7d]">
                        {category.items} items
                      </p>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExploreCategories;
