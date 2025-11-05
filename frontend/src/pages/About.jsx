import React from "react";
import Breadcrumb from "../components/Breadcrumb";
import Services from "../components/Services";

const About = () => {
  return (
    <>
      <Breadcrumb title="About" destination1="Home" destination2="About" />
      <section className="section-about py-[50px] max-[1199px]:py-[35px]">
        <div className="flex flex-wrap justify-between items-center mx-auto min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px]">
          <div className="flex flex-wrap w-full mb-[-24px]">
            {/* First Content Block */}
            <div className="min-[992px]:w-[50%] w-full px-[12px] mb-[24px]">
              <div className="bb-about-img sticky">
                <img
                  src="../assets/img/about/about-1.jpg"
                  alt="about-one"
                  className="w-full"
                />
              </div>
            </div>
            <div className="min-[992px]:w-[50%] w-full mb-[24px]">
              <div className="bb-about-contact h-full flex flex-col justify-center">
                <div className="section-title pb-[12px] px-[12px] flex justify-start max-[991px]:flex-col max-[991px]:justify-center max-[991px]:text-center">
                  <div className="section-detail max-[991px]:mb-[12px]">
                    <h2 className="bb-title font-quicksand tracking-[0.03rem] mb-[0] p-[0] text-[25px] font-bold text-[#4682b6] inline capitalize leading-[1] max-[767px]:text-[23px]">
                      About Us
                    </h2>
                  </div>
                </div>
                <div className="about-inner-contact px-[12px] mb-[14px]">
                  <p className="font-Poppins mb-[16px] text-[14px] text-[#080909] font-light leading-[28px] tracking-[0.03rem]">
                    Foreever Cure Pharmacy is a mass distributor of generic drugs
                    and OTC healthcare items since 2011. We have proudly been
                    providing quality service and products to consumers all over
                    the world for 5 years.
                  </p>
                  <h4 className="font-quicksand tracking-[0.03rem] leading-[1.2] mb-[20px] text-[18px] text-[#3d4750] font-bold italic">
                    Exceptional Quality
                  </h4>
                  <p className="font-Poppins mb-[16px] text-[14px] text-[#080909] font-light leading-[28px] tracking-[0.03rem]">
                    At Foreever Cure, you get high-quality products
                    because we work with intelligent direction to ensure that
                    every drug and order is made and processed with sincere
                    efforts and skillful execution.
                  </p>
                </div>
              </div>
            </div>

            {/* Second Content Block (Image Right, Text Left) */}
            <div className="flex flex-wrap min-[992px]:flex-row-reverse w-full items-center">
              <div className="min-[992px]:w-[50%] w-full px-[12px] mb-[24px]">
                <div className="bb-about-img sticky">
                  <img
                    src="../assets/img/about/about-2.jpg"
                    alt="about-two"
                    className="w-full"
                  />
                </div>
              </div>
              <div className="min-[992px]:w-[50%] w-full mb-[24px] px-[12px]">
                <h4 className="font-quicksand tracking-[0.03rem] leading-[1.2] mb-[20px] text-[18px] text-[#3d4750] font-bold italic">
                  Service Standards
                </h4>
                <p className="font-Poppins mb-[16px] text-[14px] text-[#080909] font-light leading-[28px] tracking-[0.03rem]">
                  A Quality Audit Team regularly works in monitoring all drugs
                  and orders adhere to our strict standards to ensure only the
                  best service and experience for all of our consumers.
                </p>
                <h4 className="font-quicksand tracking-[0.03rem] leading-[1.2] mb-[20px] text-[18px] text-[#3d4750] font-bold italic">
                  Lowest Price Guarantee
                </h4>
                <p className="font-Poppins mb-[16px] text-[14px] text-[#080909] font-light leading-[28px] tracking-[0.03rem]">
                  You don’t have to spend a fortune just to get quality
                  medications. Here at Foreever Cure, you are guaranteed
                  to find the lowest prices for your generic and OTC drugs.
                </p>
              </div>
            </div>

            {/* Third Content Block (Image Left, Text Right) */}
            <div className="flex flex-wrap min-[992px]:flex-row w-full items-center">
              {/* Image (Left Side) */}
              <div className="min-[992px]:w-[50%] w-full px-[12px] mb-[24px]">
                <div className="bb-about-img sticky">
                  <img
                    src="../assets/img/about/about-3.jpg"
                    alt="about-three"
                    className="w-full"
                  />
                </div>
              </div>

              {/* Text (Right Side) */}
              <div className="min-[992px]:w-[50%] w-full px-[12px] mb-[24px]">
                <h4 className="font-quicksand tracking-[0.03rem] leading-[1.2] mb-[20px] text-[18px] text-[#3d4750] font-bold italic">
                  Choice of Products and Availability
                </h4>
                <p className="font-Poppins mb-[16px] text-[14px] text-[#080909] font-light leading-[28px] tracking-[0.03rem]">
                  In order for a product to appear on our website, it has to
                  pass stringent evaluation parameters and approval. Market
                  studies are conducted for every product prior to consideration
                  for placement.
                </p>
                <h4 className="font-quicksand tracking-[0.03rem] leading-[1.2] mb-[20px] text-[18px] text-[#3d4750] font-bold italic">
                  Security of Ordering
                </h4>
                <p className="font-Poppins mb-[16px] text-[14px] text-[#080909] font-light leading-[28px] tracking-[0.03rem]">
                  With Foreever Cure, you never have to worry about your
                  personal information getting in the wrong hands. We utilize
                  full certifications from Alpha SSL and Sucuri Security.
                </p>
              </div>
            </div>
            {/* Fourth Content Block (Image Right, Text Left) */}
            <div className="flex flex-wrap min-[992px]:flex-row-reverse w-full items-center">
              {/* Image (Right Side) */}
              <div className="min-[992px]:w-[50%] w-full px-[12px] mb-[24px]">
                <div className="bb-about-img sticky">
                  <img
                    src="../assets/img/about/about-4.jpg"
                    alt="about-four"
                    className="w-full"
                  />
                </div>
              </div>

              {/* Text (Left Side) */}
              <div className="min-[992px]:w-[50%] w-full px-[12px] mb-[24px]">
                <h4 className="font-quicksand tracking-[0.03rem] leading-[1.2] mb-[20px] text-[18px] text-[#3d4750] font-bold italic">
                  Discreet Delivery
                </h4>
                <p className="font-Poppins mb-[16px] text-[14px] text-[#080909] font-light leading-[28px] tracking-[0.03rem]">
                  As part of our commitment to providing only the highest in
                  customer service, we ensure all of our orders are shipped in
                  recycled, environmentally friendly discreet boxes or mailers
                  to respect your privacy.
                </p>

                <h4 className="font-quicksand tracking-[0.03rem] leading-[1.2] mb-[20px] text-[18px] text-[#3d4750] font-bold italic">
                  Customer Service Support
                </h4>
                <p className="font-Poppins mb-[16px] text-[14px] text-[#080909] font-light leading-[28px] tracking-[0.03rem]">
                  When you order from us, you can be sure of one thing: WE CARE
                  ABOUT YOUR SATISFACTION. Our customer service team is
                  dedicated to making sure our customers are always satisfied.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Services />
    </>
  );
};

export default About;
