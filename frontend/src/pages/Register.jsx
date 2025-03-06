import React from "react";
import Breadcrumb from "../components/Breadcrumb";

const Register = () => {
  return (
    <>
      <Breadcrumb
        title="Register"
        destination1="Home"
        destination2="Register"
      />
      <section className="section-register py-[50px] max-[1199px]:py-[35px]">
        <div className="flex flex-wrap justify-between relative items-center mx-auto min-[1400px]:max-w-[1320px] min-[1200px]:max-w-[1140px] min-[992px]:max-w-[960px] min-[768px]:max-w-[720px] min-[576px]:max-w-[540px]">
          <div className="flex flex-wrap w-full">
            <div className="w-full">
              <div className="bb-register border-[1px] border-solid p-[30px] rounded-[20px]">
                <div className="flex flex-wrap">
                  <div className="w-full px-[12px]">
                    <div className="section-title mb-[20px] pb-[20px] z-[5] relative flex flex-col items-center text-center max-[991px]:pb-[0]">
                      <div className="section-detail max-[991px]:mb-[12px]">
                        <h2 className="bb-title font-quicksand mb-[0] p-[0] text-[25px] font-bold text-[#3d4750] relative inline capitalize leading-[1] tracking-[0.03rem] max-[767px]:text-[23px]">
                          Register
                        </h2>
                        <p className="font-Poppins max-w-[400px] mt-[10px] text-[14px] text-[#686e7d] leading-[18px] font-light tracking-[0.03rem] max-[991px]:mx-[auto]">
                          Best place to buy and sell digital products
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full px-[12px]">
                    <form method="post" className="flex flex-wrap mx-[-12px]">
                      <div className="bb-register-wrap w-[50%] max-[575px]:w-full px-[12px] mb-[24px]">
                        <label className="inline-block mb-[6px] text-[14px] leading-[18px] font-medium text-[#3d4750]">
                          First Name*
                        </label>
                        <input
                          type="text"
                          name="firstname"
                          placeholder="Enter your first name"
                          className="w-full p-[10px] text-[14px] font-normal text-[#686e7d] border-[1px] border-solid border-[#eee] outline-[0] leading-[26px] rounded-[10px]"
                          required=""
                        />
                      </div>
                      <div className="bb-register-wrap w-[50%] max-[575px]:w-full px-[12px] mb-[24px]">
                        <label className="inline-block mb-[6px] text-[14px] leading-[18px] font-medium text-[#3d4750]">
                          Last Name*
                        </label>
                        <input
                          type="text"
                          name="Lasttname"
                          placeholder="Enter your Last name"
                          className="w-full p-[10px] text-[14px] font-normal text-[#686e7d] border-[1px] border-solid border-[#eee] outline-[0] leading-[26px] rounded-[10px]"
                          required=""
                        />
                      </div>
                      <div className="bb-register-wrap w-[50%] max-[575px]:w-full px-[12px] mb-[24px]">
                        <label className="inline-block mb-[6px] text-[14px] leading-[18px] font-medium text-[#3d4750]">
                          Email*
                        </label>
                        <input
                          type="email"
                          name="email"
                          placeholder="Enter your Email"
                          className="w-full p-[10px] text-[14px] font-normal text-[#686e7d] border-[1px] border-solid border-[#eee] outline-[0] leading-[26px] rounded-[10px]"
                          required=""
                        />
                      </div>
                      <div className="bb-register-wrap w-[50%] max-[575px]:w-full px-[12px] mb-[24px]">
                        <label className="inline-block mb-[6px] text-[14px] leading-[18px] font-medium text-[#3d4750]">
                          Phone Number*
                        </label>
                        <input
                          type="text"
                          name="phonenumber"
                          placeholder="Enter your phone number"
                          className="w-full p-[10px] text-[14px] font-normal text-[#686e7d] border-[1px] border-solid border-[#eee] outline-[0] leading-[26px] rounded-[10px]"
                          required=""
                        />
                      </div>
                      <div className="bb-register-wrap w-[50%] max-[575px]:w-full px-[12px] mb-[24px]">
                        <label className="inline-block mb-[6px] text-[14px] leading-[18px] font-medium text-[#3d4750]">
                          Password*
                        </label>
                        <input
                          type="password"
                          name="password"
                          placeholder="Enter Password"
                          className="w-full p-[10px] text-[14px] font-normal text-[#686e7d] border-[1px] border-solid border-[#eee] outline-[0] leading-[26px] rounded-[10px]"
                          required=""
                        />
                      </div>
                      <div className="bb-register-wrap w-[50%] max-[575px]:w-full px-[12px] mb-[24px]">
                        <label className="inline-block mb-[6px] text-[14px] leading-[18px] font-medium text-[#3d4750]">
                          Confirm Password*
                        </label>
                        <input
                          type="password"
                          name="confirmpassword"
                          placeholder="Confirm Password"
                          className="w-full p-[10px] text-[14px] font-normal text-[#686e7d] border-[1px] border-solid border-[#eee] outline-[0] leading-[26px] rounded-[10px]"
                          required=""
                        />
                      </div>
                      {/* <div className="w-full px-[12px] mb-[12px] flex items-center">
                      <input
                        type="checkbox"
                        id="newsletter"
                        className="mr-[8px]"
                      />
                      <label
                        htmlFor="newsletter"
                        className="text-[14px] text-[#3d4750]"
                      >
                        Subscribe to our newsletter
                      </label>
                    </div>
                    <div className="w-full px-[12px] mb-[12px] flex">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="terms"
                          className="mr-[8px]"
                          required
                        />
                        <label
                          htmlFor="terms"
                          className="text-[14px] text-[#3d4750]"
                        >
                          I agree to the terms and conditions
                        </label>
                      </div>
                    </div> */}

                      <div className="bb-register-button w-full flex justify-center">
                        <button
                          type="button"
                          className="bb-btn-2 transition-all duration-[0.3s] ease-in-out font-Poppins leading-[28px] tracking-[0.03rem] py-[4px] px-[20px] text-[14px] font-normal text-[#fff] bg-[#6c7fd8] rounded-[10px] border-[1px] border-solid border-[#6c7fd8] hover:bg-transparent hover:border-[#3d4750] hover:text-[#3d4750]"
                        >
                          Register
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Register;
