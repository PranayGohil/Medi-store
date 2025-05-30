import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const ProductCard = (product) => {
  const { currency } = useContext(ShopContext);
  const rating = product.rating.toFixed(1);
  const displayRating = () => {
    let stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <i
          key={i}
          className={
            i < rating
              ? "ri-star-fill float-left text-[15px] mr-[3px] leading-[18px] text-[#0097b2]"
              : "ri-star-line float-left text-[15px] mr-[3px] leading-[18px] text-[#0097b2]"
          }
        ></i>
      );
    }
    return stars;
  };

  if (!product.listView) {
    return (
      <div
        className="bb-pro-box rounded-[20px] overflow-hidden"
      >
        {/* Product Image */}
        <div className="bb-pro-img relative border-b border-[#eee]">

          <img
            className="w-full aspect-square object-contain transition-all duration-300 hover:opacity-80"
            src={product.product_images[0]}
            alt={product.name}
          />
        </div>

        {/* Product Details */}
        <div className="p-[20px]">
          <div className="bb-pro-subtitle mb-[8px] flex flex-wrap justify-between">
            <p
              className="transition-all duration-[0.3s] ease-in-out font-Poppins text-[13px] leading-[16px] text-[#777] font-light tracking-[0.03rem]"
            >
              {product.generic_name}
            </p>
            <span className="bb-pro-rating">{displayRating()}</span>
          </div>
          <h4 className="transition-all duration-[0.3s] ease-in-out font-quicksand w-full block whitespace-nowrap overflow-hidden text-ellipsis text-[15px] leading-[18px] text-[#3d4750] font-semibold tracking-[0.03rem]">
            {product.name}
          </h4>
          {/* <small className="transition-all duration-[0.3s] ease-in-out font-Poppins text-[13px] leading-[16px] text-[#777] font-light tracking-[0.03rem]">
            {product.generic_name}
          </small> */}
          <div className="flex justify-between items-center">
            <span className="new-price px-[3px] text-[16px] text-[#686e7d] font-bold">
              {currency}
              {product.pricing[0].unit_price} /Piece
            </span>
          </div>
          <Link to={`/product/${product.alias}`} className="block text-center mt-2 bb-btn-2 transition-all duration-[0.3s] ease-in-out font-Poppins leading-[28px] tracking-[0.03rem] py-[4px] px-[10px] text-[14px] font-normal text-[#fff] bg-[#0097b2] rounded-[10px] border-[1px] border-solid border-[#0097b2] hover:bg-transparent hover:border-[#3d4750] hover:text-[#3d4750]">
            View Details
          </Link>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex items-center border border-[#eee] rounded-[20px] mb-4 p-4">
        {/* Product Image */}
        <div className="w-1/4 mr-4">
          <img
            className="w-full"
            src={product.product_images[0]}
            alt={product.name}
          />
        </div>

        {/* Product Details */}
        <div className="flex-grow">
          <h4 className="md:text-lg text-base font-semibold">{product.name}</h4>
          <p className="text-sm text-gray-700">{product.generic_name}</p>
          <div className="bb-pro-rating">{displayRating()}</div>
        </div>

        {/* Price and Rating */}
        <div className="w-1/4 text-right">
          <span className="md:text-lg text-sm font-bold">
            {currency} {product.pricing[0].unit_price} /Piece
          </span>
          <Link to={`/product/${product.alias}`} className="block text-center mt-2 bb-btn-2 transition-all duration-[0.3s] ease-in-out font-Poppins leading-[28px] tracking-[0.03rem] py-[4px] px-[5px] text-[11px] md:text-[14px] font-normal text-[#fff] bg-[#0097b2] rounded-[10px] border-[1px] border-solid border-[#0097b2] hover:bg-transparent hover:border-[#3d4750] hover:text-[#3d4750]">
            View Details
          </Link>
        </div>
      </div>
    );
  }
};

export default ProductCard;