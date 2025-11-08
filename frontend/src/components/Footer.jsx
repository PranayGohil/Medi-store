import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";

const Footer = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const gotoAboutPage = () => {
    console.log("button clicked");
    navigate("/about");
  };

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/category/all`
      );
      console.log("Data : ", response.data);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryClick = (category) => {
    window.location.href = `/search?category=${category}`;
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <footer className="bb-footer mt-[50px] max-[1199px]:mt-[35px] bg-[#272723] text-[#fff]">
      <div className="footer-container border-t-[30px] border-solid border-[#0097b2]">
        <div className="footer-top py-[50px] max-[1199px]:py-[35px]">
          <div className="flex flex-wrap justify-between relative items-center mx-auto min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px]">
            <div className="flex flex-wrap w-full max-[991px]:mb-[-30px]">
              {/* Company Info Section */}
              <div className="min-[992px]:w-[35%] max-[991px]:w-full w-full px-[12px]">
                <div className="bb-footer-widget bb-footer-company flex flex-col max-[991px]:mb-[24px]">
                  <img
                    src="../assets/img/logo/logo-white.png"
                    className="bb-footer-logo max-w-[144px] mb-[30px] max-[767px]:max-w-[130px]"
                    alt="footer logo"
                  />
                  <img
                    src="../assets/img/logo/logo-dark.png"
                    className="bb-footer-dark-logo max-w-[144px] mb-[30px] max-[767px]:max-w-[130px] hidden"
                    alt="footer logo"
                  />
                  <p className="bb-footer-detail max-w-[400px] mb-[30px] p-[0] font-Poppins text-[14px] leading-[27px] font-normal text-[#fff] inline-block relative max-[1399px]:text-[15px] max-[1199px]:text-[14px]">
                    Foreever Cure Pharmacy is a mass distributor of generic
                    drugs and OTC healthcare items since 2011. We have proudly
                    been providing quality service and products to consumers all
                    over the world for 5 years.{" "}
                    <button
                      type="button"
                      className="cursor-pointer text-[#0097b2] font-Poppins text-[14px] leading-[20px] font-normal hover:text-[#fff] transition-all duration-[0.3s] ease-in-out"
                      onClick={() => gotoAboutPage()}
                    >
                      Read More..
                    </button>
                  </p>
                  <div className="w-100 flex flex-col align-middle">
                    <div className="mb-4">Checkout Our Reviews On</div>
                    <img
                      src="/assets/img/logo/trust_pilot.svg"
                      alt="Trust Pilot"
                      className="max-w-[150px]"
                    />
                  </div>
                </div>
              </div>

              {/* Useful Links Section */}
              <div className="min-[992px]:w-[20%] max-[991px]:w-full w-full px-[12px] mt-3">
                <div className="bb-footer-widget">
                  <h4
                    className="bb-footer-heading font-quicksand leading-[1.2] text-[18px] font-bold mb-[20px] text-[#fff] tracking-[0] relative block w-full pb-[15px] capitalize border-b-[1px] border-solid border-[#858585] max-[991px]:text-[16px] max-[991px]:cursor-pointer max-[991px]:flex max-[991px]:justify-between max-[991px]:items-center"
                  >
                    Useful Links
                    
                  </h4>
                  <div className="bb-footer-links transition-all duration-300 ease-in-out max-[991px]:mb-[20px] min-[992px]:block px-3">
                    <ul className="align-items-center">
                      <li className="bb-footer-link leading-[1.5] flex items-center mb-[16px] max-[991px]:mb-[12px]">
                        <Link
                          to={"/about"}
                          className="transition-all duration-[0.3s] ease-in-out font-Poppins text-[14px] leading-[20px] text-[#a8a8a8] hover:text-[#0097b2] mb-[0] inline-block break-all tracking-[0] font-normal"
                        >
                          About Us
                        </Link>
                      </li>
                      <li className="bb-footer-link leading-[1.5] flex items-center mb-[16px] max-[991px]:mb-[12px]">
                        <Link
                          to={"/contact"}
                          className="transition-all duration-[0.3s] ease-in-out font-Poppins text-[14px] leading-[20px] text-[#a8a8a8] hover:text-[#0097b2] mb-[0] inline-block break-all tracking-[0] font-normal"
                        >
                          Contact Us
                        </Link>
                      </li>
                      <li className="bb-footer-link leading-[1.5] flex items-center mb-[16px] max-[991px]:mb-[12px]">
                        <Link
                          to={"/terms-and-conditions"}
                          className="transition-all duration-[0.3s] ease-in-out font-Poppins text-[14px] leading-[20px] text-[#a8a8a8] hover:text-[#0097b2] mb-[0] inline-block break-all tracking-[0] font-normal"
                        >
                          Terms &amp; Conditions
                        </Link>
                      </li>
                      {/* <li className="bb-footer-link leading-[1.5] flex items-center mb-[16px] max-[991px]:mb-[12px]">
                        <Link
                          to="/services"
                          className="transition-all duration-[0.3s] ease-in-out font-Poppins text-[14px] leading-[20px] text-[#a8a8a8] hover:text-[#0097b2] mb-[0] inline-block break-all tracking-[0] font-normal"
                        >
                          Services
                        </Link>
                      </li> */}
                      <li className="bb-footer-link leading-[1.5] flex items-center mb-[16px] max-[991px]:mb-[12px]">
                        <Link
                          to={"/privacy-policy"}
                          className="transition-all duration-[0.3s] ease-in-out font-Poppins text-[14px] leading-[20px] text-[#a8a8a8] hover:text-[#0097b2] mb-[0] inline-block break-all tracking-[0] font-normal"
                        >
                          Privacy Policy
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Category Section */}
              <div className="min-[992px]:w-[20%] max-[991px]:w-full w-full px-[12px] mt-3">
                <div className="bb-footer-widget">
                  <h4
                    className="bb-footer-heading font-quicksand leading-[1.2] text-[18px] font-bold mb-[20px] text-[#fff] tracking-[0] relative block w-full pb-[15px] capitalize border-b-[1px] border-solid border-[#858585] max-[991px]:text-[16px] max-[991px]:cursor-pointer max-[991px]:flex max-[991px]:justify-between max-[991px]:items-center"
                  >
                    Category
                  </h4>
                  <div
                    className={`bb-footer-links transition-all duration-300 ease-in-out max-[991px]:mb-[20px] min-[992px]:block px-3`}
                  >
                    <ul className="align-items-center">
                      {categories.map(
                        (category) =>
                          category.navbar_active && (
                            <li
                              key={category._id}
                              className="bb-footer-link leading-[1.5] flex items-center mb-[16px] max-[991px]:mb-[12px]"
                            >
                              <button
                                onClick={() =>
                                  handleCategoryClick(category.category)
                                }
                                className="transition-all duration-[0.3s] ease-in-out font-Poppins text-[14px] leading-[20px] text-[#a8a8a8] hover:text-[#0097b2] mb-[0] inline-block break-all tracking-[0] font-normal text-left"
                              >
                                {category.category}
                              </button>
                            </li>
                          )
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Get In Touch Section */}
              <div className="min-[992px]:w-[25%] max-[991px]:w-full w-full px-[12px] mt-3">
                <div className="bb-footer-contact mb-[30px]">
                  <div className="bb-footer-widget">
                    <h4
                      className="bb-footer-heading font-quicksand leading-[1.2] text-[18px] font-bold mb-[20px] text-[#fff] tracking-[0] relative block w-full pb-[15px] capitalize border-b-[1px] border-solid border-[#858585] max-[991px]:text-[16px] max-[991px]:cursor-pointer max-[991px]:flex max-[991px]:justify-between max-[991px]:items-center"
                    >
                      Get In Touch
                    </h4>
                    <div
                      className={`bb-footer-links transition-all duration-300 ease-in-out max-[991px]:mb-[20px] min-[992px]:block px-3`}
                    >
                      <ul className="align-items-center">
                        <li className="bb-footer-link bb-foo-call flex items-start max-[991px]:mb-[15px] mb-[16px]">
                          <span className="w-[25px] basis-[auto] grow-[0] shrink-[0]">
                            <i className="ri-building-line leading-[0] text-[18px] text-[#0097b2]" />
                          </span>
                          <div className="transition-all duration-[0.3s] ease-in-out font-Poppins text-[14px] leading-[20px] text-[#a8a8a8] hover:text-[#0097b2] inline-block relative break-all tracking-[0] font-normal max-[1399px]:text-[15px] max-[1199px]:text-[14px]">
                            PT Haji Maruti Indonesia
                          </div>
                        </li>
                        <li className="bb-footer-link bb-foo-location flex items-start max-[991px]:mb-[15px] mb-[16px]">
                          <span className="mt-[5px] w-[25px] basis-[auto] grow-[0] shrink-[0]">
                            <i className="ri-map-pin-line leading-[0] text-[18px] text-[#0097b2]" />
                          </span>
                          <p className="m-[0] font-Poppins text-[14px] text-[#a8a8a8] font-normal leading-[28px] tracking-[0.03rem]">
                            Jalan Duren Sawit Raya, Rukan Duren Sawit Center No.
                            9G, Kelurahan Klender, Kecamatan Duren Sawit,
                            Jakarta Timur, 13470 - Indonesia
                          </p>
                        </li>
                        <li className="bb-footer-link bb-foo-call flex items-start max-[991px]:mb-[15px] mb-[16px]">
                          <span className="w-[25px] basis-[auto] grow-[0] shrink-[0]">
                            <i className="ri-whatsapp-line leading-[0] text-[18px] text-[#0097b2]" />
                          </span>
                          <a
                            href="tel:+009876543210"
                            className="transition-all duration-[0.3s] ease-in-out font-Poppins text-[14px] leading-[20px] text-[#a8a8a8] hover:text-[#0097b2] inline-block relative break-all tracking-[0] font-normal max-[1399px]:text-[15px] max-[1199px]:text-[14px]"
                          >
                            +6287780387915
                          </a>
                        </li>
                        <li className="bb-footer-link bb-foo-mail flex">
                          <span className="w-[25px] basis-[auto] grow-[0] shrink-[0]">
                            <i className="ri-mail-line leading-[0] text-[18px] text-[#0097b2]" />
                          </span>
                          <a
                            href="mailto:pmapt.hajimaruti.indonesia@gmail.com"
                            className="transition-all duration-[0.3s] ease-in-out font-Poppins text-[14px] leading-[20px] text-[#a8a8a8] hover:text-[#0097b2] inline-block relative break-all tracking-[0] font-normal max-[1399px]:text-[15px] max-[1199px]:text-[14px]"
                          >
                            pmapt.hajimaruti.indonesia@gmail.com
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Social Media Section */}
                <div className="bb-footer-social mb-3">
                  <div className="bb-footer-widget">
                    <h4 className="bb-footer-heading font-quicksand leading-[1.2] text-[18px] font-bold mb-[20px] text-[#fff] tracking-[0] relative block w-full pb-[15px] capitalize border-b-[1px] border-solid border-[#858585] max-[991px]:text-[16px]">
                      Follow Us
                    </h4>
                    <div className="bb-footer-links">
                      <ul className="align-items-center flex flex-wrap items-center gap-[10px]">
                        <li className="bb-footer-link leading-[1.5] flex items-center">
                          <Link
                            to={"https://www.facebook.com/"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition-all duration-[0.3s] ease-in-out w-[40px] h-[40px] rounded-[5px] bg-[#3d4750] hover:bg-[#0097b2] capitalize flex items-center justify-center text-[15px] leading-[20px] text-[#a8a8a8] relative break-all font-normal"
                          >
                            <i className="ri-facebook-fill text-[18px] text-[#fff]" />
                          </Link>
                        </li>
                        <li className="bb-footer-link leading-[1.5] flex items-center">
                          <Link
                            to={"https://twitter.com/"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition-all duration-[0.3s] ease-in-out w-[40px] h-[40px] rounded-[5px] bg-[#3d4750] hover:bg-[#0097b2] capitalize flex items-center justify-center text-[15px] leading-[20px] text-[#a8a8a8] relative break-all font-normal"
                          >
                            <i className="ri-twitter-x-fill text-[18px] text-[#fff]" />
                          </Link>
                        </li>
                        <li className="bb-footer-link leading-[1.5] flex items-center">
                          <Link
                            to={"https://whatsapp.com/"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition-all duration-[0.3s] ease-in-out w-[40px] h-[40px] rounded-[5px] bg-[#3d4750] hover:bg-[#0097b2] capitalize flex items-center justify-center text-[15px] leading-[20px] text-[#a8a8a8] relative break-all font-normal"
                          >
                            <i className="ri-whatsapp-line text-[18px] text-[#fff]" />
                          </Link>
                        </li>
                        <li className="bb-footer-link leading-[1.5] flex items-center">
                          <Link
                            to={"https://www.instagram.com/"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="transition-all duration-[0.3s] ease-in-out w-[40px] h-[40px] rounded-[5px] bg-[#3d4750] hover:bg-[#0097b2] capitalize flex items-center justify-center text-[15px] leading-[20px] text-[#a8a8a8] relative break-all font-normal"
                          >
                            <i className="ri-instagram-line text-[18px] text-[#fff]" />
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom py-[10px] border-t-[1px] border-solid border-[#858585] max-[991px]:py-[15px]">
          <div className="flex flex-wrap justify-between relative items-center mx-auto min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px]">
            <div className="flex flex-wrap w-full">
              <div className="bb-bottom-info w-full flex flex-row items-center justify-center max-[991px]:flex-col px-[12px]">
                <div className="footer-copy max-[991px]:mb-[15px]">
                  <div className="footer-bottom-copy max-[991px]:text-center">
                    <div className="bb-copy text-[#a8a8a8] text-[13px] tracking-[1px] text-center font-normal leading-[2]">
                      Copyright © {new Date().getFullYear()}{" "}
                      <Link
                        to={"/"}
                        className="site-name transition-all duration-[0.3s] ease-in-out font-medium text-[#0097b2] hover:text-[#fff] font-Poppins text-[15px] leading-[28px] tracking-[0.03rem]"
                      >
                        PT Haji Maruti Indonesia
                      </Link>{" "}
                      All rights reserved. | Developed By : Foreever Team
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
