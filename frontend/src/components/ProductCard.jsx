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
              ? "ri-star-fill float-left text-[12px] max-[575px]:text-[10px] mr-[2px] leading-[18px] max-[575px]:leading-[14px] text-yellow-500"
              : "ri-star-line float-left text-[12px] max-[575px]:text-[10px] mr-[2px] leading-[18px] max-[575px]:leading-[14px] text-yellow-500"
          }
        ></i>
      );
    }
    return stars;
  };

  if (!product.listView) {
    return (
      <Link
        to={`/product/${product.alias}`}
        className="bb-pro-box rounded-[20px] max-[575px]:rounded-[12px] border-[#858585] overflow-hidden border"
      >
        {/* Product Image */}
        <div className="bb-pro-img relative border-b border-[#858585]">
          <img
            className="w-full aspect-square object-contain transition-all duration-300 hover:opacity-80"
            src={product.product_images[0]}
            alt={product.name}
          />
          {product.available ? null : (
            <div class="absolute inset-0 bg-gray-800 opacity-75 flex items-center justify-center">
              <span class="text-white text-lg md:text-3xl font-bold uppercase tracking-wider transform rotate-[-45deg] z-10">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="p-[20px] max-[575px]:p-[12px]">
          <div className="bb-pro-subtitle mb-[8px] max-[575px]:mb-[4px] flex flex-wrap justify-between items-center">
            <p className="transition-all duration-[0.3s] ease-in-out font-Poppins text-[13px] max-[575px]:text-[10px] leading-[16px] max-[575px]:leading-[14px] text-[#777] font-semibold tracking-[0.03rem] md:font-light">
              {product.generic_name}
            </p>
            <span className="bb-pro-rating flex">{displayRating()}</span>
          </div>
          <h4 className="transition-all duration-[0.3s] ease-in-out font-quicksand w-full block whitespace-nowrap overflow-hidden text-ellipsis text-[15px] max-[575px]:text-[12px] leading-[18px] max-[575px]:leading-[16px] text-[#3d4750] font-semibold tracking-[0.03rem] mb-[8px] max-[575px]:mb-[4px]">
            {product.name}
          </h4>
          <div className="flex justify-between items-center mb-[10px] max-[575px]:mb-[6px]">
            <span className="new-price px-[3px] text-[12px] max-[575px]:text-[12px] text-[#686e7d] font-semibold">
              {currency} {product.pricing[0].unit_price} /Piece
            </span>
          </div>
          <Link
            to={`/product/${product.alias}`}
            className="block text-center mt-2 max-[575px]:mt-1 bb-btn-2 transition-all duration-[0.3s] ease-in-out font-Poppins leading-[28px] max-[575px]:leading-[22px] tracking-[0.03rem] py-[4px] max-[575px]:py-[3px] px-[10px] max-[575px]:px-[8px] text-[14px] max-[575px]:text-[11px] font-normal text-[#fff] bg-[#0097b2] rounded-[10px] max-[575px]:rounded-[8px] border-[1px] border-solid border-[#0097b2] hover:bg-transparent hover:border-[#0097b2] hover:text-[#0097b2]"
          >
            View Details
          </Link>
        </div>
      </Link>
    );
  } else {
    return (
      <div className="flex items-center border border-[#858585] rounded-[20px] max-[575px]:rounded-[12px] mb-4 max-[575px]:mb-3 p-4 max-[575px]:p-3">
        {/* Product Image */}
        <div className="w-1/4 max-[575px]:w-[80px] mr-4 max-[575px]:mr-3">
          <img
            className="w-full"
            src={product.product_images[0]}
            alt={product.name}
          />
        </div>

        {/* Product Details */}
        <div className="flex-grow">
          <h4 className="md:text-lg text-base max-[575px]:text-[12px] font-semibold max-[575px]:mb-1">
            {product.name}
          </h4>
          <p className="text-sm max-[575px]:text-[10px] text-gray-700 font-semibold mb-1 max-[575px]:mb-0">
            {product.generic_name}
          </p>
          <div className="bb-pro-rating flex">{displayRating()}</div>
        </div>

        {/* Price and Rating */}
        <div className="w-1/4 max-[575px]:w-auto text-right">
          <span className="md:text-lg text-sm max-[575px]:text-[11px] font-bold block mb-2 max-[575px]:mb-1">
            {currency} {product.pricing[0].unit_price} /Piece
          </span>
          <Link
            to={`/product/${product.alias}`}
            className="block text-center mt-2 max-[575px]:mt-1 bb-btn-2 transition-all duration-[0.3s] ease-in-out font-Poppins leading-[28px] max-[575px]:leading-[20px] tracking-[0.03rem] py-[4px] max-[575px]:py-[2px] px-[5px] max-[575px]:px-[6px] text-[11px] md:text-[14px] max-[575px]:text-[9px] font-normal text-[#fff] bg-[#0097b2] rounded-[10px] max-[575px]:rounded-[6px] border-[1px] border-solid border-[#0097b2] hover:bg-transparent hover:border-[#3d4750] hover:text-[#3d4750] whitespace-nowrap"
          >
            View Details
          </Link>
        </div>
      </div>
    );
  }
};

export default ProductCard;
