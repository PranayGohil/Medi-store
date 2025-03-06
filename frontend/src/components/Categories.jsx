import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation, Autoplay } from "swiper/modules";

const categories = [
  {
    id: 1,
    name: "Vegetables",
    image: "../assets/img/category/1.svg",
    items: 485,
    bg: "#fef1f1",
  },
  {
    id: 2,
    name: "Fruits",
    image: "../assets/img/category/2.svg",
    items: 291,
    bg: "#e1fcf2",
  },
  {
    id: 3,
    name: "Cold Drinks",
    image: "../assets/img/category/3.svg",
    items: 49,
    bg: "#f4f1fe",
  },
  {
    id: 4,
    name: "Bakery",
    image: "../assets/img/category/4.svg",
    items: 8,
    bg: "#fbf9e4",
  },
  {
    id: 5,
    name: "Vegetables",
    image: "../assets/img/category/1.svg",
    items: 485,
    bg: "#fef1f1",
  },
  {
    id: 6,
    name: "Fruits",
    image: "../assets/img/category/2.svg",
    items: 291,
    bg: "#e1fcf2",
  },
  {
    id: 7,
    name: "Cold Drinks",
    image: "../assets/img/category/3.svg",
    items: 49,
    bg: "#f4f1fe",
  },
  {
    id: 8,
    name: "Bakery",
    image: "../assets/img/category/4.svg",
    items: 8,
    bg: "#fbf9e4",
  },
];

const Categories = () => {
  return (
    <section className="section-category pt-[50px] max-[1199px]:pt-[35px] mb-[24px]">
      <div className="flex flex-wrap justify-between relative items-center mx-auto min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px]">
        <div className="flex flex-wrap w-full">
          <div className="w-full px-[12px]">
            <Swiper
              spaceBetween={20}
              modules={[Pagination, Navigation, Autoplay]}
              className="bb-category-6-colum owl-carousel"
              breakpoints={{
                0: { slidesPerView: 2 },
                640: { slidesPerView: 3 },
                768: { slidesPerView: 5 },
                1024: { slidesPerView: 6 },
              }}
              autoplay={{ delay: 3000 }}
            >
              {categories.map((category) => (
                <SwiperSlide key={category.id}>
                  <div
                    className="bb-category-box p-[30px] rounded-[20px] flex flex-col items-center text-center max-[1399px]:p-[20px] category-items-1 bg-[#fef1f1]"
                    style={{ backgroundColor: category.bg }}
                  >
                    <div className="category-image mb-[12px]">
                      <img
                        src={category.image}
                        alt="category"
                        className="w-[50px] h-[50px] max-[1399px]:h-[65px] max-[1399px]:w-[65px] max-[1199px]:h-[50px] max-[1199px]:w-[50px]"
                      />
                    </div>
                    <div className="category-sub-contact">
                      <h5 className="mb-[2px] text-[16px] font-quicksand text-[#3d4750] font-semibold tracking-[0.03rem] leading-[1.2]">
                        <a
                          href="shop-left-sidebar-col-3.html"
                          className="font-Poppins text-[16px] font-medium leading-[1.2] tracking-[0.03rem] text-[#3d4750] capitalize"
                        >
                          {category.name}
                        </a>
                      </h5>
                      <p className="font-Poppins text-[13px] text-[#686e7d] leading-[25px] font-light tracking-[0.03rem]">
                        {category.items}
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;
