import React from "react";

const Title = ({ title1, title2, description }) => {
  return (
    <div className="px-4">
      <div className="section-title bb-deal mb-[20px] pb-[20px] relative flex justify-between items-center max-[991px]:flex-col max-[991px]:text-center">
        <div className="section-detail max-[991px]:mb-[12px]">
          <h2 className="text-[25px] font-quicksand font-bold text-[#3d4750]">
            {title1} <span className="text-[#0097b2]">{title2}</span>
          </h2>
          <p className="text-[14px] text-[#686e7d] mt-[10px] font-light">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Title;
