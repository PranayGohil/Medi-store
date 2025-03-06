import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay } from "swiper/modules";
import Title from "./Title";

const testimonials = [
  {
    id: 1,
    name: "Stephen Smith",
    role: "Co Founder",
    image: "../assets/img/testimonials/1.jpg",
    quote:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto at sint eligendi possimus perspiciatis asperiores reiciendis hic amet alias aut quaerat maiores blanditiis.",
  },
  {
    id: 2,
    name: "Jane Doe",
    role: "CEO",
    image: "../assets/img/testimonials/2.jpg",
    quote:
      "Doloremque velit soluta facilis distinctio dolorem unde asperiores molestias quos deserunt, incidunt aperiam cumque.",
  },
];

export default function TestimonialCarousel() {
  return (
    <section className="section-testimonials overflow-hidden py-[100px] max-[1199px]:py-[70px] max-[991px]:p-[0]">
      <div className="flex flex-wrap justify-between relative items-center mx-auto min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px]">
        <Title title1="Testimonials" title2="What People Say" description="" />
        <div className="flex flex-wrap w-full">
          <div className="w-full px-[12px]">
            <div className="bb-testimonials relative">
              <div className="w-full flex justify-center items-center py-10">
                <img
                  src="../assets/img/testimonials/img-1.png"
                  alt="testimonials-1"
                  className="testimonials-img-1 z-[-1] h-[70px] w-[70px] absolute top-[0] left-[25px] rounded-[20px] rotate-[-10deg] max-[1399px]:h-[60px] max-[1399px]:w-[60px] max-[1399px]:left-[10px] max-[1199px]:hidden"
                />
                <img
                  src="../assets/img/testimonials/img-2.png"
                  alt="testimonials-2"
                  className="testimonials-img-2 z-[-1] h-[50px] w-[50px] absolute bottom-[0] left-[0] rounded-[15px] rotate-[15deg] blur-[3px] max-[1199px]:hidden"
                />
                <img
                  src="../assets/img/testimonials/img-3.png"
                  alt="testimonials-3"
                  className="testimonials-img-3 z-[-1] h-[60px] w-[60px] absolute top-[-50px] right-[500px] rounded-[20px] rotate-[-30deg] blur-[3px] max-[991px]:hidden"
                />
                <img
                  src="../assets/img/testimonials/img-4.png"
                  alt="testimonials-4"
                  className="testimonials-img-4 z-[-1] h-[60px] w-[60px] absolute top-[50px] right-[250px] rounded-[20px] rotate-[15deg] max-[1399px]:top-[20px] max-[991px]:hidden"
                />
                <img
                  src="../assets/img/testimonials/img-5.png"
                  alt="testimonials-5"
                  className="testimonials-img-5 z-[-1] h-[70px] w-[70px] absolute top-[0] right-[20px] rounded-[20px] blur-[3px] max-[991px]:hidden"
                />
                <img
                  src="../assets/img/testimonials/img-6.png"
                  alt="testimonials-6"
                  className="testimonials-img-6 z-[-1] h-[60px] w-[60px] absolute bottom-[30px] right-[100px] rounded-[20px] rotate-[-25deg] max-[1399px]:h-[50px] max-[1399px]:w-[50px] max-[1399px]:right-[50px] max-[1199px]:right-[0] max-[991px]:hidden"
                />
                <div className="inner-banner rotate-[270deg] absolute top-[0] z-[-1] left-[150px] bottom-[0] max-[1399px]:left-[110px] max-[1199px]:left-[30px] max-[991px]:hidden">
                  <h4 className="font-quicksand text-[#fff] tracking-[0.03rem] opacity-[0.15] text-[42px] font-bold leading-[1.2] max-[1399px]:text-[38px] max-[1199px]:text-[34px]">
                    Testimonials
                  </h4>
                </div>
                <Swiper
                  modules={[Autoplay]}
                  slidesPerView={1}
                  spaceBetween={30}
                  loop={true}
                  className="testimonials-slider"
                >
                  {testimonials.map((testimonial) => (
                    <SwiperSlide
                      key={testimonial.id}
                    >
                      <div className="flex flex-wrap mx-[-12px] testimonials-row">
                        <div className="min-[768px]:w-[33.33%] w-full px-[12px] max-[767px]:hidden">
                          <div className="testimonials-image relative max-[575px]:mb-[20px] max-[575px]:max-w-[200px] flex justify-end">
                            <img
                              src={testimonial.image}
                              alt="testimonials"
                              className="w-3/5 rounded-[30px] block"
                            />
                          </div>
                        </div>
                        <div className="min-[768px]:w-[66.66%] w-full px-[12px]">
                          <div className="testimonials-contact h-full flex flex-col justify-end">
                            <div className="user max-[767px]:flex max-[767px]:items-center">
                              <img
                                src={testimonial.image}
                                alt="testimonials"
                                className="w-full hidden rounded-[15px] max-[767px]:max-w-[60px] max-[767px]:mr-[15px] max-[767px]:flex"
                              />
                              <div className="detail">
                                <h4 className="font-quicksand text-[#3d4750] tracking-[0.03rem] leading-[1.2] mb-[8px] text-[20px] font-bold max-[767px]:mb-[4px] max-[767px]:text-[18px]">
                                  {testimonial.name}
                                </h4>
                                <span className="font-Poppins font-normal tracking-[0.02rem] text-[14px] text-[#777]">
                                  ({testimonial.role})
                                </span>
                              </div>
                            </div>
                            <div className="inner-contact bg-[#fff] mt-[10px] border-[1px] border-solid border-[#eee] p-[20px] rounded-[30px]">
                              <p className="font-Poppins text-[#686e7d] text-[14px] leading-[25px] tracking-[0.03rem] font-light">
                                {testimonial.quote}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
