import React from "react";

const OrderHistory = () => {
  return (
    <div>
      {/* Order Placed, Total, Order Number */}
      {/* Products image, name, view item */}
      <div className="text-center w-full my-[150px] max-[1199px]:mt-[35px]">
        <div className="mb-[30px] max-[991px]:hidden">
          <h2 className="font-quicksand text-[124px] text-[#525252] opacity-[0.5] font-bold leading-[1.2] tracking-[0.03rem] max-[1399px]:text-[95px] max-[1199px]:text-[70px] max-[767px]:text-[42px]">
            Order History Page
          </h2>
          <h3 className="font-quicksand mt-3 text-[70px] text-[#575757] opacity-[0.25] font-bold leading-[1.2] tracking-[0.03rem] max-[1399px]:text-[95px] max-[1199px]:text-[70px] max-[767px]:text-[42px]">
            Comming Soon
          </h3>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
