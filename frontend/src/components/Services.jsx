import React from "react";
import Title from "./Title";

const Services = () => {
  return (
    <section className="section-services overflow-hidden py-[50px] max-[1199px]:py-[35px]">
      <div className="flex flex-wrap justify-between relative items-center mx-auto min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px]">
        <Title title1="Services" title2="We Provide" description="" />
        <div className="flex flex-wrap w-full mb-[-24px]">
          <div
            className="min-[992px]:w-[25%] min-[768px]:w-[50%] w-full px-[12px] mb-[24px]"
          >
            <div className="bb-services-box p-[30px] border-[1px] border-solid border-[#eee] rounded-[20px] text-center">
              <div className="services-img mb-[20px] flex justify-center">
                <img
                  src="../assets/img/services/1.png"
                  alt="services-1"
                  className="w-[50px]"
                />
              </div>
              <div className="services-contact">
                <h4 className="font-quicksand mb-[8px] text-[18px] font-bold text-[#3d4750] leading-[1.2] tracking-[0.03rem]">
                  Free Shipping
                </h4>
                <p className="font-Poppins font-light text-[14px] leading-[20px] text-[#686e7d] tracking-[0.03rem]">
                  Free shipping on all Us order or above $200
                </p>
              </div>
            </div>
          </div>
          <div
            className="min-[992px]:w-[25%] min-[768px]:w-[50%] w-full px-[12px] mb-[24px]"
          >
            <div className="bb-services-box p-[30px] border-[1px] border-solid border-[#eee] rounded-[20px] text-center">
              <div className="services-img mb-[20px] flex justify-center">
                <img
                  src="../assets/img/services/2.png"
                  alt="services-2"
                  className="w-[50px]"
                />
              </div>
              <div className="services-contact">
                <h4 className="font-quicksand mb-[8px] text-[18px] font-bold text-[#3d4750] leading-[1.2] tracking-[0.03rem]">
                  24x7 Support
                </h4>
                <p className="font-Poppins font-light text-[14px] leading-[20px] text-[#686e7d] tracking-[0.03rem]">
                  Contact us 24 hours a day, 7 days a week
                </p>
              </div>
            </div>
          </div>
          <div
            className="min-[992px]:w-[25%] min-[768px]:w-[50%] w-full px-[12px] mb-[24px]"
          >
            <div className="bb-services-box p-[30px] border-[1px] border-solid border-[#eee] rounded-[20px] text-center">
              <div className="services-img mb-[20px] flex justify-center">
                <img
                  src="../assets/img/services/3.png"
                  alt="services-3"
                  className="w-[50px]"
                />
              </div>
              <div className="services-contact">
                <h4 className="font-quicksand mb-[8px] text-[18px] font-bold text-[#3d4750] leading-[1.2] tracking-[0.03rem]">
                  30 Days Return
                </h4>
                <p className="font-Poppins font-light text-[14px] leading-[20px] text-[#686e7d] tracking-[0.03rem]">
                  Simply return it within 30 days for an exchange
                </p>
              </div>
            </div>
          </div>
          <div
            className="min-[992px]:w-[25%] min-[768px]:w-[50%] w-full px-[12px] mb-[24px]"
          >
            <div className="bb-services-box p-[30px] border-[1px] border-solid border-[#eee] rounded-[20px] text-center">
              <div className="services-img mb-[20px] flex justify-center">
                <img
                  src="../assets/img/services/4.png"
                  alt="services-4"
                  className="w-[50px]"
                />
              </div>
              <div className="services-contact">
                <h4 className="font-quicksand mb-[8px] text-[18px] font-bold text-[#3d4750] leading-[1.2] tracking-[0.03rem]">
                  Payment Secure
                </h4>
                <p className="font-Poppins font-light text-[14px] leading-[20px] text-[#686e7d] tracking-[0.03rem]">
                  Contact us 24 hours a day, 7 days a week
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
